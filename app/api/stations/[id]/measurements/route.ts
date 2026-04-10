// app/api/stations/[id]/measurements/route.ts
import { NextResponse } from "next/server";
import { measurements } from "@/data/mockData";
import { z } from "zod";
import { ApiResponse } from "@/types/api";
import { Measurement } from "@/types/environment";

const querySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(24),
  sortBy: z.enum(["asc", "desc"]).default("desc"),
});

export async function GET(
  request: Request,

  { params }: { params: Promise<{ id: string }> },
) {
  try {

    const { id } = await params;
    const { searchParams } = new URL(request.url);

    const validation = querySchema.safeParse(Object.fromEntries(searchParams));
    if (!validation.success) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: { code: 400, message: "Invalid query parameters" },
        },
        { status: 400 },
      );
    }

    const { limit, sortBy } = validation.data;

    let stationMeasurements = measurements.filter((m) => m.stationId === id);

    stationMeasurements.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortBy === "desc" ? timeB - timeA : timeA - timeB;
    });

    const paginatedData = stationMeasurements.slice(0, limit);

    return NextResponse.json<ApiResponse<Measurement[]>>(
      { success: true, data: paginatedData },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: { code: 500, message: "Internal Server Error" },
      },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import {
  getStationsData,
  getTotalStationsCount,
} from "@/services/stationService";
import { ApiResponse } from "@/types/api";
import { Station } from "@/types/environment";
import { z } from "zod";

const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const validation = paginationSchema.safeParse(
      Object.fromEntries(searchParams),
    );

    if (!validation.success) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: { code: 400, message: "Invalid pagination parameters" },
        },
        { status: 400 },
      );
    }

    const { page, limit } = validation.data;

    const paginatedStations = await getStationsData(page, limit);
    const total = await getTotalStationsCount();

    return NextResponse.json<ApiResponse<Station[]>>(
      {
        success: true,
        data: paginatedStations,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
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

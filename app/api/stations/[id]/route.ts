// app/api/stations/[id]/route.ts
import { NextResponse } from "next/server";
import { stations, measurements } from "@/data/mockData";
import { ApiResponse } from "@/types/api";
import { Station, Measurement } from "@/types/environment"; // Объединил импорты для чистоты

type StationWithMeasurements = Station & { currentMeasurement?: Measurement };

export async function GET(
  request: Request,
  // В Next.js 15+ типизируем как Promise
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Ждем разрешения промиса, чтобы получить id
    const { id } = await params;

    const station = stations.find((s) => s.id === id);

    if (!station) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: { code: 404, message: "Station not found" } },
        { status: 404 },
      );
    }

    const currentMeasurement = measurements.find((m) => m.stationId === id);
    const data: StationWithMeasurements = { ...station, currentMeasurement };

    return NextResponse.json<ApiResponse<StationWithMeasurements>>(
      { success: true, data },
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

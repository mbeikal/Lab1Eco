"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

interface StationViewTrackerProps {
  stationId: string;
  stationName: string;
}

export function StationViewTracker({ stationId, stationName }: StationViewTrackerProps) {
  useEffect(() => {
    trackEvent('station_view', { stationId, stationName });
  }, [stationId, stationName]);

  return null;
}

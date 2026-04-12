import { sendGAEvent } from '@next/third-parties/google';

export type AnalyticsEventName =
  | 'station_map_click'
  | 'station_view'
  | 'chart_interaction'
  | 'filter_applied'
  | 'data_export'
  | 'error_caught';

export interface AnalyticsEventParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Утиліта для відправки кастомних подій в GA4.
 * Обгортає стандартний sendGAEvent від Next.js.
 * 
 * @param event 
 * @param params 
 */
export const trackEvent = (event: AnalyticsEventName, params?: AnalyticsEventParams) => {
  try {

    sendGAEvent('event', event, params || {});
  } catch (error) {

    console.warn('Failed to send GA event:', error);
  }
};

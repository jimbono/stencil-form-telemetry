import { TelemetryBatcher } from './telemetry-batcher'

export interface TelemetryEvent {
  type: string;
  timestamp: string;
  details: any;
}

class Telemetry {
  private static instance: Telemetry;
  private batcher: TelemetryBatcher;

  private constructor() {
    this.batcher = new TelemetryBatcher();
    this.trackPageMetrics();
  }

  public static getInstance(): Telemetry {
    if (!Telemetry.instance) {
      Telemetry.instance = new Telemetry();
    }
    return Telemetry.instance;
  }

  public trackEvent(event: TelemetryEvent): void {
    if (this.shouldSampleEvent(event.type)) {
      this.batcher.addEvent(event);
    }
  }

  private shouldSampleEvent(eventType: string): boolean {
    const samplingRates = {
      'formSubmit': 1,    // 100% sampling
      'fieldBlur': 0.1,   // 10% sampling
      'default': 0.5      // 50% sampling
    };
    const rate = samplingRates[eventType] || samplingRates['default'];
    return Math.random() < rate;
  }

  private trackPageMetrics(): void {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        this.trackEvent({
          type: 'pageMetrics',
          timestamp: new Date().toISOString(),
          details: {
            pageLoadTime: navigationTiming.loadEventEnd - navigationTiming.loadEventStart,
            domInteractive: navigationTiming.domInteractive,
            domComplete: navigationTiming.domComplete,
          }
        });
      });
    }
  }
}

export const telemetry = Telemetry.getInstance();
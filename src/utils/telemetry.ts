export class Telemetry {
  private static instance: Telemetry;
  private endpoint: string = '/analytics-endpoint';

  private constructor() {
    this.trackPageMetrics();
  }

  public static getInstance(): Telemetry {
    if (!Telemetry.instance) {
      Telemetry.instance = new Telemetry();
    }
    return Telemetry.instance;
  }

  public setEndpoint(endpoint: string): void {
    this.endpoint = endpoint;
  }

  public sendMetrics(data: any): void {
    console.log('Telemetry data:', data);  // For local testing
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      navigator.sendBeacon(this.endpoint, blob);
    } else {
      fetch(this.endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        keepalive: true,
      });
    }
  }

  public trackRender(componentId: string, renderTime: number): void {
    this.sendMetrics({ type: 'timeToRender', componentId, value: renderTime });
  }

  public trackVisibility(componentId: string): void {
    this.sendMetrics({ type: 'componentVisible', componentId });
  }

  public trackInteraction(componentId: string, interactionType: string, details?: any): void {
    this.sendMetrics({ type: 'interaction', componentId, interactionType, details });
  }

  private trackPageMetrics(): void {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        const pageLoadTime = performance.now();
        const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const fpTime = performance.getEntriesByName('first-paint')[0]?.startTime;
        const fcpTime = performance.getEntriesByName('first-contentful-paint')[0]?.startTime;

        this.sendMetrics({
          type: 'pageMetrics',
          pageLoadTime,
          domInteractive: navigationTiming.domInteractive,
          domComplete: navigationTiming.domComplete,
          firstPaint: fpTime,
          firstContentfulPaint: fcpTime,
        });
      });
    }
  }
}

export const telemetry = Telemetry.getInstance();
import { TelemetryBatcher } from './telemetry-batcher';
import { TelemetryEvent } from './telemetry-types';

class TelemetryService {
  private static instance: TelemetryService;
  private batcher: TelemetryBatcher;

  private constructor() {
    this.batcher = new TelemetryBatcher();
    this.initializeGlobalListener();
  }

  public static getInstance(): TelemetryService {
    if (!TelemetryService.instance) {
      TelemetryService.instance = new TelemetryService();
    }
    return TelemetryService.instance;
  }

  private initializeGlobalListener() {
    document.addEventListener('telemetry', (event: CustomEvent<TelemetryEvent>) => {
      this.processEvent(event.detail);
    });
  }

  private processEvent(event: TelemetryEvent) {
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

  public emit(eventType: string, eventData: any) {
    const event: TelemetryEvent = {
      type: eventType,
      timestamp: new Date().toISOString(),
      data: eventData
    };
    document.dispatchEvent(new CustomEvent('telemetry', { detail: event }));
  }
}

export const telemetry = TelemetryService.getInstance();
import { TelemetryBatcher } from './telemetry-batcher';
import { TelemetryEvent, TelemetryEventType } from './telemetry-types';

class TelemetryService {
  private static instance: TelemetryService;
  private batcher: TelemetryBatcher;
  private samplingRates: { [key: string]: number } = {
    /*[TelemetryEventType.FormSubmit]: 1,
    [TelemetryEventType.FieldBlur]: 0.1,
    [TelemetryEventType.ComponentRender]: 0.5,
    [TelemetryEventType.ComponentVisible]: 0.5,
    [TelemetryEventType.UserInteraction]: 0.2,
    [TelemetryEventType.PerformanceMetric]: 1,
    [TelemetryEventType.ErrorOccurred]: 1,
    [TelemetryEventType.FormCompletionTime]: 1,  // Always capture form completion time
    'default': 0.5*/

    [TelemetryEventType.FormSubmit]: 0.5,
    [TelemetryEventType.FieldBlur]: 0.5,
    [TelemetryEventType.ComponentRender]: 0.5,
    [TelemetryEventType.ComponentVisible]: 0.5,
    [TelemetryEventType.UserInteraction]: 0.5,
    [TelemetryEventType.PerformanceMetric]: 0.5,
    [TelemetryEventType.ErrorOccurred]: 0.5,
    [TelemetryEventType.FormCompletionTime]: 1,  // Always capture form completion time
    'default': 1
  };

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
    const rate = this.samplingRates[eventType] || this.samplingRates['default'];
    return Math.random() < rate;
  }

  public setSamplingRate(eventType: string, rate: number) {
    if (rate >= 0 && rate <= 1) {
      this.samplingRates[eventType] = rate;
    } else {
      console.error(`Invalid sampling rate for ${eventType}. Rate must be between 0 and 1.`);
    }
  }

  public emit(eventType: TelemetryEventType, eventData: any) {
    const event: TelemetryEvent = {
      type: eventType,
      timestamp: new Date().toISOString(),
      data: eventData
    };
    document.dispatchEvent(new CustomEvent('telemetry', { detail: event }));
  }
}

export const telemetry = TelemetryService.getInstance();
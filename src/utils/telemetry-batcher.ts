import { TelemetryEvent } from './telemetry-types';
import pako from 'pako';

export class TelemetryBatcher {
  private buffer: TelemetryEvent[] = [];
  private batchSize: number = 50;
  private flushInterval: number = 30000; // 30 seconds
  private retryAttempts: number = 3;
  private retryDelay: number = 5000; // 5 seconds

  constructor() {
    setInterval(() => this.flush(), this.flushInterval);
  }

  addEvent(event: TelemetryEvent) {
    this.buffer.push(event);
    window.dispatchEvent(new CustomEvent('telemetryEvent', { detail: event }));

    if (this.buffer.length >= this.batchSize) {
      this.flush();
    }
  }

  private async flush() {
    if (this.buffer.length > 0) {
      const eventsToSend = [...this.buffer];
      this.buffer = [];
      await this.sendWithRetry(eventsToSend);
    }
  }

  private async sendWithRetry(events: TelemetryEvent[], attempt: number = 1) {
    try {
      const compressedData = this.compressData(events);
      await this.sendToServer(compressedData);
    } catch (error) {
      if (attempt < this.retryAttempts) {
        setTimeout(() => this.sendWithRetry(events, attempt + 1), this.retryDelay);
      } else {
        console.error('Failed to send telemetry data after multiple attempts', error);
      }
    }
  }

  private compressData(data: any): Uint8Array {
    return pako.deflate(JSON.stringify(data));
  }

  private async sendToServer(data: Uint8Array): Promise<void> {
    // In a real implementation, you would send this data to your server
    // For this example, we'll just log it to the console
    console.log('Sending compressed telemetry data:', data);
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}
import { TelemetryEvent } from './telemetry-types';
import pako from 'pako';

export class TelemetryBatcher {
  private buffer: TelemetryEvent[] = [];
  private batchSize: number = 50;
  private flushInterval: number = 30000; // 30 seconds

  constructor() {
    setInterval(() => this.flush(), this.flushInterval);
  }

  addEvent(event: TelemetryEvent) {
    this.buffer.push(event);
    if (this.buffer.length >= this.batchSize) {
      this.flush();
    }
  }

  private flush() {
    if (this.buffer.length > 0) {
      const compressedData = this.compressData(this.buffer);
      this.sendToServer(compressedData);
      this.buffer = [];
    }
  }

  private compressData(data: any): Uint8Array {
    return pako.deflate(JSON.stringify(data));
  }

  private sendToServer(data: Uint8Array) {
    // In a real implementation, you would send this data to your server
    // For this example, we'll just log it to the console
    console.log('Sending compressed telemetry data:', data);
  }
}
import { Component, h, State, Listen } from '@stencil/core';
import { TelemetryEvent } from '../../utils/telemetry-types';

@Component({
  tag: 'events-telemetry-panel',
  styleUrl: 'events-telemetry-panel.css',
  shadow: true
})
export class EventsTelemetryPanel {
  @State() events: TelemetryEvent[] = [];

  @Listen('telemetryEvent', { target: 'window' })
  handleTelemetryEvent(event: CustomEvent<TelemetryEvent>) {
    this.events = [event.detail, ...this.events].slice(0, 50);  // Keep last 50 events, newest first
  }

  render() {
    return (
      <div class="events-panel">
        <h3>Telemetry Events</h3>
        <div class="events-list">
          {this.events.map((event, index) => (
            <div key={index} class="event-item">
              <span class="event-type">{event.type}</span>
              <span class="event-timestamp">{event.timestamp}</span>
              <pre class="event-data">{JSON.stringify(event.data, null, 2)}</pre>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
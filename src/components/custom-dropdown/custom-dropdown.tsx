import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';
import { telemetry } from '../../utils/telemetry-service';
import { TelemetryEventType } from '../../utils/telemetry-types';

@Component({
  tag: 'custom-dropdown',
  styleUrl: 'custom-dropdown.css',
  shadow: true,
})
export class CustomDropdown {
  @Prop() options: string[];
  @Prop() label: string;
  @Prop() name: string;
  @Event() valueChanged: EventEmitter<{ name: string, value: string }>;

  handleChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.valueChanged.emit({ name: this.name, value: select.value });
    telemetry.emit(TelemetryEventType.UserInteraction, {
      componentName: 'CustomDropdown',
      field: this.name,
      value: select.value
    });
  }

  render() {
    return (
      <div class="dropdown-container">
        <label htmlFor={this.name}>{this.label}</label>
        <select id={this.name} name={this.name} onChange={(event) => this.handleChange(event)}>
          {this.options.map(option => (
            <option value={option}>{option}</option>
          ))}
        </select>
      </div>
    );
  }
}
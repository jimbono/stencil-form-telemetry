import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';
import { telemetry } from '../../utils/telemetry-service';
import { TelemetryEventType } from '../../utils/telemetry-types';

@Component({
  tag: 'custom-input',
  styleUrl: 'custom-input.css',
  shadow: true,
})
export class CustomInput {
  @Prop() label: string;
  @Prop() name: string;
  @Prop() type: string = 'text';
  @Prop() value: string = '';
  @Event() valueChanged: EventEmitter<{ name: string, value: string }>;

  handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.valueChanged.emit({ name: this.name, value: input.value });
  }

  handleBlur(event: Event) {
    const input = event.target as HTMLInputElement;
    telemetry.emit(TelemetryEventType.FieldBlur, {
      componentName: 'CustomInput',
      field: this.name,
      value: input.value
    });
  }

  render() {
    return (
      <div class="input-container">
        <label htmlFor={this.name}>{this.label}</label>
        <input
          type={this.type}
          id={this.name}
          name={this.name}
          value={this.value}
          onInput={(event) => this.handleInput(event)}
          onBlur={(event) => this.handleBlur(event)}
        />
      </div>
    );
  }
}
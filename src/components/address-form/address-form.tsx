import { Component, h, State, Event, EventEmitter } from '@stencil/core';
import { TelemetryEvent } from '../../utils/telemetry';

@Component({
  tag: 'address-form',
  styleUrl: 'address-form.css',
  shadow: true,
})
export class AddressForm {
  @State() formData: { [key: string]: string } = {};
  @Event() telemetryEvent: EventEmitter<TelemetryEvent>;

  private formFields: string[] = ['name', 'street', 'city', 'state', 'zipCode'];

  private emitTelemetry(eventType: string, details: any) {
    this.telemetryEvent.emit({
      type: eventType,
      timestamp: new Date().toISOString(),
      details
    });
  }

  handleInput(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    this.formData = { ...this.formData, [field]: input.value };
  }

  handleBlur(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    this.emitTelemetry('fieldBlur', { field, value: input.value });
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    this.emitTelemetry('formSubmit', this.formData);
    console.log('Form submitted:', this.formData);
  }

  render() {
    return (
      <form onSubmit={(e) => this.handleSubmit(e)}>
        {this.formFields.map(field => (
          <div>
            <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              type="text"
              id={field}
              value={this.formData[field] || ''}
              onInput={(e) => this.handleInput(e, field)}
              onBlur={(e) => this.handleBlur(e, field)}
            />
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    );
  }
}
import { Component, h, State, Element } from '@stencil/core';
import { telemetry } from '../../utils/telemetry-service';
import { TelemetryEventType } from '../../utils/telemetry-types';

@Component({
  tag: 'address-form',
  styleUrl: 'address-form.css',
  shadow: true,
})
export class AddressForm {
  @State() formData: { [key: string]: string } = {};
  @Element() el: HTMLElement;

  private formFields: string[] = ['name', 'street', 'city', 'state', 'zipCode'];
  private intersectionObserver: IntersectionObserver;

  componentWillLoad() {
    telemetry.emit(TelemetryEventType.ComponentMount, { name: 'AddressForm' });
  }

  componentDidLoad() {
    telemetry.emit(TelemetryEventType.ComponentRender, { 
      name: 'AddressForm',
      renderTime: performance.now() // This is a simplification. For more accurate timing, you'd need to store the start time at the beginning of the render cycle.
    });
    this.observeVisibility();
  }

  disconnectedCallback() {
    telemetry.emit(TelemetryEventType.ComponentUnmount, { name: 'AddressForm' });
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  private observeVisibility() {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            telemetry.emit(TelemetryEventType.ComponentVisible, { 
              name: 'AddressForm',
              visibleTime: performance.now()
            });
            this.intersectionObserver.disconnect();
          }
        });
      },
      { threshold: 0.5 } // Component is considered visible when 50% is in view
    );

    this.intersectionObserver.observe(this.el);
  }

  handleInput(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    this.formData = { ...this.formData, [field]: input.value };
  }

  handleBlur(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    telemetry.emit(TelemetryEventType.FieldBlur, { field, value: input.value, component: 'AddressForm' });
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    telemetry.emit(TelemetryEventType.FormSubmit, { formData: this.formData, component: 'AddressForm' });
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
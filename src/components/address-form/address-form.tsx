import { Component, h, State, Element } from '@stencil/core';
import { telemetry } from '../../utils/telemetry-service';
import { TelemetryEventType, FormCompletionTimeData } from '../../utils/telemetry-types';

@Component({
  tag: 'address-form',
  styleUrl: 'address-form.css',
  shadow: true,
})
export class AddressForm {
  @State() formData: { [key: string]: string } = {};
  @Element() el: HTMLElement;

  private formFields: string[] = ['name', 'street', 'city', 'state', 'zipCode'];
  private formStartTime: number;
  private intersectionObserver: IntersectionObserver;

  componentWillLoad() {
    telemetry.emit(TelemetryEventType.ComponentMount, { name: 'AddressForm' });
    this.formStartTime = performance.now();
  }

  componentDidLoad() {
    telemetry.emit(TelemetryEventType.ComponentRender, { 
      name: 'AddressForm',
      renderTime: performance.now() - this.formStartTime
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
      { threshold: 0.5 }
    );

    this.intersectionObserver.observe(this.el);
  }

  handleInput(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    this.formData = { ...this.formData, [field]: input.value };
  }

  handleBlur(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    telemetry.emit(TelemetryEventType.FieldBlur, { field, value: input.value });
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    const completionTime = performance.now() - this.formStartTime;
    
    // Emit form submission event
    telemetry.emit(TelemetryEventType.FormSubmit, this.formData);
    
    // Emit form completion time event
    const formCompletionData: FormCompletionTimeData = {
      formId: 'AddressForm',
      completionTime: completionTime,
      fieldCount: this.formFields.length
    };
    telemetry.emit(TelemetryEventType.FormCompletionTime, formCompletionData);

    console.log('Form submitted:', this.formData);
    console.log('Form completion time:', completionTime, 'ms');

    // Reset the form start time for the next submission
    this.formStartTime = performance.now();
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
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
  private formStartTime: number;
  private intersectionObserver: IntersectionObserver;

  componentWillLoad() {
    this.formStartTime = performance.now();
    telemetry.emit(TelemetryEventType.ComponentMount, { name: 'AddressForm' });
  }

  componentDidLoad() {
    telemetry.emit(TelemetryEventType.ComponentRender, { 
      name: 'AddressForm',
      renderTime: performance.now() - this.formStartTime
    });
    this.observeVisibility();
  }

  disconnectedCallback() {
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

  handleValueChange(event: CustomEvent<{ name: string, value: string }>) {
    this.formData = { ...this.formData, [event.detail.name]: event.detail.value };
  }

  handleBlur(event: CustomEvent<{ name: string, value: string }>) {
    telemetry.emit(TelemetryEventType.FieldBlur, { 
      field: event.detail.name, 
      value: event.detail.value 
    });
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    const completionTime = performance.now() - this.formStartTime;
    
    telemetry.emit(TelemetryEventType.FormSubmit, {
      formId: 'AddressForm',
      formData: this.formData,
      completionTime: completionTime,
      fieldCount: this.formFields.length
    });

    console.log('Form submitted:', this.formData);
    console.log('Form completion time:', completionTime, 'ms');

    // Reset the form start time for the next submission
    this.formStartTime = performance.now();
  }

  render() {
    return (
      <form onSubmit={(e) => this.handleSubmit(e)}>
        <h2>Address Form</h2>
        {this.formFields.map(field => (
          <custom-input
            key={field}
            label={field.charAt(0).toUpperCase() + field.slice(1)}
            name={field}
            value={this.formData[field] || ''}
            onValueChanged={(e) => this.handleValueChange(e)}
            onInputBlur={(e) => this.handleBlur(e)}
          ></custom-input>
        ))}
        <button type="submit">Submit Address</button>
      </form>
    );
  }
}
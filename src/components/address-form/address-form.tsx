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
    
    telemetry.emit(TelemetryEventType.FormSubmit, this.formData);
    telemetry.emit(TelemetryEventType.FormCompletionTime, {
      formId: 'AddressForm',
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
        <div class="form-row">
          <custom-input
            label="Name"
            name="name"
            type="text"
            onValueChanged={(e) => this.handleInput(e, 'name')}
          ></custom-input>
          <custom-input
            label="Street"
            name="street"
            type="text"
            onValueChanged={(e) => this.handleInput(e, 'street')}
          ></custom-input>
        </div>
        <div class="form-row">
          <custom-input
            label="City"
            name="city"
            type="text"
            onValueChanged={(e) => this.handleInput(e, 'city')}
          ></custom-input>
          <custom-input
            label="State"
            name="state"
            type="text"
            onValueChanged={(e) => this.handleInput(e, 'state')}
          ></custom-input>
        </div>
        <custom-input
          label="Zip Code"
          name="zipCode"
          type="text"
          onValueChanged={(e) => this.handleInput(e, 'zipCode')}
        ></custom-input>
        <button type="submit">Submit Address</button>
      </form>
    );
  }
}
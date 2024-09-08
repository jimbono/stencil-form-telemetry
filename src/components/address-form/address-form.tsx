import { Component, h, State } from '@stencil/core';
import { telemetry } from '../../utils/telemetry-service';

@Component({
  tag: 'address-form',
  styleUrl: 'address-form.css',
  shadow: true,
})
export class AddressForm {
  @State() formData: { [key: string]: string } = {};

  private formFields: string[] = ['name', 'street', 'city', 'state', 'zipCode'];

  componentDidLoad() {
    telemetry.emit('componentMount', { name: 'AddressForm' });
  }

  disconnectedCallback() {
    telemetry.emit('componentUnmount', { name: 'AddressForm' });
  }

  handleInput(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    this.formData = { ...this.formData, [field]: input.value };
  }

  handleBlur(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    telemetry.emit('fieldBlur', { field, value: input.value, component: 'AddressForm' });
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    telemetry.emit('formSubmit', { formData: this.formData, component: 'AddressForm' });
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
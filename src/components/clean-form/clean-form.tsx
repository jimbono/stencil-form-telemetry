// src/components/clean-form/clean-form.tsx

import { Component, h, State, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'clean-form',
  styleUrl: 'clean-form.css',
  shadow: true,
})
export class CleanForm {
  @Prop() submitButtonText: string = 'Submit';
  @State() formData: { [key: string]: string } = {};
  @State() formErrors: { [key: string]: string } = {};
  @Event() telemetryEvent: EventEmitter<any>;

  private formFields: string[] = ['name', 'address', 'city', 'state', 'zipCode'];

  handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.formData = { ...this.formData, [input.name]: input.value };
  }

  handleBlur(event: Event) {
    const input = event.target as HTMLInputElement;
    this.telemetryEvent.emit({
      type: 'fieldInput',
      field: input.name,
      value: input.value
    });
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    this.validateForm();
    if (Object.keys(this.formErrors).length === 0) {
      this.telemetryEvent.emit({
        type: 'formSubmit',
        formData: this.formData
      });
    } else {
      this.telemetryEvent.emit({
        type: 'formError',
        errors: this.formErrors
      });
    }
  }

  validateForm() {
    const errors: { [key: string]: string } = {};
    this.formFields.forEach(field => {
      if (!this.formData[field]) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });
    this.formErrors = errors;
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        {this.formFields.map(field => (
          <div class="form-group">
            <label htmlFor={field}>
              {field.charAt(0).toUpperCase() + field.slice(1)}:
            </label>
            <input
              type="text"
              id={field}
              name={field}
              value={this.formData[field] || ''}
              onInput={this.handleInput.bind(this)}
              onBlur={this.handleBlur.bind(this)}
            />
            {this.formErrors[field] && <span class="error">{this.formErrors[field]}</span>}
          </div>
        ))}
        <button type="submit">{this.submitButtonText}</button>
      </form>
    );
  }
}
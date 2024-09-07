import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true,
})
export class AppRoot {
  render() {
    return (
      <div>
        <header>
          <h1>Stencil Form Telemetry Builder - Demo</h1>
        </header>
        <main>
          <telemetry-wrapper component-id="address-form">
            <clean-form 
              id="address-form" 
              submit-button-text="Submit Address"
            ></clean-form>
          </telemetry-wrapper>
        </main>
      </div>
    );
  }
}
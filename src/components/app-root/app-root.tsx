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
          <h1>Address Form with Telemetry</h1>
        </header>
        <main>
          <telemetry-wrapper component-id="address-form">
            <address-form></address-form>
          </telemetry-wrapper>
        </main>
      </div>
    );
  }
}
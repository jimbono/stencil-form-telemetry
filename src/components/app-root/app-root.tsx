import { Component, h } from '@stencil/core';
import { telemetry } from '../../utils/telemetry-service';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true,
})
export class AppRoot {
  componentDidLoad() {
    telemetry.emit('componentMount', { name: 'AppRoot' });
  }

  disconnectedCallback() {
    telemetry.emit('componentUnmount', { name: 'AppRoot' });
  }

  render() {
    return (
      <div>
        <header>
          <h1>Address Form with Telemetry</h1>
        </header>
        <main>
          <address-form></address-form>
        </main>
      </div>
    );
  }
}
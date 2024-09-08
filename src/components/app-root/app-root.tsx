import { Component, h, Element } from '@stencil/core';
import { telemetry } from '../../utils/telemetry-service';
import { TelemetryEventType } from '../../utils/telemetry-types';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true,
})
export class AppRoot {
  @Element() el: HTMLElement;

  private intersectionObserver: IntersectionObserver;

  componentWillLoad() {
    telemetry.emit(TelemetryEventType.ComponentMount, { name: 'AppRoot' });
  }

  componentDidLoad() {
    telemetry.emit(TelemetryEventType.ComponentRender, { 
      name: 'AppRoot',
      renderTime: performance.now()
    });
    this.observeVisibility();
  }

  disconnectedCallback() {
    telemetry.emit(TelemetryEventType.ComponentUnmount, { name: 'AppRoot' });
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
              name: 'AppRoot',
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
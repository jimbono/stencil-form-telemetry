import { Component, h, Element } from '@stencil/core';
import { telemetry } from '../../utils/telemetry-service';
import { TelemetryEventType } from '../../utils/telemetry-types';
import { MockUserService } from '../../utils/mock-user-service';



@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true,
})
export class AppRoot {
  
  @Element() el: HTMLElement;
  private userService = new MockUserService();

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
      <div class="app-container">
        <header>
          <h1>Stencil Components with Telemetry - Demo</h1>
        </header>
        <main>
          <div class="forms-row">
            <trade-order-entry></trade-order-entry>
            <address-form></address-form>
            <user-profile user-id="12345" userService={this.userService}></user-profile>
          </div>
          <events-telemetry-panel></events-telemetry-panel>
        </main>
      </div>
    );
  }
}
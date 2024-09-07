import { Component, Element, Prop, h, Listen } from '@stencil/core';
import { telemetry } from '../../utils/telemetry';

@Component({
  tag: 'telemetry-wrapper',
  shadow: true,
})
export class TelemetryWrapper {
  @Element() el: HTMLElement;
  @Prop() componentId: string;

  private renderTimestamp: number;
  private intersectionObserver: IntersectionObserver;

  componentWillLoad() {
    this.renderTimestamp = performance.now();
  }

  componentDidLoad() {
    const timeToRender = performance.now() - this.renderTimestamp;
    telemetry.trackRender(this.componentId, timeToRender);
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
            telemetry.trackVisibility(this.componentId);
            this.intersectionObserver.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    this.intersectionObserver.observe(this.el);
  }

  @Listen('telemetryEvent', { capture: true })
  handleTelemetryEvent(event: CustomEvent) {
    telemetry.trackInteraction(this.componentId, event.type, event.detail);
  }

  render() {
    return <slot></slot>;
  }
}
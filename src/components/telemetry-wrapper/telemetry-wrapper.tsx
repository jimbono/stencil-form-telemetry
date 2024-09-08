import { Component, Element, Prop, h, Listen } from '@stencil/core';
import { telemetry, TelemetryEvent } from '../../utils/telemetry';

@Component({
  tag: 'telemetry-wrapper',
  shadow: true,
})
export class TelemetryWrapper {
  @Element() el: HTMLElement;
  @Prop() componentId: string;

  private renderTimestamp: number;
  private intersectionObserver: IntersectionObserver;
  private worker: Worker;

  componentWillLoad() {
    this.renderTimestamp = performance.now();
    this.worker = new Worker('/assets/telemetry-worker.js');
    this.worker.onmessage = (event) => {
      if (event.data.type === 'processingComplete') {
        console.log('Telemetry processing complete:', event.data.result);
      }
    };
  }

  componentDidLoad() {
    const timeToRender = performance.now() - this.renderTimestamp;
    telemetry.trackEvent({
      type: 'componentRender',
      timestamp: new Date().toISOString(),
      details: { componentId: this.componentId, renderTime: timeToRender }
    });
    this.observeVisibility();
  }

  disconnectedCallback() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    if (this.worker) {
      this.worker.terminate();
    }
  }

  private observeVisibility() {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            telemetry.trackEvent({
              type: 'componentVisible',
              timestamp: new Date().toISOString(),
              details: { componentId: this.componentId }
            });
            this.intersectionObserver.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    this.intersectionObserver.observe(this.el);
  }

  @Listen('telemetryEvent', { capture: true })
  handleTelemetryEvent(event: CustomEvent<TelemetryEvent>) {
    // Offload intensive processing to Web Worker
    this.worker.postMessage({ type: 'processTelemetry', data: event.detail });
    
    // Track the event
    telemetry.trackEvent(event.detail);
  }

  render() {
    return <slot></slot>;
  }
}
import { Component, h, State, Prop, Element, Watch } from '@stencil/core';
import { telemetry } from '../../utils/telemetry-service';
import { TelemetryEventType, UserService, UserData } from '../../utils/telemetry-types';

@Component({
  tag: 'user-profile',
  styleUrl: 'user-profile.css',
  shadow: true,
})
export class UserProfile {
  @Prop() userId: string;
  @Prop() userService: UserService;
  @State() userData: UserData = null;
  @State() error: string = null;
  @Element() el: HTMLElement;

  private intersectionObserver: IntersectionObserver;

  @Watch('userId')
  watchUserId(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
      this.fetchUserData();
    }
  }

  componentWillLoad() {
    telemetry.emit(TelemetryEventType.ComponentMount, { name: 'UserProfile', userId: this.userId });
    this.fetchUserData();
  }

  componentDidLoad() {
    telemetry.emit(TelemetryEventType.ComponentRender, { 
      name: 'UserProfile',
      renderTime: performance.now()
    });
    this.observeVisibility();
  }

  disconnectedCallback() {
    telemetry.emit(TelemetryEventType.ComponentUnmount, { name: 'UserProfile', userId: this.userId });
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
              name: 'UserProfile',
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

  private async fetchUserData() {
    const start = performance.now();
    try {
      this.userData = await this.userService.getUserData(this.userId);
      const end = performance.now();
      telemetry.emit(TelemetryEventType.PerformanceMetric, {
        metricName: 'userDataFetchTime',
        value: end - start,
        unit: 'ms'
      });
    } catch (error) {
      this.error = error.message;
      telemetry.emit(TelemetryEventType.ErrorOccurred, {
        message: 'Failed to fetch user data',
        componentName: 'UserProfile',
        stack: error.stack
      });
    }
  }

  private handleInteraction = (action: string) => {
    telemetry.emit(TelemetryEventType.UserInteraction, { 
      name: 'UserProfile',
      action: action,
      userId: this.userId
    });
  }

  render() {
    if (this.error) {
      return <div class="error">Error: {this.error}</div>;
    }

    if (!this.userData) {
      return <div class="loading">Loading...</div>;
    }

    return (
      <div class="user-profile">
        <div class="profile-image"></div>
        <h2>{this.userData.name}</h2>
        <div class="user-info">
          <p>Email: {this.userData.email}</p>
          <p>Location: {this.userData.location}</p>
        </div>
        <div class="interaction-area">
          <button onClick={() => this.handleInteraction('viewDetails')}>View Details</button>
        </div>
      </div>
    );
  }
}
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
  @State() isEditing: boolean = false;
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

  private handleEdit = () => {
    this.isEditing = true;
    telemetry.emit(TelemetryEventType.UserInteraction, { 
      name: 'UserProfile',
      action: 'editModeEntered',
      userId: this.userId
    });
  }

  private handleSave = async () => {
    try {
      await this.userService.updateUserData(this.userId, this.userData);
      this.isEditing = false;
      telemetry.emit(TelemetryEventType.UserInteraction, { 
        name: 'UserProfile',
        action: 'profileUpdated',
        userId: this.userId
      });
    } catch (error) {
      this.error = error.message;
      telemetry.emit(TelemetryEventType.ErrorOccurred, {
        message: 'Failed to update user data',
        componentName: 'UserProfile',
        stack: error.stack
      });
    }
  }

  private handleInputChange = (event: Event, field: string) => {
    const input = event.target as HTMLInputElement;
    this.userData = { ...this.userData, [field]: input.value };
    telemetry.emit(TelemetryEventType.UserInteraction, { 
      name: 'UserProfile',
      action: 'fieldEdited',
      field: field,
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
          {this.isEditing ? (
            <div>
              <input type="text" value={this.userData.name} onInput={(e) => this.handleInputChange(e, 'name')} />
              <input type="email" value={this.userData.email} onInput={(e) => this.handleInputChange(e, 'email')} />
              <input type="text" value={this.userData.location} onInput={(e) => this.handleInputChange(e, 'location')} />
              <button onClick={this.handleSave}>Save</button>
            </div>
          ) : (
            <div>
              <p>Email: {this.userData.email}</p>
              <p>Location: {this.userData.location}</p>
              <button onClick={this.handleEdit}>Edit Profile</button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
# Stencil Telemetry Project

This project demonstrates a non-intrusive, event-agnostic telemetry system implemented using Stencil web components. It showcases how to collect user behavior metrics and component performance data without tightly coupling the telemetry logic to individual components.

## Features

- Event-agnostic telemetry wrapper component
- Generic telemetry event emission from components
- Automatic tracking of component render times and visibility
- Page load metrics collection
- Sample form component with telemetry integration

## Project Structure

```
form-telemetry/
├── src/
│   ├── components/
│   │   ├── app-root/
│   │   │   ├── app-root.tsx
│   │   │   └── app-root.css
│   │   ├── clean-form/
│   │   │   ├── clean-form.tsx
│   │   │   └── clean-form.css
│   │   └── telemetry-wrapper/
│   │       └── telemetry-wrapper.tsx
│   ├── utils/
│   │   └── telemetry.ts
│   ├── index.html
│   └── index.ts
├── stencil.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-username/your-project-name.git
   cd your-project-name
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. To build for production:
   ```
   npm run build
   ```

## Usage

### Telemetry Wrapper

Wrap any component you want to track with the `<telemetry-wrapper>` component:

```html
<telemetry-wrapper component-id="unique-id">
  <your-component></your-component>
</telemetry-wrapper>
```

### Emitting Telemetry Events

In your component, emit telemetry events using the `telemetryEvent` custom event:

```typescript
@Event() telemetryEvent: EventEmitter<any>;

// ...

this.telemetryEvent.emit({
  type: 'customEventType',
  // ... other relevant data
});
```

### Clean Form Component

The `<clean-form>` component demonstrates how to integrate telemetry into a form:

```html
<telemetry-wrapper component-id="address-form">
  <clean-form id="address-form" submit-button-text="Submit Address"></clean-form>
</telemetry-wrapper>
```

## Telemetry Data

The telemetry system collects the following data:

- Component render times
- Component visibility
- Custom interaction events
- Form submissions and errors
- Page load metrics

Telemetry data is logged to the console in this demo. In a production environment, you would configure the `sendMetrics` function in `telemetry.ts` to send data to your analytics service.

## Customization

- Modify the `Telemetry` class in `src/utils/telemetry.ts` to change how metrics are collected or sent.
- Add new event types by emitting different payloads in your components.
- Extend the `TelemetryWrapper` component to add more automatic tracking features.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
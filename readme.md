# Stencil Components Demo with Enhanced Telemetry - Demo

This project demonstrates a high-performance, scalable implementation of an address form and user profile component with advanced telemetry capabilities. Built using Stencil, it showcases best practices for collecting user behavior data and business metrics while maintaining high performance and scalability.

## Features

- Reusable address form web component
- User profile component demonstrating advanced telemetry integration
- Enhanced telemetry system with performance optimizations
- Non-intrusive data collection using a global event bus
- Comprehensive component lifecycle tracking
- Business metric tracking (e.g., form completion time)

## Project Structure

```
stencil-form-telemetry/
├── src/
│   ├── components/
│   │   ├── app-root/
│   │   │   ├── app-root.tsx
│   │   │   └── app-root.css
│   │   ├── address-form/
│   │   │   ├── address-form.tsx
│   │   │   └── address-form.css
│   │   └── user-profile/
│   │       ├── user-profile.tsx
│   │       └── user-profile.css
│   ├── utils/
│   │   ├── telemetry-service.ts
│   │   ├── telemetry-batcher.ts
│   │   └── telemetry-types.ts
│   ├── global/
│   │   └── app.css
│   ├── index.html
│   └── index.ts
├── stencil.config.ts
├── package.json
├── tsconfig.json
├── README.md
└── PROJECT_DOCUMENTATION.md
```

## Telemetry Enhancements

1. **Global Event Bus**: Centralized telemetry processing using a custom event-based system.
2. **Event Batching**: Groups multiple telemetry events into batches to reduce network requests.
3. **Data Compression**: Uses Pako library for efficient data compression before sending.
4. **Intelligent Sampling**: Implements configurable sampling rates for different event types.
5. **Non-Blocking Operations**: Utilizes asynchronous processing to maintain UI responsiveness.
6. **Component Lifecycle Tracking**: Monitors component mount, render, visibility, and unmount events.
7. **Business Metric Tracking**: Tracks important business events like form completion time.

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/jimbono/stencil-form-telemetry.git
   cd stencil-form-telemetry
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Build for production:
   ```
   npm run build
   ```

## Usage

The address form and user profile components with built-in telemetry can be used in your HTML as follows:

```html
<address-form></address-form>
<user-profile user-id="12345" userService={userServiceInstance}></user-profile>
```

Telemetry events are automatically collected and processed.

## Customization

- Adjust sampling rates in `src/utils/telemetry-service.ts`
- Modify batch size and flush interval in `src/utils/telemetry-batcher.ts`
- Add or modify tracked events in `src/utils/telemetry-types.ts`
- Extend business metric tracking by adding new event types and implementing them in relevant components

## Performance Considerations

- Telemetry events are batched and compressed to minimize network impact
- Sampling reduces data volume while maintaining insights
- Asynchronous processing ensures smooth user experience
- Visibility tracking uses IntersectionObserver for efficiency
- Form completion time tracking adds minimal overhead to form submission process

## Business Insights

- Track form completion times to understand user behavior and form usability
- Analyze component visibility and render times for performance optimization
- Monitor user interactions and error rates for improving user experience

## Contributing

This code was written using a fun session with Claude AI intended to show a demo of how telemetry can be implemented when building Stencil components. This code is purely for education and hence no contributions are expected.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

For more detailed information about the project and its implementation, please refer to the PROJECT_DOCUMENTATION.md file.
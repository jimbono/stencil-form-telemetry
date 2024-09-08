# Stencil Components with Telemetry - Demo

This project implements a demo of stencil components with built-in telemetry capabilities. It demonstrates how to effectively collect user behavior data and business metrics while maintaining high performance and scalability.

## Features

- Trade Order Entry component for stock trading
- Address Form component for user information collection
- User Profile component for account management
- Enhanced telemetry system with performance optimizations
- Non-intrusive data collection using a global event bus
- Comprehensive component lifecycle tracking
- Responsive design for various screen sizes

## Project Structure

```
stencil-form-telemetry/
├── src/
│   ├── components/
│   │   ├── app-root/
│   │   │   ├── app-root.tsx
│   │   │   └── app-root.css
│   │   ├── trade-order-entry/
│   │   │   ├── trade-order-entry.tsx
│   │   │   └── trade-order-entry.css
│   │   ├── address-form/
│   │   │   ├── address-form.tsx
│   │   │   └── address-form.css
│   │   ├── user-profile/
│   │   │   ├── user-profile.tsx
│   │   │   └── user-profile.css
│   │   ├── custom-dropdown/
│   │   │   ├── custom-dropdown.tsx
│   │   │   └── custom-dropdown.css
│   │   └── custom-input/
│   │       ├── custom-input.tsx
│   │       └── custom-input.css
│   ├── utils/
│   │   ├── telemetry-service.ts
│   │   ├── telemetry-batcher.ts
│   │   ├── telemetry-types.ts
│   │   └── mock-user-service.ts
│   ├── index.html
│   └── index.ts
├── stencil.config.ts
├── package.json
├── tsconfig.json
├── README.md
└── PROJECT_DOCUMENTATION.md
```

## Telemetry Enhancements

1. Global Event Bus: Centralized telemetry processing using a custom event-based system.
2. Event Batching: Groups multiple telemetry events into batches to reduce network requests.
3. Data Compression: Uses Pako library for efficient data compression before sending.
4. Intelligent Sampling: Implements configurable sampling rates for different event types.
5. Non-Blocking Operations: Utilizes asynchronous processing to maintain UI responsiveness.
6. Component Lifecycle Tracking: Monitors component mount, render, visibility, and unmount events.
7. Business Metric Tracking: Tracks important business events like trade order completion time and frequently traded symbols.

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

The dashboard components can be used in your HTML as follows:

```html
<trade-order-entry></trade-order-entry>
<address-form></address-form>
<user-profile user-id="12345" userService={userServiceInstance}></user-profile>
```

Telemetry events are automatically collected and processed for all components.

## Customization

- Adjust sampling rates in `src/utils/telemetry-service.ts`
- Modify batch size and flush interval in `src/utils/telemetry-batcher.ts`
- Add or modify tracked events in `src/utils/telemetry-types.ts`
- Extend business metric tracking by adding new event types and implementing them in relevant components

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

For more detailed information about the project and its implementation, please refer to the PROJECT_DOCUMENTATION.md file.
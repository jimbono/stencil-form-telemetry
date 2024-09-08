# Address Form with Enhanced Telemetry

This project demonstrates a high-performance, scalable implementation of an address form component with advanced telemetry capabilities. Built using Stencil, it showcases best practices for collecting user behavior data while minimizing performance impact.

## Features

- Reusable address form web component
- Enhanced telemetry system with performance optimizations
- Non-intrusive data collection using a global event bus
- Comprehensive component lifecycle tracking

## Project Structure

```
address-form-telemetry/
├── src/
│   ├── components/
│   │   ├── app-root/
│   │   │   ├── app-root.tsx
│   │   │   └── app-root.css
│   │   └── address-form/
│   │       ├── address-form.tsx
│   │       └── address-form.css
│   ├── utils/
│   │   ├── telemetry-service.ts
│   │   ├── telemetry-batcher.ts
│   │   └── telemetry-types.ts
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

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/your-username/address-form-telemetry.git
   cd address-form-telemetry
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

The address form component with built-in telemetry can be used in your HTML as follows:

```html
<address-form></address-form>
```

Telemetry events are automatically collected and processed for both the `app-root` and `address-form` components.

## Customization

- Adjust sampling rates in `src/utils/telemetry-service.ts`
- Modify batch size and flush interval in `src/utils/telemetry-batcher.ts`
- Add or modify tracked events in `src/utils/telemetry-types.ts`

## Performance Considerations

- Telemetry events are batched and compressed to minimize network impact
- Sampling reduces data volume while maintaining insights
- Asynchronous processing ensures smooth user experience
- Visibility tracking uses IntersectionObserver for efficiency

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

For more detailed information about the project and its implementation, please refer to the PROJECT_DOCUMENTATION.md file.
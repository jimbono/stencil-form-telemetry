import { Component, State, h, Element } from '@stencil/core';
import { telemetry } from '../../utils/telemetry-service';
import { TelemetryEventType, TradeOrderData, FrequentSymbolsData } from '../../utils/telemetry-types';

@Component({
  tag: 'trade-order-entry',
  styleUrl: 'trade-order-entry.css',
  shadow: true,
})
export class TradeOrderEntry {
  @State() formData: TradeOrderData = {
    action: 'Buy',
    symbol: '',
    quantity: 0,
    orderType: 'Market',
    timeInForce: 'Day'
  };
  @State() symbolInfo: { price: number; change: number; changePercent: number } | null = null;
  @Element() el: HTMLElement;

  private formStartTime: number;
  private frequentSymbols: FrequentSymbolsData = { symbols: [], counts: {} };
  private intersectionObserver: IntersectionObserver;

  componentWillLoad() {
    this.formStartTime = performance.now();
    telemetry.emit(TelemetryEventType.ComponentMount, { name: 'TradeOrderEntry' });
    telemetry.emit(TelemetryEventType.TradeOrderStarted, { timestamp: new Date().toISOString() });
  }

  componentDidLoad() {
    telemetry.emit(TelemetryEventType.ComponentRender, { 
      name: 'TradeOrderEntry',
      renderTime: performance.now() - this.formStartTime
    });
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
            telemetry.emit(TelemetryEventType.ComponentVisible, { 
              name: 'TradeOrderEntry',
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

  handleValueChange(event: CustomEvent<{ name: string, value: string }>) {
    this.formData = { ...this.formData, [event.detail.name]: event.detail.value };
    
    if (event.detail.name === 'symbol') {
      this.trackSymbol(event.detail.value);
      telemetry.emit(TelemetryEventType.SymbolEntered, {
        symbol: event.detail.value
      });
      this.fetchSymbolInfo(event.detail.value);
    }
  }

  trackSymbol(symbol: string) {
    if (!this.frequentSymbols.counts[symbol]) {
      this.frequentSymbols.counts[symbol] = 0;
      this.frequentSymbols.symbols.push(symbol);
    }
    this.frequentSymbols.counts[symbol]++;
    
    telemetry.emit(TelemetryEventType.FrequentSymbolsTracked, this.frequentSymbols);
  }

  async fetchSymbolInfo(symbol: string) {
    // This is a mock function. In a real application, you would call an API to get this data.
    const mockFetch = async () => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      return {
        price: 100 + Math.random() * 100,
        change: Math.random() * 10 - 5,
        changePercent: Math.random() * 5 - 2.5
      };
    };

    try {
      this.symbolInfo = await mockFetch();
    } catch (error) {
      console.error('Failed to fetch symbol info:', error);
      this.symbolInfo = null;
    }
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    const completionTime = performance.now() - this.formStartTime;
    
    telemetry.emit(TelemetryEventType.FormSubmit, this.formData);
    telemetry.emit(TelemetryEventType.TradeOrderCompleted, {
      orderData: this.formData,
      completionTime: completionTime,
      frequentSymbols: this.frequentSymbols
    });

    console.log('Order submitted:', this.formData);
    console.log('Form completion time:', completionTime, 'ms');
    console.log('Frequent symbols:', this.frequentSymbols);

    // Reset the form start time for the next order
    this.formStartTime = performance.now();
    telemetry.emit(TelemetryEventType.TradeOrderStarted, { timestamp: new Date().toISOString() });
  }

  render() {
    return (
      <form onSubmit={(e) => this.handleSubmit(e)}>
        <h2>Trade Order Entry</h2>
        
        <div class="form-row">
          <custom-dropdown
            label="Action"
            name="action"
            options={['Buy', 'Sell']}
            onValueChanged={(e) => this.handleValueChange(e)}
          ></custom-dropdown>

          <custom-input
            label="Symbol"
            name="symbol"
            type="text"
            onValueChanged={(e) => this.handleValueChange(e)}
          ></custom-input>
        </div>

        {this.symbolInfo && (
          <div class="symbol-info">
            <h3>{this.formData.symbol}</h3>
            <p class="price">${this.symbolInfo.price.toFixed(2)}</p>
            <p class={`change ${this.symbolInfo.change >= 0 ? 'positive' : 'negative'}`}>
              {this.symbolInfo.change.toFixed(2)} ({this.symbolInfo.changePercent.toFixed(2)}%)
            </p>
          </div>
        )}

        <div class="form-row">
          <custom-input
            label="Quantity"
            name="quantity"
            type="number"
            onValueChanged={(e) => this.handleValueChange(e)}
          ></custom-input>

          <custom-dropdown
            label="Order Type"
            name="orderType"
            options={['Market', 'Limit', 'Stop', 'Stop Limit']}
            onValueChanged={(e) => this.handleValueChange(e)}
          ></custom-dropdown>
        </div>

        {(this.formData.orderType === 'Limit' || this.formData.orderType === 'Stop Limit') && (
          <custom-input
            label="Limit Price"
            name="limitPrice"
            type="number"
            onValueChanged={(e) => this.handleValueChange(e)}
          ></custom-input>
        )}

        <custom-dropdown
          label="Time in Force"
          name="timeInForce"
          options={['Day', 'GTC', 'Extended Hours']}
          onValueChanged={(e) => this.handleValueChange(e)}
        ></custom-dropdown>

        <button type="submit">Place Order</button>
      </form>
    );
  }
}
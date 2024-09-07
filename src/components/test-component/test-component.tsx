import { Component, h } from '@stencil/core';

@Component({
  tag: 'test-component',
  shadow: true
})
export class TestComponent {
  render() {
    return <div>Hello from TestComponent!</div>;
  }
}
# custom-input



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type     | Default     |
| -------- | --------- | ----------- | -------- | ----------- |
| `label`  | `label`   |             | `string` | `undefined` |
| `name`   | `name`    |             | `string` | `undefined` |
| `type`   | `type`    |             | `string` | `'text'`    |
| `value`  | `value`   |             | `string` | `''`        |


## Events

| Event          | Description | Type                                            |
| -------------- | ----------- | ----------------------------------------------- |
| `valueChanged` |             | `CustomEvent<{ name: string; value: string; }>` |


## Dependencies

### Used by

 - [address-form](../address-form)
 - [trade-order-entry](../trade-order-entry)
 - [user-profile](../user-profile)

### Graph
```mermaid
graph TD;
  address-form --> custom-input
  trade-order-entry --> custom-input
  user-profile --> custom-input
  style custom-input fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

export interface TelemetryEvent {
    type: string;
    timestamp: string;
    data: any;
  }
  
  export enum TelemetryEventType {
    ComponentMount = 'componentMount',
    ComponentUnmount = 'componentUnmount',
    ComponentRender = 'componentRender',
    ComponentVisible = 'componentVisible',
    FieldBlur = 'fieldBlur',
    FormSubmit = 'formSubmit'
  }
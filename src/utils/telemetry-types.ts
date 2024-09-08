export interface TelemetryEvent {
    type: string;
    timestamp: string;
    data: any;
  }
  
  export enum TelemetryEventType {
    ComponentMount = 'componentMount',
    ComponentRender = 'componentRender',
    ComponentVisible = 'componentVisible',
    ComponentUnmount = 'componentUnmount',
    FieldBlur = 'fieldBlur',
    FormSubmit = 'formSubmit',
    UserInteraction = 'userInteraction',
    PerformanceMetric = 'performanceMetric',
    ErrorOccurred = 'errorOccurred',
    FormCompletionTime = 'formCompletionTime',
    ProfileEditStarted = 'profileEditStarted',
    ProfileUpdated = 'profileUpdated',
    TradeOrderStarted = 'tradeOrderStarted',
    TradeOrderCompleted = 'tradeOrderCompleted',
    SymbolEntered = 'symbolEntered',
    FrequentSymbolsTracked = 'frequentSymbolsTracked'
  }

  export interface PerformanceMetricData {
    metricName: string;
    value: number;
    unit: string;
  }
  
  export interface ErrorData {
    message: string;
    stack?: string;
    componentName?: string;
  }
  
  export interface UserData {
    id: string;
    name: string;
    email: string;
    location: string;
  }
  
  export interface UserService {
    getUserData(userId: string): Promise<UserData>;
    updateUserData(userId: string, userData: UserData): Promise<UserData>;
  }
  
  export interface FormCompletionTimeData {
    formId: string;
    completionTime: number;
    fieldCount: number;
  }

  export interface TradeOrderData {
    action: string;
    symbol: string;
    quantity: number;
    orderType: string;
    limitPrice?: number;
    timeInForce: string;
  }
  
  export interface FrequentSymbolsData {
    symbols: string[];
    counts: { [symbol: string]: number };
  }
export interface ControllerConfigurationProps {
  onCancel?: () => void;
  onFinish?: () => void;
}

export interface ControllerConfigurationState {
  opMin: string;
  pvMin: string;
  opMax: string;
  pvMax: string;
  sampleIntervalType: "average" | "specified";
  specifiedInterval: string;
  serviceFactorThreshold: string;
  minimumContiguousSampleCount: string;
  isSlave: boolean;
  pvNormalization: string;
  spNormalization: string;
  opNormalization: string;
  aux1Normalization: string;
  aux2Normalization: string;
  aux3Normalization: string;
  inGap: string;
  feedForward: string;
  warningThreshold: string;
  abortThreshold: string;
  badPvThreshold: string;
  weight: string;
  description: string;
  allowRobustDiagnostic: boolean;
  eliminationExpression: string;
  gain: string;
  derivativeFilter: string;
  integralTime: string;
  pvFilter: string;
  derivativeTime: string;
  comment: string;
  tuningHistoryDays: string;
  sensorHighLimit: string;
  sensorLowLimit: string;
  freezeDuration: string;
  acceptableViolation: string;
  showAdvancedSettings: boolean;
  maximumMeasurementChange: string;
  minimumMeasurementChange: string;
}

type StringFieldKey = {
  [K in keyof ControllerConfigurationState]: ControllerConfigurationState[K] extends string
    ? K
    : never;
}[keyof ControllerConfigurationState];

export type TextField = {
  label: string;
  field: StringFieldKey;
  type: "text" | "number";
};

export type SampleIntervalOption = {
  label: string;
  value: "average" | "specified";
};

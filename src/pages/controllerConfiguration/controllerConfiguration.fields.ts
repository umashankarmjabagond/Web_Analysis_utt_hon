import type { TextField } from "../../types/ControllerConfigurationTypes";

export const controllerStepTitles = [
  "CONTROLLER_STEP_1_TITLE",
  "CONTROLLER_STEP_2_TITLE",
  "CONTROLLER_STEP_3_TITLE",
  "CONTROLLER_STEP_4_TITLE",
  "CONTROLLER_STEP_5_TITLE",
  "CONTROLLER_STEP_6_TITLE",
] as const;

export const controllerSampleIntervalOptions = [
  {
    label: "CONTROLLER_AVERAGE_SAMPLE_INTERVAL",
    value: "average",
  },
  {
    label: "CONTROLLER_SPECIFIED_INTERVAL",
    value: "specified",
  },
] as const;

export const controllerFields = {
  range: [
    {
      label: "CONTROLLER_OP_MIN",
      field: "opMin",
      type: "number",
    },
    {
      label: "CONTROLLER_PV_MIN",
      field: "pvMin",
      type: "number",
    },
    {
      label: "CONTROLLER_OP_MAX",
      field: "opMax",
      type: "number",
    },
    {
      label: "CONTROLLER_PV_MAX",
      field: "pvMax",
      type: "number",
    },
  ] satisfies TextField[],

  sampling: [
    {
      label: "CONTROLLER_SERVICE_FACTOR_THRESHOLD",
      field: "serviceFactorThreshold",
      type: "number",
    },
    {
      label: "CONTROLLER_MIN_CONTIGUOUS_SAMPLE_COUNT",
      field: "minimumContiguousSampleCount",
      type: "number",
    },
  ] satisfies TextField[],

  normalization: [
    {
      label: "CONTROLLER_PV",
      field: "pvNormalization",
      type: "text",
    },
    {
      label: "CONTROLLER_SP",
      field: "spNormalization",
      type: "text",
    },
    {
      label: "CONTROLLER_OP",
      field: "opNormalization",
      type: "text",
    },
  ] satisfies TextField[],

  auxiliary: [
    {
      label: "CONTROLLER_AUX_1",
      field: "aux1Normalization",
      type: "text",
    },
    {
      label: "CONTROLLER_AUX_2",
      field: "aux2Normalization",
      type: "text",
    },
    {
      label: "CONTROLLER_AUX_3",
      field: "aux3Normalization",
      type: "text",
    },
    {
      label: "CONTROLLER_IN_GAP",
      field: "inGap",
      type: "text",
    },
    {
      label: "CONTROLLER_FEED_FORWARD",
      field: "feedForward",
      type: "text",
    },
  ] satisfies TextField[],

  badData: [
    {
      label: "CONTROLLER_WARNING_THRESHOLD",
      field: "warningThreshold",
      type: "number",
    },
    {
      label: "CONTROLLER_ABORT_THRESHOLD",
      field: "abortThreshold",
      type: "number",
    },
    {
      label: "CONTROLLER_BAD_PV_THRESHOLD",
      field: "badPvThreshold",
      type: "number",
    },
  ] satisfies TextField[],

  plantInformation: [
    {
      label: "CONTROLLER_WEIGHT",
      field: "weight",
      type: "number",
    },
    {
      label: "CONTROLLER_DESCRIPTION",
      field: "description",
      type: "text",
    },
  ] satisfies TextField[],

  tuning: [
    {
      label: "CONTROLLER_GAIN",
      field: "gain",
      type: "number",
    },
    {
      label: "CONTROLLER_DERIVATIVE_FILTER",
      field: "derivativeFilter",
      type: "number",
    },
    {
      label: "CONTROLLER_INTEGRAL_TIME",
      field: "integralTime",
      type: "number",
    },
    {
      label: "CONTROLLER_PV_FILTER",
      field: "pvFilter",
      type: "number",
    },
    {
      label: "CONTROLLER_DERIVATIVE_TIME",
      field: "derivativeTime",
      type: "number",
    },
  ] satisfies TextField[],

  sensorLimits: [
    {
      label: "CONTROLLER_SENSOR_HIGH_LIMIT",
      field: "sensorHighLimit",
      type: "number",
    },
    {
      label: "CONTROLLER_SENSOR_LOW_LIMIT",
      field: "sensorLowLimit",
      type: "number",
    },
  ] satisfies TextField[],

  tolerance: [
    {
      label: "CONTROLLER_FREEZE_DURATION",
      field: "freezeDuration",
      type: "number",
    },
    {
      label: "CONTROLLER_ACCEPTABLE_VIOLATION",
      field: "acceptableViolation",
      type: "number",
    },
  ] satisfies TextField[],

  advanced: [
    {
      label: "CONTROLLER_MAX_MEASUREMENT_CHANGE",
      field: "maximumMeasurementChange",
      type: "number",
    },
    {
      label: "CONTROLLER_MIN_MEASUREMENT_CHANGE",
      field: "minimumMeasurementChange",
      type: "number",
    },
  ] satisfies TextField[],
};

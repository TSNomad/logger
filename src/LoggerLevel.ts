/**
 * LoggerLevel
 *
 * PHPNomad's `PHPNomad\Logger\Enums\LoggerLevel`: the eight RFC 5424
 * levels, by name. Each value is also the name of the `LoggerStrategy`
 * method that logs at that level.
 *
 * Where this differs from PHPNomad: a frozen object of the same names and
 * values stands in for PHP's class of constants, and the type
 * `LoggerLevel` is the union of its values.
 */
export const LoggerLevel = Object.freeze({
  Emergency: 'emergency',
  Alert: 'alert',
  Critical: 'critical',
  Error: 'error',
  Warning: 'warning',
  Notice: 'notice',
  Info: 'info',
  Debug: 'debug',
} as const);

export type LoggerLevel = (typeof LoggerLevel)[keyof typeof LoggerLevel];

/**
 * LoggerStrategy
 *
 * PHPNomad's `PHPNomad\Logger\Interfaces\LoggerStrategy`: one method per
 * level, each taking a message and a context, plus `logException`.
 * Platform integrations implement it. Extending `BaseLoggerStrategy`
 * gives an implementation `logException`, as PHPNomad's `CanLogException`
 * trait does.
 *
 * A context is a plain object of values that explain the message. A
 * logger never throws because of what a context holds.
 *
 * Where this differs from PHPNomad: `logException` accepts any thrown
 * value, because JavaScript can throw anything, and PHP's takes an
 * `Exception`.
 */

import { createToken } from '@tsnomad/di-container';
import type { LoggerLevel } from './LoggerLevel.js';

export type LogContext = Record<string, unknown>;

export interface LoggerStrategy {
  /** The system is unusable. */
  emergency(message: string, context?: LogContext): void;

  /** Someone must act now, such as when the whole site is down. */
  alert(message: string, context?: LogContext): void;

  /** A critical condition, such as an unexpected exception. */
  critical(message: string, context?: LogContext): void;

  /** A runtime error that needs no immediate action but must be seen. */
  error(message: string, context?: LogContext): void;

  /** Something unusual that is not an error. */
  warning(message: string, context?: LogContext): void;

  /** A normal but significant event. */
  notice(message: string, context?: LogContext): void;

  /** An interesting event. */
  info(message: string, context?: LogContext): void;

  /** Detailed debug information. */
  debug(message: string, context?: LogContext): void;

  /**
   * Logs a thrown value once, at `level`, which defaults to critical.
   * `BaseLoggerStrategy` documents the message and context it writes.
   *
   * @throws TypeError when `level` is not one of the eight levels
   */
  logException(error: unknown, message?: string, context?: LogContext, level?: LoggerLevel): void;
}

export const LoggerStrategy = createToken<LoggerStrategy>('LoggerStrategy');

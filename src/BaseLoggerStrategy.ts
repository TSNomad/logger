/**
 * BaseLoggerStrategy
 *
 * The TypeScript counterpart to PHPNomad's `CanLogException` trait. An
 * implementation extends it, writes the eight level methods, and inherits
 * `logException`.
 *
 * Where this differs from PHPNomad: TypeScript has no traits, so the trait
 * becomes a base class, as the loader's `BaseInitializer` does for
 * `CanSetContainer`. An implementation that must extend another class
 * writes `logException` itself, to this contract.
 */

import { LoggerLevel } from './LoggerLevel.js';
import type { LogContext, LoggerStrategy } from './LoggerStrategy.js';

/** The eight levels, the only names `logException` will call. */
const LEVELS: readonly string[] = Object.values(LoggerLevel);

export abstract class BaseLoggerStrategy implements LoggerStrategy {
  abstract emergency(message: string, context?: LogContext): void;
  abstract alert(message: string, context?: LogContext): void;
  abstract critical(message: string, context?: LogContext): void;
  abstract error(message: string, context?: LogContext): void;
  abstract warning(message: string, context?: LogContext): void;
  abstract notice(message: string, context?: LogContext): void;
  abstract info(message: string, context?: LogContext): void;
  abstract debug(message: string, context?: LogContext): void;

  /**
   * Calls the method named by `level` once, critical by default, with:
   *
   * - the message `<message> - <error message>`, or the error message
   *   alone when `message` is empty. The error message is `error.message`
   *   for an Error and `String(error)` for any other value.
   * - a new context holding every key of `context` plus `exception`, set
   *   to `error` itself. A caller's own `exception` key is replaced, as in
   *   PHP. The caller's object is not changed.
   *
   * Where this differs from PHPNomad: PHP joins with ' - ' even when the
   * message is empty, which writes ' - <error message>'. This drops the
   * empty part. PHP calls whatever method the level names. This throws a
   * TypeError for a level that is not one of the eight, before it logs,
   * so a mistyped level fails where it is written instead of later.
   *
   * @throws TypeError when `level` is not one of the eight levels
   */
  logException(error: unknown, message: string = '', context: LogContext = {}, level?: LoggerLevel): void {
    const chosen = level ?? LoggerLevel.Critical;
    // Check before logging, so a mistyped level logs nothing and fails here.
    if (!LEVELS.includes(chosen)) {
      throw new TypeError(`logException: '${String(chosen)}' is not one of the eight logger levels`);
    }
    const errorMessage = error instanceof Error ? error.message : String(error);
    const text = message === '' ? errorMessage : `${message} - ${errorMessage}`;
    // A new object, the caller's keys first and exception last, so a
    // caller's own exception key is replaced and its object is untouched.
    const logged: LogContext = { ...context };
    delete logged.exception;
    logged.exception = error;
    this[chosen](text, logged);
  }
}

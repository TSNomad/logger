/**
 * Acceptance tests for BaseLoggerStrategy.logException.
 */

import { describe, expect, test } from 'vitest';
import { BaseLoggerStrategy, LoggerLevel } from '@tsnomad/logger';
import type { LogContext } from '@tsnomad/logger';

type Call = { level: string; message: string; context: LogContext | undefined };

class RecordingLogger extends BaseLoggerStrategy {
  readonly calls: Call[] = [];
  private record(level: string, message: string, context?: LogContext) {
    this.calls.push({ level, message, context });
  }
  emergency(message: string, context?: LogContext) { this.record('emergency', message, context); }
  alert(message: string, context?: LogContext) { this.record('alert', message, context); }
  critical(message: string, context?: LogContext) { this.record('critical', message, context); }
  error(message: string, context?: LogContext) { this.record('error', message, context); }
  warning(message: string, context?: LogContext) { this.record('warning', message, context); }
  notice(message: string, context?: LogContext) { this.record('notice', message, context); }
  info(message: string, context?: LogContext) { this.record('info', message, context); }
  debug(message: string, context?: LogContext) { this.record('debug', message, context); }
}

describe('BaseLoggerStrategy.logException', () => {
  test('logs once at critical by default, joining the message and the error message', () => {
    const logger = new RecordingLogger();
    const error = new Error('disk full');
    logger.logException(error, 'Saving the order failed', { orderId: 'o_1' });

    expect(logger.calls).toHaveLength(1);
    expect(logger.calls[0]).toEqual({
      level: 'critical',
      message: 'Saving the order failed - disk full',
      context: { orderId: 'o_1', exception: error },
    });
    expect(logger.calls[0].context?.exception).toBe(error);
  });

  test('writes the error message alone when the message is empty or left out', () => {
    const logger = new RecordingLogger();
    logger.logException(new Error('boom'), '');
    logger.logException(new Error('bang'));

    expect(logger.calls.map((c) => c.message)).toEqual(['boom', 'bang']);
    expect(logger.calls.map((c) => c.level)).toEqual(['critical', 'critical']);
  });

  test('calls the method each of the eight levels names', () => {
    const levels = Object.values(LoggerLevel);
    expect(levels).toHaveLength(8);
    for (const level of levels) {
      const logger = new RecordingLogger();
      logger.logException(new Error('x'), 'at ' + level, {}, level);
      expect(logger.calls).toEqual([{ level, message: `at ${level} - x`, context: { exception: expect.any(Error) } }]);
    }
  });

  test('reads a value that is not an Error with String()', () => {
    const logger = new RecordingLogger();
    logger.logException('plain string thrown', 'Handler failed');
    logger.logException(42);

    expect(logger.calls[0].message).toBe('Handler failed - plain string thrown');
    expect(logger.calls[0].context).toEqual({ exception: 'plain string thrown' });
    expect(logger.calls[1].message).toBe('42');
    expect(logger.calls[1].context).toEqual({ exception: 42 });
  });

  test("leaves the caller's context alone and replaces its exception key in the logged copy", () => {
    const logger = new RecordingLogger();
    const error = new Error('real');
    const context: LogContext = { exception: 'caller value', step: 3 };
    logger.logException(error, 'm', context);

    expect(context).toEqual({ exception: 'caller value', step: 3 });
    expect(logger.calls[0].context).not.toBe(context);
    expect(logger.calls[0].context).toEqual({ exception: error, step: 3 });
  });

  test('throws a TypeError naming a level that is not one of the eight, and logs nothing', () => {
    const logger = new RecordingLogger();
    expect(() => logger.logException(new Error('x'), 'm', {}, 'verbose' as never)).toThrow(TypeError);
    expect(() => logger.logException(new Error('x'), 'm', {}, 'verbose' as never)).toThrow(/verbose/);
    expect(() => logger.logException(new Error('x'), 'm', {}, 'logException' as never)).toThrow(TypeError);
    expect(logger.calls).toEqual([]);
  });
});

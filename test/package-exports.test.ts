/**
 * The public entry point, imported by package name. Runs now.
 */

import { expect, test } from 'vitest';
import * as logger from '@tsnomad/logger';

test('exports the levels, the strategy token and the base class', () => {
  expect(Object.keys(logger).sort()).toEqual(['BaseLoggerStrategy', 'LoggerLevel', 'LoggerStrategy']);
  expect(logger.LoggerStrategy.name).toBe('LoggerStrategy');
  expect(logger.LoggerLevel).toEqual({
    Emergency: 'emergency',
    Alert: 'alert',
    Critical: 'critical',
    Error: 'error',
    Warning: 'warning',
    Notice: 'notice',
    Info: 'info',
    Debug: 'debug',
  });
  expect(Object.isFrozen(logger.LoggerLevel)).toBe(true);
});

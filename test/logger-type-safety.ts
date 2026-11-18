/**
 * Compile-only checks, run by `npm run typecheck`. Each @ts-expect-error
 * line must stay an error. Nothing here runs.
 */

import type { LoggerStrategy, LogContext } from '@tsnomad/logger';
import { BaseLoggerStrategy } from '@tsnomad/logger';

declare const logger: LoggerStrategy;

logger.error('message');
logger.error('message', { key: 'value' });
logger.logException(new Error('x'));
logger.logException(new Error('x'), 'message', {}, 'warning');

// @ts-expect-error a level outside the eight
logger.logException(new Error('x'), 'message', {}, 'verbose');

// @ts-expect-error a context must be an object
logger.info('message', 'not a context');

// @ts-expect-error a strategy needs all eight level methods
const missingDebug: LoggerStrategy = { emergency() {}, alert() {}, critical() {}, error() {}, warning() {}, notice() {}, info() {}, logException() {} };

// @ts-expect-error an implementation must write the eight level methods
class OnlyError extends BaseLoggerStrategy {
  error(message: string, context?: LogContext): void {}
}

void missingDebug;
void OnlyError;

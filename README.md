# @tsnomad/logger

The logger contract: `LoggerStrategy` with PHPNomad's eight levels and
`logException`, the `LoggerLevel` values, and `BaseLoggerStrategy`,
which writes `logException` once for every strategy.

This is the TypeScript counterpart to PHPNomad's
[logger](https://github.com/phpnomad/logger) package.

## Install

```bash
npm install @tsnomad/logger
```

The package ships compiled JavaScript with its type declarations, so
it needs no build step of its own. It needs Node 20.19 or later.
npm installs the TS Nomad package it depends on with it.

`scripts/consumer-check.sh [<commit>]` installs the package from git at
one commit into a scratch project and imports every export, from Node
and from TypeScript.

## Where it fits

Every other TS Nomad package that reports a failure does it through this
contract. `@tsnomad/rest` and the platform integrations depend on it,
and an integration binds the strategy that writes the lines.

## Use

```ts
import { BaseLoggerStrategy, LoggerStrategy, type LogContext } from '@tsnomad/logger';

class LineLogger extends BaseLoggerStrategy {
  emergency(message: string, context?: LogContext) { this.write('emergency', message, context); }
  // ...alert, critical, error, warning, notice and info the same way
  debug(message: string, context?: LogContext) { this.write('debug', message, context); }
  private write(level: string, message: string, context?: LogContext) { /* ... */ }
}

container.bind(LineLogger, LoggerStrategy);

logger.logException(error, 'Sync failed', { order: 42 });          // critical
logger.logException(error, 'Sync failed', { order: 42 }, 'warning');
```

`logException(error, message?, context?, level?)` logs once, at
`critical` unless a level is given. The message is `<message> - <error
message>`, or the error message alone when `message` is empty. The
context it logs is a copy of the caller's with `exception` set to the
error. An unknown level throws a `TypeError` before anything is logged.

`@tsnomad/node-integration` ships `ConsoleLoggerStrategy`.

## Where this differs from PHPNomad

- `BaseLoggerStrategy` stands in for PHP's `CanLogException` trait.
- `logException` takes any thrown value, read with `String()` when it is
  not an `Error`, and leaves out the ` - ` separator when the message is
  empty.
- `logException` throws a `TypeError` for an unknown level before it
  logs. PHP fails when it calls a method of that name, which does not
  exist.

## Extracted 2026-11-17

This package moved into its own repository on 2026-11-17, at version
0.1.0, with its tests.

## License

Copyright (C) 2026 TSNomad.

This package is free software, released under the GNU General Public
License, version 3 or any later version (GPL-3.0-or-later). It comes
with no warranty. The full text is in [LICENSE](LICENSE).

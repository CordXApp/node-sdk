# prettierlogs

A simple and customizable logger for Node.js applications with support for colored console output and optional file logging.

---

## Installation

Install the module using your preferred package manager

---

### NPM

```sh
npm install prettierlogs
```

### Yarn

```sh
yarn install prettierlogs
```

### Bun

```sh
bun install prettierlogs
```

---

## Usage

### Importing the Logger

```ts
import { prettier } from 'prettierlogs'
```

### Creating a Logger Instance

You can create a logger instance with an optional prefix, log level, and log file configuration.

```ts
/** CREATE A NEW DEBUG LOG AND SAVE THE LOGS CREATED UNDER IT TO A "app.log" FILE */
const logs = new prettier('My App', 'debug', { path: 'app.log', enabled: true })
```

### Logging Messages

You can log messages at different levels:

```ts
logs.info('This is an info message')
logs.warn('This is a warning message')
logs.error('This is an error message')
logs.ready('The application is ready')
logs.debug('This is a debug message')
```

### Changing Log Level

You can change the log level dynamically:

```ts
logs.setLogLevel('warn')
```

---

## API

### Logger

#### Constructor

```ts
new Logger(prefix?: string, logLevel?: LogLevel, logFile?: LogFile);
```

- `prefix` (optional): A string to prefix all log messages with.
- `logLevel` (optional): The minimum log level to output ('info', 'warn', 'error', 'ready', 'debug'). Default is 'info'.
- `logFile` (optional): An object with `path` and `enabled` properties to configure file logging.

#### Methods

- `info(message: string | object): void`: Logs an info message.
- `warn(message: string | object): void`: Logs a warning message.
- `error(message: string | object): void`: Logs an error message.
- `ready(message: string | object): void`: Logs a ready message.
- `debug(message: string | object): void`: Logs a debug message.
- `setLogLevel(level: LogLevel): void`: Sets the log level.

#### LogFile

An interface to configure file logging.

```ts
interface LogFile {
    path: string
    enabled: boolean
}
```

#### LogLevel

A type representing the log levels.

```ts
type LogLevel = 'info' | 'warn' | 'error' | 'ready' | 'debug'
```

---

## Example

```ts
import { prettier } from 'prettierlogs'

const logs = new prettier('MyApp', 'debug', { path: 'app.log', enabled: true })

logs.info('This is an info message')
logs.warn('This is a warning message')
logs.error('This is an error message')
logs.ready('The application is ready')
logs.debug('This is a debug message')

logs.setLogLevel('warn')
logs.debug('This debug message will not be logged')
logs.error('This error message will be logged')
```

# CordXSnowflake
CordXSnowflake is a simple yet customizable module for generating and decomposing unique ID strings, similar to Twitter's Snowflake IDs. 
Snowflake IDs are a way of generating unique, sortable identifiers distributedly, as they contain a timestamp component and machine identifier.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Create a new instance](#create-a-new-instance)
  - [Generate a new snowflake](#generate-a-new-snowflake)
  - [Decompose a snowflake](#decompose-a-snowflake)
- [API](#api)
- [Error Handling](#error-handling)
- [Contributing](#contributing)

## Features
- Generate unique ID strings
- Decompose ID strings back into their components
- Configurable worker ID, process ID, epoch, and increment
- Optional debug logging

---

## Installation

```bash
npm install @cordxapp/snowflake
```

---

## Usage 
First, you need to import the CordX Snowflake client/class:

```ts
import { CordXSnowflake } from '@cordxapp/snowflake';
```

### Create a new instance
Once you have the module imported you can create a new `CordXSnowflake` client:

```ts
const snowflake = new CordXSnowflake({
    workerId: 1, // Unique identifier for the worker generating IDs
    processId: 2, // Unique identifier for the process generating IDs
    epoch: 3, // Starting point in time for generating IDs
    increment: 4, // Ensures uniqueness of IDs generated in the same millisecond
    sequence: 5n, // Additional measure to ensure uniqueness
    debug: false // Enable or disable debug logging
});
```

### Generate a new snowflake
Now you can generate a new snowflake id:

```ts
const id = await snowflake.generate();

console.log(id); // Outputs: '12345678901234567890'
```

### Decompose a snowflake
You can also decompose a snowflake to return its properties:

```ts
const components = snowflake.decompose(id);
console.log(components); // Outputs: { timestamp: 1234567890, workerId: 1, processId: 2, sequence: 5 }
```

---

## API

### `CordXSnowflake(options: ICordXSnowflakeOptions)`
Creates a new CordXSnowflake instance. The options object should contain the following properties:
- `workerId`: A number representing the worker ID. Must be less than or equal to 31.
- `processId`: A number representing the process ID. Must be less than or equal to 31.
- `epoch`: A number representing the epoch.
- `increment`: A number representing the increment. Must be less than or equal to 4095.
- `sequence`: A bigint representing the sequence. Must be less than or equal to 4095.
- `debug`: A boolean indicating whether debug logging should be enabled.

**Example**:

```ts
const snowflake = new CordXSnowflake({
    workerId: 1,
    processId: 2,
    epoch: 3,
    increment: 4,
    sequence: 5n,
    debug: false
});
```

### `generate(): string`
Generates a new ID string. The ID is composed of the timestamp, worker ID, process ID, and sequence, 
each shifted to occupy a specific range of bits in the ID.

**Example**:
```ts
const id = snowflake.generate();
console.log(id); // Outputs: '12345678901234567890'
```

### `decompose(id: string): { timestamp: number, workerId: number, processId: number, sequence: number }`
Decomposes an ID string back into its components. The returned object contains the following properties:
- `timestamp`: The timestamp component of the ID.
- `workerId`: The worker ID component of the ID.
- `processId`: The process ID component of the ID.
- `sequence`: The sequence component of the ID.

**Example**:
```ts
const components = snowflake.decompose(id);
console.log(components); // Outputs: { timestamp: 1234567890, workerId: 1, processId: 2, sequence: 5 }
```

---

## Error Handling
If an error occurs during ID generation or decomposition, a SnowflakeError will be thrown. You can catch this error and handle it appropriately in your application.

---

## Contributing
Contributions are welcome! Please submit a pull request or create an issue to discuss any changes you'd like to make.


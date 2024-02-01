# CordX Client
CordX Client is a simple and powerful npm module for interacting with the CordX API. 
It provides a set of easy-to-use methods for fetching data from the API.

---
## Features

- Generate random pieces of advice, facts, memes, and "Yo Momma" jokes with `CordXCommands`.
- Fetch website statistics, service versions, and status summary with `CordXSystem`.

## Installation
To use this module, you'll need to have Node.js installed. You can then install the module using npm:

```bash
npm install @cordxapp/client
```

---

## API Documentation

### CordX Commands
- `RunAdviceCommand()`: Generates a random piece of advice.
- `RunFactCommand()`: Generates a random fact.
- `RunMemeCommand(type)`: Generates a random meme of the specified type.
- `RunYoMommaCommand()`: Generates a random "Yo Momma" joke.

### CordX System
- `Statistics()`: Fetches website statistics.
- `Versions()`: Fetches service versions.
- `Status()`: Fetches status summary.

---

## Usage
Here's how you can use the `CordXCommands` and `CordXSystem` classes respectively:

```ts
import { CordXCommands, CordXSystem } from 'cordx-client';

const commandsClient = new CordXCommands();
const systemClient = new CordXSystem();

// Using CordXCommands
commandsClient.RunAdviceCommand().then(console.log).catch(console.error);
commandsClient.RunFactCommand().then(console.log).catch(console.error);
commandsClient.RunMemeCommand('type').then(console.log).catch(console.error); // Replace 'type' with the type of meme you want
commandsClient.RunYoMommaCommand().then(console.log).catch(console.error);

// Using CordXSystem
systemClient.Statistics().then(console.log).catch(console.error);
systemClient.Versions().then(console.log).catch(console.error);
systemClient.Status().then(console.log).catch(console.error);
```

---
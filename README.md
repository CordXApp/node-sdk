# CordX SDK

Welcome to the official CordX Software Development Kit (SDK). This SDK allows you to interact with all of our services in a simple and efficient way. It's built with Lerna, making it modular and easy to maintain.

## Modules
Our SDK is composed of several modules, each serving a unique purpose. 
You can find detailed usage instructions for each module in our documentation:
- [type docs](https://cordxapp.github.io/node-sdk)
- [user docs](https://help.cordx.lol/docs/npm)

Here are the modules included in our SDK:

- [@cordxapp/pastes](https://www.npmjs.com/package/@cordxapp/pastes): A module for interacting with the CordX pastes service.
- [@cordxapp/request](https://www.npmjs.com/package/@cordxapp/request): A module for making HTTP requests to the CordX API.
- [@cordxapp/instatus](https://www.npmjs.com/package/@cordxapp/instatus): A module for interacting with the CordX instatus service.
- [@cordxapp/snowflake](https://www.npmjs.com/package/@cordxapp/snowflake): A module for generating and decoding CordX snowflakes.

## Installation
Installing our SDK may not be as simple as you think, this SDK is broken down into multiple modules that are released/published
individually so they need to be installed separately:

### CordX Client
```bash
npm install @cordxapp/client
```

### CordX Instatus API
```bash
npm install @cordxapp/instatus
```

### CordX Pastes
```bash
npm install @cordxapp/pastes
```

### CordX Request
```bash
npm install @cordxapp/request
```

### CordX Snowflake
```bash
npm install @cordxapp/snowflake
```

---
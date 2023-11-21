# Instatus API
Custom module for interacting with the instatus api

---

### Install

```js
npm install @cordxapp/instatus
```

---

### Getting Started

```js
/** ES6 */
import { InstatusClient } from '@cordxapp/instatus';

const instatus = new InstatusClient({ 
    apiKey: 'YOUR_INSTATUS_API_KEY'
    apiVersion: '2' 
});
```

```js
const { InstatusClient } = require('@cordxapp/instatus');
const instatus = new InstatusClient({ 
    apiKey: 'YOUR_INSTATUS_API_KEY'
    apiVersion: '2' 
});
```

---
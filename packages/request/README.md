# @cordxapp/request
Simple request logic used in our software development kit

---

## Get Method

### Commonjs

```js
const { RequestClient } = require('@cordxapp/request');
const { get } = new RequestClient();

const response = await get('https://api.cordx.lol');

return console.log(response.message);
```

### ES6

```js
import { RequestClient } from '@cordxapp/request';
const req = new RequestClient();

const response = await req.get('https://api.cordx.lol');

return console.log(response.message);
```

---

## Post Method

### Commonjs

```js
const { RequestClient } = require('@cordxapp/request');
const req = new RequestClient();

return req.post({ url: 'https://api.cordx.lol', body: 'SOME_BODY_HERE' });
```

### ES6

```js
import { RequestClient } from '@cordxapp/request';
const req = new RequestClient();

return req.post({ url: 'https://api.cordx.lol', body: 'SOME_BODY_HERE' });
```
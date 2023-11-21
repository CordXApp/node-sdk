# @cordxapp/request

Custom logic for handling requests how you want to!

---

## Documentation
- [User Guides](https://help.cordx.lol/docs/npm/request)
- [TypeDocs](https://cordxapp.github.io/node-sdk/modules/request_src.html)

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
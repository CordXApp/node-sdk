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
const { get } = new RequestClient();

const response = await get('https://api.cordx.lol');

return console.log(response.message);
```

---

## Post Method

### Commonjs

```js
const { RequestClient } = require('@cordxapp/request');
const { post } = new RequestClient();

return post('https://api.cordx.lol', 'SOME_BODY_HERE');
```

### ES6

```js
import { RequestClient } from '@cordxapp/request';
const { get } = new RequestClient();

return post('https://api.cordx.lol', 'SOME_BODY_HERE');
```
# CordX Pastes
Simple module for posting and fetching code snippets, text and more to/from our bin.

---

## Install

```
npm install @cordxapp/pastes
```

---

## Imports

### Commonjs

```js
const { PasteClient } = require('@cordxapp/pastes');
```

### ES6
```js
import { PasteClient } from '@cordxapp/pastes';
```

---

## New paste

```js
import {PasteClient} from '@cordxapp/pastes'
const pastes = new PasteClient();

await pastes.post('Some text sting or whatever you want here!')
.then((r) => {

    console.log(r);
}).catch((e) => {

    console.log(e.stack)
});

```

---

## Get paste

```js
import {PasteClient} from '@cordxapp/pastes'
const pastes = new PasteClient();

await pastes.get('PASTE_KEY/ID_HERE')
.then((r) => {

    console.log(r.data);
}).catch((e) => {

    console.log(e.stack)
});


```

---

## Get raw

```js
import {PasteClient} from '@cordxapp/pastes'
const pastes = new PasteClient();

await pastes.raw('PASTE_KEY/ID_HERE')
.then((r) => {

    console.log(r.code);
}).catch((e) => {

    console.log(e.stack)
});

```
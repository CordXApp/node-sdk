# Instatus Client
Simple yet efficient client for the Instatus API. It provides methods to fetch user profiles, status pages, components, incidents, and subscribers.

## Installation

```bash
npm install @cordxapp/instatus
```

---

## Usage
To use the module you will new to import it and create a new client:

```ts
import { InstatusClient } from '@cordxapp/instatus';

const instatus = new InstatusClient({
    apiKey: 'API_KEY',
    apiVersion: 'API_VERSION'
});
```

---

## Methods
Here are the methods provided by the `InstatusClient` class:

### getUserProfile()
Fetches the user profile information:

```ts
instatus.getUserProfile();
```

### getStatusPages()
Fetches an array of the status pages in your team/workspace:

```ts
instatus.getStatusPages();
```

### getQueriedStatusPages(query)
Fetches a queried array of the status pages in your team/workspace:

```ts
instatus.getQueriedStatusPages({ page: 1, per_page: 20 });
```

### getComponents({ pageId })
Fetches an array of all the components in your status page:

```ts
instatus.getComponents({ pageId: 'some_page_id' });
```

### getComponent({ id, pageId })
Fetches a status page component by ID:

```ts
instatus.getComponent({ id: 'some_component_id', pageId: 'some_page_id' });
```

### getIncidents({ pageId })
Fetches a list of incidents:

```ts
instatus.getIncidents({ pageId: 'some_page_id' });
```

### getQueriedIncidents(pageId, query)
Fetches a queried list of incidents:

```ts
instatus.getQueriedIncidents('some_page_id', { page: 1, per_page: 20 });
```

### getIncident(pageId, id)
Fetches an incident by ID:

```ts
instatus.getIncident('some_page_id', 'some_incident_id');
```

### getSubscribers(pageId, query)
Fetches a list of people subscribed to your status page:

```ts
instatus.getSubscribers('some_page_id', { page: 1, per_page: 20 });
```

---

## Error Handling
// TODO: Add information about how errors are handled and what kind of errors can be expected.

---

## API Rate Limiting
// TODO: Add information about any rate limiting imposed by the Instatus API and how users can handle it.

---

## Support
If you encounter any issues or have questions, please file an issue in our [issue tracker](https://github.com/CordXApp/node-sdk/issues).

## Contributing
Contributions are welcome. Please submit a pull request or create an issue to discuss what you would like to change.
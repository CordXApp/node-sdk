# CordX Database

This is an official NPM Module used by our services to host, interact with and maintain our database schema and clients.

> This module is setup to be used internally, environment variables are provided via the project itself

---

## Core Features

- Create, Update and Manage Entities
- Create, Update and Manage Domains
- Create, Update and Manage Webhooks

And more..

---

## Installation

To install the CordX Database module, use npm:

```sh
npm install @cordx/database
```

---

## Usage

To initialize the CordX Database, you need to set up the required environment variables and create an instance of the CordXDatabase class.

```ts
import { CordXDatabase } from '@cordx/database'
import dotenv from 'dotenv'

dotenv.config()

const db = new CordXDatabase()

async function main() {
    const isConnected = await db.isConnected()
    if (isConnected) {
        console.log('Connected to the database successfully!')
    } else {
        console.error('Failed to connect to the database.')
    }
}

main()
```

---

## Managing Entities

### User Entities

To create, update, fetch, and delete user entities, you can use the `UserEntity` class.

```ts
const userEntity = db.entities.user

// Create a new user entity
const newUser = await userEntity.create({
    name: 'John Doe',
    handle: '@johndoe',
    userid: '1234567890',
    avatar: 'avatar_url',
    banner: 'banner_url'
})

// Update an existing user entity
const updatedUser = await userEntity.update('entity_id', {
    avatar: 'new_avatar_url',
    banner: 'new_banner_url',
    domain: 'new_domain'
})

// Fetch a user entity by ID
const fetchedUser = await userEntity.fetch('entity_id')

// Delete a user entity by ID
const deletedUser = await userEntity.delete('entity_id')
```

### Organization Entities

To manage organization entities, you can use the `OrgEntity` class.

```ts
const orgEntity = db.entities.org

// Create a new organization entity
const newOrg = await orgEntity.create({
    name: 'CordX Org',
    handle: '@cordxorg',
    owner: 'owner_id',
    avatar: 'avatar_url',
    banner: 'banner_url'
})

// Update an existing organization entity
const updatedOrg = await orgEntity.update('entity_id', {
    avatar: 'new_avatar_url',
    banner: 'new_banner_url',
    owner: 'new_owner_id'
})

// Fetch an organization entity by ID
const fetchedOrg = await orgEntity.fetch('entity_id')

// Delete an organization entity by ID
const deletedOrg = await orgEntity.delete('entity_id')
```

### Bot/Integration Entities

To manage bot/integration entities, you can use the BotEntity class.

```ts
const botEntity = db.entities.bot

// Create a new bot/integration entity
const newBot = await botEntity.create({
    name: 'CordX Bot',
    handle: '@cordxbot',
    botid: 'bot_id',
    avatar: 'avatar_url',
    banner: 'banner_url'
})

// Update an existing bot/integration entity
const updatedBot = await botEntity.update('entity_id', {
    avatar: 'new_avatar_url',
    banner: 'new_banner_url',
    botid: 'new_bot_id'
})

// Fetch a bot/integration entity by ID
const fetchedBot = await botEntity.fetch('entity_id')

// Delete a bot/integration entity by ID
const deletedBot = await botEntity.delete('entity_id')
```

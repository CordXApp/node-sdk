import { Entity } from './entity'

export interface Responses {
    success: boolean
    message?: string
    missing?: string
    changes?: any
    data?: any
}

export interface UserEntityClient {
    create: (entity: Entity) => Promise<Responses>
    update: (id: string, user: Entity) => Promise<Responses>
    fetch: (id: string) => Promise<Responses>
    delete: (id: string) => Promise<Responses>
    count: () => Promise<number>
}

export interface OrgEntityClient {
    create: (entity: Entity) => Promise<Responses>
    update: (id: string, org: Entity) => Promise<Responses>
    fetch: (id: string) => Promise<Responses>
    delete: (id: string) => Promise<Responses>
    count: () => Promise<number>
}

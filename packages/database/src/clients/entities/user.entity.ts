import { UserEntityClient, Responses } from '../../typings'
import { Entity, EntityType } from '../../typings/entity'
import { EntityClient } from '.'

export class UserEntity {
    private parent: EntityClient

    constructor(parent: EntityClient) {
        this.parent = parent
    }

    /**
     * Create a new user entity
     * @param entity The entity to create
     * @returns {Promise<Responses>}
     */
    public async create(entity: Entity): Promise<Responses> {
        const { name, handle, userid, avatar, banner } = entity

        if (!name || !handle || !userid) {
            const missing = !name ? 'name' : !handle ? 'handle' : 'userid'
            return { success: false, message: `Missing required field: ${missing}` }
        }

        try {
            const apiKey = await this.parent.createApiKey()
            const encryptedKey = await this.parent.encrypt(apiKey)

            const data = {
                id: this.parent.cornflake.create(),
                name: name,
                handle: handle,
                type: 'DISCORD_USER' as EntityType,
                userid: userid,
                avatar: avatar || null,
                banner: banner || null,
                apiKey: encryptedKey
            }

            const entity = await this.parent.db.prisma.entity.create({ data })

            return {
                success: true,
                message: `Successfully created entity: ${entity.id}`,
                data: entity
            }
        } catch (error: any) {
            return {
                success: false,
                message: `Failed to create entity: ${error.message}`
            }
        }
    }

    /**
     * Update an existing user entity
     * @param id The ID of the entity to update
     * @param entity The entity to update
     * @returns {Promise<Responses>}
     */
    public async update(id: string, entity: Entity): Promise<Responses> {
        const { avatar, banner, domain } = entity

        if (!id) return { success: false, message: 'Missing required Cornflake ID for User Entity' }

        if (!avatar || !banner || !domain) {
            const missing = !avatar ? 'avatar' : !banner ? 'banner' : 'domain'
            return {
                success: false,
                message: `Please provide all of the required params`,
                missing: missing
            }
        }

        try {
            const exists = await this.parent.db.prisma.entity.findUnique({ where: { id } })

            if (!exists) return { success: false, message: `Entity with ID: ${id} does not exist` }

            const data = { avatar, banner, domain }

            const entity = await this.parent.db.prisma.entity.update({ where: { id }, data })

            return {
                success: true,
                message: `Successfully updated entity: ${entity.id}`,
                changes: {
                    avatar: exists.avatar !== avatar ? `${exists.avatar} > ${avatar}` : 'No change',
                    banner: exists.banner !== banner ? `${exists.banner} > ${banner}` : 'No change',
                    domain: exists.domain !== domain ? `${exists.domain} > ${domain}` : 'No change'
                }
            }
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to update entity: ${err.message}`
            }
        }
    }

    /**
     * Fetch a user entity by ID
     * @param id The ID of the entity to fetch
     * @returns {Promise<Responses>}
     */
    public async fetch(id: string): Promise<Responses> {
        if (!id) return { success: false, message: 'Missing required Cornflake ID for User Entity' }

        try {
            let entity = await this.parent.db.prisma.entity.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    handle: true,
                    type: true,
                    biography: true,
                    avatar: true,
                    banner: true,
                    userid: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: {
                            domains: true,
                            uploads: true,
                            perms: true
                        }
                    }
                }
            })

            if (!entity)
                entity = await this.parent.db.prisma.entity.findFirst({
                    where: { userid: id },
                    select: {
                        id: true,
                        name: true,
                        handle: true,
                        type: true,
                        biography: true,
                        avatar: true,
                        banner: true,
                        userid: true,
                        createdAt: true,
                        updatedAt: true,
                        _count: {
                            select: {
                                domains: true,
                                uploads: true,
                                perms: true
                            }
                        }
                    }
                })

            if (!entity) return { success: false, message: `User Entity with ID: ${id} does not exist` }

            return {
                success: true,
                message: `Successfully fetched entity: ${entity.id}`,
                data: {
                    id: entity.id,
                    name: entity.name,
                    handle: entity.handle,
                    type: entity.type,
                    bio: entity.biography,
                    userid: entity.userid,
                    avatar: entity.avatar,
                    banner: entity.banner,
                    created: entity.createdAt,
                    updated: entity.updatedAt,
                    stats: {
                        domains: entity._count.domains,
                        uploads: entity._count.uploads,
                        perms: entity._count.perms
                    }
                }
            }
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to fetch entity: ${err.message}`
            }
        }
    }

    /**
     * Delete a user entity by ID
     * @param id The ID of the entity to delete
     * @returns {Promise<Responses>}
     */
    public async delete(id: string): Promise<Responses> {
        if (!id) return { success: false, message: 'Missing required Cornflake ID for User Entity' }

        try {
            const entity = await this.parent.db.prisma.entity.findUnique({ where: { id } })

            if (!entity) return { success: false, message: `User Entity with ID: ${id} does not exist` }

            await this.parent.db.prisma.entity.delete({ where: { id } })

            return {
                success: true,
                message: `Successfully deleted entity: ${entity.id}`
            }
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to delete entity: ${err.message}`
            }
        }
    }

    public async count(): Promise<number> {
        try {
            const count = await this.parent.db.prisma.entity.count({
                where: { type: 'DISCORD_USER' }
            })

            return count
        } catch (err: unknown) {
            if (err instanceof Error) {
                this.parent.logs.error(`Error fetching user entity count: ${err.message}`)
                return 0
            }

            this.parent.logs.error(`Error fetching user entity count: ${err}`)
            return 0
        }
    }
}

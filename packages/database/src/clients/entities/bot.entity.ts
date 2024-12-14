import { Responses } from '../../typings'
import { Entity, EntityType } from '../../typings/entity'
import { EntityClient } from '.'

export class BotEntity {
    private parent: EntityClient

    constructor(parent: EntityClient) {
        this.parent = parent
    }

    /**
     * Create a new bot/integration entity
     * @param entity the entity to create
     * @returns { Promise<Responses>}
     */
    public async create(entity: Entity): Promise<Responses> {
        const { name, handle, botid, avatar, banner } = entity

        if (!name || !handle || !botid) {
            const missing = !name ? 'name' : !handle ? 'handle' : 'botid'
            return { success: false, message: `Missing required field: ${missing}` }
        }

        try {
            const apiKey = await this.parent.createApiKey()
            const encryptedKey = await this.parent.encrypt(apiKey)

            const data = {
                id: this.parent.cornflake.create(),
                name: name,
                handle: handle,
                type: 'INTEGRATION' as EntityType,
                botid: botid,
                avatar: avatar || null,
                banner: banner || null,
                apiKey: encryptedKey
            }

            const entity = await this.parent.db.prisma.entity.create({ data })

            return {
                success: true,
                message: `Successfully created bot/integration entity: ${entity.id}`,
                data: entity
            }
        } catch (error: any) {
            return {
                success: false,
                message: `Failed to create bot/integration entity: ${error.message}`
            }
        }
    }

    /**
     * Update an existing bot/integration entity
     * @param id The ID of the entity to update
     * @param entity The entity to update
     * @returns {Promise<Responses>}
     */
    public async update(id: string, entity: Entity): Promise<Responses> {
        const { avatar, banner, botid } = entity

        if (!id) return { success: false, message: 'Missing required ID for Bot/Integration Entity' }

        if (!avatar || !banner || !botid) {
            const missing = !avatar ? 'avatar' : !banner ? 'banner' : 'botid'
            return {
                success: false,
                message: `Please provide all of the required params`,
                missing: missing
            }
        }

        try {
            const exists = await this.parent.db.prisma.entity.findUnique({ where: { id } })

            if (!exists) return { success: false, message: `Bot/Integration Entity with ID: ${id} does not exist` }

            const data = { avatar, banner, botid }

            const entity = await this.parent.db.prisma.entity.update({ where: { id }, data })

            return {
                success: true,
                message: `Successfully updated bot/integration entity: ${entity.id}`,
                changes: {
                    avatar: exists.avatar !== avatar ? `${exists.avatar} > ${avatar}` : 'No change',
                    banner: exists.banner !== banner ? `${exists.banner} > ${banner}` : 'No change',
                    botid: exists.botid !== botid ? `${exists.botid} > ${botid}` : 'No change'
                }
            }
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to update bot/integration entity: ${err.message}`
            }
        }
    }

    /**
     * Fetch a bot/integration entity by ID
     * @param id The ID of the entity to fetch
     * @returns {Promise<Responses>}
     */
    public async fetch(id: string): Promise<Responses> {
        if (!id) return { success: false, message: 'Missing required ID for Bot/Integration Entity' }

        try {
            const entity = await this.parent.db.prisma.entity.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    handle: true,
                    type: true,
                    biography: true,
                    avatar: true,
                    banner: true,
                    botid: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: {
                            domains: true,
                            uploads: true,
                            webhooks: true
                        }
                    }
                }
            })

            if (!entity) return { success: false, message: `Bot/Integration Entity with ID: ${id} does not exist` }

            return {
                success: true,
                message: `Successfully fetched bot/integration entity: ${entity.id}`,
                data: {
                    id: entity.id,
                    name: entity.name,
                    handle: entity.handle,
                    type: entity.type,
                    bio: entity.biography,
                    botid: entity.botid,
                    avatar: entity.avatar,
                    banner: entity.banner,
                    created: entity.createdAt,
                    updated: entity.updatedAt,
                    stats: {
                        domains: entity._count.domains,
                        uploads: entity._count.uploads,
                        webhooks: entity._count.webhooks
                    }
                }
            }
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to fetch bot/integration entity: ${err.message}`
            }
        }
    }

    /**
     * Delete a bot/integration entity by ID
     * @param id The ID of the entity to delete
     * @returns {Promise<Responses>}
     */
    public async delete(id: string): Promise<Responses> {
        if (!id) return { success: false, message: 'Missing required ID for Bot/Integration Entity' }

        try {
            const entity = await this.parent.db.prisma.entity.findUnique({ where: { id } })

            if (!entity) return { success: false, message: `Bot/Integration Entity with ID: ${id} does not exist` }

            await this.parent.db.prisma.entity.delete({ where: { id } })

            return {
                success: true,
                message: `Successfully deleted bot/integration entity: ${entity.id}`
            }
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to delete bot/integration entity: ${err.message}`
            }
        }
    }

    /**
     * Count the number of bot/integration entities
     * @returns {Promise<number>}
     */
    public async count(): Promise<number> {
        try {
            const count = await this.parent.db.prisma.entity.count({
                where: {
                    type: 'INTEGRATION'
                }
            })
            return count
        } catch (err: any) {
            console.error(`Failed to count bot/integration entities: ${err.message}`)
            return 0
        }
    }
}

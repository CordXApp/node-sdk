import { OrgEntityClient, Responses } from '../../typings'
import { Entity, EntityType } from '../../typings/entity'
import { EntityClient } from '.'

export class OrgEntity {
    private parent: EntityClient

    constructor(parent: EntityClient) {
        this.parent = parent
    }

    /**
     * Create a new org entity
     * @param entity the entity to create
     * @returns { Promise<Responses>}
     */
    public async create(entity: Entity): Promise<Responses> {
        const { name, handle, avatar, banner, owner } = entity

        if (!name || !handle || !owner) {
            const missing = !name ? 'name' : !handle ? 'handle' : 'owner'
            return { success: false, message: `Missing required field: ${missing}` }
        }

        try {
            const apiKey = await this.parent.createApiKey()
            const encryptedKey = await this.parent.encrypt(apiKey)

            const data = {
                id: this.parent.cornflake.create(),
                name: name,
                handle: handle,
                type: 'ORGANIZATION' as EntityType,
                avatar: avatar || null,
                banner: banner || null,
                owner: owner,
                apiKey: encryptedKey
            }

            const entity = await this.parent.db.prisma.entity.create({ data })

            return {
                success: true,
                message: `Successfully created organization entity: ${entity.id}`,
                data: entity
            }
        } catch (error: any) {
            return {
                success: false,
                message: `Failed to create organization entity: ${error.message}`
            }
        }
    }

    /**
     * Update an existing org entity
     * @param id The ID of the entity to update
     * @param entity The entity to update
     * @returns {Promise<Responses>}
     */
    public async update(id: string, entity: Entity): Promise<Responses> {
        const { avatar, banner, owner } = entity

        if (!id) return { success: false, message: 'Missing required ID for Organization Entity' }

        if (!avatar || !banner || !owner) {
            const missing = !avatar ? 'avatar' : !banner ? 'banner' : 'owner'
            return {
                success: false,
                message: `Please provide all of the required params`,
                missing: missing
            }
        }

        try {
            const exists = await this.parent.db.prisma.entity.findUnique({ where: { id } })

            if (!exists) return { success: false, message: `Organization Entity with ID: ${id} does not exist` }

            const data = { avatar, banner, owner }

            const entity = await this.parent.db.prisma.entity.update({ where: { id }, data })

            return {
                success: true,
                message: `Successfully updated organization entity: ${entity.id}`,
                changes: {
                    avatar: exists.avatar !== avatar ? `${exists.avatar} > ${avatar}` : 'No change',
                    banner: exists.banner !== banner ? `${exists.banner} > ${banner}` : 'No change',
                    owner: exists.owner !== owner ? `${exists.owner} > ${owner}` : 'No change'
                }
            }
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to update organization entity: ${err.message}`
            }
        }
    }

    /**
     * Fetch an org entity by ID
     * @param id The ID of the entity to fetch
     * @returns {Promise<Responses>}
     */
    public async fetch(id: string): Promise<Responses> {
        if (!id) return { success: false, message: 'Missing required ID for Organization Entity' }

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
                    owner: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: {
                            domains: true,
                            uploads: true,
                            members: true
                        }
                    }
                }
            })

            if (!entity) return { success: false, message: `Organization Entity with ID: ${id} does not exist` }

            return {
                success: true,
                message: `Successfully fetched organization entity: ${entity.id}`,
                data: {
                    id: entity.id,
                    name: entity.name,
                    handle: entity.handle,
                    type: entity.type,
                    bio: entity.biography,
                    owner: entity.owner,
                    avatar: entity.avatar,
                    banner: entity.banner,
                    created: entity.createdAt,
                    updated: entity.updatedAt,
                    stats: {
                        domains: entity._count.domains,
                        uploads: entity._count.uploads,
                        members: entity._count.members
                    }
                }
            }
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to fetch organization entity: ${err.message}`
            }
        }
    }

    /**
     * Delete an org entity by ID
     * @param id The ID of the entity to delete
     * @returns {Promise<Responses>}
     */
    public async delete(id: string): Promise<Responses> {
        if (!id) return { success: false, message: 'Missing required ID for Organization Entity' }

        try {
            const entity = await this.parent.db.prisma.entity.findUnique({ where: { id } })

            if (!entity) return { success: false, message: `Organization Entity with ID: ${id} does not exist` }

            await this.parent.db.prisma.entity.delete({ where: { id } })

            return {
                success: true,
                message: `Successfully deleted organization entity: ${entity.id}`
            }
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to delete organization entity: ${err.message}`
            }
        }
    }

    /**
     * Count the number of organization entities
     * @returns {Promise<number>}
     */
    public async count(): Promise<number> {
        try {
            const count = await this.parent.db.prisma.entity.count({
                where: {
                    type: 'ORGANIZATION'
                }
            })
            return count
        } catch (err: any) {
            console.error(`Failed to count organization entities: ${err.message}`)
            return 0
        }
    }
}

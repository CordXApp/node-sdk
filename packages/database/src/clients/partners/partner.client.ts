import { Responses } from '../../typings'
import { Partners } from '../../typings/partner'
import { PartnerClient } from '.'

export class PartnersClient {
    private parent: PartnerClient

    constructor(parent: PartnerClient) {
        this.parent = parent
    }

    /**
     * Create a new partner entity
     * @param partner the partner entity to create
     * @returns { Promise<Responses>}
     */
    public async create(partner: Partners): Promise<Responses> {
        const { name, image, bio, url, social } = partner

        if (!name || !image || !url) {
            const missing = !name ? 'name' : !image ? 'image' : 'url'
            return { success: false, message: `Missing required field: ${missing}` }
        }

        try {
            const data = {
                name: name as string,
                image: image as string,
                bio: bio as string,
                url: url as string,
                social: social as string
            }

            const partnerEntity = await this.parent.db.prisma.partners.create({ data })

            return {
                success: true,
                message: `Successfully created partner entity: ${partnerEntity.id}`,
                data: partnerEntity
            }
        } catch (error: any) {
            return {
                success: false,
                message: `Failed to create partner entity: ${error.message}`
            }
        }
    }

    /**
     * Update an existing partner entity
     * @param id The ID of the partner entity to update
     * @param partner The partner entity to update
     * @returns {Promise<Responses>}
     */
    public async update(id: string, partner: Partners): Promise<Responses> {
        const { name, image, bio, url, social } = partner

        if (!id) return { success: false, message: 'Missing required ID for Partner Entity' }

        if (!name || !image || !url) {
            const missing = !name ? 'name' : !image ? 'image' : 'url'
            return {
                success: false,
                message: `Please provide all of the required params`,
                missing: missing
            }
        }

        try {
            const exists = await this.parent.db.prisma.partners.findUnique({ where: { id } })

            if (!exists) return { success: false, message: `Partner Entity with ID: ${id} does not exist` }

            const data = { name, image, bio, url, social }

            const partnerEntity = await this.parent.db.prisma.partners.update({ where: { id }, data })

            return {
                success: true,
                message: `Successfully updated partner entity: ${partnerEntity.id}`,
                changes: {
                    name: exists.name !== name ? `${exists.name} > ${name}` : 'No change',
                    image: exists.image !== image ? `${exists.image} > ${image}` : 'No change',
                    bio: exists.bio !== bio ? `${exists.bio} > ${bio}` : 'No change',
                    url: exists.url !== url ? `${exists.url} > ${url}` : 'No change',
                    social: exists.social !== social ? `${exists.social} > ${social}` : 'No change'
                }
            }
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to update partner entity: ${err.message}`
            }
        }
    }

    /**
     * Fetch a partner entity by ID
     * @param id The ID of the partner entity to fetch
     * @returns {Promise<Responses>}
     */
    public async fetch(id: string): Promise<Responses> {
        if (!id) return { success: false, message: 'Missing required ID for Partner Entity' }

        try {
            const partnerEntity = await this.parent.db.prisma.partners.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    image: true,
                    bio: true,
                    url: true,
                    social: true
                }
            })

            if (!partnerEntity) return { success: false, message: `Partner Entity with ID: ${id} does not exist` }

            return {
                success: true,
                message: `Successfully fetched partner entity: ${partnerEntity.id}`,
                data: partnerEntity
            }
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to fetch partner entity: ${err.message}`
            }
        }
    }

    /**
     * Delete a partner entity by ID
     * @param id The ID of the partner entity to delete
     * @returns {Promise<Responses>}
     */
    public async delete(id: string): Promise<Responses> {
        if (!id) return { success: false, message: 'Missing required ID for Partner Entity' }

        try {
            const partnerEntity = await this.parent.db.prisma.partners.findUnique({ where: { id } })

            if (!partnerEntity) return { success: false, message: `Partner Entity with ID: ${id} does not exist` }

            await this.parent.db.prisma.partners.delete({ where: { id } })

            return {
                success: true,
                message: `Successfully deleted partner entity: ${partnerEntity.id}`
            }
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to delete partner entity: ${err.message}`
            }
        }
    }

    /**
     * Count the number of partner entities
     * @returns {Promise<number>}
     */
    public async count(): Promise<number> {
        try {
            const count = await this.parent.db.prisma.partners.count()
            return count
        } catch (err: any) {
            console.error(`Failed to count partner entities: ${err.message}`)
            return 0
        }
    }
}

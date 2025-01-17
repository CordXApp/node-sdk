import { Responses } from '../../typings';
import { Domain } from '../../typings/domains';
import { DNSClient } from '.'

export class DomainClient {
    private parent: DNSClient;

    constructor(parent: DNSClient) {
        this.parent = parent;
    }

    /**
     * Create a new domain
     * @param domain the domain to create
     * @returns { Promise<Responses>}
     */
    public async create(domain: Domain): Promise<Responses> {
        const { name, content, entityId } = domain;

        if (!name || !content || !entityId) {
            const missing = !name ? 'name' : !content ? 'content' : 'entityId';
            return { success: false, message: `Missing required field: ${missing}` }
        }

        try {
            const data = {
                name: name,
                content: content,
                verified: domain.verified || false,
                active: domain.active || true,
                entityId: entityId
            };

            const domainEntity = await this.parent.db.prisma.domains.create({ data });

            return {
                success: true,
                message: `Successfully created domain: ${domainEntity.id}`,
                data: domainEntity
            };
        } catch (error: any) {
            return {
                success: false,
                message: `Failed to create domain: ${error.message}`
            };
        }
    }

    /**
     * Update an existing domain
     * @param id The ID of the domain to update
     * @param domain The domain to update
     * @returns {Promise<Responses>}
     */
    public async update(id: string, domain: Domain): Promise<Responses> {
        const { name, content, verified, active, entityId } = domain;

        if (!id) return { success: false, message: 'Missing required ID for Domain' };

        if (!name || !content || !entityId) {
            const missing = !name ? 'name' : !content ? 'content' : 'entityId';
            return {
                success: false,
                message: `Please provide all of the required params`,
                missing: missing
            };
        }

        try {
            const exists = await this.parent.db.prisma.domains.findUnique({ where: { id } });

            if (!exists) return { success: false, message: `Domain with ID: ${id} does not exist` };

            const data = { name, content, verified, active, entityId };

            const domainEntity = await this.parent.db.prisma.domains.update({ where: { id }, data });

            return {
                success: true,
                message: `Successfully updated domain: ${domainEntity.id}`,
                changes: {
                    name: exists.name !== name ? `${exists.name} > ${name}` : 'No change',
                    content: exists.content !== content ? `${exists.content} > ${content}` : 'No change',
                    verified: exists.verified !== verified ? `${exists.verified} > ${verified}` : 'No change',
                    active: exists.active !== active ? `${exists.active} > ${active}` : 'No change'
                }
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to update domain: ${err.message}`
            };
        }
    }

    /**
     * Fetch a domain by ID
     * @param id The ID of the domain to fetch
     * @returns {Promise<Responses>}
     */
    public async fetch(id: string): Promise<Responses> {
        if (!id) return { success: false, message: 'Missing required ID for Domain' };

        try {
            const domainEntity = await this.parent.db.prisma.domains.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    content: true,
                    verified: true,
                    active: true,
                    entityId: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            if (!domainEntity) return { success: false, message: `Domain with ID: ${id} does not exist` };

            return {
                success: true,
                message: `Successfully fetched domain: ${domainEntity.id}`,
                data: domainEntity
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to fetch domain: ${err.message}`
            };
        }
    }

    /**
     * Delete a domain by ID
     * @param id The ID of the domain to delete
     * @returns {Promise<Responses>}
     */
    public async delete(id: string): Promise<Responses> {
        if (!id) return { success: false, message: 'Missing required ID for Domain' };

        try {
            const domainEntity = await this.parent.db.prisma.domains.findUnique({ where: { id } });

            if (!domainEntity) return { success: false, message: `Domain with ID: ${id} does not exist` };

            await this.parent.db.prisma.domains.delete({ where: { id } });

            return {
                success: true,
                message: `Successfully deleted domain: ${domainEntity.id}`
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to delete domain: ${err.message}`
            };
        }
    }

    /**
     * Count the number of domains
     * @returns {Promise<number>}
     */
    public async count(): Promise<number> {
        try {
            const count = await this.parent.db.prisma.domains.count();
            return count;
        } catch (err: any) {
            console.error(`Failed to count domains: ${err.message}`);
            return 0;
        }
    }
}
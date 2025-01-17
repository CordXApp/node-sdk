import { Responses } from '../../typings';
import { Webhooks } from '../../typings/other';
import { OtherClients } from '.';

export class WebhooksClient {
    private parent: OtherClients;

    constructor(parent: OtherClients) {
        this.parent = parent;
    }

    /**
     * Create a new webhook
     * @param webhook the webhook to create
     * @returns { Promise<Responses>}
     */
    public async create(webhook: Webhooks): Promise<Responses> {
        const { name, token, enabled, hook_url, entityId } = webhook;

        if (!name || !token || !hook_url || !entityId) {
            const missing = !name ? 'name' : !token ? 'token' : !hook_url ? 'hook_url' : 'entityId';
            return { success: false, message: `Missing required field: ${missing}` }
        }

        try {
            const data = {
                name: name,
                token: token,
                enabled: enabled !== undefined ? enabled : true,
                hook_url: hook_url,
                entityId: entityId
            };

            const webhookEntity = await this.parent.db.prisma.webhooks.create({ data });

            return {
                success: true,
                message: `Successfully created webhook: ${webhookEntity.id}`,
                data: webhookEntity
            };
        } catch (error: any) {
            return {
                success: false,
                message: `Failed to create webhook: ${error.message}`
            };
        }
    }

    /**
     * Update an existing webhook
     * @param id The ID of the webhook to update
     * @param webhook The webhook to update
     * @returns {Promise<Responses>}
     */
    public async update(id: string, webhook: Webhooks): Promise<Responses> {
        const { name, token, enabled, hook_url, entityId } = webhook;

        if (!id) return { success: false, message: 'Missing required ID for Webhook' };

        if (!name || !token || !hook_url || !entityId) {
            const missing = !name ? 'name' : !token ? 'token' : !hook_url ? 'hook_url' : 'entityId';
            return {
                success: false,
                message: `Please provide all of the required params`,
                missing: missing
            };
        }

        try {
            const exists = await this.parent.db.prisma.webhooks.findUnique({ where: { id } });

            if (!exists) return { success: false, message: `Webhook with ID: ${id} does not exist` };

            const data = { name, token, enabled, hook_url, entityId };

            const webhookEntity = await this.parent.db.prisma.webhooks.update({ where: { id }, data });

            return {
                success: true,
                message: `Successfully updated webhook: ${webhookEntity.id}`,
                changes: {
                    name: exists.name !== name ? `${exists.name} > ${name}` : 'No change',
                    token: exists.token !== token ? `${exists.token} > ${token}` : 'No change',
                    enabled: exists.enabled !== enabled ? `${exists.enabled} > ${enabled}` : 'No change',
                    hook_url: exists.hook_url !== hook_url ? `${exists.hook_url} > ${hook_url}` : 'No change',
                    entityId: exists.entityId !== entityId ? `${exists.entityId} > ${entityId}` : 'No change'
                }
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to update webhook: ${err.message}`
            };
        }
    }

    /**
     * Fetch a webhook by ID
     * @param id The ID of the webhook to fetch
     * @returns {Promise<Responses>}
     */
    public async fetch(id: string): Promise<Responses> {
        if (!id) return { success: false, message: 'Missing required ID for Webhook' };

        try {
            const webhookEntity = await this.parent.db.prisma.webhooks.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    token: true,
                    enabled: true,
                    hook_url: true,
                    entityId: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            if (!webhookEntity) return { success: false, message: `Webhook with ID: ${id} does not exist` };

            return {
                success: true,
                message: `Successfully fetched webhook: ${webhookEntity.id}`,
                data: webhookEntity
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to fetch webhook: ${err.message}`
            };
        }
    }

    /**
     * Delete a webhook by ID
     * @param id The ID of the webhook to delete
     * @returns {Promise<Responses>}
     */
    public async delete(id: string): Promise<Responses> {
        if (!id) return { success: false, message: 'Missing required ID for Webhook' };

        try {
            const webhookEntity = await this.parent.db.prisma.webhooks.findUnique({ where: { id } });

            if (!webhookEntity) return { success: false, message: `Webhook with ID: ${id} does not exist` };

            await this.parent.db.prisma.webhooks.delete({ where: { id } });

            return {
                success: true,
                message: `Successfully deleted webhook: ${webhookEntity.id}`
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to delete webhook: ${err.message}`
            };
        }
    }

    /**
     * Count the number of webhooks
     * @returns {Promise<number>}
     */
    public async count(): Promise<number> {
        try {
            const count = await this.parent.db.prisma.webhooks.count();
            return count;
        } catch (err: any) {
            console.error(`Failed to count webhooks: ${err.message}`);
            return 0;
        }
    }
}
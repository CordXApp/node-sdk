import { Responses } from '../../typings';
import { UserPerms } from '../../typings/perms';
import { UserEntityPerms } from '@prisma/client';
import { PermsClient } from '.';

export class UserPermsClient {
    private parent: PermsClient;

    constructor(parent: PermsClient) {
        this.parent = parent;
    }

    /**
     * Create a new user permission
     * @param userPerms the user permission to create
     * @returns { Promise<Responses>}
     */
    public async create(userPerms: UserPerms): Promise<Responses> {
        const { entityId, permission } = userPerms;

        if (!entityId || !permission) {
            const missing = !entityId ? 'entityId' : 'permission';
            return { success: false, message: `Missing required field: ${missing}` }
        }

        try {
            const data = {
                entityId: entityId,
                permission: permission as UserEntityPerms
            };

            const userPermsEntity = await this.parent.db.prisma.userPerms.create({ data });

            return {
                success: true,
                message: `Successfully created user permission: ${userPermsEntity.id}`,
                data: userPermsEntity
            };
        } catch (error: any) {
            return {
                success: false,
                message: `Failed to create user permission: ${error.message}`
            };
        }
    }

    /**
     * Update an existing user permission
     * @param id The ID of the user permission to update
     * @param userPerms The user permission to update
     * @returns {Promise<Responses>}
     */
    public async update(id: string, userPerms: UserPerms): Promise<Responses> {
        const { entityId, permission } = userPerms;

        if (!id) return { success: false, message: 'Missing required ID for User Permission' };

        if (!entityId || !permission) {
            const missing = !entityId ? 'entityId' : 'permission';
            return {
                success: false,
                message: `Please provide all of the required params`,
                missing: missing
            };
        }

        try {
            const exists = await this.parent.db.prisma.userPerms.findUnique({ where: { id } });

            if (!exists) return { success: false, message: `User Permission with ID: ${id} does not exist` };

            const data = {
                entityId: entityId,
                permission: permission as UserEntityPerms
            };

            const userPermsEntity = await this.parent.db.prisma.userPerms.update({ where: { id }, data });

            return {
                success: true,
                message: `Successfully updated user permission: ${userPermsEntity.id}`,
                changes: {
                    entityId: exists.entityId !== entityId ? `${exists.entityId} > ${entityId}` : 'No change',
                    permission: exists.permission !== permission ? `${exists.permission} > ${permission}` : 'No change'
                }
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to update user permission: ${err.message}`
            };
        }
    }

    /**
     * Fetch a user permission by ID
     * @param id The ID of the user permission to fetch
     * @returns {Promise<Responses>}
     */
    public async fetch(id: string): Promise<Responses> {
        if (!id) return { success: false, message: 'Missing required ID for User Permission' };

        try {
            const userPermsEntity = await this.parent.db.prisma.userPerms.findUnique({
                where: { id },
                select: {
                    id: true,
                    entityId: true,
                    permission: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            if (!userPermsEntity) return { success: false, message: `User Permission with ID: ${id} does not exist` };

            return {
                success: true,
                message: `Successfully fetched user permission: ${userPermsEntity.id}`,
                data: userPermsEntity
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to fetch user permission: ${err.message}`
            };
        }
    }

    /**
     * Delete a user permission by ID
     * @param id The ID of the user permission to delete
     * @returns {Promise<Responses>}
     */
    public async delete(id: string): Promise<Responses> {
        if (!id) return { success: false, message: 'Missing required ID for User Permission' };

        try {
            const userPermsEntity = await this.parent.db.prisma.userPerms.findUnique({ where: { id } });

            if (!userPermsEntity) return { success: false, message: `User Permission with ID: ${id} does not exist` };

            await this.parent.db.prisma.userPerms.delete({ where: { id } });

            return {
                success: true,
                message: `Successfully deleted user permission: ${userPermsEntity.id}`
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to delete user permission: ${err.message}`
            };
        }
    }

    /**
     * Count the number of user permissions
     * @returns {Promise<number>}
     */
    public async count(): Promise<number> {
        try {
            const count = await this.parent.db.prisma.userPerms.count();
            return count;
        } catch (err: any) {
            console.error(`Failed to count user permissions: ${err.message}`);
            return 0;
        }
    }
}
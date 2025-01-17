import { Responses } from '../../typings';
import { MemberPerms } from '../../typings/perms';
import { OrgMemberPerms } from '@prisma/client';
import { PermsClient } from '.';

export class MemberPermsClient {
    private parent: PermsClient;

    constructor(parent: PermsClient) {
        this.parent = parent;
    }

    /**
     * Create a new member permission
     * @param memberPerms the member permission to create
     * @returns { Promise<Responses>}
     */
    public async create(memberPerms: MemberPerms): Promise<Responses> {
        const { orgMemberId, permission } = memberPerms;

        if (!orgMemberId || !permission) {
            const missing = !orgMemberId ? 'orgMemberId' : 'permission';
            return { success: false, message: `Missing required field: ${missing}` }
        }

        try {
            const data = {
                orgMemberId: orgMemberId,
                permission: permission as OrgMemberPerms // Ensure the correct type
            };

            const memberPermsEntity = await this.parent.db.prisma.memberPerms.create({ data });

            return {
                success: true,
                message: `Successfully created member permission: ${memberPermsEntity.id}`,
                data: memberPermsEntity
            };
        } catch (error: any) {
            return {
                success: false,
                message: `Failed to create member permission: ${error.message}`
            };
        }
    }

    /**
     * Update an existing member permission
     * @param id The ID of the member permission to update
     * @param memberPerms The member permission to update
     * @returns {Promise<Responses>}
     */
    public async update(id: string, memberPerms: MemberPerms): Promise<Responses> {
        const { orgMemberId, permission } = memberPerms;

        if (!id) return { success: false, message: 'Missing required ID for Member Permission' };

        if (!orgMemberId || !permission) {
            const missing = !orgMemberId ? 'orgMemberId' : 'permission';
            return {
                success: false,
                message: `Please provide all of the required params`,
                missing: missing
            };
        }

        try {
            const exists = await this.parent.db.prisma.memberPerms.findUnique({ where: { id } });

            if (!exists) return { success: false, message: `Member Permission with ID: ${id} does not exist` };

            const data = { orgMemberId, permission: permission as OrgMemberPerms };

            const memberPermsEntity = await this.parent.db.prisma.memberPerms.update({ where: { id }, data });

            return {
                success: true,
                message: `Successfully updated member permission: ${memberPermsEntity.id}`,
                changes: {
                    orgMemberId: exists.orgMemberId !== orgMemberId ? `${exists.orgMemberId} > ${orgMemberId}` : 'No change',
                    permission: exists.permission !== permission ? `${exists.permission} > ${permission}` : 'No change'
                }
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to update member permission: ${err.message}`
            };
        }
    }

    /**
     * Fetch a member permission by ID
     * @param id The ID of the member permission to fetch
     * @returns {Promise<Responses>}
     */
    public async fetch(id: string): Promise<Responses> {
        if (!id) return { success: false, message: 'Missing required ID for Member Permission' };

        try {
            const memberPermsEntity = await this.parent.db.prisma.memberPerms.findUnique({
                where: { id },
                select: {
                    id: true,
                    orgMemberId: true,
                    permission: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            if (!memberPermsEntity) return { success: false, message: `Member Permission with ID: ${id} does not exist` };

            return {
                success: true,
                message: `Successfully fetched member permission: ${memberPermsEntity.id}`,
                data: memberPermsEntity
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to fetch member permission: ${err.message}`
            };
        }
    }

    /**
     * Delete a member permission by ID
     * @param id The ID of the member permission to delete
     * @returns {Promise<Responses>}
     */
    public async delete(id: string): Promise<Responses> {
        if (!id) return { success: false, message: 'Missing required ID for Member Permission' };

        try {
            const memberPermsEntity = await this.parent.db.prisma.memberPerms.findUnique({ where: { id } });

            if (!memberPermsEntity) return { success: false, message: `Member Permission with ID: ${id} does not exist` };

            await this.parent.db.prisma.memberPerms.delete({ where: { id } });

            return {
                success: true,
                message: `Successfully deleted member permission: ${memberPermsEntity.id}`
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to delete member permission: ${err.message}`
            };
        }
    }

    /**
     * Count the number of member permissions
     * @returns {Promise<number>}
     */
    public async count(): Promise<number> {
        try {
            const count = await this.parent.db.prisma.memberPerms.count();
            return count;
        } catch (err: any) {
            console.error(`Failed to count member permissions: ${err.message}`);
            return 0;
        }
    }
}
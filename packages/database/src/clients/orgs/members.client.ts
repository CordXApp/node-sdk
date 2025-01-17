import { Responses } from '../../typings';
import { OrgMembers } from '../../typings/orgs';
import { OrgClient } from '.';

export class OrgMembersClient {
    private parent: OrgClient;

    constructor(parent: OrgClient) {
        this.parent = parent;
    }

    /**
     * Create a new organization member
     * @param orgMember the organization member to create
     * @returns { Promise<Responses>}
     */
    public async create(orgMember: OrgMembers): Promise<Responses> {
        const { orgId, userId } = orgMember;

        if (!orgId || !userId) {
            const missing = !orgId ? 'orgId' : 'userId';
            return { success: false, message: `Missing required field: ${missing}` }
        }

        try {
            const data = {
                orgId: orgId,
                userId: userId
            };

            const orgMemberEntity = await this.parent.db.prisma.orgMembers.create({ data });

            return {
                success: true,
                message: `Successfully created organization member: ${orgMemberEntity.id}`,
                data: orgMemberEntity
            };
        } catch (error: any) {
            return {
                success: false,
                message: `Failed to create organization member: ${error.message}`
            };
        }
    }

    /**
     * Update an existing organization member
     * @param id The ID of the organization member to update
     * @param orgMember The organization member to update
     * @returns {Promise<Responses>}
     */
    public async update(id: string, orgMember: OrgMembers): Promise<Responses> {
        const { orgId, userId } = orgMember;

        if (!id) return { success: false, message: 'Missing required ID for Organization Member' };

        if (!orgId || !userId) {
            const missing = !orgId ? 'orgId' : 'userId';
            return {
                success: false,
                message: `Please provide all of the required params`,
                missing: missing
            };
        }

        try {
            const exists = await this.parent.db.prisma.orgMembers.findUnique({ where: { id } });

            if (!exists) return { success: false, message: `Organization Member with ID: ${id} does not exist` };

            const data = { orgId, userId };

            const orgMemberEntity = await this.parent.db.prisma.orgMembers.update({ where: { id }, data });

            return {
                success: true,
                message: `Successfully updated organization member: ${orgMemberEntity.id}`,
                changes: {
                    orgId: exists.orgId !== orgId ? `${exists.orgId} > ${orgId}` : 'No change',
                    userId: exists.userId !== userId ? `${exists.userId} > ${userId}` : 'No change'
                }
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to update organization member: ${err.message}`
            };
        }
    }

    /**
     * Fetch an organization member by ID
     * @param id The ID of the organization member to fetch
     * @returns {Promise<Responses>}
     */
    public async fetch(id: string): Promise<Responses> {
        if (!id) return { success: false, message: 'Missing required ID for Organization Member' };

        try {
            const orgMemberEntity = await this.parent.db.prisma.orgMembers.findUnique({
                where: { id },
                select: {
                    id: true,
                    orgId: true,
                    userId: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            if (!orgMemberEntity) return { success: false, message: `Organization Member with ID: ${id} does not exist` };

            return {
                success: true,
                message: `Successfully fetched organization member: ${orgMemberEntity.id}`,
                data: orgMemberEntity
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to fetch organization member: ${err.message}`
            };
        }
    }

    /**
     * Delete an organization member by ID
     * @param id The ID of the organization member to delete
     * @returns {Promise<Responses>}
     */
    public async delete(id: string): Promise<Responses> {
        if (!id) return { success: false, message: 'Missing required ID for Organization Member' };

        try {
            const orgMemberEntity = await this.parent.db.prisma.orgMembers.findUnique({ where: { id } });

            if (!orgMemberEntity) return { success: false, message: `Organization Member with ID: ${id} does not exist` };

            await this.parent.db.prisma.orgMembers.delete({ where: { id } });

            return {
                success: true,
                message: `Successfully deleted organization member: ${orgMemberEntity.id}`
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to delete organization member: ${err.message}`
            };
        }
    }

    /**
     * Count the number of organization members
     * @returns {Promise<number>}
     */
    public async count(): Promise<number> {
        try {
            const count = await this.parent.db.prisma.orgMembers.count();
            return count;
        } catch (err: any) {
            console.error(`Failed to count organization members: ${err.message}`);
            return 0;
        }
    }
}
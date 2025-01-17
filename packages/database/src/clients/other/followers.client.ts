import { Responses } from '../../typings';
import { Followers } from '../../typings/other';
import { OtherClients } from '.';

export class FollowersClient {
    private parent: OtherClients;

    constructor(parent: OtherClients) {
        this.parent = parent;
    }

    /**
     * Create a new follower relationship
     * @param follower the follower relationship to create
     * @returns { Promise<Responses>}
     */
    public async create(follower: Followers): Promise<Responses> {
        const { followerId, followingId } = follower;

        if (!followerId || !followingId) {
            const missing = !followerId ? 'followerId' : 'followingId';
            return { success: false, message: `Missing required field: ${missing}` }
        }

        try {
            const data = {
                followerId: followerId,
                followingId: followingId
            };

            const followerEntity = await this.parent.db.prisma.followers.create({ data });

            return {
                success: true,
                message: `Successfully created follower relationship: ${followerEntity.id}`,
                data: followerEntity
            };
        } catch (error: any) {
            return {
                success: false,
                message: `Failed to create follower relationship: ${error.message}`
            };
        }
    }

    /**
     * Update an existing follower relationship
     * @param id The ID of the follower relationship to update
     * @param follower The follower relationship to update
     * @returns {Promise<Responses>}
     */
    public async update(id: string, follower: Followers): Promise<Responses> {
        const { followerId, followingId } = follower;

        if (!id) return { success: false, message: 'Missing required ID for Follower Relationship' };

        if (!followerId || !followingId) {
            const missing = !followerId ? 'followerId' : 'followingId';
            return {
                success: false,
                message: `Please provide all of the required params`,
                missing: missing
            };
        }

        try {
            const exists = await this.parent.db.prisma.followers.findUnique({ where: { id } });

            if (!exists) return { success: false, message: `Follower Relationship with ID: ${id} does not exist` };

            const data = { followerId, followingId };

            const followerEntity = await this.parent.db.prisma.followers.update({ where: { id }, data });

            return {
                success: true,
                message: `Successfully updated follower relationship: ${followerEntity.id}`,
                changes: {
                    followerId: exists.followerId !== followerId ? `${exists.followerId} > ${followerId}` : 'No change',
                    followingId: exists.followingId !== followingId ? `${exists.followingId} > ${followingId}` : 'No change'
                }
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to update follower relationship: ${err.message}`
            };
        }
    }

    /**
     * Fetch a follower relationship by ID
     * @param id The ID of the follower relationship to fetch
     * @returns {Promise<Responses>}
     */
    public async fetch(id: string): Promise<Responses> {
        if (!id) return { success: false, message: 'Missing required ID for Follower Relationship' };

        try {
            const followerEntity = await this.parent.db.prisma.followers.findUnique({
                where: { id },
                select: {
                    id: true,
                    followerId: true,
                    followingId: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            if (!followerEntity) return { success: false, message: `Follower Relationship with ID: ${id} does not exist` };

            return {
                success: true,
                message: `Successfully fetched follower relationship: ${followerEntity.id}`,
                data: followerEntity
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to fetch follower relationship: ${err.message}`
            };
        }
    }

    /**
     * Delete a follower relationship by ID
     * @param id The ID of the follower relationship to delete
     * @returns {Promise<Responses>}
     */
    public async delete(id: string): Promise<Responses> {
        if (!id) return { success: false, message: 'Missing required ID for Follower Relationship' };

        try {
            const followerEntity = await this.parent.db.prisma.followers.findUnique({ where: { id } });

            if (!followerEntity) return { success: false, message: `Follower Relationship with ID: ${id} does not exist` };

            await this.parent.db.prisma.followers.delete({ where: { id } });

            return {
                success: true,
                message: `Successfully deleted follower relationship: ${followerEntity.id}`
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to delete follower relationship: ${err.message}`
            };
        }
    }

    /**
     * Count the number of follower relationships
     * @returns {Promise<number>}
     */
    public async count(): Promise<number> {
        try {
            const count = await this.parent.db.prisma.followers.count();
            return count;
        } catch (err: any) {
            console.error(`Failed to count follower relationships: ${err.message}`);
            return 0;
        }
    }
}
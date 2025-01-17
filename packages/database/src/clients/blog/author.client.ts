import { Responses } from '../../typings';
import { Author } from '../../typings/author';
import { BlogClient } from '.';

export class AuthorClient {
    private parent: BlogClient;

    constructor(parent: BlogClient) {
        this.parent = parent;
    }

    /**
     * Create a new author
     * @param author the author to create
     * @returns { Promise<Responses>}
     */
    public async create(author: Author): Promise<Responses> {
        const { name, bio, avatar, logo } = author;

        if (!name) {
            return { success: false, message: `Missing required field: name` }
        }

        try {
            const data = {
                name: name,
                bio: bio || null,
                avatar: avatar || null,
                logo: logo || null
            };

            const authorEntity = await this.parent.db.prisma.author.create({ data });

            return {
                success: true,
                message: `Successfully created author: ${authorEntity.id}`,
                data: authorEntity
            };
        } catch (error: any) {
            return {
                success: false,
                message: `Failed to create author: ${error.message}`
            };
        }
    }

    /**
     * Update an existing author
     * @param id The ID of the author to update
     * @param author The author to update
     * @returns {Promise<Responses>}
     */
    public async update(id: string, author: Author): Promise<Responses> {
        const { name, bio, avatar, logo } = author;

        if (!id) return { success: false, message: 'Missing required ID for Author' };

        if (!name) {
            return {
                success: false,
                message: `Please provide all of the required params`,
                missing: 'name'
            };
        }

        try {
            const exists = await this.parent.db.prisma.author.findUnique({ where: { id } });

            if (!exists) return { success: false, message: `Author with ID: ${id} does not exist` };

            const data = { name, bio, avatar, logo };

            const authorEntity = await this.parent.db.prisma.author.update({ where: { id }, data });

            return {
                success: true,
                message: `Successfully updated author: ${authorEntity.id}`,
                changes: {
                    name: exists.name !== name ? `${exists.name} > ${name}` : 'No change',
                    bio: exists.bio !== bio ? `${exists.bio} > ${bio}` : 'No change',
                    avatar: exists.avatar !== avatar ? `${exists.avatar} > ${avatar}` : 'No change',
                    logo: exists.logo !== logo ? `${exists.logo} > ${logo}` : 'No change'
                }
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to update author: ${err.message}`
            };
        }
    }

    /**
     * Fetch an author by ID
     * @param id The ID of the author to fetch
     * @returns {Promise<Responses>}
     */
    public async fetch(id: string): Promise<Responses> {
        if (!id) return { success: false, message: 'Missing required ID for Author' };

        try {
            const authorEntity = await this.parent.db.prisma.author.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    bio: true,
                    avatar: true,
                    logo: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            if (!authorEntity) return { success: false, message: `Author with ID: ${id} does not exist` };

            return {
                success: true,
                message: `Successfully fetched author: ${authorEntity.id}`,
                data: authorEntity
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to fetch author: ${err.message}`
            };
        }
    }

    /**
     * Delete an author by ID
     * @param id The ID of the author to delete
     * @returns {Promise<Responses>}
     */
    public async delete(id: string): Promise<Responses> {
        if (!id) return { success: false, message: 'Missing required ID for Author' };

        try {
            const authorEntity = await this.parent.db.prisma.author.findUnique({ where: { id } });

            if (!authorEntity) return { success: false, message: `Author with ID: ${id} does not exist` };

            await this.parent.db.prisma.author.delete({ where: { id } });

            return {
                success: true,
                message: `Successfully deleted author: ${authorEntity.id}`
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to delete author: ${err.message}`
            };
        }
    }

    /**
     * Count the number of authors
     * @returns {Promise<number>}
     */
    public async count(): Promise<number> {
        try {
            const count = await this.parent.db.prisma.author.count();
            return count;
        } catch (err: any) {
            console.error(`Failed to count authors: ${err.message}`);
            return 0;
        }
    }
}
import { Responses } from '../../typings';
import { BlogPost } from '../../typings/blog';
import { BlogClient } from '.';

export class PostClient {
    private parent: BlogClient;

    constructor(parent: BlogClient) {
        this.parent = parent;
    }

    /**
     * Create a new blog post
     * @param blogPost the blog post to create
     * @returns { Promise<Responses>}
     */
    public async create(blogPost: BlogPost): Promise<Responses> {
        const { title, content, authorId } = blogPost;

        if (!title || !content || !authorId) {
            const missing = !title ? 'title' : !content ? 'content' : 'authorId';
            return { success: false, message: `Missing required field: ${missing}` }
        }

        try {
            const data = {
                title: title,
                content: content,
                published: blogPost.published || false,
                authorId: authorId
            };

            const blogPostEntity = await this.parent.db.prisma.blogPost.create({ data });

            return {
                success: true,
                message: `Successfully created blog post: ${blogPostEntity.id}`,
                data: blogPostEntity
            };
        } catch (error: any) {
            return {
                success: false,
                message: `Failed to create blog post: ${error.message}`
            };
        }
    }

    /**
     * Update an existing blog post
     * @param id The ID of the blog post to update
     * @param blogPost The blog post to update
     * @returns {Promise<Responses>}
     */
    public async update(id: string, blogPost: BlogPost): Promise<Responses> {
        const { title, content, published, authorId } = blogPost;

        if (!id) return { success: false, message: 'Missing required ID for Blog Post' };

        if (!title || !content || !authorId) {
            const missing = !title ? 'title' : !content ? 'content' : 'authorId';
            return {
                success: false,
                message: `Please provide all of the required params`,
                missing: missing
            };
        }

        try {
            const exists = await this.parent.db.prisma.blogPost.findUnique({ where: { id } });

            if (!exists) return { success: false, message: `Blog Post with ID: ${id} does not exist` };

            const data = { title, content, published, authorId };

            const blogPostEntity = await this.parent.db.prisma.blogPost.update({ where: { id }, data });

            return {
                success: true,
                message: `Successfully updated blog post: ${blogPostEntity.id}`,
                changes: {
                    title: exists.title !== title ? `${exists.title} > ${title}` : 'No change',
                    content: exists.content !== content ? `${exists.content} > ${content}` : 'No change',
                    published: exists.published !== published ? `${exists.published} > ${published}` : 'No change',
                    authorId: exists.authorId !== authorId ? `${exists.authorId} > ${authorId}` : 'No change'
                }
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to update blog post: ${err.message}`
            };
        }
    }

    /**
     * Fetch a blog post by ID
     * @param id The ID of the blog post to fetch
     * @returns {Promise<Responses>}
     */
    public async fetch(id: string): Promise<Responses> {
        if (!id) return { success: false, message: 'Missing required ID for Blog Post' };

        try {
            const blogPostEntity = await this.parent.db.prisma.blogPost.findUnique({
                where: { id },
                select: {
                    id: true,
                    title: true,
                    content: true,
                    published: true,
                    authorId: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            if (!blogPostEntity) return { success: false, message: `Blog Post with ID: ${id} does not exist` };

            return {
                success: true,
                message: `Successfully fetched blog post: ${blogPostEntity.id}`,
                data: blogPostEntity
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to fetch blog post: ${err.message}`
            };
        }
    }

    /**
     * Delete a blog post by ID
     * @param id The ID of the blog post to delete
     * @returns {Promise<Responses>}
     */
    public async delete(id: string): Promise<Responses> {
        if (!id) return { success: false, message: 'Missing required ID for Blog Post' };

        try {
            const blogPostEntity = await this.parent.db.prisma.blogPost.findUnique({ where: { id } });

            if (!blogPostEntity) return { success: false, message: `Blog Post with ID: ${id} does not exist` };

            await this.parent.db.prisma.blogPost.delete({ where: { id } });

            return {
                success: true,
                message: `Successfully deleted blog post: ${blogPostEntity.id}`
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to delete blog post: ${err.message}`
            };
        }
    }

    /**
     * Count the number of blog posts
     * @returns {Promise<number>}
     */
    public async count(): Promise<number> {
        try {
            const count = await this.parent.db.prisma.blogPost.count();
            return count;
        } catch (err: any) {
            console.error(`Failed to count blog posts: ${err.message}`);
            return 0;
        }
    }
}
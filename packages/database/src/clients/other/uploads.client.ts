import { Responses } from '../../typings';
import { Uploads } from '../../typings/other';
import { OtherClients } from '.';

export class UploadsClient {
    private parent: OtherClients;

    constructor(parent: OtherClients) {
        this.parent = parent;
    }

    /**
     * Create a new upload
     * @param upload the upload to create
     * @returns { Promise<Responses>}
     */
    public async create(upload: Uploads): Promise<Responses> {
        const { name, type, mime, size, fileId, fileName, shareable, entityId } = upload;

        if (!entityId) {
            return { success: false, message: `Missing required field: entityId` }
        }

        try {
            const data = {
                name: name || null,
                type: type || null,
                mime: mime || null,
                size: size || null,
                fileId: fileId || null,
                fileName: fileName || null,
                shareable: shareable || false,
                entityId: entityId
            };

            const uploadEntity = await this.parent.db.prisma.uploads.create({ data });

            return {
                success: true,
                message: `Successfully created upload: ${uploadEntity.id}`,
                data: uploadEntity
            };
        } catch (error: any) {
            return {
                success: false,
                message: `Failed to create upload: ${error.message}`
            };
        }
    }

    /**
     * Update an existing upload
     * @param id The ID of the upload to update
     * @param upload The upload to update
     * @returns {Promise<Responses>}
     */
    public async update(id: string, upload: Uploads): Promise<Responses> {
        const { name, type, mime, size, fileId, fileName, shareable, entityId } = upload;

        if (!id) return { success: false, message: 'Missing required ID for Upload' };

        if (!entityId) {
            return {
                success: false,
                message: `Please provide all of the required params`,
                missing: 'entityId'
            };
        }

        try {
            const exists = await this.parent.db.prisma.uploads.findUnique({ where: { id } });

            if (!exists) return { success: false, message: `Upload with ID: ${id} does not exist` };

            const data = { name, type, mime, size, fileId, fileName, shareable, entityId };

            const uploadEntity = await this.parent.db.prisma.uploads.update({ where: { id }, data });

            return {
                success: true,
                message: `Successfully updated upload: ${uploadEntity.id}`,
                changes: {
                    name: exists.name !== name ? `${exists.name} > ${name}` : 'No change',
                    type: exists.type !== type ? `${exists.type} > ${type}` : 'No change',
                    mime: exists.mime !== mime ? `${exists.mime} > ${mime}` : 'No change',
                    size: exists.size !== size ? `${exists.size} > ${size}` : 'No change',
                    fileId: exists.fileId !== fileId ? `${exists.fileId} > ${fileId}` : 'No change',
                    fileName: exists.fileName !== fileName ? `${exists.fileName} > ${fileName}` : 'No change',
                    shareable: exists.shareable !== shareable ? `${exists.shareable} > ${shareable}` : 'No change',
                    entityId: exists.entityId !== entityId ? `${exists.entityId} > ${entityId}` : 'No change'
                }
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to update upload: ${err.message}`
            };
        }
    }

    /**
     * Fetch an upload by ID
     * @param id The ID of the upload to fetch
     * @returns {Promise<Responses>}
     */
    public async fetch(id: string): Promise<Responses> {
        if (!id) return { success: false, message: 'Missing required ID for Upload' };

        try {
            const uploadEntity = await this.parent.db.prisma.uploads.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    type: true,
                    mime: true,
                    size: true,
                    fileId: true,
                    fileName: true,
                    shareable: true,
                    entityId: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            if (!uploadEntity) return { success: false, message: `Upload with ID: ${id} does not exist` };

            return {
                success: true,
                message: `Successfully fetched upload: ${uploadEntity.id}`,
                data: uploadEntity
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to fetch upload: ${err.message}`
            };
        }
    }

    /**
     * Delete an upload by ID
     * @param id The ID of the upload to delete
     * @returns {Promise<Responses>}
     */
    public async delete(id: string): Promise<Responses> {
        if (!id) return { success: false, message: 'Missing required ID for Upload' };

        try {
            const uploadEntity = await this.parent.db.prisma.uploads.findUnique({ where: { id } });

            if (!uploadEntity) return { success: false, message: `Upload with ID: ${id} does not exist` };

            await this.parent.db.prisma.uploads.delete({ where: { id } });

            return {
                success: true,
                message: `Successfully deleted upload: ${uploadEntity.id}`
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to delete upload: ${err.message}`
            };
        }
    }

    /**
     * Count the number of uploads
     * @returns {Promise<number>}
     */
    public async count(): Promise<number> {
        try {
            const count = await this.parent.db.prisma.uploads.count();
            return count;
        } catch (err: any) {
            console.error(`Failed to count uploads: ${err.message}`);
            return 0;
        }
    }
}
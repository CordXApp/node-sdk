import { Responses } from '../../typings';
import { Errors } from '../../typings/other';
import { OtherClients } from '.';
import { ErrStates, ErrTypes } from '@prisma/client';

export class ErrorsClient {
    private parent: OtherClients;

    constructor(parent: OtherClients) {
        this.parent = parent;
    }

    /**
     * Create a new error
     * @param error the error to create
     * @returns { Promise<Responses>}
     */
    public async create(error: Errors): Promise<Responses> {
        const { state, type, status, message, reporter, error_obj } = error;

        if (!status || !message || !reporter || !error_obj) {
            const missing = !status ? 'status' : !message ? 'message' : !reporter ? 'reporter' : 'error_obj';
            return { success: false, message: `Missing required field: ${missing}` }
        }

        try {
            const data = {
                state: state as ErrStates || 'OPEN',
                type: type as ErrTypes || 'UNKNOWN_ERR',
                status: status,
                message: message,
                reporter: reporter,
                error_obj: error_obj
            };

            const errorEntity = await this.parent.db.prisma.errors.create({ data });

            return {
                success: true,
                message: `Successfully created error: ${errorEntity.id}`,
                data: errorEntity
            };
        } catch (error: any) {
            return {
                success: false,
                message: `Failed to create error: ${error.message}`
            };
        }
    }

    /**
     * Update an existing error
     * @param id The ID of the error to update
     * @param error The error to update
     * @returns {Promise<Responses>}
     */
    public async update(id: string, error: Errors): Promise<Responses> {
        const { state, type, status, message, reporter, error_obj } = error;

        if (!id) return { success: false, message: 'Missing required ID for Error' };

        if (!status || !message || !reporter || !error_obj) {
            const missing = !status ? 'status' : !message ? 'message' : !reporter ? 'reporter' : 'error_obj';
            return {
                success: false,
                message: `Please provide all of the required params`,
                missing: missing
            };
        }

        try {
            const exists = await this.parent.db.prisma.errors.findUnique({ where: { id } });

            if (!exists) return { success: false, message: `Error with ID: ${id} does not exist` };

            const data = {
                state: state as ErrStates,
                type: type as ErrTypes,
                status,
                message,
                reporter,
                error_obj
            };

            const errorEntity = await this.parent.db.prisma.errors.update({ where: { id }, data });

            return {
                success: true,
                message: `Successfully updated error: ${errorEntity.id}`,
                changes: {
                    state: exists.state !== state ? `${exists.state} > ${state}` : 'No change',
                    type: exists.type !== type ? `${exists.type} > ${type}` : 'No change',
                    status: exists.status !== status ? `${exists.status} > ${status}` : 'No change',
                    message: exists.message !== message ? `${exists.message} > ${message}` : 'No change',
                    reporter: exists.reporter !== reporter ? `${exists.reporter} > ${reporter}` : 'No change',
                    error_obj: exists.error_obj !== error_obj ? `${exists.error_obj} > ${error_obj}` : 'No change'
                }
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to update error: ${err.message}`
            };
        }
    }

    /**
     * Fetch an error by ID
     * @param id The ID of the error to fetch
     * @returns {Promise<Responses>}
     */
    public async fetch(id: string): Promise<Responses> {
        if (!id) return { success: false, message: 'Missing required ID for Error' };

        try {
            const errorEntity = await this.parent.db.prisma.errors.findUnique({
                where: { id },
                select: {
                    id: true,
                    state: true,
                    type: true,
                    status: true,
                    message: true,
                    reporter: true,
                    error_obj: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            if (!errorEntity) return { success: false, message: `Error with ID: ${id} does not exist` };

            return {
                success: true,
                message: `Successfully fetched error: ${errorEntity.id}`,
                data: errorEntity
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to fetch error: ${err.message}`
            };
        }
    }

    /**
     * Delete an error by ID
     * @param id The ID of the error to delete
     * @returns {Promise<Responses>}
     */
    public async delete(id: string): Promise<Responses> {
        if (!id) return { success: false, message: 'Missing required ID for Error' };

        try {
            const errorEntity = await this.parent.db.prisma.errors.findUnique({ where: { id } });

            if (!errorEntity) return { success: false, message: `Error with ID: ${id} does not exist` };

            await this.parent.db.prisma.errors.delete({ where: { id } });

            return {
                success: true,
                message: `Successfully deleted error: ${errorEntity.id}`
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to delete error: ${err.message}`
            };
        }
    }

    /**
     * Count the number of errors
     * @returns {Promise<number>}
     */
    public async count(): Promise<number> {
        try {
            const count = await this.parent.db.prisma.errors.count();
            return count;
        } catch (err: any) {
            console.error(`Failed to count errors: ${err.message}`);
            return 0;
        }
    }
}
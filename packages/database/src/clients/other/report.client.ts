import { Responses } from '../../typings';
import { Reports } from '../../typings/other';
import { OtherClients } from '.';
import { ReportStatus, ReportTypes } from '@prisma/client';

export class ReportsClient {
    private parent: OtherClients;

    constructor(parent: OtherClients) {
        this.parent = parent;
    }

    /**
     * Create a new report
     * @param report the report to create
     * @returns { Promise<Responses>}
     */
    public async create(report: Reports): Promise<Responses> {
        const { type, status, author, reason, mod } = report;

        if (!author || !reason) {
            const missing = !author ? 'author' : 'reason';
            return { success: false, message: `Missing required field: ${missing}` }
        }

        try {
            const data = {
                type: type as ReportTypes || 'BUG_REPORT',
                status: status as ReportStatus || 'OPEN',
                author: author,
                reason: reason,
                mod: mod || null
            };

            const reportEntity = await this.parent.db.prisma.reports.create({ data });

            return {
                success: true,
                message: `Successfully created report: ${reportEntity.id}`,
                data: reportEntity
            };
        } catch (error: any) {
            return {
                success: false,
                message: `Failed to create report: ${error.message}`
            };
        }
    }

    /**
     * Update an existing report
     * @param id The ID of the report to update
     * @param report The report to update
     * @returns {Promise<Responses>}
     */
    public async update(id: string, report: Reports): Promise<Responses> {
        const { type, status, author, reason, mod } = report;

        if (!id) return { success: false, message: 'Missing required ID for Report' };

        if (!author || !reason) {
            const missing = !author ? 'author' : 'reason';
            return {
                success: false,
                message: `Please provide all of the required params`,
                missing: missing
            };
        }

        try {
            const exists = await this.parent.db.prisma.reports.findUnique({ where: { id } });

            if (!exists) return { success: false, message: `Report with ID: ${id} does not exist` };

            const data = {
                type: type as ReportTypes,
                status: status as ReportStatus,
                author,
                reason,
                mod
            };

            const reportEntity = await this.parent.db.prisma.reports.update({ where: { id }, data });

            return {
                success: true,
                message: `Successfully updated report: ${reportEntity.id}`,
                changes: {
                    type: exists.type !== type ? `${exists.type} > ${type}` : 'No change',
                    status: exists.status !== status ? `${exists.status} > ${status}` : 'No change',
                    author: exists.author !== author ? `${exists.author} > ${author}` : 'No change',
                    reason: exists.reason !== reason ? `${exists.reason} > ${reason}` : 'No change',
                    mod: exists.mod !== mod ? `${exists.mod} > ${mod}` : 'No change'
                }
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to update report: ${err.message}`
            };
        }
    }

    /**
     * Fetch a report by ID
     * @param id The ID of the report to fetch
     * @returns {Promise<Responses>}
     */
    public async fetch(id: string): Promise<Responses> {
        if (!id) return { success: false, message: 'Missing required ID for Report' };

        try {
            const reportEntity = await this.parent.db.prisma.reports.findUnique({
                where: { id },
                select: {
                    id: true,
                    type: true,
                    status: true,
                    author: true,
                    reason: true,
                    mod: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            if (!reportEntity) return { success: false, message: `Report with ID: ${id} does not exist` };

            return {
                success: true,
                message: `Successfully fetched report: ${reportEntity.id}`,
                data: reportEntity
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to fetch report: ${err.message}`
            };
        }
    }

    /**
     * Delete a report by ID
     * @param id The ID of the report to delete
     * @returns {Promise<Responses>}
     */
    public async delete(id: string): Promise<Responses> {
        if (!id) return { success: false, message: 'Missing required ID for Report' };

        try {
            const reportEntity = await this.parent.db.prisma.reports.findUnique({ where: { id } });

            if (!reportEntity) return { success: false, message: `Report with ID: ${id} does not exist` };

            await this.parent.db.prisma.reports.delete({ where: { id } });

            return {
                success: true,
                message: `Successfully deleted report: ${reportEntity.id}`
            };
        } catch (err: any) {
            return {
                success: false,
                message: `Failed to delete report: ${err.message}`
            };
        }
    }

    /**
     * Count the number of reports
     * @returns {Promise<number>}
     */
    public async count(): Promise<number> {
        try {
            const count = await this.parent.db.prisma.reports.count();
            return count;
        } catch (err: any) {
            console.error(`Failed to count reports: ${err.message}`);
            return 0;
        }
    }
}
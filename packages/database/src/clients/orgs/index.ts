import Logger from '../../utils/logger.util'
import { OrgMembersClient } from './members.client'
import { CordXDatabase } from '../..'

export class OrgClient {
    private logs: Logger
    public db: CordXDatabase
    public method: OrgMembersClient

    constructor(db: CordXDatabase) {
        this.logs = new Logger('[@cordxapp/db]:org_members')
        this.db = db

        this.method = new OrgMembersClient(this)
    }
}

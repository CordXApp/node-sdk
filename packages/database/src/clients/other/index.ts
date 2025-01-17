import Logger from '../../utils/logger.util'
import { CordXDatabase } from '../..'

export class OtherClients {
    private logs: Logger
    public db: CordXDatabase

    constructor(db: CordXDatabase) {
        this.logs = new Logger('[@cordxapp/db]:partner_client')
        this.db = db
    }
}

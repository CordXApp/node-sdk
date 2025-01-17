import Logger from '../../utils/logger.util'
import { DomainClient } from './domain.client'
import { CordXDatabase } from '../..'

export class DNSClient {
    private logs: Logger
    public db: CordXDatabase
    public method: DomainClient

    constructor(db: CordXDatabase) {
        this.logs = new Logger('[@cordxapp/db]:partner_client')
        this.db = db

        this.method = new DomainClient(this)
    }
}

import Logger from '../../utils/logger.util'
import { PartnersClient } from './partner.client'
import { CordXDatabase } from '../..'

export class PartnerClient {
    private logs: Logger
    public db: CordXDatabase
    public partners: PartnersClient

    constructor(db: CordXDatabase) {
        this.logs = new Logger('[@cordxapp/db]:partner_client')
        this.db = db

        this.partners = new PartnersClient(this)
    }
}

import Logger from '../../utils/logger.util'
import { UserPermsClient } from './user.client'
import { MemberPermsClient } from './member.client'
import { CordXDatabase } from '../..'

export class PermsClient {
    private logs: Logger
    public db: CordXDatabase

    public user_perms: UserPermsClient
    public org_member_perms: MemberPermsClient

    constructor(db: CordXDatabase) {
        this.logs = new Logger('[@cordxapp/db]:permission_client')
        this.db = db

        this.user_perms = new UserPermsClient(this);
        this.org_member_perms = new MemberPermsClient(this);
    }
}

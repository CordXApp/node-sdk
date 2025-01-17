export interface UserPerms {
    id?: string;
    entityId: string;
    permission: string;
}

export interface MemberPerms {
    id?: string;
    orgMemberId: string;
    permission: string;
}
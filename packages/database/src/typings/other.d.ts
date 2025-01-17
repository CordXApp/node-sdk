import { Webhooks as EntityHooks } from "@prisma/client";

export interface Followers {
    followerId: string;
    followingId: string;
}

export interface Uploads {
    name?: string;
    type?: string;
    mime?: string;
    size?: number;
    fileId?: string;
    fileName?: string;
    shareable?: boolean;
    entityId: string;
}

export interface Webhooks {
    name: string;
    token: string;
    enabled?: boolean;
    hook_url: string;
    entityId: string;
}

export interface Errors {
    id?: string;
    state?: string;
    type?: string;
    status: string;
    message: string;
    reporter: string;
    error_obj: any;
}

export interface Reports {
    id?: string;
    type?: string;
    status?: string;
    author: string;
    reason: string;
    mod?: string;
}
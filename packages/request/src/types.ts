import { Dispatcher } from 'undici'

export interface Request {
    url: string;
    method: Dispatcher.HttpMethod;
    body?: Record<string, any>;
}

export interface Response {
    code?: string,
    statusCode?: number,
    statusText?: string,
    message?: string,
    errormsg?: string,
    status?: number,
}

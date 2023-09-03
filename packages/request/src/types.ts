import { Dispatcher } from 'undici'
import type { IncomingHttpHeaders } from 'undici/types/header'

export interface Request {
    url: string
    method: Dispatcher.HttpMethod
    headers: IncomingHttpHeaders
    body: string
}

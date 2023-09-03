import { request, Dispatcher } from 'undici'
import type { IncomingHttpHeaders } from 'undici/types/header'
import ResponseError from './errors'
import { EventEmitter } from 'events'
import { STATUS_CODES } from 'http'

export class RequestClient extends EventEmitter {
    constructor() {
        super()
    }

    public async request(url: string, method: Dispatcher.HttpMethod, body?: string): Promise<any> {
        const headers: IncomingHttpHeaders = {}

        if (method !== 'GET') headers['content-type'] = 'application/json'

        const response = await request(url, {
            method,
            headers,
            body: body
        })

        let responseBody

        if ((response.headers['content-type'] as string)?.startsWith('application/json')) {
            responseBody = await response.body.json()
        } else {
            responseBody = await response.body.text()
        }

        if (response.statusCode < 200 || response.statusCode > 299) {
            throw new ResponseError(response.statusCode, STATUS_CODES[response.statusCode] ?? '', response)
        }

        return responseBody
    }
}

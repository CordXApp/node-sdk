import { request, Dispatcher } from 'undici'
import type { IncomingHttpHeaders } from 'undici/types/header'
import ResponseError from './errors'
import { EventEmitter } from 'events'
import { STATUS_CODES } from 'http'

export class PasteClient extends EventEmitter {
    constructor() {
        super()
    }

    private async _request(method: Dispatcher.HttpMethod, path: string, body?: string): Promise<any> {
        const headers: IncomingHttpHeaders = {}

        if (method !== 'GET') headers['content-type'] = 'application/json'

        const url = `https://pastes.cordx.lol/${path}`

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

    public async post(code: string) {
        if (!code) throw new ReferenceError('Please provide some code or text to upload')

        return this._request('POST', 'documents', code)
    }

    public async get(key: string) {
        if (!key) throw new ReferenceError('Please provide a valid key')

        return this._request('GET', `documents/${key}`)
    }

    public async raw(key: string) {
        if (!key) throw new ReferenceError('Please provide a valid key')

        return this._request('GET', `raw/${key}`)
    }
}

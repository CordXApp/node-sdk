import { request, Dispatcher } from 'undici'
import type { IncomingHttpHeaders } from 'undici/types/header'
import ResponseError from './errors'
import { EventEmitter } from 'events'
import { STATUS_CODES } from 'http'
import { Request } from '../types'

export class RequestClient extends EventEmitter {
    constructor() {
        super()
    }

    private async _request(method: Dispatcher.HttpMethod, url: string, body?: string): Promise<any> {
        const headers: IncomingHttpHeaders = {}
        const req_body = body && method !== 'GET' ? JSON.stringify('body') : undefined

        if (method !== 'GET') headers['content-type'] = 'application/json'

        const response = await request(url, {
            method,
            headers,
            body: req_body
        })

        let responseBody

        if ((response.headers['content-type'] as string)?.startsWith('application/json')) {
            responseBody = await response.body.json()
        } else {
            responseBody = await response.body.text()
        }

        if ((response.headers['content-type'] as string)?.startsWith('application/x-www-form-urlencoded')) {
            throw new ReferenceError('multi part form data is not currently supported')
        }

        if (response.statusCode < 200 || response.statusCode > 299) {
            throw new ResponseError(response.statusCode, STATUS_CODES[response.statusCode] ?? '', response)
        }

        return responseBody
    }

    public async get(url: Request): Promise<any> {
        if (!url) throw new ReferenceError('please provide a valid url')
        if (typeof url !== 'string') throw new TypeError('url is not a valid string')

        return this._request('GET', url)
    }

    public async post({ url, body }: Request): Promise<any> {
        if (!url) throw new ReferenceError('please provide a valid url')
        if (typeof url !== 'string') throw new TypeError('url is not a valid string')
        if (!body) throw new ReferenceError('please provide a valid post body')
        if (typeof body !== 'string') throw new TypeError('post body should be a valid string')

        return this._request('POST', url, body)
    }

    public async custom({ method, url, body }: Request): Promise<any> {
        const validMethods = ['POST', 'PUT', 'PATCH', 'GET', 'DELETE']

        if (!method) throw new ReferenceError('please provide a request method')
        if (!validMethods.includes(method)) throw new TypeError(`request method should be one of ${validMethods}`)

        if (!url) throw new ReferenceError('please provide a request url')
        if (typeof url !== 'string') throw new TypeError('request url should be a valid string')

        if (!body) throw new ReferenceError('please provide a post body')
        if (typeof body !== 'string') throw new TypeError('please provide a valid post body')

        return this._request(method, url, body)
    }
}

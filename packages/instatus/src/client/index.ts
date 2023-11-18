import * as User from '../typings/user'
import * as Page from '../typings/page'
import * as Subscribers from '../typings/subscribers'
import * as Incidents from '../typings/incidents'
import * as Components from '../typings/components'
import { InstatusOptions } from '../typings/defaults'
import { EventEmitter } from 'events'
import axios from 'axios'

/**
 * base client for all of the get methods/endpoints
 * @interface InstatusOptions
 * @extends EventEmitter
 */
export class InstatusClient extends EventEmitter {
    private _opts: InstatusOptions
    private _defaultURL: string
    private _defaultVersion: string
    private _apiKey: string
    private _apiVersion: string
    private _pageId: string
    private _httpClient: any

    public _disclaimer: string
    public _copyright: string
    public _docs: string

    constructor(options: InstatusOptions) {
        super()

        this._defaultURL = 'https://api.instatus.com'
        this._defaultVersion = 'v2'

        if (!options.apiKey) {
            throw new ReferenceError('[@cordxapp/instatus]: Client should have a valid instatus api key')
        }

        this._opts = options
        this._apiKey = options.apiKey
        this._apiVersion = options.apiVersion || this._defaultVersion
        this._pageId = options.pageId
        this._copyright = '© 2023 - Infinity Development'
        this._disclaimer = '"@cordxapp/instatus" is not owned, endorsed by or affiliated with https://instatus.com!'
        this._docs = 'https://cordxapp.github.io/node-sdk/modules/instatus_src.html'

        this._httpClient = axios.create({
            baseURL: `${this._defaultURL}/${this._apiVersion}`,
            headers: {
                Authorization: `Bearer ${this._apiKey}`
            }
        })
    }

    /**
     * VIEW YOUR PUBLIC PROFILE INFORMATION VIA YOUR API KEY
     * @interface UserProfile user profile typings
     * @returns instatus profile information
     * @example
     * const { InstatusClient } = require('@cordxapp/instatus');
     *
     * const instatus = new InstatusClient({
     *     apiKey: 'API_KEY',
     *     apiVersion: 'API_VERSION'
     * });
     *
     * instatus.getUserProfile();
     */
    public async getUserProfile(): Promise<User.UserProfile> {
        const res = await this._httpClient.get('/user')

        if (res.data.error) throw new Error(`[@cordxapp/instatus:error]: ${res.data.error}`)

        return res.data
    }

    /**
     * VIEW AN ARRAY OF THE STATUS PAGES IN YOUR TEAM/WORKSPACE
     * @interface Page.Information status page typings
     * @returns array of status pages in your team/workspace
     * @example
     * const { InstatusClient } = require('@cordxapp/instatus');
     *
     * const instatus = new InstatusClient({
     *     apiKey: 'API_KEY',
     *     apiVersion: 'API_VERSION'
     * });
     *
     * instatus.getStatusPages();
     */
    public async getStatusPages(): Promise<Page.Information[]> {
        const res = await this._httpClient.get('/pages')

        if (res.data.error) throw new Error(`[@cordxapp/instatus:error]: ${res.data.error}`)

        return res.data
    }

    /**
     * VIEW A QUERIED ARRAY OF THE STATUS PAGES IN YOUR TEAM/WORKSPACE
     * @interface Page.Information status page typings
     * @returns array of status pages in your team/workspace
     * @example
     * const { InstatusClient } = require('@cordxapp/instatus');
     *
     * const instatus = new InstatusClient({
     *     apiKey: 'API_KEY',
     *     apiVersion: 'API_VERSION'
     * });
     *
     * instatus.getQueriedStatusPages({ page: 1, per_page: 20 });
     */
    public async getQueriedStatusPages(query: { page: Page.Query; per_page: Page.Query }): Promise<Page.Information[]> {
        if (!query || query == undefined) {
            throw new ReferenceError('[@cordxapp/instatus:error]: please provide a valid query')
        } else if (typeof query.page !== 'number') {
            throw new TypeError('[@cordxapp/instatus:error]: page param should be a valid number')
        } else if (typeof query.per_page !== 'number') {
            throw new TypeError('[@cordxapp/instatus:error]: page param should be a valid number')
        } else if (typeof query !== 'object') {
            throw new TypeError(
                '[@cordxapp/instatus:error]: query should be a valid object | Ex: getQueriedIncidents({ page, per_page })'
            )
        }

        const res = await this._httpClient.get(`/pages?page=${query.page}&per_page=${query.per_page}`)

        if (res.data.error) throw new Error(`[@cordxapp/instatus:error]: ${res.data.error}`)

        return res.data
    }

    /**
     * VIEW AN ARRAY OF ALL THE COMPONENTS IN YOUR STATUS PAGE
     * @requires InstatusOptions.pageId
     * @returns array of status page components
     * @example
     * const { InstatusClient } = require('@cordxapp/instatus');
     *
     * const instatus = new InstatusClient({
     *     apiKey: 'API_KEY',
     *     apiVersion: 'API_VERSION',
     *     pageId: 'PAGE_ID'
     * });
     *
     * instatus.getComponent({ id: 'some_comp_id' });
     */
    public async getComponents(pageId: InstatusOptions): Promise<Page.Components[]> {
        if (!this._pageId) {
            throw new ReferenceError(
                '[@cordxapp/instatus:error]: please provide a valid page id in the client options to use this method'
            )
        }

        const res = await this._httpClient.get(`/${pageId}/components`)

        if (res.data.error) throw new Error(`[@cordxapp/instatus:error]: ${res.data.error}`)

        return res.data
    }

    /**
     * GET A STATUS PAGE COMPONENT BY ID
     * @param id the component id
     * @requires id
     * @returns component information
     * @example
     * const { InstatusClient } = require('@cordxapp/instatus');
     *
     * const instatus = new InstatusClient({
     *     apiKey: 'API_KEY',
     *     apiVersion: 'API_VERSION'
     * });
     *
     * instatus.getComponent({ id: 'some_component_id' });
     */
    public async getComponent({ id }: Components.Fetch): Promise<Page.Components> {
        if (!id) throw new ReferenceError('[@cordxapp/instatus:error]: please provide a component id')
        if (typeof id !== 'string') {
            throw new TypeError('[@cordxapp/instatus:error]: component id should be a valid string')
        }

        const res = await this._httpClient.get(`/${this._pageId}/components/${id}`)

        if (res.data.error) throw new Error(`[@cordxapp/instatus:error]: ${res.data.error}`)

        return res.data
    }

    /**
     * GET A LIST OF INCIDENTS
     * @interface BaseIncident incident typings
     * @returns array of incidents
     * @example
     * const { InstatusClient } = require('@cordxapp/instatus');
     *
     * const instatus = new InstatusClient({
     *     apiKey: 'API_KEY',
     *     apiVersion: 'API_VERSION',
     *     pageId: 'STATUS_PAGE_ID'
     * });
     *
     * instatus.getIncidents();
     */
    public async getIncidents(): Promise<Incidents.Base[]> {
        const res = await this._httpClient.get(`/${this._pageId}/incidents`)

        if (res.data.error) throw new Error(`[@cordxapp/instatus:error]: ${res.data.error}`)

        return res.data
    }

    /**
     * GET A QUERIED LIST OF INCIDENTS
     * @interface BaseIncident
     * @returns an array of incidents
     * @example
     * const { InstatusClient } = require('@cordxapp/instatus');
     *
     * const instatus = new InstatusClient({
     *     apiKey: 'API_KEY',
     *     apiVersion: 'API_VERSION',
     *     pageId: 'STATUS_PAGE_ID'
     * });
     *
     * instatus.getQueriedIncidents({
     *     page: 1,
     *     per_page: 20
     * });
     */
    public async getQueriedIncidents(query?: {
        page: Incidents.Query
        per_page: Incidents.Query
    }): Promise<Incidents.Base[]> {
        if (!query || query == undefined) {
            throw new ReferenceError('[@cordxapp/instatus:error]: please provide a valid query')
        } else if (typeof query.page !== 'number') {
            throw new TypeError('[@cordxapp/instatus:error]: page param should be a valid number')
        } else if (typeof query.per_page !== 'number') {
            throw new TypeError('[@cordxapp/instatus:error]: page param should be a valid number')
        } else if (typeof query !== 'object') {
            throw new TypeError(
                '[@cordxapp/instatus:error]: query should be a valid object | Ex: getQueriedIncidents({ page, per_page })'
            )
        }

        const res = await this._httpClient.get(
            `/${this._pageId}/incidents?page=${query.page}&per_page=${query.per_page}`
        )

        if (res.data.error) throw new Error(`[@cordxapp/instatus:error]: ${res.data.error}`)

        return res.data
    }

    public async getIncident({ id }: Incidents.Base): Promise<Incidents.Base> {
        if (!id) throw new ReferenceError('[@cordxapp/instatus:error]: please provide a valid incident id')
        if (typeof id !== 'string') {
            throw new TypeError('[@cordxapp/instatus:error]: incident id should be a valid string')
        }

        const res = await this._httpClient.get(`${this._pageId}/incidents/${id}`)

        if (res.data.error) throw new Error(`[@cordxapp/instatus:error]: ${res.data.error}`)

        return res.data
    }

    /**
     * VIEW A LIST OF PEOPLE SUBSCRIBED TO YOUR STATUS PAGE
     * @param query
     * @returns array of status page subscribers
     */
    public async getSubscribers(query?: {
        page: Subscribers.Query
        per_page: Subscribers.Query
    }): Promise<Subscribers.Base> {
        if (!query || query == undefined) {
            throw new ReferenceError('[@cordxapp/instatus:error]: please provide a valid query')
        } else if (typeof query.page !== 'number') {
            throw new TypeError('[@cordxapp/instatus:error]: page param should be a valid number')
        } else if (typeof query.per_page !== 'number') {
            throw new TypeError('[@cordxapp/instatus:error]: page param should be a valid number')
        } else if (typeof query !== 'object') {
            throw new TypeError(
                '[@cordxapp/instatus:error]: query should be a valid object | Ex: getQueriedIncidents({ page, per_page })'
            )
        }

        const res = await this._httpClient.get(`/${this._pageId}/subscribers`)

        if (res.data.error) throw new Error(`[@cordxapp/instatus:error]: ${res.data.error}`)

        return res.data
    }
}

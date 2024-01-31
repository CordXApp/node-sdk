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
    private _httpClient: any
    public _disclaimer: string
    public _copyright: string
    public _docs: string

    constructor(options: InstatusOptions) {
        super()

        this._defaultURL = 'https://api.instatus.com'
        this._defaultVersion = 'v2'

        if (!options.apiKey) {
            throw new ReferenceError(
                '[@cordxapp/instatus]: client should have a valid instatus api key or user api key'
            )
        }

        this._opts = options
        this._apiKey = options.apiKey
        this._apiVersion = options.apiVersion || this._defaultVersion
        this._copyright = '© 2023 - Infinity Development'
        this._disclaimer = '"@cordxapp/instatus" is not owned, endorsed by or affiliated with https://instatus.com!'
        this._docs = 'https://cordxapp.github.io/node-sdk/modules/instatus_src.html'

        if (this._apiVersion !== 'v1' && this._apiVersion !== 'v2') {
            throw new RangeError("[@cordxapp/instatus]: 'apiVersion' should be one of 'v1' or 'v2'")
        }

        this._httpClient = axios.create({
            baseURL: `${this._defaultURL}/${this._apiVersion}`,
            headers: {
                Authorization: `Bearer ${this._apiKey}`
            }
        })

        this._httpClient.interceptors.response.use(
            (response: any) => response,
            (error: any) => {
                let errMsg

                if (error.response.status == 401) {
                    errMsg =
                        'Invalid api key, if you are trying to access a user route you need a instatus user api key!'
                } else if (error.response.status == 404 && this._apiVersion == 'v1') {
                    error = 'This api endpoint does not exist on v1, please switch to v2'
                } else if (error.response.status === 404 && this._apiVersion == 'v2') {
                    error = 'This api endpoint does not exist on v2, please switch to v1'
                } else if (error.response.status === 500) {
                    error = 'Whoops, something went seriously wrong with this request!'
                }

                throw Error('[cordxapp/instatus]: ' + errMsg)
            }
        )
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
     * });
     *
     * instatus.getComponent({
     *    pageId: 'some_status_page_id'
     * });
     */
    public async getComponents({ pageId }: Components.Fetch): Promise<Page.Components[]> {
        if (!pageId) throw new ReferenceError('[@cordxapp/instatus:error]: invalid `pageId` provided!')

        const res = await this._httpClient.get(`/${pageId}/components`)

        return res.data
    }

    /**
     * GET A STATUS PAGE COMPONENT BY ID
     * @param id the component id
     * @param pageId the page id
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
    public async getComponent({ id, pageId }: Components.Fetch): Promise<Page.Components> {
        if (!id) throw new ReferenceError('[@cordxapp/instatus:error]: please provide a component id')
        if (typeof id !== 'string') {
            throw new TypeError('[@cordxapp/instatus:error]: component id should be a valid string')
        }

        if (!pageId) throw new ReferenceError('please provide the page id for this component')
        if (typeof pageId !== 'string') throw new TypeError('`pageId` should be a valid string')

        const res = await this._httpClient.get(`/${pageId}/components/${id}`)

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
     *     apiVersion: 'API_VERSION'
     * });
     *
     * instatus.getIncidents();
     */
    public async getIncidents({ pageId }: InstatusOptions): Promise<Incidents.Base[]> {
        const res = await this._httpClient.get(`/${pageId}/incidents`)

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
     *     apiVersion: 'API_VERSION'
     * });
     *
     * instatus.getQueriedIncidents({
     *     page: 1,
     *     per_page: 20
     * });
     */
    public async getQueriedIncidents(
        pageId: InstatusOptions,
        query?: { page: Incidents.Query; per_page: Incidents.Query }
    ): Promise<Incidents.Base[]> {
        if (!pageId) throw new ReferenceError('please provide the page id for this component')
        if (typeof pageId !== 'string') throw new TypeError('`pageId` should be a valid string')

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

        const res = await this._httpClient.get(`/${pageId}/incidents?page=${query.page}&per_page=${query.per_page}`)

        return res.data
    }

    public async getIncident(pageId: InstatusOptions, id: Incidents.Base): Promise<Incidents.Base> {
        if (!id) throw new ReferenceError('[@cordxapp/instatus:error]: please provide a valid incident id')
        if (typeof id !== 'string') {
            throw new TypeError('[@cordxapp/instatus:error]: incident id should be a valid string')
        }

        const res = await this._httpClient.get(`${pageId}/incidents/${id}`)

        return res.data
    }

    /**
     * VIEW A LIST OF PEOPLE SUBSCRIBED TO YOUR STATUS PAGE
     * @param query
     * @returns array of status page subscribers
     */
    public async getSubscribers(
        pageId: InstatusOptions,
        query?: { page: Subscribers.Query; per_page: Subscribers.Query }
    ): Promise<Subscribers.Base> {
        if (!pageId) throw new ReferenceError('please provide the page id for this component')
        if (typeof pageId !== 'string') throw new TypeError('`pageId` should be a valid string')

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

        const res = await this._httpClient.get(`/${pageId}/subscribers`)

        return res.data
    }
}

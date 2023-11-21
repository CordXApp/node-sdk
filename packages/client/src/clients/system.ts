import * as SystemTypes from '../typings/system/'
import * as SystemInterface from '../interfaces/system'
import { EventEmitter } from 'events'
import axios from 'axios'

/**
 * base client for all of the get methods/endpoints
 * @interface Defaults.ClientOptions
 * @extends EventEmitter
 */
export class CordXSystem extends EventEmitter {
    private _defaultURL: string
    private _defaultVersion: string
    private _apiVersion: string
    private _httpClient: any

    public _copyright: string
    public _docs: string

    constructor() {
        super()

        this._docs = 'https://docs.cordx.lol'
        this._defaultURL = 'https://api.cordx.lol'
        this._defaultVersion = 'v3'

        this._apiVersion = this._defaultVersion
        this._copyright = '© 2023 - Infinity Development'

        this._httpClient = axios.create({
            baseURL: `${this._defaultURL}/${this._apiVersion}`,
            timeoutErrorMessage: 'Request timed out!',
            timeout: 10000
        })

        this._httpClient.interceptors.response.use((response: any) => response, (error: any) => {

            let errMsg;

            if (error.response.status == 401) errMsg = 'Whoops, you do not have access to this endpoint. Sorry about that!';
            else if (error.response.status == 404) error = 'Hang on there, we were unable to locate whatever it is you are looking for!';
            else if (error.response.status === 500) error = 'Whoops, something went seriously wrong with this request!'

            throw Error('[cordxapp/client:system]: ' + errMsg);
          });
    }

    /**
     * DISPLAYS OUR WEBSITE STATISTICS
     */
    public async Statistics(): Promise<SystemInterface.BaseStats | SystemInterface.CachedStats> {
        const res = await this._httpClient.get('/system/stats')

        return res.data
    }

    /**
     * DISPLAYS A LIST OF OUR SERVICE VERSIONS
     */
    public async Versions(): Promise<SystemInterface.Versions> {
        const res = await this._httpClient.get('/system/check/versions')

        return res.data
    }

    public async Status(): Promise<SystemInterface.StatusPage> {
        const res = await this._httpClient.get('/status/summary')

        return res.data
    }
}

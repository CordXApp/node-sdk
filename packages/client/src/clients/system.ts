import * as SystemTypes from '../typings/system/';
import * as SystemInterface from '../interfaces/system';
import * as Options from '../interfaces/defaults';
import { EventEmitter } from 'events';
import axios from 'axios';

/**
 * base client for all of the get methods/endpoints
 * @interface Defaults.ClientOptions
 * @extends EventEmitter
 */
export class CordXSystem extends EventEmitter {
	private _opts: Options.ClientOptions;
	private _defaultURL: string;
	private _defaultVersion: string;
	private _apiVersion: string;
	private _httpClient: any;

	public _copyright: string;
	public _docs: string;

	constructor(options: Options.ClientOptions) {
		super();

		this._docs = 'https://docs.cordx.lol';
		this._defaultURL = 'https://api.cordx.lol';
		this._defaultVersion = 'v3';

		this._opts = options;
		this._apiVersion = options.apiVersion || this._defaultVersion;
		this._copyright = '© 2023 - Infinity Development';

		this._httpClient = axios.create({
			baseURL: `${this._defaultURL}/${this._apiVersion}`,
			timeoutErrorMessage: 'Request timed out!',
			timeout: 10000,
		});
	}

	/**
     * DISPLAYS OUR WEBSITE STATISTICS
     */
	public async Statistics(): Promise<SystemInterface.BaseStats | SystemInterface.CachedStats> {
		const res = await this._httpClient.get('/system/stats');

		if (res.data.error) throw new Error(`[@cordxapp/client:error]: ${res.data.error}`);

		return res.data;
	}

	/**
     * DISPLAYS A LIST OF OUR SERVICE VERSIONS
     */
	public async Versions(): Promise<SystemInterface.Versions> {
		const res = await this._httpClient.get('/system/check/versions');

		return res.response;
	}

	public async Status(): Promise<SystemInterface.StatusPage> {
		const res = await this._httpClient.get('/status/summary');

		if (res.data.error) throw new Error(`[@cordxapp/client:error]: ${res.data.error}`);

		return res.data;
	}

	public async ComponentStatusFilter(
		auth: string,
		method: SystemTypes.Status
	): Promise<SystemInterface.BaseComponents> {
		const res = await this._httpClient.get(`/status/comp/filter/${auth}?=${method}`);

		if (res.data.error) throw new Error(`[@cordxapp/client:error]: ${res.data.error}`);

		return res.data;
	}
}

import * as CommandTypings from '../typings/commands/index';
import * as CommandInterface from '../interfaces/commands';
import * as Options from '../interfaces/defaults';
import { EventEmitter } from 'events';
import axios from 'axios';

/**
 * base client for all of the get methods/endpoints
 * @interface Defaults.ClientOptions
 * @extends EventEmitter
 */
export class CordXCommands extends EventEmitter {
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
		});
	}

	/**
     * GENERATES A 8 BALL RESPONSE
     */
	public async Run8BallCommand(): Promise<CommandInterface.Generate8Ball> {
		const res = await this._httpClient.get('/client/8ball');

		return res.response;
	}

	/**
     * GENERATES A RANDOM PIECE OF ADVICE
     */
	public async RunAdviceCommand(): Promise<CommandInterface.GenerateAdvice> {
		const res = await this._httpClient.get('/client/advice/random');

		return res.advice;
	}

	/**
     * GENERATES A RANDOM FACT WITH A LINK TO ITS SOURCE
     */
	public async RunFactCommand(): Promise<CommandInterface.GenerateFacts> {
		const res = await this._httpClient.get('/client/facts/random');

		return {
			fact: res.fact,
			source: res.source,
		};
	}

	/**
     * GENERATES A RANDOM MEME BASED ON THE PROVIDED PARAMS
     */
	public async RunMemeCommand(type: CommandTypings.MemeTypes): Promise<CommandInterface.GenerateMeme> {
		const res = await this._httpClient.get(`/client/${type}`);

		return {
			title: res.title,
			image: res.image,
			link: res.link,
			author: res.author,
			upvotes: res.upvotes,
			comments: res.comments,
			nsfw: res.nsfw,
		};
	}

	/**
     * GENERATE A RANDOM YOMOMMA JOKE
     */
	public async RunYoMommaCommand(): Promise<CommandInterface.GenerateYoMommaJoke> {
		const res = await this._httpClient.get('/client/yomomma');

		return res.joke;
	}
}

import * as CommandTypings from '../typings/commands/index'
import * as CommandInterface from '../interfaces/commands'
import { EventEmitter } from 'events'
import axios from 'axios'

/**
 * base client for all of the get methods/endpoints
 * @extends EventEmitter
 */
export class CordXCommands extends EventEmitter {
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
            baseURL: `${this._defaultURL}/${this._apiVersion}`
        })

        this._httpClient.interceptors.response.use((response: any) => response, (error: any) => {

            let errMsg;

            if (error.response.status == 401) errMsg = 'Whoops, you do not have access to this endpoint. Sorry about that!';
            else if (error.response.status == 404) error = 'Hang on there, we were unable to locate whatever it is you are looking for!';
            else if (error.response.status === 500) error = 'Whoops, something went seriously wrong with this request!'

            throw Error('[cordxapp/client:commands]: ' + errMsg);
          });
    }

    /**
     * GENERATES A 8 BALL RESPONSE
     */
    public async Run8BallCommand(question: CommandInterface.Required8BallParams): Promise<CommandInterface.Generate8Ball> {

        if (!question) throw new ReferenceError('[cordxapp/client:commands]: error, please ask the 8 ball a question!');

        const res = await this._httpClient.get('/client/8ball')

        return res.data
    }

    /**
     * GENERATES A RANDOM PIECE OF ADVICE
     */
    public async RunAdviceCommand(): Promise<CommandInterface.GenerateAdvice> {
        const res = await this._httpClient.get('/client/advice/random')

        return res.data
    }

    /**
     * GENERATES A RANDOM FACT WITH A LINK TO ITS SOURCE
     */
    public async RunFactCommand(): Promise<CommandInterface.GenerateFacts> {
        const res = await this._httpClient.get('/client/facts/random')

        return res.data
    }

    /**
     * GENERATES A RANDOM MEME BASED ON THE PROVIDED PARAMS
     */
    public async RunMemeCommand(type: CommandTypings.MemeTypes): Promise<CommandInterface.GenerateMeme> {
        const res = await this._httpClient.get(`/client/${type}`)

        return res.data
    }

    /**
     * GENERATE A RANDOM YOMOMMA JOKE
     */
    public async RunYoMommaCommand(): Promise<CommandInterface.GenerateYoMommaJoke> {
        const res = await this._httpClient.get('/client/yomomma')

        return res.data
    }
}

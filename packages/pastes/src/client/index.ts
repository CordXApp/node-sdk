import { EventEmitter } from 'events';
import { RequestClient } from '@cordxapp/request';

export class PasteClient extends EventEmitter {
	private _request: any;
	public _url: string;

	constructor() {
		super();

		this._request = new RequestClient();
		this._url = 'https://pastes.cordx.lol';
	}

	public async post(code: string) {
		if (!code) throw new ReferenceError('Please provide some code or text to upload');

		return this._request.post({ url: `${this._url}/documents`, body: code });
	}

	public async get(key: string) {
		if (!key) throw new ReferenceError('Please provide a valid key');

		return this._request.get(`${this._url}/documents/${key}`);
	}

	public async raw(key: string) {
		if (!key) throw new ReferenceError('Please provide a valid key');

		return this._request.get(`${this._url}/raw/${key}`);
	}
}

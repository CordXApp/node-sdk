import type { Dispatcher } from 'undici';

const tips = {
	200: 'OK',
	301: 'Request was temporarily moved to a new location',
	400: 'Bad request, please check your params and try again',
	403: 'Access to this endpoint is forbidden',
	408: 'Maintenance mode, be back soon',
	429: 'Whoops, you are being rate limited, try again later!',
	500: 'Something went wrong here!',
	502: 'Uh-oh, this service appears to be down',
	522: 'Whoops, this connection has timed out!',
};

export default class ResponseErrors extends Error {
	public response?: Dispatcher.ResponseData;
	constructor(code: number, text: string, response: Dispatcher.ResponseData) {
		if (code in tips) {
			super(`${code} ${text} (${tips[code as keyof typeof tips]})`);
		}
		else {
			super(`${code} ${text}`);
		}
		this.response = response;
	}
}

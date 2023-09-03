import type { Dispatcher } from 'undici'

const tips = {
    200: 'Your paste has been added',
    500: 'Something went wrong here!'
}

/** API Error */
export default class ResponseErrors extends Error {
    /** Possible response from Request */
    public response?: Dispatcher.ResponseData
    constructor(code: number, text: string, response: Dispatcher.ResponseData) {
        if (code in tips) {
            super(`${code} ${text} (${tips[code as keyof typeof tips]})`)
        } else {
            super(`${code} ${text}`)
        }
        this.response = response
    }
}

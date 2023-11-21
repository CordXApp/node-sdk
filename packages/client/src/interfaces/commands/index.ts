export interface Generate8Ball {
    response: string
}

export interface Required8BallParams {
    question: string
}

export interface GenerateAdvice {
    advice: string
}

export interface GenerateFacts {
    fact: string
    source: string
}

export interface GenerateMeme {
    title: string
    image: string
    link: string
    author: string
    upvotes: number
    comments: number
    nsfw: boolean
}

export interface GenerateYoMommaJoke {
    joke: string
}

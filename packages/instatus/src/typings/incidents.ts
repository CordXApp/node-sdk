export interface Base {
    id: string
    name: string
    status: string
    started: string
    resolved: string | null
    updates: Updates[] | null
    components: Components[] | null
}

export interface Updates {
    id: string
    message: string
    messageHtml: string
    status: string
    notify: boolean
    started: string
    ended: string | null
    duration: number | null
    createdAt: string
}

export interface Components {
    id: string
    name: string
    status: string
    showUptime: boolean | null
    site: {
        id: string
        name: string
        subdomain: string
        color: string | null
        logoUrl: string | null
        publicEmail: string | null
    }
}

export interface Query {
    page: number | null
    per_page: number | null
}

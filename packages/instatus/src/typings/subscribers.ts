export interface Base {
    id: string
    email: string
    phone: string | null
    webhook: string | null
    webhookEmail: string | null
    confirmed: boolean
    all: boolean
    components: []
    site: Site | null
}

export interface Site {
    id: string
    name: string
    logoUrl: string | null
    subdomain: string | null
    publicEmail: string | null
    language: string
}

export interface Query {
    page: number | null
    per_page: number | null
}

export interface Add {
    email: string
    all: boolean
    autoConfirm: boolean
}

export interface Information {
    id: string
    subdomain: string
    name: string
    logoUrl: string | null
    faviconUrl: string | null
    websiteUrl: string | null
    customDomain: string | null
    publicEmail: string | null
    twitter: string | null
    status: string
    subscribeBySms: boolean
    language: string
    useLargeHeader: boolean
    brandColor: string | null
    okColor: string | null
    disruptedColor: string | null
    degradedColor: string | null
    downColor: string | null
    noticeColor: string | null
    unknownColor: string | null
    googleAnalytics: string | null
    smsService: string | null
    htmlInMeta: string | null
    htmlAboveHeader: string | null
    htmlBelowHeader: string | null
    htmlAboveFooter: string | null
    htmlBelowFooter: string | null
    htmlBelowSummary: string | null
    launchDate: string | null
    cssGlobal: string | null
    onboarded: boolean | null
    createdAt: string | null
    updatedAt: string | null
}

export interface Components {
    id: string
    name: string
    status: string
    uniqueEmail: string
    description: string
    showUptime: boolean
    order: number
    group: any
}

export interface Query {
    page: number | null
    per_page: number | null
}

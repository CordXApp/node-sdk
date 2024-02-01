export interface BaseStats {
    users: number
    images: number
    downloads: number
}

export interface CachedStats {
    cached: boolean
    expires: number
    data: BaseStats
}

export interface Versions {
    current: {
        api: string
        client: string
        website: string
        documentation: string
    }
    newest: {
        api: string
        client: string
        website: string
        documentation: string
    }
    stable: {
        api: string
        client: string
        website: string
        documentation: string
    }
}

export interface StatusPage {
    page: StatusInfo
}

export interface StatusInfo {
    name: string
    url: string
    status: string
}

export interface BaseComponents {
    id: string
    name: string
    nameTranslationId: string | null
    description: string
    descriptionTranslationId: string | null
    status: string
    order: number
    showUptime: boolean
    createdAt: string | null
    updatedAt: string | null
    archivedAt: string | null
    siteId: string | null
    uniqueEmail: string | null
    oldGroup: string | null
    groupId: string | null
    isParent: boolean
    isCollapsed: boolean
    monitorId: string | null
    nameHtml: string | null
    nameHtmlTranslationId: string | null
    descriptionHtml: string | null
    descriptionHtmlTranslationId: string | null
    isThirdParty: boolean
    thirdPartyStatus: string | null
    thirdPartyComponentId: string | null
    thirdPartyComponentServiceId: string | null
    importedFromStatusPage: boolean
    startDate: string | null
    children: ComponentChildren | []
    translations: any
}

export interface ComponentChildren {
    id: string
    name: string
    nameTranslationId: string | null
    description: string
    descriptionTranslationId: string | null
    status: string
    order: number
    showUptime: boolean
    createdAt: string
    updatedAt: string | null
    archivedAt: string | null
    siteId: string
    uniqueEmail: string | null
    oldGroup: string | null
    groupId: string | null
    isParent: boolean
    isCollapsed: boolean
    monitorId: string | null
    nameHtml: string | null
    nameHtmlTranslationId: string | null
    descriptionHtml: string | null
    descriptionHtmlTranslationId: string | null
    isThirdParty: boolean
    thirdPartyStatus: string | null
    thirdPartyComponentId: string | null
    thirdPartyComponentServiceId: string | null
    importedFromStatuspage: string | null
    startDate: string | null
    thirdPartyComponentService: string | null
    metrics: [any]
    children: [any]
    translations: [any]
}

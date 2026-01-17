import type {Tile} from './Board'

export interface BugReport {
    id: string
    description?: string
    scenario_id: string
    productionCurve_id: string
    tiles: Tile[]
    tasks: string[]
    navigator: {
        userAgent: string
        platform: string
        language: string
    }
    date: string
    screenshot?: string
}

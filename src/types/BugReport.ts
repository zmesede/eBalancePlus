import { Tile } from "./Board";

export interface BugReport {
    id: number;
    description?: string;
    scenario_id: string;
    productionCurve_id: string;
    tiles: Tile[];
    tasks: string[];
    navigator: Navigator;
    date: Date
    screenshot?: string
}

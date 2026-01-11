class Tile {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string
    logo?: string | undefined;
    iconBase64?: string | undefined;
}



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

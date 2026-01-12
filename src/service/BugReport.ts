import type { BugReport } from '../types/BugReport'
import { useScenarioStore } from '../stores/ScenarioStore'
import { useTaskStore } from '../stores/TaskStore'
import { useBoardStore } from '../stores/BoardStore'
import {useProductionStore} from '../stores/ProductionStore'

let bugReportId = 1

export function createBugReport(description?: string, screenshot?:string): BugReport {
    const scenarioStore = useScenarioStore()
    const taskStore = useTaskStore()
    const boardStore = useBoardStore()
    const productionStore = useProductionStore(),

    report: BugReport = {
        id: bugReportId++,
        description,
        scenario_id: scenarioStore.clickedScenario?.id ?? 'UNKNOWN',
        productionCurve_id: productionStore.clickedProductionCurve?.id ?? 'UNKNOWN',
        tiles: boardStore.board.consumptionTiles,
        tasks: taskStore.getCompletedTasks,
        navigator: navigator,
        date: new Date(),
        screenshot,
    }

    console.group('🐞 BUG REPORT')
    console.log(report)
    if (screenshot) {
        console.log('📸 Screenshot:')
        console.log(screenshot)
    }
    console.groupEnd()

    return report
}

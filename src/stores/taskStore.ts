import {defineStore} from 'pinia'
import {useScenarioStore} from './scenarioStore'
import {useConsumptionStore} from './consumptionStore'

interface Task {
    id: string
    equipmentTypeId: string
    names: { text: string; lang: string }[]
    icon: string
    color: string
    order: number
}

export const useTaskStore = defineStore('task', {
    state: () => ({
        manuallyCompletedTasks: [] as string[],
    }),

    getters: {
        // Génération des tâches
        getTasksByDay: () => {
            const scenarioStore = useScenarioStore()
            const clickedScenario = scenarioStore.clickedScenario

            if (!clickedScenario) return [] as Task[]

            return (clickedScenario.equipmentTypes || []).map(
                (equipmentType, index): Task => ({
                    id: `task_${equipmentType.id}`,
                    equipmentTypeId: equipmentType.id,
                    names: equipmentType.names,
                    icon: equipmentType.icon_name,
                    color: equipmentType.color,
                    order: index + 1,
                })
            )
        },

        // Getter qui retourne une fonction
        isTaskCompleted() {
            return (taskId: string, equipmentTypeId: string): boolean => {
                if (this.manuallyCompletedTasks.includes(taskId)) {
                    return true
                }

                const consumptionStore = useConsumptionStore()

                return consumptionStore.consumptionList.some(
                    c => c.equipment.type.id === equipmentTypeId
                )
            }
        },

        // Pourcentage d'avancement
        getCompletionProgress(): number {
            const tasks = this.getTasksByDay
            if (tasks.length === 0) return 0

            const isCompleted = this.isTaskCompleted

            const completed = tasks.filter((task: Task) =>
                isCompleted(task.id, task.equipmentTypeId)
            ).length

            return Math.round((completed / tasks.length) * 100)
        },

        // Nombre complété / total
        getCompletedTasksCount(): { completed: number; total: number } {
            const tasks = this.getTasksByDay
            const isCompleted = this.isTaskCompleted

            const completed = tasks.filter((task: Task) =>
                isCompleted(task.id, task.equipmentTypeId)
            ).length

            return {
                completed,
                total: tasks.length,
            }
        },
    },

    actions: {
        toggleTaskCompletion(taskId: string) {
            const index = this.manuallyCompletedTasks.indexOf(taskId)

            if (index !== -1) {
                this.manuallyCompletedTasks.splice(index, 1)
            } else {
                this.manuallyCompletedTasks.push(taskId)
            }
        },

        resetManuallyCompletedTasks() {
            this.manuallyCompletedTasks = []
        },

        resetForNewScenario() {
            this.manuallyCompletedTasks = []
        },
    },
})

<script lang="ts">
import Board from '../components/Board.vue'
import BaseAlert from '../components/BaseAlert.vue'
import EquipmentList from '../components/EquipmentList.vue'
import TaskList from '../components/TaskList.vue'
import BoardIconsBar from '../components/BoardIconsBar.vue'
import BoardConsumptionDetails from '../components/BoardConsumptionDetails.vue'
import BoardConsumptionAddWindow from '../components/BoardConsumptionAddWindow.vue'
import EnergyMenuAddEnergyWindow from '../components/EnergyMenuAddEnergyWindow.vue'
import EnergyMenuUseEnergyWindow from '../components/EnergyMenuUseEnergyWindow.vue'

export default {
  name: 'Game',
  components: {
    BaseAlert,
    Board,
    BoardIconsBar,
    EquipmentList,
    TaskList,
    BoardConsumptionDetails,
    BoardConsumptionAddWindow,
    EnergyMenuAddEnergyWindow,
    EnergyMenuUseEnergyWindow,
  },
  mounted() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'auto'
    })
  },
  setup() {
    const boardStore = useBoardStore()
    const consumptionStore = useConsumptionStore()
    const taskStore = useTaskStore()

    watch(
        () => boardStore.board.consumptionTiles.length,
        () => {
          taskStore.getTasksByDay
        }
    )

    watch(
        () => consumptionStore.consumptionList.length,
        () => {
          console.log('Consommations mises à jour, recalcul des tâches')
        }
    )
  },
  data() {
    return {
      consumptionStore: useConsumptionStore(),
      boardStore: useBoardStore(),
      gameParametersStore: useGameParametersStore(),
      equipmentStore: useEquipmentStore(),
      energyStore: useEnergyStore(),
      resultsStore: useResultsStore(),
    }
  },
  computed: {
    displayOverlay() {
      return this.equipmentStore.clickedEquipment
          || this.boardStore.isTileClicked
          || this.energyStore.clickedStoreEnergy
          || this.gameParametersStore.showedInfoOverlay
          || this.resultsStore.getIsConfirmationWindowOpen
    },
  },
}
</script>

<template>
  <div>
    <NavBar/>

    <div v-if="displayOverlay" class="overlay"/>
    <TheGameInfoWindow v-if="gameParametersStore.showedInfoOverlay"/>
    <ResultsMenuConfirmation/>

    <div class="canvas-layer">
      <Board
          :board-visual-params="boardStore.board.boardVisualParams"
          :board-width="boardStore.board.width"
          :board-height="boardStore.board.height"
          :px-size-for15m="boardStore.tileParams.pxSizeFor15min"
          :px-size-for10-w="boardStore.tileParams.pxSizeFor10W"
          :consumption-tiles-list="boardStore.board.consumptionTiles"
          :production-tiles-list="boardStore.board.productionTiles"
          :production-curve-props="gameParametersStore.getProductionCurve"
      />

    </div>

    <section class="side-list left">
      <EquipmentList/>
    </section>
    <section class="side-list right">
      <TaskList/>
    </section>
    <div id="game-page" class="view game-layout">
      <BoardConsumptionAddWindow
          v-if="equipmentStore.clickedEquipment"
          :equipment="equipmentStore.clickedEquipment"
      />
      <BoardConsumptionDetails
          :consumption-tile="boardStore.clickedTile"
          :production-tile="boardStore.clickedProductionTile"
      />
      <BoardIconsBar/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useBoardStore} from '../stores/BoardStore'
import type {ProductionCurve} from '../types/Production'
import type {BoardVisualParams, Tile} from '../types/Board'
import {convertValuesListToPixelsList} from '../helpers/drawInPixels'
import BaseCanvas from './BaseCanvas.vue'
</script>

<script lang="ts">
const boardStore = useBoardStore()
export default {
  name: 'Board',
  components: {
    BaseCanvas,
  },
  props: {
    boardVisualParams: {
      type: Object as () => BoardVisualParams,
      default: () => ({}),
      required: true,
    },
    boardWidth: Number,
    boardHeight: Number,
    pxSizeFor15m: Number,
    pxSizeFor10W: Number,
    productionCurveProps: null,
    consumptionTilesList: {
      type: Array as () => Tile[],
      default: () => [],
      required: true,
    },
    productionTilesList: {
      type: Array as () => Tile[],
      default: () => [],
      required: true,
    },
  },
  data() {
    return {
      canvasId: 'canvas',
      canvas: null as CanvasRenderingContext2D | null,
      canvasWidth: 1440,
      canvasHeight: 5000,
      lastPosition: {x: 0, y: 0} as { x: number; y: number },
      productionCurve: null as ProductionCurve | null,
      tiles: [] as Tile[],
      productionTiles: [] as Tile[],
      isDragging: false,
      dragTileIndex: -1,
      dragOffset: {x: 0, y: 0} as { x: number; y: number },
      hoursList: Array.from({length: 25}, (_, i) => i),
      dragTileInitialX: 0,
      dragConsumptionInitialStartIndex: 0,
    }
  },
  watch: {
    boardWidth: {
      handler(newWidth) {
        this.canvasWidth = newWidth
        this.render()
      },
      immediate: true,
    },
    boardHeight: {
      handler(newHeight) {
        this.canvasHeight = newHeight
        this.render()
      },
      immediate: true,
    },
    productionCurveProps: {
      handler(newProductionCurve) {
        this.productionCurve = newProductionCurve
        this.render()
      },
      immediate: true,
    },
    consumptionTilesList: {
      handler(newTiles) {
        this.tiles = newTiles
        this.render()
      },
      immediate: true,
    },
    productionTilesList: {
      handler(newTiles) {
        this.productionTiles = newTiles
        this.render()
      },
      immediate: true,
    },
  },
  mounted() {
    const canvasHTMLElement = document.getElementById(this.canvasId) as HTMLCanvasElement | null
    if (canvasHTMLElement) {
      const ctx = canvasHTMLElement.getContext('2d')
      this.canvas = ctx
    }
    this.render()
  },
  methods: {
    canvasClick(event: MouseEvent) {
      const x = event.offsetX
      const y = event.offsetY
      const clickedTiles = this.tiles.filter((tile: Tile) => this.isInsideTile(x, y, tile))
      const clickedProductionTiles = this.productionTiles.filter((tile: Tile) => this.isInsideTile(x, y, tile))
      if (clickedTiles.length)
        boardStore.setClickedTile(clickedTiles[0])
      else
        boardStore.setClickedTile(null)

      if (clickedProductionTiles.length)
        boardStore.setClickedProductionTile(clickedProductionTiles[0])
      else
        boardStore.setClickedProductionTile(null)
    },
    canvasMouseDown(event: MouseEvent) {
      const x = event.offsetX
      const y = event.offsetY
      const idx = this.tiles.findIndex((t: Tile) => this.isInsideTile(x, y, t))

      if (idx !== -1) {
        const tile = this.tiles[idx]
        this.isDragging = true
        this.dragTileIndex = idx
        this.dragOffset = {x: x - tile.x, y: 0}

        this.dragTileInitialX = tile.x
        const sameTiles = this.tiles.filter((t: Tile) => t.id === tile.id)
        const minX = Math.min(...sameTiles.map(t => t.x))
        this.dragConsumptionInitialStartIndex = this.pxToIndex(minX)
      }
    },
    canvasMouseMove(event: MouseEvent) {
      const x = event.offsetX
      const y = event.offsetY
      this.lastPosition = {x, y}

      if (this.isDragging && this.dragTileIndex !== -1) {
        const tile = this.tiles[this.dragTileIndex]
        let newX = x - this.dragOffset.x

        newX = Math.max(0, Math.min(newX, this.canvasWidth - tile.width))

        const snapX = this.pxSizeFor15m || 15

        tile.x = Math.round(newX / snapX) * snapX


        this.render()
      }
    },
    pxToIndex(px: number) {
      const pxPer15min = this.pxSizeFor15m || 15
      return Math.round(px / pxPer15min)
    },

    canvasMouseUp() {
      if (this.isDragging && this.dragTileIndex !== -1) {
        const tile = this.tiles[this.dragTileIndex]
        const deltaPx = tile.x - this.dragTileInitialX
        const deltaIndex = this.pxToIndex(deltaPx)
        const newGlobalStartIndex = this.dragConsumptionInitialStartIndex + deltaIndex
        const consumptionStore = useConsumptionStore()
        consumptionStore.moveConsumption(this.tiles[this.dragTileIndex].id, newGlobalStartIndex)
        this.isDragging = false
        this.dragTileIndex = -1
      }
    },
    clearCanvas(startX: number, startY: number, endX: number, endY: number) {
      if (this.canvas)
        this.canvas.clearRect(startX, startY, endX, endY)
    },
    drawTiles(tiles: Tile[]) {
      for (const tile of tiles) {
        this.drawRectangle(tile.x, tile.y, tile.width, tile.height, tile.color)
        this.drawTileIcon(tile)
      }
    },
    drawRectangle(x: number, y: number, width: number, height: number, color: string) {
      if (this.canvas) {
        this.canvas.fillStyle = color
        this.canvas.fillRect(x, y, width, height)
      }
    },
    drawProductionCurve(productionCurve: ProductionCurve | null, isCurveSmoothed: boolean, shouldDisplayProductionCurve: boolean) {
      if (productionCurve && shouldDisplayProductionCurve) {
        const pxSize = this.pxSizeFor10W ? this.pxSizeFor10W : 5
        if (productionCurve.solar.length > 0)
          this.drawCurve(convertValuesListToPixelsList(productionCurve.solar, pxSize, 10), 'yellow', isCurveSmoothed)

        if (productionCurve.wind.length > 0)
          this.drawCurve(convertValuesListToPixelsList(productionCurve.wind, pxSize, 10), 'green', isCurveSmoothed)

        if (productionCurve.hydro.length > 0)
          this.drawCurve(convertValuesListToPixelsList(productionCurve.hydro, pxSize, 10), 'blue', isCurveSmoothed)

        if (productionCurve.total.length > 0)
          this.drawCurve(convertValuesListToPixelsList(productionCurve.total, pxSize, 10), 'black', isCurveSmoothed)
      }
    },
    drawKWLines(displayKWLines: boolean, is3kWLineRed: boolean) {
      if (displayKWLines) {
        const ySize = (this.pxSizeFor10W ? this.pxSizeFor10W : 5) * 100
        let y = 0
        for (let i = 0; i < (this.canvasHeight / ySize); i++) {
          const color = is3kWLineRed && (i - 1) % 3 === 0 ? 'red' : '#003C73'
          this.drawLine(0, y, this.canvasWidth, y, color, 0.5)
          y = y + ySize
        }
      }
    },
    drawHoursLines(displayHoursLines: boolean) {
      if (displayHoursLines) {
        const xSize = this.pxSizeFor15m ? this.pxSizeFor15m : 15
        let x = 0
        for (let i = 0; i <= 24; i++) {
          this.drawLine(x, 0, x, this.canvasHeight, '#003C73', 0.5)
          x = x + xSize * 4
        }
      }
    },
    drawCurve(points: number[], color: string, isCurveSmoothed: boolean) {
      const xSize = this.pxSizeFor15m ? this.pxSizeFor15m : 15
      let x = 0
      if (isCurveSmoothed) {
        for (let i = 0; i < points.length - 1; i++) {
          this.drawLine(x, this.canvasHeight - points[i], x + xSize, this.canvasHeight - points[i + 1], color)
          x = x + xSize
        }
      } else {
        for (let i = 0; i < points.length - 1; i++) {
          this.drawLine(x, this.canvasHeight - points[i], x + xSize, this.canvasHeight - points[i], color)
          this.drawLine(x + xSize, this.canvasHeight - points[i], x + xSize, this.canvasHeight - points[i + 1], color)
          x = x + xSize
        }
      }
      this.drawLine(x, this.canvasHeight - points[points.length - 1], x + xSize, this.canvasHeight - points[points.length - 1], color)
    },
    drawLine(startX: number, startY: number, endX: number, endY: number, color: string, linewidth = 3) {
      if (this.canvas) {
        this.canvas.strokeStyle = color
        this.canvas.lineWidth = linewidth
        this.canvas.beginPath()
        this.canvas.moveTo(startX, startY)
        this.canvas.lineTo(endX, endY)
        this.canvas.stroke()
      }
    },
    drawTileIcon(tile: Tile) {
      if (!this.canvas || !tile.iconBase64) return
      const img = new Image()
      img.src = tile.iconBase64
      img.onload = () => {
        const iconSize = Math.min(tile.width, tile.height) * 0.6
        const x = tile.x + tile.width / 2 - iconSize / 2
        const y = tile.y + tile.height / 2 - iconSize / 2
        this.canvas!.drawImage(img, x, y, iconSize, iconSize)
      }
    },
    isInsideTile(x: number, y: number, tile: Tile) {
      return (x >= tile.x && x <= tile.x + tile.width) && (y >= tile.y && y <= tile.y + tile.height)
    },
    render() {
      this.clearCanvas(0, 0, this.canvasWidth, this.canvasHeight)
      this.drawHoursLines(this.boardVisualParams.shouldDisplayHoursLines)
      this.drawKWLines(this.boardVisualParams.shouldDisplayKWLines, this.boardVisualParams.is3kWLineRed,)
      const sortedProduction = [...this.productionTiles].sort((a, b) => b.width - a.width)
      const sortedConsumption = [...this.tiles].sort((a, b) => b.width - a.width)

      this.drawTiles(sortedProduction)
      this.drawTiles(sortedConsumption)

      this.drawProductionCurve(this.productionCurve, this.boardVisualParams.isProductionCurveSmoothed, this.boardVisualParams.shouldDisplayProductionCurve,)
    }
  },
}
</script>

<template>
  <section id="game-board" class="board">
    <div
        class="canvas-container"
        :style="{ width: canvasWidth + 'px' }"
    >
      <BaseCanvas
          :canvas-id="canvasId"
          :width="canvasWidth"
          :height="canvasHeight"
          style="display:block;margin:0;padding:0;"
          @click="canvasClick"
          @mousemove="canvasMouseMove"
          @mousedown="canvasMouseDown"
          @mouseup="canvasMouseUp"
      />
      <div class="hours-labels">
        <div class="hours-labels" :style="{ width: canvasWidth + 'px' }">
  <span
      v-for="hour in hoursList"
      :key="hour"
      class="hour-label"
      :style="{ left: (hour * (pxSizeFor15m * 4)) + 'px' }"
  >
    {{ hour === 24 ? '00' : hour.toString().padStart(2, '0') }}h
  </span>
        </div>
      </div>
      <div class="legend">
        <div class="legend-item">
          <span class="legend-color solar"></span> Solaire
        </div>
        <div class="legend-item">
          <span class="legend-color wind"></span> Éolien
        </div>
        <div class="legend-item">
          <span class="legend-color total"></span> Total
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
@import '../styles/components/board.scss';
</style>

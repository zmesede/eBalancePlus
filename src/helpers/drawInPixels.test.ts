import { describe, expect, it } from 'vitest'
import {
  convertPixelsToValue,
  convertValueToPixels,
  convertValuesListToPixelsList,
} from './drawInPixels'

describe('convertValueToPixels', () => {
  it('should convert value to pixels correctly', () => {
    expect(convertValueToPixels(10, 20, 2)).toEqual(100)
    expect(convertValueToPixels(5, 10, 1)).toEqual(50)
  })
})

describe('convertPixelsToValue', () => {
  it('should convert pixels to value correctly', () => {
    expect(convertPixelsToValue(100, 20, 2)).toEqual(10)
    expect(convertPixelsToValue(50, 10, 1)).toEqual(5)
  })
})

describe('convertValuesListToPixelsList', () => {
  it('should convert values list to pixels list correctly', () => {
    expect(convertValuesListToPixelsList([10, 20, 30], 20, 2)).toEqual([100, 200, 300])
    expect(convertValuesListToPixelsList([5, 10, 15], 10, 1)).toEqual([50, 100, 150])
  })
})

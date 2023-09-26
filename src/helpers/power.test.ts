import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  calculateMaxPowerPer15min,
  calculateTotalWattsPer15min,
  convertWattsPer15minToKilowattsPerHour,
  convertWattsPer15minToWattsPerHour,
  getTotalKilowattsPerHour,
  roundNumberToTwoDecimals,
} from './power'

describe('power helper functions', () => {
  describe('roundNumberToTwoDecimals', () => {
    it('should round a number to two decimal places', () => {
      expect(roundNumberToTwoDecimals(3.14159)).toEqual(3.14)
      expect(roundNumberToTwoDecimals(10)).toEqual(10)
      expect(roundNumberToTwoDecimals(0.123)).toEqual(0.12)
    })
  })

  describe('calculateMaxPowerPer15min', () => {
    it('should calculate the max power per 15 minutes', () => {
      expect(calculateMaxPowerPer15min(1000, { indexStart: 0, indexEnd: 3 })).toEqual(250)
      expect(calculateMaxPowerPer15min(500, { indexStart: 2, indexEnd: 5 })).toEqual(125)
      expect(calculateMaxPowerPer15min(0, { indexStart: 0, indexEnd: 0 })).toEqual(0)
    })
  })

  describe('calculateTotalWattsPer15min', () => {
    it('should calculate the total watts per 15 minutes', () => {
      expect(calculateTotalWattsPer15min(250, { indexStart: 0, indexEnd: 3 })).toEqual(1000)
      expect(calculateTotalWattsPer15min(100, { indexStart: 2, indexEnd: 5 })).toEqual(400)
      expect(calculateTotalWattsPer15min(0, { indexStart: 0, indexEnd: 0 })).toEqual(0)
    })
  })

  describe('convertWattsPer15minToWattsPerHour', () => {
    it('should convert watts per 15 minutes to watts per hour', () => {
      expect(convertWattsPer15minToWattsPerHour(250)).toEqual(62.5)
      expect(convertWattsPer15minToWattsPerHour(100)).toEqual(25)
      expect(convertWattsPer15minToWattsPerHour(0)).toEqual(0)
    })
  })

  describe('convertWattsPer15minToKilowattsPerHour', () => {
    it('should convert watts per 15 minutes to kilowatts per hour', () => {
      expect(convertWattsPer15minToKilowattsPerHour(250)).toEqual(0.06)
      expect(convertWattsPer15minToKilowattsPerHour(100)).toEqual(0.03)
      expect(convertWattsPer15minToKilowattsPerHour(0)).toEqual(0)
    })
  })

  describe('getTotalKilowattsPerHour', () => {
    it('should calculate the total kilowatts per hour', () => {
      expect(getTotalKilowattsPerHour(250, { indexStart: 0, indexEnd: 3 })).toEqual(0.25)
      expect(getTotalKilowattsPerHour(100, { indexStart: 2, indexEnd: 5 })).toEqual(0.1)
      expect(getTotalKilowattsPerHour(0, { indexStart: 0, indexEnd: 0 })).toEqual(0)
    })
  })
})

import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  addTimeAmountToHour,
  checkTimeInput,
  compareTwoHours,
  convertIndexesToTimes,
  convertTimesToIndexes,
  removeTimeAmountFromHour,
} from './time'

describe('compareTwoHours', () => {
  it('should return -1 when the first hour is earlier than the second hour', () => {
    expect(compareTwoHours('08:00', '09:00')).toBe(-1)
  })

  it('should return 1 when the first hour is later than the second hour', () => {
    expect(compareTwoHours('09:00', '08:00')).toBe(1)
  })

  it('should return 0 when the two hours are the same', () => {
    expect(compareTwoHours('08:00', '08:00')).toBe(0)
  })
})

describe('removeTimeAmountFromHour', () => {
  it('should subtract the time amount from the hour', () => {
    expect(removeTimeAmountFromHour('08:00', '01:30')).toBe('06:30')
  })

  it('should handle cases where the minutes go negative', () => {
    expect(removeTimeAmountFromHour('08:00', '01:45')).toBe('06:15')
  })

  it('should handle cases where the hours go negative', () => {
    expect(removeTimeAmountFromHour('01:30', '02:00')).toBe('00:00')
  })
})

describe('addTimeAmountToHour', () => {
  it('should add the time amount to the hour', () => {
    expect(addTimeAmountToHour('08:00', '01:30')).toBe('09:30')
  })

  it('should handle cases where the minutes go over 60', () => {
    expect(addTimeAmountToHour('08:00', '01:45')).toBe('09:45')
  })

  it('should handle cases where the hours go over 24', () => {
    expect(addTimeAmountToHour('23:45', '01:00')).toBe('23:45')
  })
})

describe('convertIndexesToTimes', () => {
  it('should convert the start and end indexes to times', () => {
    expect(convertIndexesToTimes(0, 3)).toEqual({ timeStart: '00:00', timeEnd: '01:00' })
  })
})

describe('convertTimesToIndexes', () => {
  it('should convert the start and end times to indexes', () => {
    expect(convertTimesToIndexes('00:00', '01:00')).toEqual({ indexStart: 0, indexEnd: 3 })
  })
})

describe('checkTimeInput', () => {
  it('should return true when the input is valid', () => {
    expect(checkTimeInput('08:00', '09:00')).toBe(true)
  })

  it('should return false when either time is empty', () => {
    expect(checkTimeInput('', '09:00')).toBe(false)
    expect(checkTimeInput('08:00', '')).toBe(false)
  })

  it('should return false when the start time is after the end time', () => {
    expect(checkTimeInput('09:00', '08:00')).toBe(false)
  })

  it('should return false when either index is out of range', () => {
    expect(checkTimeInput('00:00', '25:00')).toBe(false)
    // TODO : Change the function to take into account this behavior:
    // expect(checkTimeInput('08:00', '08:60')).toBe(false)
  })
})

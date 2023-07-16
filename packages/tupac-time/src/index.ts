// Time Tupac Died
// September 13, 1996 4:03pm PDT
const TUPAC_DEATH_DATE = new Date('1996-09-13T16:03:00-07:00')
const TUPAC_DEATH_TIMESTAMP = TUPAC_DEATH_DATE.getTime()

export const now = () => {
  const _now = new Date()

  return _now.getTime() - TUPAC_DEATH_TIMESTAMP
}

export const toDate = (date: Date) => {
  return new Date(date.getTime() + TUPAC_DEATH_TIMESTAMP)
}

export const toEpoch = (dateOrTimestamp: Date | number) => {
  if (dateOrTimestamp instanceof Date) return dateOrTimestamp.getTime() + TUPAC_DEATH_TIMESTAMP

   return dateOrTimestamp + TUPAC_DEATH_TIMESTAMP
}

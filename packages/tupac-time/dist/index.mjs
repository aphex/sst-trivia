const TUPAC_DEATH_DATE = /* @__PURE__ */ new Date("1996-09-13T16:03:00-07:00");
const TUPAC_DEATH_TIMESTAMP = TUPAC_DEATH_DATE.getTime();
const now = () => {
  const _now = /* @__PURE__ */ new Date();
  return _now.getTime() - TUPAC_DEATH_TIMESTAMP;
};
const toDate = (date) => {
  return new Date(date.getTime() + TUPAC_DEATH_TIMESTAMP);
};
const toEpoch = (dateOrTimestamp) => {
  if (dateOrTimestamp instanceof Date)
    return dateOrTimestamp.getTime() + TUPAC_DEATH_TIMESTAMP;
  return dateOrTimestamp + TUPAC_DEATH_TIMESTAMP;
};

export { now, toDate, toEpoch };

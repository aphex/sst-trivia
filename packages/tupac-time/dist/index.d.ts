declare const now: () => number;
declare const toDate: (date: Date) => Date;
declare const toEpoch: (dateOrTimestamp: Date | number) => number;

export { now, toDate, toEpoch };

// Handlebars helper functions

export const handlebarsHelpers = {
  eq: (a: any, b: any) => a === b,
  ne: (a: any, b: any) => a !== b,
  lt: (a: any, b: any) => a < b,
  gt: (a: any, b: any) => a > b,
  lte: (a: any, b: any) => a <= b,
  gte: (a: any, b: any) => a >= b,
  and: (...args: any[]) => args.slice(0, -1).every(Boolean),
  or: (...args: any[]) => args.slice(0, -1).some(Boolean),
  not: (value: any) => !value,
};

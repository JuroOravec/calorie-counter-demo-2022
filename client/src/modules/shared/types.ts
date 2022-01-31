export type PartialFields<TObj, TKeys extends keyof TObj> = Omit<TObj, TKeys> &
  Partial<Pick<TObj, TKeys>>;

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type Merge<T1, T2> = Prettify<Omit<T1, keyof T2> & T2>;

type OtherString = string & NonNullable<unknown>;

export type { Merge, OtherString, Prettify };

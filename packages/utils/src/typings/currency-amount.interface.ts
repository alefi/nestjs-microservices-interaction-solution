import type { Currency } from './currency.enum';

export interface ICurrencyAmount<T extends Currency = Currency> {
  readonly currency: T;
  readonly amount?: string;
}

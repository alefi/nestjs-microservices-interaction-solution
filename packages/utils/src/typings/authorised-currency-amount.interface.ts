import { Currency } from './currency.enum';

export interface IAuthorisedCurrencyAmount<T extends Currency = Currency> {
  readonly currency: T;
  readonly authorisedAmount?: string;
}

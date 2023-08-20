/* eslint-disable */

export const protobufPackage = "struct.v1";

export interface CurrencyAmount {
  currency: string;
  amount: string;
}

export interface GetEntityById {
  id: string;
}

export interface OperationResult {
  id: string;
  status?: string | undefined;
}

export const STRUCT_V1_PACKAGE_NAME = "struct.v1";

import {ErrorHoldingSnapshot} from './abstract-snapshot';

export interface TransactionResult extends ErrorHoldingSnapshot{
  ids : number[];
}

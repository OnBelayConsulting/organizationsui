import { Injectable } from '@angular/core';
import {CodeItem} from '../../../models/code.model';
import {SearchOperator} from '../../../models/search-column.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  dealStatusCodeItems: CodeItem[] = [
    {label: 'Pending', code: 'Pending'},
    {label: 'Verified', code: 'Verified'},
    {label: 'Suspended', code: 'Suspended'}
  ]


  buySellCodeItems: CodeItem[] = [
    {label: 'Buy', code: 'BUY'},
    {label: 'Sell', code: 'SELL'},
  ]


  private searchOperatorListItems: { label: string; value: string; type: string}[] = [
    { label: '=', value: "=", type: "all" },
    { label: '!=', value: "!=" , type: "all"},
    { label: 'contains', value: "CONTAINS", type: "s" },
    { label: 'starts with', value: "startsWith", type: "s" },
    { label: '>', value: ">", type: "dn" },
    { label: '>=', value: ">=", type: "dn" },
    { label: '<', value: "<", type: "dn" },
    { label: '<=', value: "<=", type: "dn" },
  ];

  getSearchOperators(columnType: string) {
    switch (columnType) {
      case "TEXT": {
        return this.searchOperatorListItems
          .filter( (item)=> item.type === "s" || item.type === "all");
      }
      case "DATE": {
        return this.searchOperatorListItems
          .filter( (item)=> item.type != "s");
      }
      default : {
        return this.searchOperatorListItems
          .filter( (item)=> item.type != "s");
      }
    }
  }

  codeManagerMap = new Map<string, CodeItem[]>();

  constructor() {
    this.codeManagerMap.set("DealStatusCode", this.dealStatusCodeItems);
    this.codeManagerMap.set("BuySellCode", this.buySellCodeItems);
  }

  getCodeItems(codeFamily: string) : CodeItem[] {
    if (this.codeManagerMap.has(codeFamily))
      return this.codeManagerMap.get(codeFamily)!;
    else
      return  [];
  }
}

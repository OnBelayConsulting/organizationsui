import {computed, signal} from '@angular/core';
import {CodeItem} from '../../../models/code.model';
import {SearchColumnModel} from '../../../models/search-column.model';

export abstract class AbstractSearchService {

  codeManagerMap = new Map<string, CodeItem[]>();

  selectionCriteria = signal<string>('');
  filterCriteria = signal<string>('');
  orderByCriteria= signal<string>('');
  limitSetting = signal<number>(100);

  searchCriteria = computed( () => {
    let builder: string = "";
    let hasWhere = false;
    if ( (this.selectionCriteria() && this.selectionCriteria().length > 0)
      || (this.filterCriteria() && this.filterCriteria().length > 0) ) {
      builder = 'WHERE ' ;
      hasWhere = true;
      if (this.filterCriteria() && this.filterCriteria().length > 0) {
        if (this.selectionCriteria() && this.selectionCriteria().length > 0) {
          builder = builder + '(' + this.filterCriteria() + ') AND (' + this.selectionCriteria() + ')';
        } else {
          builder = builder + this.filterCriteria();
        }
      } else {
        builder = builder + this.selectionCriteria();
      }
    }

    if (this.orderByCriteria() && this.orderByCriteria().length > 0) {
      builder = builder + " ORDER BY " + this.orderByCriteria();
    }
    if (!builder) {
      builder = 'WHERE ';
    }
    return builder;
  })

  constructor(protected initialOrderByValue: string, public searchColumns: SearchColumnModel[]) {
    this.orderByCriteria = signal<string>(this.initialOrderByValue);
  }



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

  getCodeItems(codeFamily: string) : CodeItem[] {
    if (this.codeManagerMap.has(codeFamily))
      return this.codeManagerMap.get(codeFamily)!;
    else
      return  [];
  }

}

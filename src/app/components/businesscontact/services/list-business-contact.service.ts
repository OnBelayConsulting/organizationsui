import {computed, Injectable, signal} from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class ListBusinessContactService {
  selectionCriteria = signal<string>('');
  orderByCriteria = signal<string>("lastName");
  limitSetting = signal<number>(100);

  searchCriteria = computed( () => {
    let builder: string = "";
    if (this.selectionCriteria() && this.selectionCriteria().length > 0) {
      builder = 'WHERE ' + this.selectionCriteria();
      if (this.orderByCriteria() && this.orderByCriteria().length > 0) {
        builder = builder + " ORDER BY " + this.orderByCriteria();
      }
    } else {
      if (this.orderByCriteria() && this.orderByCriteria().length > 0) {
        builder = " ORDER BY " + this.orderByCriteria();
      }
    }
    if (!builder) {
      builder = 'WHERE ';
    }
    return builder;
  })

}

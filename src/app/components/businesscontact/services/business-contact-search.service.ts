import {Injectable} from '@angular/core';
import {AbstractSearchService} from '../../shared/search-services/abstract-search.service';
import {SearchColumnModel} from '../../../models/search-column.model';

@Injectable({
  providedIn: 'root'
})
export class BusinessContactSearchService extends AbstractSearchService {

  constructor() {

  let searchColumns: SearchColumnModel[] = [
      { label: 'firstName', columnName: "firstName", columnType: "TEXT" },
      { label: 'lastName', columnName: "name", columnType: "TEXT" },
      { label: 'email', columnName: "email", columnType: "TEXT" },
    ];
    super('lastName', searchColumns);
  }

}

import {Injectable} from '@angular/core';
import {AbstractSearchService} from '../../shared/search-services/abstract-search.service';
import {SearchColumnModel} from '../../../models/search-column.model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationSearchService extends AbstractSearchService {

  constructor() {

  let searchColumns: SearchColumnModel[] = [
      { label: 'shortName', columnName: "shortName", columnType: "TEXT" },
      { label: 'legalName', columnName: "legalName", columnType: "TEXT" },
    ];
    super('shortName', searchColumns);
  }

}

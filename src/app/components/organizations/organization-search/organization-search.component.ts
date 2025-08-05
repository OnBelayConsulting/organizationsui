import {Component, EventEmitter, input, Output,  signal, effect, inject} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {SearchColumnModel, SearchConfig, SearchOperator} from '../../../models/search-column.model';
import {CodeItem} from '../../../models/code.model';
import {SearchService} from '../../shared/service/search.service';
import {ListOrganizationService} from '../services/list-organizations.service';

@Component({
  selector: 'app-org-search',
  imports: [
    FormsModule
  ],
  templateUrl: './organization-search.component.html',
  styleUrl: './organization-search.component.scss'
})
export class OrganizationSearchComponent {

  listOrganizationService = inject(ListOrganizationService);

  localSelectionCriteria = signal<string>("");
  localOrderByCriteria = signal<string>("");
  localSearchLimit = signal<number>(100);

  searchOperator  = signal<string>("");
  searchValue = signal<string>('');

  searchField = signal<string>("");

  searchService = inject(SearchService);


  public searchColumns: SearchColumnModel[] = [
    { label: 'None', columnName: "none", columnType: "TEXT"},
    { label: 'Short Name', columnName: "shortName", columnType: "TEXT" },
    { label: 'Legal Name', columnName: "legalName", columnType: "TEXT" },
    { label: 'Industry Type', columnName: "industryType", columnType: "TEXT" },
    { label: 'Credit Status', columnName: "creditStatus", columnType: "TEXT" },
  ];


  searchColumn = signal<SearchColumnModel | undefined>(undefined);

  searchCodes = signal<CodeItem[] | undefined>(undefined);

  searchOperatorListItems = signal<SearchOperator[] | undefined>(undefined);

  @Output() close = new EventEmitter<void>();

  constructor() {

    this.localSelectionCriteria.set(this.listOrganizationService.selectionCriteria());
    this.localOrderByCriteria.set(this.listOrganizationService.orderByCriteria());
    this.localSearchLimit.set(this.listOrganizationService.limitSetting());

    effect(() => {
      if (this.searchField()) {
        console.log("field selected: " + this.searchField());
        this.searchColumn.set( this.searchColumns.find( (col) => col.columnName === this.searchField()));
        this.searchOperatorListItems.set(this.searchService.getSearchOperators(this.searchColumn()!.columnType));
        if (this.searchColumn()?.columnType === "CODE") {
          this.searchCodes.set(this.searchService.getCodeItems(this.searchColumn()?.codeEntityName!));
        } else {
          this.searchCodes.set(undefined);
        }
      }
    });

  }

  onAddOpenBracket() {
    this.localSelectionCriteria.update(criteria => criteria + "(");
  }

  onAddCloseBracket() {
    this.localSelectionCriteria.update(criteria => criteria + ")");
  }

  onAddAnd() {
    this.localSelectionCriteria.update(criteria => criteria + " AND ");
  }

  onAddExpression() {
    let stringBuilder = "";
    if (this.searchColumn) {
      stringBuilder = stringBuilder +  this.searchColumn()?.columnName;
    }
    if (this.searchOperator()) {
      stringBuilder = stringBuilder + " " + this.searchOperator();
    }
    if (this.searchValue()) {
      stringBuilder = stringBuilder + " '" + this.searchValue() +"'";
    }
    console.log(stringBuilder);
    if (this.localSelectionCriteria() === 'default') {
      this.localSelectionCriteria.set(stringBuilder);
    } else {
      this.localSelectionCriteria.update((criteria) => criteria + stringBuilder);
    }
    this.searchOperator.set("");
    this.searchValue.set("");
    this.searchField.set("");
    this.searchColumn.set(undefined);
    this.searchCodes.set(undefined);
  }

  onReset() {
    this.localSelectionCriteria.set(this.listOrganizationService.selectionCriteria());
    this.localOrderByCriteria.set(this.listOrganizationService.orderByCriteria());
    this.localSearchLimit.set(this.listOrganizationService.limitSetting());
  }

  onClose() {
    this.listOrganizationService.selectionCriteria.set(this.localSelectionCriteria());
    this.listOrganizationService.orderByCriteria.set(this.localOrderByCriteria());
    this.listOrganizationService.limitSetting.set(this.localSearchLimit());
    this.close.emit();
  }
}

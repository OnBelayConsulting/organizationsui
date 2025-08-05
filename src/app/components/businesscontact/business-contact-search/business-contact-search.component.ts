import {Component, effect, EventEmitter, inject, Output, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SearchService} from '../../shared/service/search.service';
import {SearchColumnModel, SearchOperator} from '../../../models/search-column.model';
import {CodeItem} from '../../../models/code.model';
import {ListBusinessContactService} from '../services/list-business-contact.service';

@Component({
  selector: 'app-contact-search',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './business-contact-search.component.html',
  styleUrl: './business-contact-search.component.scss'
})
export class BusinessContactSearchComponent {

  listBusinessContactService = inject(ListBusinessContactService);

  localSelectionCriteria = signal<string>("");
  localOrderByCriteria = signal<string>("");
  localSearchLimit = signal<number>(100);

  searchOperator  = signal<string>("");
  searchValue = signal<string>('');

  searchField = signal<string>("");

  searchService = inject(SearchService);


  public searchColumns: SearchColumnModel[] = [
    { label: 'None', columnName: "none", columnType: "TEXT"},
    { label: 'first Name', columnName: "firstName", columnType: "TEXT" },
    { label: 'last Name', columnName: "lastName", columnType: "TEXT" },
    { label: 'email', columnName: "email", columnType: "TEXT" },
    { label: 'phone', columnName: "phone", columnType: "TEXT" },
    { label: 'status', columnName: "contactStatus", columnType: "TEXT" },
    { label: 'is Company Trader', columnName: "isCompanyTrader", columnType: "BOOLEAN" },
    { label: 'is Counterparty Trader', columnName: "isCounterpartyTrader", columnType: "BOOLEAN" },
    { label: 'is Administrator', columnName: "isAdministrator", columnType: "BOOLEAN" },
  ];


  searchColumn = signal<SearchColumnModel | undefined>(undefined);

  searchCodes = signal<CodeItem[] | undefined>(undefined);

  searchOperatorListItems = signal<SearchOperator[] | undefined>(undefined);

  @Output() close = new EventEmitter<void>();

  constructor() {

    this.localSelectionCriteria.set(this.listBusinessContactService.selectionCriteria());
    this.localOrderByCriteria.set(this.listBusinessContactService.orderByCriteria());
    this.localSearchLimit.set(this.listBusinessContactService.limitSetting());

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
    this.localSelectionCriteria.set(this.listBusinessContactService.selectionCriteria());
    this.localOrderByCriteria.set(this.listBusinessContactService.orderByCriteria());
    this.localSearchLimit.set(this.listBusinessContactService.limitSetting());
  }

  onClose() {
    this.listBusinessContactService.selectionCriteria.set(this.localSelectionCriteria());
    this.listBusinessContactService.orderByCriteria.set(this.localOrderByCriteria());
    this.listBusinessContactService.limitSetting.set(this.localSearchLimit());
    this.close.emit();
  }

}

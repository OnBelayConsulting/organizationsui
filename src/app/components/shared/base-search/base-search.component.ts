import {Component, effect, output, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SearchColumnModel, SearchOperator} from '../../../models/search-column.model';
import {CodeItem} from '../../../models/code.model';
import {AbstractSearchService} from '../search-services/abstract-search.service';

@Component({
  selector: 'app-base-search',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './base-search.component.html',
  styleUrl: './base-search.component.scss'
})
export class BaseSearchComponent {
  public localSelectionCriteria = signal<string>("");
  public localOrderByCriteria = signal<string>("");
  public localSearchLimit = signal<number>(100);

  public searchOperator  = signal<string>("");
  public searchValue = signal<string>('');

  public searchField = signal<string>("");


  public searchColumn = signal<SearchColumnModel | undefined>(undefined);

  public searchCodes = signal<CodeItem[] | undefined>(undefined);

  public searchOperatorListItems = signal<SearchOperator[] | undefined>(undefined);

  search = output<void>();
  cancel = output<void>();

  constructor( public searchService : AbstractSearchService) {

    this.localSelectionCriteria.set(this.searchService.selectionCriteria());
    this.localOrderByCriteria.set(this.searchService.orderByCriteria());
    this.localSearchLimit.set(this.searchService.limitSetting());

    effect(() => {
      if (this.searchField()) {
        console.log("field selected: " + this.searchField());
        this.searchColumn.set( this.searchService.searchColumns.find( (col) => col.columnName === this.searchField()));
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
    this.localSelectionCriteria.set('');
    this.localOrderByCriteria.set(this.searchService.orderByCriteria());
    this.localSearchLimit.set(this.searchService.limitSetting());
  }

  onClose() {
    this.searchService.selectionCriteria.set(this.localSelectionCriteria());
    this.searchService.orderByCriteria.set(this.localOrderByCriteria());
    this.searchService.limitSetting.set(this.localSearchLimit());
    this.search.emit();
  }

  onCancel() {
    this.cancel.emit();
  }

}

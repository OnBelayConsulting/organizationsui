import {Component, inject} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BaseSearchComponent} from '../../shared/base-search/base-search.component';
import {BusinessContactSearchService} from '../services/business-contact-search.service';

@Component({
  selector: 'app-contact-search',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: '../../shared/base-search/base-search.component.html',
  styleUrl: '../../shared/base-search/base-search.component.scss'
})
export class BusinessContactSearchComponent  extends BaseSearchComponent {
  constructor() {
    super(inject(BusinessContactSearchService));
  }
}

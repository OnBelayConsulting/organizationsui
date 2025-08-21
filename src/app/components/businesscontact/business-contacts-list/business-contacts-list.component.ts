import {Component, DestroyRef, effect, inject, signal} from '@angular/core';
import {BusinessContactService} from '../services/business-contact.service';
import {BusinessContactSnapshotCollection} from '../model/business-contact.model';
import {RouterLink} from '@angular/router';
import {HasRolesDirective} from 'keycloak-angular';
import {BusinessContactSearchComponent} from '../business-contact-search/business-contact-search.component';
import {TransactionResult} from '../../../models/transactionresult.model';
import {BusinessContactSearchService} from '../services/business-contact-search.service';

@Component({
  selector: 'app-list-business-contacts',
  imports: [
    RouterLink,
    BusinessContactSearchComponent
  ],
  templateUrl: './business-contacts-list.component.html',
  styleUrl: './business-contacts-list.component.scss'
})
export class BusinessContactsListComponent {
  businessContactService = inject(BusinessContactService);
  businessContactSearchService = inject(BusinessContactSearchService);

  selectedBusinessContactId: number | undefined = undefined;
  businessContactCollection :BusinessContactSnapshotCollection | undefined = undefined;
  showSearchFields = signal<boolean>(false);

  transactionResult : TransactionResult | undefined = undefined;

  showNext: boolean = false;
  showPrev: boolean = false;

  destroyRef = inject(DestroyRef);


  constructor() {
    effect(() => {
      let subscription  =this.businessContactService.findBusinessContacts(
        this.businessContactSearchService.searchCriteria(),
        0,
        this.businessContactSearchService.limitSetting()).subscribe({
        next: (data) => {
          this.businessContactCollection = data;
          this.setNextAndPrev()
        },
        error: err => console.log(err)
      });

      this.destroyRef.onDestroy( () => subscription.unsubscribe());

    });
  }



  onSelected(entityId: number) {
    this.selectedBusinessContactId = entityId;
  }

  private setNextAndPrev() {
    if (this.businessContactCollection) {
      if (this.businessContactCollection.start === 0) {
        this.showPrev = false;
      } else {
        this.showPrev = true;
      }
      let currentPosition = this.businessContactCollection.start + this.businessContactCollection.count;
      if (currentPosition < this.businessContactCollection.totalItems) {
        this.showNext = true;
      } else {
        this.showNext = false;
      }

    }
  }

  startSearch() {
    let subscription  =this.businessContactService.findBusinessContacts(
      this.businessContactSearchService.searchCriteria(),
      0,
      this.businessContactSearchService.limitSetting()).subscribe({
      next: (data) => {
        this.businessContactCollection = data;
        this.setNextAndPrev()
      },
      error: err => console.log(err)
    });

    this.destroyRef.onDestroy( () => subscription.unsubscribe());
  }


  onSynchronizeContacts() {
    let subscription  =this.businessContactService.synchronizeBusinessContacts().subscribe({
      next: (data) => {
        this.transactionResult = data;
      },
      error: err => console.log(err)
    });

    this.destroyRef.onDestroy( () => subscription.unsubscribe());
  }


  onNext() {
    let currentPosition = this.businessContactCollection!.start + this.businessContactCollection!.count;

    let subscription  =this.businessContactService.findBusinessContacts(
      this.businessContactSearchService.searchCriteria(),
      currentPosition,
      this.businessContactCollection!.limit
    ).subscribe({
      next: (data) => {
        this.businessContactCollection = data;
        this.setNextAndPrev()
      },
      error: err => console.log(err)
    });

    this.destroyRef.onDestroy( () => subscription.unsubscribe());
  }


  onPrev() {
    let newStart = this.businessContactCollection!.start - this.businessContactCollection!.limit;
    if (newStart < 0)
      newStart = 0;

    let subscription  =this.businessContactService.findBusinessContacts(
      this.businessContactSearchService.searchCriteria(),
      newStart,
      this.businessContactCollection!.limit
    ).subscribe({
      next: (data) => {
        this.businessContactCollection = data;
        this.setNextAndPrev()
      },
      error: err => console.log(err)
    });

    this.destroyRef.onDestroy( () => subscription.unsubscribe());
  }
  onClose() {
    this.showSearchFields.set(false);
    this.startSearch();
  }


  onShowSearch() {
    this.showSearchFields.set(true);
  }

  onSearchCancel() {
    this.showSearchFields.set(false);
  }
}

import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {OrganizationService} from '../services/organization.service';
import {Router, RouterLink} from '@angular/router';
import {OrganizationSnapshotCollection} from '../model/organization.model';
import {OrganizationSearchComponent} from '../organization-search/organization-search.component';
import {HasRolesDirective} from 'keycloak-angular';
import {OrganizationSearchService} from '../services/organization-search.service';
import {TransactionResult} from '../../../models/transactionresult.model';

@Component({
  selector: 'app-organizations',
  imports: [
    RouterLink,
    OrganizationSearchComponent,
    HasRolesDirective
  ],
  templateUrl: './organizations-list.component.html',
  styleUrl: './organizations-list.component.scss'
})
export class OrganizationsListComponent implements  OnInit{
  private organizationService = inject(OrganizationService);
  private router = inject(Router);
  organizationSearchService = inject(OrganizationSearchService);
  transactionResult : TransactionResult | undefined = undefined;

  selectedOrganizationId: number | undefined = undefined;

  organizationCollection: OrganizationSnapshotCollection | undefined = undefined;
  showSearchFields = signal<boolean>(false);

  showNext: boolean = false;
  showPrev: boolean = false;

  destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.startSearch();
  }




  onSelected(entityId: number) {
    this.selectedOrganizationId = entityId;
  }

  private setNextAndPrev() {
    if (this.organizationCollection) {
      if (this.organizationCollection.start === 0) {
        this.showPrev = false;
      } else {
        this.showPrev = true;
      }
      let currentPosition = this.organizationCollection.start + this.organizationCollection.count;
      if (currentPosition < this.organizationCollection.totalItems) {
        this.showNext = true;
      } else {
        this.showNext = false;
      }

    }
  }

  startSearch() {
    let subscription  =this.organizationService.findOrganizations(
      this.organizationSearchService.searchCriteria(),
      0,
      this.organizationSearchService.limitSetting()).subscribe({
      next: (data) => {
        this.organizationCollection = data;
        this.setNextAndPrev()
      },
      error: err => console.log(err)
    });

    this.destroyRef.onDestroy( () => subscription.unsubscribe());
  }


  onNext() {
    let currentPosition = this.organizationCollection!.start + this.organizationCollection!.count;

    let subscription  =this.organizationService.findOrganizations(
      this.organizationSearchService.searchCriteria(),
      currentPosition,
      this.organizationCollection!.limit
      ).subscribe({
      next: (data) => {
        this.organizationCollection = data;
        this.setNextAndPrev()
      },
      error: err => console.log(err)
    });

    this.destroyRef.onDestroy( () => subscription.unsubscribe());
  }


  onPrev() {
    let newStart = this.organizationCollection!.start - this.organizationCollection!.limit;
    if (newStart < 0)
      newStart = 0;

    let subscription  =this.organizationService.findOrganizations(
      this.organizationSearchService.searchCriteria(),
      newStart,
      this.organizationCollection!.limit
    ).subscribe({
      next: (data) => {
        this.organizationCollection = data;
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


  onCancelSearch() {
    this.showSearchFields.set(false);
  }

  onSynchronizeOrganizations() {
    let subscription  =this.organizationService.synchronizeOrganizations().subscribe({
      next: (data) => {
        this.transactionResult = data;
      },
      error: err => console.log(err)
    });

    this.destroyRef.onDestroy( () => subscription.unsubscribe());
  }


  onShowSearch() {
    this.showSearchFields.set(true);

  }
}

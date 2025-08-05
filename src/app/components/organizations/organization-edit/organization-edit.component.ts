import {Component, DestroyRef, inject, input, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from '@angular/router';
import {OrganizationService} from '../../../services/organization.service';
import {OrganizationSnapshot} from '../model/organization.model';
import {TransactionResult} from '../../../models/transactionresult.model';

@Component({
  selector: 'app-organization-edit',
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './organization-edit.component.html',
  styleUrl: './organization-edit.component.scss'
})
export class OrganizationEditComponent implements OnInit {
  router = inject(Router);
  organizationService = inject(OrganizationService);
  destroyRef = inject(DestroyRef);

  organizationId = input<number | undefined>(undefined);

  transactionResult: TransactionResult | undefined = undefined;

  private modifiedSnapshot: OrganizationSnapshot = {
    entityState: 'NEW',
    entityId: {
      id: undefined
    },
    version: -1,
    detail: {
      shortName: undefined,
      legalName: undefined,
      creditStatusCodeValue: undefined,
      industryTypeCodeValue: undefined
    }
  }


  myForm = new FormGroup({

    shortName: new FormControl<string | undefined>(undefined, {
      validators: [
        Validators.required,
      ],
    }),
    legalName: new FormControl<string | undefined>(undefined, {
      validators: [
        Validators.required,
      ],
    }),
    industryType: new FormControl<string | undefined>(undefined, {
      validators: [
        Validators.required,
      ],
    }),
    creditStatus: new FormControl<string | undefined>(undefined, {
      validators: [
        Validators.required,
      ],
    })


  });

  ngOnInit(): void {
    if (this.organizationId()) {
      let subscriber = this.organizationService.findOrganizationById(this.organizationId()!).subscribe( {
        next: organizationSnapshot => {
          if (organizationSnapshot) {
            this.modifiedSnapshot.entityState = 'UNMODIFIED';
            this.modifiedSnapshot.version = organizationSnapshot.version;
            this.modifiedSnapshot.entityId = {
              id: organizationSnapshot.entityId!.id
            };
            this.myForm.controls.shortName.setValue(organizationSnapshot.detail!.shortName!);
            this.myForm.controls.legalName.setValue(organizationSnapshot.detail?.legalName!);

            this.myForm.controls.industryType.setValue(organizationSnapshot.detail!.industryTypeCodeValue);
            this.myForm.controls.creditStatus.setValue(organizationSnapshot.detail!.creditStatusCodeValue);
          } else {
            this.router.navigate(['organizations', 'list']);

          }
        },
        error: err => {
          this.router.navigate(['organizations', 'list']);
        }
      });

      this.destroyRef.onDestroy(subscriber.unsubscribe);

    }

  }


  onReset() {
    this.router.navigate(['organizations', 'list']);
  }


  onSubmit() {
    console.log(this.myForm);
    if (this.myForm.invalid) {
      console.log("invalid form");
    } else {
      let wasModified = false;
      if (this.myForm.controls.shortName.dirty && this.myForm.controls.shortName.value != null) {
        this.modifiedSnapshot.detail!.shortName = this.myForm.controls.shortName.value;
        wasModified = true;
      }
      if (this.myForm.controls.legalName.dirty && this.myForm.controls.legalName.value != null) {
        this.modifiedSnapshot!.detail!.legalName = this.myForm.controls.legalName.value;
        wasModified = true;
      }
      if (this.myForm.controls.industryType.dirty && this.myForm.controls.industryType.value != null) {
        this.modifiedSnapshot!.detail!.industryTypeCodeValue = this.myForm.controls.industryType.value;
        wasModified = true;
      }
      if (this.myForm.controls.creditStatus.dirty && this.myForm.controls.creditStatus.value != null) {
        this.modifiedSnapshot!.detail!.creditStatusCodeValue = this.myForm.controls.creditStatus.value;
        wasModified = true;
      }
      this.submitOrganization(wasModified);
    }
  }

  private submitOrganization(wasModified: boolean) {
    if (wasModified && this.modifiedSnapshot!.entityState === 'UNMODIFIED') {
      this.modifiedSnapshot.entityState = 'MODIFIED';
    }
    let subscription = this.organizationService.saveOrganization(this.modifiedSnapshot!).subscribe({
      next: (data) => {this.transactionResult = data},
      error: (error: Error) => {console.log(error.message)}
    });

    this.destroyRef.onDestroy( () => subscription.unsubscribe());

  }


}

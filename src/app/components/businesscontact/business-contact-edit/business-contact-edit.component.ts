import {Component, DestroyRef, inject, input, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from '@angular/router';
import {TransactionResult} from '../../../models/transactionresult.model';
import {BusinessContactService} from '../services/business-contact.service';
import {BusinessContactSnapshot} from '../model/business-contact.model';

@Component({
  selector: 'app-business-contact-edit',
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './business-contact-edit.component.html',
  styleUrl: './business-contact-edit.component.scss'
})
export class BusinessContactEditComponent implements OnInit{
  router = inject(Router);
  businessContactService = inject(BusinessContactService);
  destroyRef = inject(DestroyRef);

  businessContactId = input<number>(-1);

  transactionResult: TransactionResult | undefined = undefined;

  private modifiedSnapshot: BusinessContactSnapshot = {
    entityState: 'NEW',
    entityId: {
      id: undefined
    },
    version: -1,
    detail: {
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      phone: undefined,
      contactStatusCodeValue: undefined,
      isAdministrator: undefined,
      isCompanyTrader: undefined,
      isCounterpartyTrader: undefined
    }
  }


  myForm = new FormGroup({

    firstName: new FormControl<string | undefined>(undefined, {
      validators: [
        Validators.required,
      ],
    }),
    lastName: new FormControl<string | undefined>(undefined, {
      validators: [
        Validators.required,
      ],
    }),
    email: new FormControl<string | undefined>(undefined, {
      validators: [
        Validators.required,
        Validators.email
      ],
    }),
    contactStatus: new FormControl<string | undefined>(undefined, {
      validators: [
        Validators.required,
      ],
    }),
    phone: new FormControl<string | undefined>(undefined, {
    }),
    isCompanyTrader: new FormControl<boolean>(false, {
      validators: [
        Validators.required,
      ],
    }),
    isCounterpartyTrader: new FormControl<boolean>(false, {
      validators: [
        Validators.required,
      ],
    }),
    isAdministrator: new FormControl<boolean>(false, {
      validators: [
        Validators.required,
      ],
    })


  });

  ngOnInit(): void {
    if (this.businessContactId && this.businessContactId() > 0) {
      let subscriber = this.businessContactService.findBusinessContactById(this.businessContactId()).subscribe( {
        next: businessContactSnapshot => {
          if (businessContactSnapshot) {
            this.modifiedSnapshot.entityState = 'UNMODIFIED';
            this.modifiedSnapshot.version = businessContactSnapshot.version;
            this.modifiedSnapshot.entityId = {
              id: businessContactSnapshot.entityId!.id
            };
            this.modifiedSnapshot.detail!.isAdministrator = businessContactSnapshot.detail?.isAdministrator;
            this.modifiedSnapshot.detail!.isCounterpartyTrader = businessContactSnapshot.detail?.isCounterpartyTrader;
            this.modifiedSnapshot.detail!.isCompanyTrader = businessContactSnapshot.detail?.isCompanyTrader;

            this.myForm.controls.firstName.setValue(businessContactSnapshot.detail!.firstName!);

            if (businessContactSnapshot.detail?.lastName)
              this.myForm.controls.lastName.setValue(businessContactSnapshot.detail?.lastName!);

            this.myForm.controls.email.setValue(businessContactSnapshot.detail!.email);
            this.myForm.controls.contactStatus.setValue(businessContactSnapshot.detail!.contactStatusCodeValue);

            if (businessContactSnapshot.detail?.phone) {
              this.myForm.controls.phone.setValue(businessContactSnapshot.detail.phone);
            }
            this.myForm.controls.isAdministrator.setValue(businessContactSnapshot.detail!.isAdministrator!);
            this.myForm.controls.isCounterpartyTrader.setValue(businessContactSnapshot.detail!.isCounterpartyTrader!);
            this.myForm.controls.isCompanyTrader.setValue(businessContactSnapshot.detail!.isCompanyTrader!);
          } else {
            this.router.navigate(['businesscontacts', 'list']);

          }
        },
        error: err => {
          this.router.navigate(['businesscontacts', 'list']);
        }
      });

      this.destroyRef.onDestroy(subscriber.unsubscribe);

    } else { // needed for checkbox to work.
      this.modifiedSnapshot.detail!.isAdministrator = false;
      this.modifiedSnapshot.detail!.isCompanyTrader = false;
      this.modifiedSnapshot.detail!.isCounterpartyTrader = false;
    }

  }


  onReset() {
    this.router.navigate(['businesscontacts', 'list']);
  }


  onSubmit() {
    console.log(this.myForm);
    if (this.myForm.invalid) {
      console.log("invalid form");
    } else {
      let wasModified = false;
      if (this.myForm.controls.firstName.dirty) {
        if (this.myForm.controls.firstName.value)
          this.modifiedSnapshot.detail!.firstName = this.myForm.controls.firstName.value;
        else
          this.modifiedSnapshot.detail!.firstName = null;
        wasModified = true;
      }
      if (this.myForm.controls.lastName.dirty) {
        if (this.myForm.controls.lastName.value)
          this.modifiedSnapshot!.detail!.lastName = this.myForm.controls.lastName.value;
        else
          this.modifiedSnapshot!.detail!.lastName = null;

        wasModified = true;
      }
      if (this.myForm.controls.email.dirty && this.myForm.controls.email.value != null) {
        this.modifiedSnapshot!.detail!.email = this.myForm.controls.email.value;
        wasModified = true;
      }
      if (this.myForm.controls.phone.dirty) {
        if (this.myForm.controls.phone.value)
            this.modifiedSnapshot!.detail!.phone = this.myForm.controls.phone.value;
        else
          this.modifiedSnapshot.detail!.phone = null;
        wasModified = true;
      }
      if (this.myForm.controls.contactStatus.dirty && this.myForm.controls.contactStatus.value != null) {
        this.modifiedSnapshot!.detail!.contactStatusCodeValue = this.myForm.controls.contactStatus.value;
        wasModified = true;
      }
      if (this.myForm.controls.isAdministrator.dirty) {
        if (this.myForm.controls.isAdministrator.value)
          this.modifiedSnapshot!.detail!.isAdministrator = true;
        else
          this.modifiedSnapshot!.detail!.isAdministrator = false;

        wasModified = true;
      }
      if (this.myForm.controls.isCounterpartyTrader.dirty) {
        if (this.myForm.controls.isCounterpartyTrader.value)
          this.modifiedSnapshot!.detail!.isCounterpartyTrader = true;
        else
          this.modifiedSnapshot!.detail!.isCounterpartyTrader = false;
        wasModified = true;
      }
      if (this.myForm.controls.isCompanyTrader.dirty) {
        if ( this.myForm.controls.isCompanyTrader.value)
          this.modifiedSnapshot!.detail!.isCompanyTrader = true;
        else
          this.modifiedSnapshot!.detail!.isCompanyTrader = false;
        wasModified = true;
      }
      this.submitBusinessContact(wasModified);
    }
  }

  private submitBusinessContact(wasModified: boolean) {
    if (wasModified && this.modifiedSnapshot!.entityState === 'UNMODIFIED') {
      this.modifiedSnapshot.entityState = 'MODIFIED';
    }
    let subscription = this.businessContactService.saveBusinessContact(this.modifiedSnapshot!).subscribe({
      next: (data) => {this.transactionResult = data},
      error: (error: Error) => {console.log(error.message)}
    });

    this.destroyRef.onDestroy( () => subscription.unsubscribe());

  }


}

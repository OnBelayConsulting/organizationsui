import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PermissionDeniedComponent } from './components/permission-denied/permission-denied.component';
import { canActivateAuthRole } from './guards/auth-role.guard';
import {OrganizationsListComponent} from './components/organizations/organizations-list/organizations-list.component';
import {OrganizationEditComponent} from './components/organizations/organization-edit/organization-edit.component';
import {
  BusinessContactsListComponent
} from './components/businesscontact/business-contacts-list/business-contacts-list.component';
import {
  BusinessContactEditComponent
} from './components/businesscontact/business-contact-edit/business-contact-edit.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'organizations/list',
    component: OrganizationsListComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'view-orgs' }
  },
  {
    path: 'organizations/edit',
    component: OrganizationEditComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'view-orgs' }

  },
  {
    path: 'businesscontacts/list',
    component: BusinessContactsListComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'view-orgs' }
  },
  {
    path: 'businesscontacts/edit',
    component: BusinessContactEditComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'view-orgs' }
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'see-profile' }
  },
  { path: 'forbidden', component: PermissionDeniedComponent },
  { path: '**', component: NotFoundComponent }
];

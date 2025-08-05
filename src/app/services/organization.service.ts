import { inject, Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';

import {ErrorService} from '../components/shared/service/error.service';
import {
  OrganizationSnapshot, OrganizationSnapshotCollection
} from '../components/organizations/model/organization.model';
import {TransactionResult} from '../models/transactionresult.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private orgURL = 'http://localhost:9100/Organizations/api'
  private http = inject(HttpClient);
  private errorService = inject(ErrorService);



  listOrganizations(): Observable<OrganizationSnapshotCollection> {
    return this.http.get<OrganizationSnapshotCollection>(this.orgURL + '/organizations')
      .pipe(
        catchError( (error: HttpErrorResponse) => {
          console.log(error);
          this.errorService.showError("Fetching organizations failed on", error.error.errorCode, error.message);
          return throwError( () => new Error("Network error occurred."))
        })
      );
  }

  saveOrganization(organization: OrganizationSnapshot): Observable<TransactionResult> {
    return this.http.post<TransactionResult>(this.orgURL + '/organizations', organization)
      .pipe(
        catchError( (error) => {
          console.log(error);
          this.errorService.showError("Save organization failed on", error.error.errorCode, error.message);
          return throwError( () => new Error("Network error occurred."))
        })
      );
  }



  findOrganizations(searchCriteria: string, start: number, limit:number): Observable<OrganizationSnapshotCollection> {
    const options = searchCriteria ?
      { params: new HttpParams().set('query', searchCriteria).set('start', start).set('limit', limit) } : {};
    return this.http.get<OrganizationSnapshotCollection>(this.orgURL + '/organizations', options)
      .pipe(
        catchError( (error) => {
          console.log(error);
          this.errorService.showError("Finding organizations failed on", error.error.errorCode, error.message);
          return throwError( () => new Error("Network error occurred."))
        })
      );
  }


  findOrganizationById(entityId: number): Observable<OrganizationSnapshot> {
    return this.http.get<OrganizationSnapshot>(this.orgURL + '/organizations/' + entityId)
      .pipe(
        catchError( (error) => {
          console.log(error);
          this.errorService.showError("Finding  an organization failed on", error.error.errorCode, error.message);
          return throwError( () => new Error("Network error occurred."))
        })
      );
  }

}

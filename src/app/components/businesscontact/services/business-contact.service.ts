import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {ErrorService} from '../../shared/service/error.service';
import {catchError, Observable, throwError} from 'rxjs';
import {TransactionResult} from '../../../models/transactionresult.model';
import {environment} from '../../../../environments/environment';
import {
  BusinessContactSnapshot,
  BusinessContactSnapshotCollection
} from '../model/business-contact.model';

@Injectable({
  providedIn: 'root'
})
export class BusinessContactService {
  private http = inject(HttpClient);
  private errorService = inject(ErrorService);



  listBusinessContacts(): Observable<BusinessContactSnapshotCollection> {
    return this.http.get<BusinessContactSnapshotCollection>(environment.orgAppUrl + '/businessContacts')
      .pipe(
        catchError( (error: HttpErrorResponse) => {
          console.log(error);
          this.errorService.showError("Fetching business contacts failed on", error.error.errorCode, error.message);
          return throwError( () => new Error("Network error occurred."))
        })
      );
  }

  saveBusinessContact(organization: BusinessContactSnapshot): Observable<TransactionResult> {
    return this.http.post<TransactionResult>(environment.orgAppUrl + '/businessContacts', organization)
      .pipe(
        catchError( (error) => {
          console.log(error);
          this.errorService.showError("Save business contact failed on", error.error.errorCode, error.message);
          return throwError( () => new Error("Network error occurred."))
        })
      );
  }


  synchronizeBusinessContacts(): Observable<TransactionResult> {
    return this.http.post<TransactionResult>(environment.orgAppUrl + '/businessContacts/sync', {})
      .pipe(
        catchError( (error) => {
          console.log(error);
          this.errorService.showError("Sync on business contact failed on", error.error.errorCode, error.message);
          return throwError( () => new Error("Network error occurred."))
        })
      );
  }




  findBusinessContacts(searchCriteria: string, start: number, limit:number): Observable<BusinessContactSnapshotCollection> {
    const options = searchCriteria ?
      { params: new HttpParams().set('query', searchCriteria).set('start', start).set('limit', limit) } : {};
    return this.http.get<BusinessContactSnapshotCollection>(environment.orgAppUrl + '/businessContacts', options)
      .pipe(
        catchError( (error) => {
          console.log(error);
          this.errorService.showError("Finding business contacts failed on", error.error.errorCode, error.message);
          return throwError( () => new Error("Network error occurred."))
        })
      );
  }


  findBusinessContactById(entityId: number): Observable<BusinessContactSnapshot> {
    return this.http.get<BusinessContactSnapshot>(environment.orgAppUrl + '/businessContacts/' + entityId)
      .pipe(
        catchError( (error) => {
          console.log(error);
          this.errorService.showError("Finding a business contact failed on", error.error.errorCode, error.message);
          return throwError( () => new Error("Network error occurred."))
        })
      );
  }
}

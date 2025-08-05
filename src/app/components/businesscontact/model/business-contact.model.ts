import {AbstractSnapshot, AbstractSnapshotCollection} from '../../../models/abstract-snapshot';

export interface BusinessContactSnapshot extends AbstractSnapshot{

  detail? : {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
    contactStatusCodeValue?: string | null;
    isCompanyTrader?: boolean | null;
    isCounterpartyTrader?: boolean | null;
    isAdministrator?: boolean | null;
  }

}

export interface BusinessContactSnapshotCollection extends AbstractSnapshotCollection<BusinessContactSnapshot>{

}

import {AbstractSnapshot, AbstractSnapshotCollection} from '../../../models/abstract-snapshot';


export interface OrganizationSnapshot extends AbstractSnapshot{

  detail? : {
    shortName?: string | null;
    legalName?: string | null;
    industryTypeCodeValue?: string | null;
    creditStatusCodeValue?: string | null;
  }

}

export interface OrganizationSnapshotCollection extends AbstractSnapshotCollection<OrganizationSnapshot>{

}

export interface SearchColumnModel {

  label : string;
  columnName: string;
  columnType:  "TEXT"| "DATE"| "CODE" | "BOOLEAN";
  codeEntityName?: string;
}

export interface SearchConfig {
searchCriteria: string;
limit: number;
}

export interface SearchOperator {
  label: string;
  value: string;
}

export type Roles = 'admin' | 'teacher' | 'student';

export interface DbQuery {
  queryText: string;
  values: any[];
}

export type ISODateString = string;
export type PathString = string;

export enum STATE {
  ACTIVE,
  STATE_UNSPECIFIED,
  DELETED,
}

export interface KEYINFO<T = unknown> {
  path: PathString;
  createTime: ISODateString;
  revisionCreateTime: ISODateString;
  revisionId: string;
  state: keyof typeof STATE;
  etag: string;
  id: string;
  users: string[];
  attributes: object;
  value: T;
}

export interface DATASTORE_ENTRIES {
  dataStoreEntries: KEYINFO[];
  nextPageToken: string;
}
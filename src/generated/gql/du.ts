import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigDecimal: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  Bytes: { input: any; output: any; }
  Int8: { input: any; output: any; }
  Timestamp: { input: any; output: any; }
};

export enum Aggregation_Interval {
  Day = 'day',
  Hour = 'hour'
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export enum BucketType {
  Day = 'DAY',
  Hour = 'HOUR'
}

export type DataUnion = {
  __typename?: 'DataUnion';
  creationDate: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  memberCount: Scalars['Int']['output'];
  members: Array<Member>;
  owner: Scalars['String']['output'];
  revenueWei: Scalars['BigInt']['output'];
  totalWeight: Scalars['BigDecimal']['output'];
};


export type DataUnionMembersArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Member_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Member_Filter>;
};

export type DataUnionStatsBucket = {
  __typename?: 'DataUnionStatsBucket';
  dataUnion: DataUnion;
  endDate: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  memberCountAtStart: Scalars['Int']['output'];
  memberCountChange: Scalars['Int']['output'];
  revenueAtStartWei: Scalars['BigInt']['output'];
  revenueChangeWei: Scalars['BigInt']['output'];
  startDate: Scalars['BigInt']['output'];
  totalWeightAtStart: Scalars['BigDecimal']['output'];
  totalWeightChange: Scalars['BigDecimal']['output'];
  type: BucketType;
};

export type DataUnionStatsBucket_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<DataUnionStatsBucket_Filter>>>;
  dataUnion?: InputMaybe<Scalars['String']['input']>;
  dataUnion_?: InputMaybe<DataUnion_Filter>;
  dataUnion_contains?: InputMaybe<Scalars['String']['input']>;
  dataUnion_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  dataUnion_ends_with?: InputMaybe<Scalars['String']['input']>;
  dataUnion_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dataUnion_gt?: InputMaybe<Scalars['String']['input']>;
  dataUnion_gte?: InputMaybe<Scalars['String']['input']>;
  dataUnion_in?: InputMaybe<Array<Scalars['String']['input']>>;
  dataUnion_lt?: InputMaybe<Scalars['String']['input']>;
  dataUnion_lte?: InputMaybe<Scalars['String']['input']>;
  dataUnion_not?: InputMaybe<Scalars['String']['input']>;
  dataUnion_not_contains?: InputMaybe<Scalars['String']['input']>;
  dataUnion_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  dataUnion_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  dataUnion_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dataUnion_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  dataUnion_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  dataUnion_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dataUnion_starts_with?: InputMaybe<Scalars['String']['input']>;
  dataUnion_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['BigInt']['input']>;
  endDate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  endDate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  endDate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endDate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  endDate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  endDate_not?: InputMaybe<Scalars['BigInt']['input']>;
  endDate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  memberCountAtStart?: InputMaybe<Scalars['Int']['input']>;
  memberCountAtStart_gt?: InputMaybe<Scalars['Int']['input']>;
  memberCountAtStart_gte?: InputMaybe<Scalars['Int']['input']>;
  memberCountAtStart_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  memberCountAtStart_lt?: InputMaybe<Scalars['Int']['input']>;
  memberCountAtStart_lte?: InputMaybe<Scalars['Int']['input']>;
  memberCountAtStart_not?: InputMaybe<Scalars['Int']['input']>;
  memberCountAtStart_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  memberCountChange?: InputMaybe<Scalars['Int']['input']>;
  memberCountChange_gt?: InputMaybe<Scalars['Int']['input']>;
  memberCountChange_gte?: InputMaybe<Scalars['Int']['input']>;
  memberCountChange_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  memberCountChange_lt?: InputMaybe<Scalars['Int']['input']>;
  memberCountChange_lte?: InputMaybe<Scalars['Int']['input']>;
  memberCountChange_not?: InputMaybe<Scalars['Int']['input']>;
  memberCountChange_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<DataUnionStatsBucket_Filter>>>;
  revenueAtStartWei?: InputMaybe<Scalars['BigInt']['input']>;
  revenueAtStartWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  revenueAtStartWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  revenueAtStartWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  revenueAtStartWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  revenueAtStartWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  revenueAtStartWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  revenueAtStartWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  revenueChangeWei?: InputMaybe<Scalars['BigInt']['input']>;
  revenueChangeWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  revenueChangeWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  revenueChangeWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  revenueChangeWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  revenueChangeWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  revenueChangeWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  revenueChangeWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startDate?: InputMaybe<Scalars['BigInt']['input']>;
  startDate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  startDate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  startDate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startDate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  startDate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  startDate_not?: InputMaybe<Scalars['BigInt']['input']>;
  startDate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalWeightAtStart?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalWeightAtStart_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalWeightAtStart_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalWeightAtStart_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalWeightAtStart_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalWeightAtStart_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalWeightAtStart_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalWeightAtStart_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalWeightChange?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalWeightChange_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalWeightChange_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalWeightChange_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalWeightChange_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalWeightChange_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalWeightChange_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalWeightChange_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  type?: InputMaybe<BucketType>;
  type_in?: InputMaybe<Array<BucketType>>;
  type_not?: InputMaybe<BucketType>;
  type_not_in?: InputMaybe<Array<BucketType>>;
};

export enum DataUnionStatsBucket_OrderBy {
  DataUnion = 'dataUnion',
  DataUnionCreationDate = 'dataUnion__creationDate',
  DataUnionId = 'dataUnion__id',
  DataUnionMemberCount = 'dataUnion__memberCount',
  DataUnionOwner = 'dataUnion__owner',
  DataUnionRevenueWei = 'dataUnion__revenueWei',
  DataUnionTotalWeight = 'dataUnion__totalWeight',
  EndDate = 'endDate',
  Id = 'id',
  MemberCountAtStart = 'memberCountAtStart',
  MemberCountChange = 'memberCountChange',
  RevenueAtStartWei = 'revenueAtStartWei',
  RevenueChangeWei = 'revenueChangeWei',
  StartDate = 'startDate',
  TotalWeightAtStart = 'totalWeightAtStart',
  TotalWeightChange = 'totalWeightChange',
  Type = 'type'
}

export type DataUnion_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<DataUnion_Filter>>>;
  creationDate?: InputMaybe<Scalars['BigInt']['input']>;
  creationDate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  creationDate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  creationDate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  creationDate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  creationDate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  creationDate_not?: InputMaybe<Scalars['BigInt']['input']>;
  creationDate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  memberCount?: InputMaybe<Scalars['Int']['input']>;
  memberCount_gt?: InputMaybe<Scalars['Int']['input']>;
  memberCount_gte?: InputMaybe<Scalars['Int']['input']>;
  memberCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  memberCount_lt?: InputMaybe<Scalars['Int']['input']>;
  memberCount_lte?: InputMaybe<Scalars['Int']['input']>;
  memberCount_not?: InputMaybe<Scalars['Int']['input']>;
  memberCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  members_?: InputMaybe<Member_Filter>;
  or?: InputMaybe<Array<InputMaybe<DataUnion_Filter>>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_contains?: InputMaybe<Scalars['String']['input']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_gt?: InputMaybe<Scalars['String']['input']>;
  owner_gte?: InputMaybe<Scalars['String']['input']>;
  owner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_lt?: InputMaybe<Scalars['String']['input']>;
  owner_lte?: InputMaybe<Scalars['String']['input']>;
  owner_not?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  revenueWei?: InputMaybe<Scalars['BigInt']['input']>;
  revenueWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  revenueWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  revenueWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  revenueWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  revenueWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  revenueWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  revenueWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalWeight?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalWeight_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalWeight_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalWeight_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalWeight_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalWeight_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalWeight_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalWeight_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export enum DataUnion_OrderBy {
  CreationDate = 'creationDate',
  Id = 'id',
  MemberCount = 'memberCount',
  Members = 'members',
  Owner = 'owner',
  RevenueWei = 'revenueWei',
  TotalWeight = 'totalWeight'
}

export type Member = {
  __typename?: 'Member';
  address: Scalars['String']['output'];
  dataUnion: DataUnion;
  id: Scalars['ID']['output'];
  joinDate: Scalars['BigInt']['output'];
  status: MemberStatus;
  weight: Scalars['BigDecimal']['output'];
};

export enum MemberStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  None = 'NONE'
}

export type Member_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  address_gt?: InputMaybe<Scalars['String']['input']>;
  address_gte?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<Scalars['String']['input']>>;
  address_lt?: InputMaybe<Scalars['String']['input']>;
  address_lte?: InputMaybe<Scalars['String']['input']>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  and?: InputMaybe<Array<InputMaybe<Member_Filter>>>;
  dataUnion?: InputMaybe<Scalars['String']['input']>;
  dataUnion_?: InputMaybe<DataUnion_Filter>;
  dataUnion_contains?: InputMaybe<Scalars['String']['input']>;
  dataUnion_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  dataUnion_ends_with?: InputMaybe<Scalars['String']['input']>;
  dataUnion_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dataUnion_gt?: InputMaybe<Scalars['String']['input']>;
  dataUnion_gte?: InputMaybe<Scalars['String']['input']>;
  dataUnion_in?: InputMaybe<Array<Scalars['String']['input']>>;
  dataUnion_lt?: InputMaybe<Scalars['String']['input']>;
  dataUnion_lte?: InputMaybe<Scalars['String']['input']>;
  dataUnion_not?: InputMaybe<Scalars['String']['input']>;
  dataUnion_not_contains?: InputMaybe<Scalars['String']['input']>;
  dataUnion_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  dataUnion_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  dataUnion_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dataUnion_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  dataUnion_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  dataUnion_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dataUnion_starts_with?: InputMaybe<Scalars['String']['input']>;
  dataUnion_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  joinDate?: InputMaybe<Scalars['BigInt']['input']>;
  joinDate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  joinDate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  joinDate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  joinDate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  joinDate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  joinDate_not?: InputMaybe<Scalars['BigInt']['input']>;
  joinDate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Member_Filter>>>;
  status?: InputMaybe<MemberStatus>;
  status_in?: InputMaybe<Array<MemberStatus>>;
  status_not?: InputMaybe<MemberStatus>;
  status_not_in?: InputMaybe<Array<MemberStatus>>;
  weight?: InputMaybe<Scalars['BigDecimal']['input']>;
  weight_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  weight_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  weight_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  weight_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  weight_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  weight_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  weight_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export enum Member_OrderBy {
  Address = 'address',
  DataUnion = 'dataUnion',
  DataUnionCreationDate = 'dataUnion__creationDate',
  DataUnionId = 'dataUnion__id',
  DataUnionMemberCount = 'dataUnion__memberCount',
  DataUnionOwner = 'dataUnion__owner',
  DataUnionRevenueWei = 'dataUnion__revenueWei',
  DataUnionTotalWeight = 'dataUnion__totalWeight',
  Id = 'id',
  JoinDate = 'joinDate',
  Status = 'status',
  Weight = 'weight'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  dataUnion?: Maybe<DataUnion>;
  dataUnionStatsBucket?: Maybe<DataUnionStatsBucket>;
  dataUnionStatsBuckets: Array<DataUnionStatsBucket>;
  dataUnions: Array<DataUnion>;
  member?: Maybe<Member>;
  members: Array<Member>;
  revenueEvent?: Maybe<RevenueEvent>;
  revenueEvents: Array<RevenueEvent>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryDataUnionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDataUnionStatsBucketArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDataUnionStatsBucketsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DataUnionStatsBucket_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DataUnionStatsBucket_Filter>;
};


export type QueryDataUnionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DataUnion_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DataUnion_Filter>;
};


export type QueryMemberArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMembersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Member_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Member_Filter>;
};


export type QueryRevenueEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRevenueEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RevenueEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RevenueEvent_Filter>;
};

export type RevenueEvent = {
  __typename?: 'RevenueEvent';
  amountWei: Scalars['BigInt']['output'];
  dataUnion: DataUnion;
  date: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
};

export type RevenueEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amountWei?: InputMaybe<Scalars['BigInt']['input']>;
  amountWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amountWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amountWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amountWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amountWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amountWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  amountWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<RevenueEvent_Filter>>>;
  dataUnion?: InputMaybe<Scalars['String']['input']>;
  dataUnion_?: InputMaybe<DataUnion_Filter>;
  dataUnion_contains?: InputMaybe<Scalars['String']['input']>;
  dataUnion_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  dataUnion_ends_with?: InputMaybe<Scalars['String']['input']>;
  dataUnion_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dataUnion_gt?: InputMaybe<Scalars['String']['input']>;
  dataUnion_gte?: InputMaybe<Scalars['String']['input']>;
  dataUnion_in?: InputMaybe<Array<Scalars['String']['input']>>;
  dataUnion_lt?: InputMaybe<Scalars['String']['input']>;
  dataUnion_lte?: InputMaybe<Scalars['String']['input']>;
  dataUnion_not?: InputMaybe<Scalars['String']['input']>;
  dataUnion_not_contains?: InputMaybe<Scalars['String']['input']>;
  dataUnion_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  dataUnion_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  dataUnion_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dataUnion_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  dataUnion_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  dataUnion_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dataUnion_starts_with?: InputMaybe<Scalars['String']['input']>;
  dataUnion_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['BigInt']['input']>;
  date_gt?: InputMaybe<Scalars['BigInt']['input']>;
  date_gte?: InputMaybe<Scalars['BigInt']['input']>;
  date_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  date_lt?: InputMaybe<Scalars['BigInt']['input']>;
  date_lte?: InputMaybe<Scalars['BigInt']['input']>;
  date_not?: InputMaybe<Scalars['BigInt']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<RevenueEvent_Filter>>>;
};

export enum RevenueEvent_OrderBy {
  AmountWei = 'amountWei',
  DataUnion = 'dataUnion',
  DataUnionCreationDate = 'dataUnion__creationDate',
  DataUnionId = 'dataUnion__id',
  DataUnionMemberCount = 'dataUnion__memberCount',
  DataUnionOwner = 'dataUnion__owner',
  DataUnionRevenueWei = 'dataUnion__revenueWei',
  DataUnionTotalWeight = 'dataUnion__totalWeight',
  Date = 'date',
  Id = 'id'
}

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  dataUnion?: Maybe<DataUnion>;
  dataUnionStatsBucket?: Maybe<DataUnionStatsBucket>;
  dataUnionStatsBuckets: Array<DataUnionStatsBucket>;
  dataUnions: Array<DataUnion>;
  member?: Maybe<Member>;
  members: Array<Member>;
  revenueEvent?: Maybe<RevenueEvent>;
  revenueEvents: Array<RevenueEvent>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionDataUnionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDataUnionStatsBucketArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDataUnionStatsBucketsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DataUnionStatsBucket_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DataUnionStatsBucket_Filter>;
};


export type SubscriptionDataUnionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DataUnion_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DataUnion_Filter>;
};


export type SubscriptionMemberArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMembersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Member_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Member_Filter>;
};


export type SubscriptionRevenueEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionRevenueEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RevenueEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RevenueEvent_Filter>;
};

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
  /** The hash of the parent block */
  parentHash?: Maybe<Scalars['Bytes']['output']>;
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']['output']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String']['output'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']['output'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type DataUnionFieldsFragment = { __typename?: 'DataUnion', id: string, owner: string, memberCount: number, revenueWei: any, creationDate: any };

export type GetDataUnionsByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetDataUnionsByIdQuery = { __typename?: 'Query', dataUnions: Array<{ __typename?: 'DataUnion', id: string, owner: string, memberCount: number, revenueWei: any, creationDate: any }> };

export type GetDataUnionsOwnedByQueryVariables = Exact<{
  owner: Scalars['String']['input'];
}>;


export type GetDataUnionsOwnedByQuery = { __typename?: 'Query', dataUnions: Array<{ __typename?: 'DataUnion', id: string, owner: string, memberCount: number, revenueWei: any, creationDate: any }> };

export const DataUnionFieldsFragmentDoc = gql`
    fragment DataUnionFields on DataUnion {
  id
  owner
  memberCount
  revenueWei
  creationDate
}
    `;
export const GetDataUnionsByIdDocument = gql`
    query getDataUnionsById($id: ID!) {
  dataUnions(where: {id: $id}) {
    ...DataUnionFields
  }
}
    ${DataUnionFieldsFragmentDoc}`;
export type GetDataUnionsByIdQueryResult = Apollo.QueryResult<GetDataUnionsByIdQuery, GetDataUnionsByIdQueryVariables>;
export const GetDataUnionsOwnedByDocument = gql`
    query getDataUnionsOwnedBy($owner: String!) {
  dataUnions(where: {owner: $owner}) {
    ...DataUnionFields
  }
}
    ${DataUnionFieldsFragmentDoc}`;
export type GetDataUnionsOwnedByQueryResult = Apollo.QueryResult<GetDataUnionsOwnedByQuery, GetDataUnionsOwnedByQueryVariables>;
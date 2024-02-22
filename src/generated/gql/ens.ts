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
};

export type AbiChanged = ResolverEvent & {
  __typename?: 'AbiChanged';
  /** The block number at which the event was emitted */
  blockNumber: Scalars['Int']['output'];
  /** The content type of the ABI change */
  contentType: Scalars['BigInt']['output'];
  /** Concatenation of block number and log ID */
  id: Scalars['ID']['output'];
  /** Used to derive relationships to Resolvers */
  resolver: Resolver;
  /** The transaction hash of the transaction in which the event was emitted */
  transactionID: Scalars['Bytes']['output'];
};

export type AbiChanged_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<AbiChanged_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  contentType?: InputMaybe<Scalars['BigInt']['input']>;
  contentType_gt?: InputMaybe<Scalars['BigInt']['input']>;
  contentType_gte?: InputMaybe<Scalars['BigInt']['input']>;
  contentType_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  contentType_lt?: InputMaybe<Scalars['BigInt']['input']>;
  contentType_lte?: InputMaybe<Scalars['BigInt']['input']>;
  contentType_not?: InputMaybe<Scalars['BigInt']['input']>;
  contentType_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<AbiChanged_Filter>>>;
  resolver?: InputMaybe<Scalars['String']['input']>;
  resolver_?: InputMaybe<Resolver_Filter>;
  resolver_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_gt?: InputMaybe<Scalars['String']['input']>;
  resolver_gte?: InputMaybe<Scalars['String']['input']>;
  resolver_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_lt?: InputMaybe<Scalars['String']['input']>;
  resolver_lte?: InputMaybe<Scalars['String']['input']>;
  resolver_not?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum AbiChanged_OrderBy {
  BlockNumber = 'blockNumber',
  ContentType = 'contentType',
  Id = 'id',
  Resolver = 'resolver',
  ResolverAddress = 'resolver__address',
  ResolverContentHash = 'resolver__contentHash',
  ResolverId = 'resolver__id',
  TransactionId = 'transactionID'
}

export type Account = {
  __typename?: 'Account';
  /** The domains owned by the account */
  domains: Array<Domain>;
  /** The unique identifier for the account */
  id: Scalars['ID']['output'];
  /** The Registrations made by the account */
  registrations?: Maybe<Array<Registration>>;
  /** The WrappedDomains owned by the account */
  wrappedDomains?: Maybe<Array<WrappedDomain>>;
};


export type AccountDomainsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Domain_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Domain_Filter>;
};


export type AccountRegistrationsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Registration_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Registration_Filter>;
};


export type AccountWrappedDomainsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WrappedDomain_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<WrappedDomain_Filter>;
};

export type Account_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Account_Filter>>>;
  domains_?: InputMaybe<Domain_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Account_Filter>>>;
  registrations_?: InputMaybe<Registration_Filter>;
  wrappedDomains_?: InputMaybe<WrappedDomain_Filter>;
};

export enum Account_OrderBy {
  Domains = 'domains',
  Id = 'id',
  Registrations = 'registrations',
  WrappedDomains = 'wrappedDomains'
}

export type AddrChanged = ResolverEvent & {
  __typename?: 'AddrChanged';
  /** The new address associated with the resolver */
  addr: Account;
  /** The block number at which this event occurred */
  blockNumber: Scalars['Int']['output'];
  /** Unique identifier for this event */
  id: Scalars['ID']['output'];
  /** The resolver associated with this event */
  resolver: Resolver;
  /** The transaction ID for the transaction in which this event occurred */
  transactionID: Scalars['Bytes']['output'];
};

export type AddrChanged_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  addr?: InputMaybe<Scalars['String']['input']>;
  addr_?: InputMaybe<Account_Filter>;
  addr_contains?: InputMaybe<Scalars['String']['input']>;
  addr_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  addr_ends_with?: InputMaybe<Scalars['String']['input']>;
  addr_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  addr_gt?: InputMaybe<Scalars['String']['input']>;
  addr_gte?: InputMaybe<Scalars['String']['input']>;
  addr_in?: InputMaybe<Array<Scalars['String']['input']>>;
  addr_lt?: InputMaybe<Scalars['String']['input']>;
  addr_lte?: InputMaybe<Scalars['String']['input']>;
  addr_not?: InputMaybe<Scalars['String']['input']>;
  addr_not_contains?: InputMaybe<Scalars['String']['input']>;
  addr_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  addr_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  addr_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  addr_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  addr_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  addr_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  addr_starts_with?: InputMaybe<Scalars['String']['input']>;
  addr_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  and?: InputMaybe<Array<InputMaybe<AddrChanged_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<AddrChanged_Filter>>>;
  resolver?: InputMaybe<Scalars['String']['input']>;
  resolver_?: InputMaybe<Resolver_Filter>;
  resolver_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_gt?: InputMaybe<Scalars['String']['input']>;
  resolver_gte?: InputMaybe<Scalars['String']['input']>;
  resolver_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_lt?: InputMaybe<Scalars['String']['input']>;
  resolver_lte?: InputMaybe<Scalars['String']['input']>;
  resolver_not?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum AddrChanged_OrderBy {
  Addr = 'addr',
  AddrId = 'addr__id',
  BlockNumber = 'blockNumber',
  Id = 'id',
  Resolver = 'resolver',
  ResolverAddress = 'resolver__address',
  ResolverContentHash = 'resolver__contentHash',
  ResolverId = 'resolver__id',
  TransactionId = 'transactionID'
}

export enum Aggregation_Interval {
  Day = 'day',
  Hour = 'hour'
}

export type AuthorisationChanged = ResolverEvent & {
  __typename?: 'AuthorisationChanged';
  /** The block number at which the event occurred */
  blockNumber: Scalars['Int']['output'];
  /** Unique identifier for this event */
  id: Scalars['ID']['output'];
  /** Whether the authorisation was added or removed */
  isAuthorized: Scalars['Boolean']['output'];
  /** The owner of the authorisation */
  owner: Scalars['Bytes']['output'];
  /** The resolver associated with this event */
  resolver: Resolver;
  /** The target of the authorisation */
  target: Scalars['Bytes']['output'];
  /** The transaction hash associated with the event */
  transactionID: Scalars['Bytes']['output'];
};

export type AuthorisationChanged_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<AuthorisationChanged_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isAuthorized?: InputMaybe<Scalars['Boolean']['input']>;
  isAuthorized_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isAuthorized_not?: InputMaybe<Scalars['Boolean']['input']>;
  isAuthorized_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  or?: InputMaybe<Array<InputMaybe<AuthorisationChanged_Filter>>>;
  owner?: InputMaybe<Scalars['Bytes']['input']>;
  owner_contains?: InputMaybe<Scalars['Bytes']['input']>;
  owner_gt?: InputMaybe<Scalars['Bytes']['input']>;
  owner_gte?: InputMaybe<Scalars['Bytes']['input']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  owner_lt?: InputMaybe<Scalars['Bytes']['input']>;
  owner_lte?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  resolver?: InputMaybe<Scalars['String']['input']>;
  resolver_?: InputMaybe<Resolver_Filter>;
  resolver_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_gt?: InputMaybe<Scalars['String']['input']>;
  resolver_gte?: InputMaybe<Scalars['String']['input']>;
  resolver_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_lt?: InputMaybe<Scalars['String']['input']>;
  resolver_lte?: InputMaybe<Scalars['String']['input']>;
  resolver_not?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  target?: InputMaybe<Scalars['Bytes']['input']>;
  target_contains?: InputMaybe<Scalars['Bytes']['input']>;
  target_gt?: InputMaybe<Scalars['Bytes']['input']>;
  target_gte?: InputMaybe<Scalars['Bytes']['input']>;
  target_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  target_lt?: InputMaybe<Scalars['Bytes']['input']>;
  target_lte?: InputMaybe<Scalars['Bytes']['input']>;
  target_not?: InputMaybe<Scalars['Bytes']['input']>;
  target_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  target_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum AuthorisationChanged_OrderBy {
  BlockNumber = 'blockNumber',
  Id = 'id',
  IsAuthorized = 'isAuthorized',
  Owner = 'owner',
  Resolver = 'resolver',
  ResolverAddress = 'resolver__address',
  ResolverContentHash = 'resolver__contentHash',
  ResolverId = 'resolver__id',
  Target = 'target',
  TransactionId = 'transactionID'
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type ContenthashChanged = ResolverEvent & {
  __typename?: 'ContenthashChanged';
  /** The block number where the event occurred */
  blockNumber: Scalars['Int']['output'];
  /** The new content hash for the domain */
  hash: Scalars['Bytes']['output'];
  /** Concatenation of block number and log ID */
  id: Scalars['ID']['output'];
  /** Used to derive relationships to Resolvers */
  resolver: Resolver;
  /** The ID of the transaction where the event occurred */
  transactionID: Scalars['Bytes']['output'];
};

export type ContenthashChanged_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ContenthashChanged_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  hash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  hash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  hash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  hash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ContenthashChanged_Filter>>>;
  resolver?: InputMaybe<Scalars['String']['input']>;
  resolver_?: InputMaybe<Resolver_Filter>;
  resolver_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_gt?: InputMaybe<Scalars['String']['input']>;
  resolver_gte?: InputMaybe<Scalars['String']['input']>;
  resolver_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_lt?: InputMaybe<Scalars['String']['input']>;
  resolver_lte?: InputMaybe<Scalars['String']['input']>;
  resolver_not?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum ContenthashChanged_OrderBy {
  BlockNumber = 'blockNumber',
  Hash = 'hash',
  Id = 'id',
  Resolver = 'resolver',
  ResolverAddress = 'resolver__address',
  ResolverContentHash = 'resolver__contentHash',
  ResolverId = 'resolver__id',
  TransactionId = 'transactionID'
}

export type Domain = {
  __typename?: 'Domain';
  /** The time when the domain was created */
  createdAt: Scalars['BigInt']['output'];
  /** The events associated with the domain */
  events: Array<DomainEvent>;
  /** The expiry date for the domain, from either the registration, or the wrapped domain if PCC is burned */
  expiryDate?: Maybe<Scalars['BigInt']['output']>;
  /** The namehash of the name */
  id: Scalars['ID']['output'];
  /** Indicates whether the domain has been migrated to a new registrar */
  isMigrated: Scalars['Boolean']['output'];
  /** The human readable label name (imported from CSV), if known */
  labelName?: Maybe<Scalars['String']['output']>;
  /** keccak256(labelName) */
  labelhash?: Maybe<Scalars['Bytes']['output']>;
  /** The human readable name, if known. Unknown portions replaced with hash in square brackets (eg, foo.[1234].eth) */
  name?: Maybe<Scalars['String']['output']>;
  /** The account that owns the domain */
  owner: Account;
  /** The namehash (id) of the parent name */
  parent?: Maybe<Domain>;
  /** The account that owns the ERC721 NFT for the domain */
  registrant?: Maybe<Account>;
  /** The registration associated with the domain */
  registration?: Maybe<Registration>;
  /** Address logged from current resolver, if any */
  resolvedAddress?: Maybe<Account>;
  /** The resolver that controls the domain's settings */
  resolver?: Maybe<Resolver>;
  /** The number of subdomains */
  subdomainCount: Scalars['Int']['output'];
  /** Can count domains from length of array */
  subdomains: Array<Domain>;
  /** The time-to-live (TTL) value of the domain's records */
  ttl?: Maybe<Scalars['BigInt']['output']>;
  /** The wrapped domain associated with the domain */
  wrappedDomain?: Maybe<WrappedDomain>;
  /** The account that owns the wrapped domain */
  wrappedOwner?: Maybe<Account>;
};


export type DomainEventsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DomainEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<DomainEvent_Filter>;
};


export type DomainSubdomainsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Domain_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Domain_Filter>;
};

export type DomainEvent = {
  /** The block number at which the event occurred */
  blockNumber: Scalars['Int']['output'];
  /** The domain name associated with the event */
  domain: Domain;
  /** The unique identifier of the event */
  id: Scalars['ID']['output'];
  /** The transaction hash of the transaction that triggered the event */
  transactionID: Scalars['Bytes']['output'];
};

export type DomainEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<DomainEvent_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  domain?: InputMaybe<Scalars['String']['input']>;
  domain_?: InputMaybe<Domain_Filter>;
  domain_contains?: InputMaybe<Scalars['String']['input']>;
  domain_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_gt?: InputMaybe<Scalars['String']['input']>;
  domain_gte?: InputMaybe<Scalars['String']['input']>;
  domain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_lt?: InputMaybe<Scalars['String']['input']>;
  domain_lte?: InputMaybe<Scalars['String']['input']>;
  domain_not?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<DomainEvent_Filter>>>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum DomainEvent_OrderBy {
  BlockNumber = 'blockNumber',
  Domain = 'domain',
  DomainCreatedAt = 'domain__createdAt',
  DomainExpiryDate = 'domain__expiryDate',
  DomainId = 'domain__id',
  DomainIsMigrated = 'domain__isMigrated',
  DomainLabelName = 'domain__labelName',
  DomainLabelhash = 'domain__labelhash',
  DomainName = 'domain__name',
  DomainSubdomainCount = 'domain__subdomainCount',
  DomainTtl = 'domain__ttl',
  Id = 'id',
  TransactionId = 'transactionID'
}

export type Domain_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Domain_Filter>>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  events_?: InputMaybe<DomainEvent_Filter>;
  expiryDate?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  expiryDate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_not?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isMigrated?: InputMaybe<Scalars['Boolean']['input']>;
  isMigrated_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isMigrated_not?: InputMaybe<Scalars['Boolean']['input']>;
  isMigrated_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  labelName?: InputMaybe<Scalars['String']['input']>;
  labelName_contains?: InputMaybe<Scalars['String']['input']>;
  labelName_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  labelName_ends_with?: InputMaybe<Scalars['String']['input']>;
  labelName_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  labelName_gt?: InputMaybe<Scalars['String']['input']>;
  labelName_gte?: InputMaybe<Scalars['String']['input']>;
  labelName_in?: InputMaybe<Array<Scalars['String']['input']>>;
  labelName_lt?: InputMaybe<Scalars['String']['input']>;
  labelName_lte?: InputMaybe<Scalars['String']['input']>;
  labelName_not?: InputMaybe<Scalars['String']['input']>;
  labelName_not_contains?: InputMaybe<Scalars['String']['input']>;
  labelName_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  labelName_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  labelName_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  labelName_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  labelName_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  labelName_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  labelName_starts_with?: InputMaybe<Scalars['String']['input']>;
  labelName_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  labelhash?: InputMaybe<Scalars['Bytes']['input']>;
  labelhash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  labelhash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  labelhash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  labelhash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  labelhash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  labelhash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  labelhash_not?: InputMaybe<Scalars['Bytes']['input']>;
  labelhash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  labelhash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Domain_Filter>>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_?: InputMaybe<Account_Filter>;
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
  parent?: InputMaybe<Scalars['String']['input']>;
  parent_?: InputMaybe<Domain_Filter>;
  parent_contains?: InputMaybe<Scalars['String']['input']>;
  parent_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  parent_ends_with?: InputMaybe<Scalars['String']['input']>;
  parent_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  parent_gt?: InputMaybe<Scalars['String']['input']>;
  parent_gte?: InputMaybe<Scalars['String']['input']>;
  parent_in?: InputMaybe<Array<Scalars['String']['input']>>;
  parent_lt?: InputMaybe<Scalars['String']['input']>;
  parent_lte?: InputMaybe<Scalars['String']['input']>;
  parent_not?: InputMaybe<Scalars['String']['input']>;
  parent_not_contains?: InputMaybe<Scalars['String']['input']>;
  parent_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  parent_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  parent_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  parent_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  parent_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  parent_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  parent_starts_with?: InputMaybe<Scalars['String']['input']>;
  parent_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant?: InputMaybe<Scalars['String']['input']>;
  registrant_?: InputMaybe<Account_Filter>;
  registrant_contains?: InputMaybe<Scalars['String']['input']>;
  registrant_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant_ends_with?: InputMaybe<Scalars['String']['input']>;
  registrant_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant_gt?: InputMaybe<Scalars['String']['input']>;
  registrant_gte?: InputMaybe<Scalars['String']['input']>;
  registrant_in?: InputMaybe<Array<Scalars['String']['input']>>;
  registrant_lt?: InputMaybe<Scalars['String']['input']>;
  registrant_lte?: InputMaybe<Scalars['String']['input']>;
  registrant_not?: InputMaybe<Scalars['String']['input']>;
  registrant_not_contains?: InputMaybe<Scalars['String']['input']>;
  registrant_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  registrant_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  registrant_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  registrant_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant_starts_with?: InputMaybe<Scalars['String']['input']>;
  registrant_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_?: InputMaybe<Registration_Filter>;
  resolvedAddress?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_?: InputMaybe<Account_Filter>;
  resolvedAddress_contains?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_gt?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_gte?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolvedAddress_lt?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_lte?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_not?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolvedAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver?: InputMaybe<Scalars['String']['input']>;
  resolver_?: InputMaybe<Resolver_Filter>;
  resolver_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_gt?: InputMaybe<Scalars['String']['input']>;
  resolver_gte?: InputMaybe<Scalars['String']['input']>;
  resolver_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_lt?: InputMaybe<Scalars['String']['input']>;
  resolver_lte?: InputMaybe<Scalars['String']['input']>;
  resolver_not?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  subdomainCount?: InputMaybe<Scalars['Int']['input']>;
  subdomainCount_gt?: InputMaybe<Scalars['Int']['input']>;
  subdomainCount_gte?: InputMaybe<Scalars['Int']['input']>;
  subdomainCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  subdomainCount_lt?: InputMaybe<Scalars['Int']['input']>;
  subdomainCount_lte?: InputMaybe<Scalars['Int']['input']>;
  subdomainCount_not?: InputMaybe<Scalars['Int']['input']>;
  subdomainCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  subdomains_?: InputMaybe<Domain_Filter>;
  ttl?: InputMaybe<Scalars['BigInt']['input']>;
  ttl_gt?: InputMaybe<Scalars['BigInt']['input']>;
  ttl_gte?: InputMaybe<Scalars['BigInt']['input']>;
  ttl_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  ttl_lt?: InputMaybe<Scalars['BigInt']['input']>;
  ttl_lte?: InputMaybe<Scalars['BigInt']['input']>;
  ttl_not?: InputMaybe<Scalars['BigInt']['input']>;
  ttl_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  wrappedDomain_?: InputMaybe<WrappedDomain_Filter>;
  wrappedOwner?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_?: InputMaybe<Account_Filter>;
  wrappedOwner_contains?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_ends_with?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_gt?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_gte?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  wrappedOwner_lt?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_lte?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_not?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_not_contains?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  wrappedOwner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_starts_with?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Domain_OrderBy {
  CreatedAt = 'createdAt',
  Events = 'events',
  ExpiryDate = 'expiryDate',
  Id = 'id',
  IsMigrated = 'isMigrated',
  LabelName = 'labelName',
  Labelhash = 'labelhash',
  Name = 'name',
  Owner = 'owner',
  OwnerId = 'owner__id',
  Parent = 'parent',
  ParentCreatedAt = 'parent__createdAt',
  ParentExpiryDate = 'parent__expiryDate',
  ParentId = 'parent__id',
  ParentIsMigrated = 'parent__isMigrated',
  ParentLabelName = 'parent__labelName',
  ParentLabelhash = 'parent__labelhash',
  ParentName = 'parent__name',
  ParentSubdomainCount = 'parent__subdomainCount',
  ParentTtl = 'parent__ttl',
  Registrant = 'registrant',
  RegistrantId = 'registrant__id',
  Registration = 'registration',
  RegistrationCost = 'registration__cost',
  RegistrationExpiryDate = 'registration__expiryDate',
  RegistrationId = 'registration__id',
  RegistrationLabelName = 'registration__labelName',
  RegistrationRegistrationDate = 'registration__registrationDate',
  ResolvedAddress = 'resolvedAddress',
  ResolvedAddressId = 'resolvedAddress__id',
  Resolver = 'resolver',
  ResolverAddress = 'resolver__address',
  ResolverContentHash = 'resolver__contentHash',
  ResolverId = 'resolver__id',
  SubdomainCount = 'subdomainCount',
  Subdomains = 'subdomains',
  Ttl = 'ttl',
  WrappedDomain = 'wrappedDomain',
  WrappedDomainExpiryDate = 'wrappedDomain__expiryDate',
  WrappedDomainFuses = 'wrappedDomain__fuses',
  WrappedDomainId = 'wrappedDomain__id',
  WrappedDomainName = 'wrappedDomain__name',
  WrappedOwner = 'wrappedOwner',
  WrappedOwnerId = 'wrappedOwner__id'
}

export type ExpiryExtended = DomainEvent & {
  __typename?: 'ExpiryExtended';
  /** The block number at which the event occurred */
  blockNumber: Scalars['Int']['output'];
  /** The domain name associated with the event */
  domain: Domain;
  /** The new expiry date associated with the domain after the extension event */
  expiryDate: Scalars['BigInt']['output'];
  /** The unique identifier of the event */
  id: Scalars['ID']['output'];
  /** The transaction hash of the transaction that triggered the event */
  transactionID: Scalars['Bytes']['output'];
};

export type ExpiryExtended_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ExpiryExtended_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  domain?: InputMaybe<Scalars['String']['input']>;
  domain_?: InputMaybe<Domain_Filter>;
  domain_contains?: InputMaybe<Scalars['String']['input']>;
  domain_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_gt?: InputMaybe<Scalars['String']['input']>;
  domain_gte?: InputMaybe<Scalars['String']['input']>;
  domain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_lt?: InputMaybe<Scalars['String']['input']>;
  domain_lte?: InputMaybe<Scalars['String']['input']>;
  domain_not?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  expiryDate?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  expiryDate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_not?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ExpiryExtended_Filter>>>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum ExpiryExtended_OrderBy {
  BlockNumber = 'blockNumber',
  Domain = 'domain',
  DomainCreatedAt = 'domain__createdAt',
  DomainExpiryDate = 'domain__expiryDate',
  DomainId = 'domain__id',
  DomainIsMigrated = 'domain__isMigrated',
  DomainLabelName = 'domain__labelName',
  DomainLabelhash = 'domain__labelhash',
  DomainName = 'domain__name',
  DomainSubdomainCount = 'domain__subdomainCount',
  DomainTtl = 'domain__ttl',
  ExpiryDate = 'expiryDate',
  Id = 'id',
  TransactionId = 'transactionID'
}

export type FusesSet = DomainEvent & {
  __typename?: 'FusesSet';
  /** The block number at which the event occurred */
  blockNumber: Scalars['Int']['output'];
  /** The domain name associated with the event */
  domain: Domain;
  /** The number of fuses associated with the domain after the set event */
  fuses: Scalars['Int']['output'];
  /** The unique identifier of the event */
  id: Scalars['ID']['output'];
  /** The transaction hash of the transaction that triggered the event */
  transactionID: Scalars['Bytes']['output'];
};

export type FusesSet_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FusesSet_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  domain?: InputMaybe<Scalars['String']['input']>;
  domain_?: InputMaybe<Domain_Filter>;
  domain_contains?: InputMaybe<Scalars['String']['input']>;
  domain_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_gt?: InputMaybe<Scalars['String']['input']>;
  domain_gte?: InputMaybe<Scalars['String']['input']>;
  domain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_lt?: InputMaybe<Scalars['String']['input']>;
  domain_lte?: InputMaybe<Scalars['String']['input']>;
  domain_not?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fuses?: InputMaybe<Scalars['Int']['input']>;
  fuses_gt?: InputMaybe<Scalars['Int']['input']>;
  fuses_gte?: InputMaybe<Scalars['Int']['input']>;
  fuses_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  fuses_lt?: InputMaybe<Scalars['Int']['input']>;
  fuses_lte?: InputMaybe<Scalars['Int']['input']>;
  fuses_not?: InputMaybe<Scalars['Int']['input']>;
  fuses_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<FusesSet_Filter>>>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum FusesSet_OrderBy {
  BlockNumber = 'blockNumber',
  Domain = 'domain',
  DomainCreatedAt = 'domain__createdAt',
  DomainExpiryDate = 'domain__expiryDate',
  DomainId = 'domain__id',
  DomainIsMigrated = 'domain__isMigrated',
  DomainLabelName = 'domain__labelName',
  DomainLabelhash = 'domain__labelhash',
  DomainName = 'domain__name',
  DomainSubdomainCount = 'domain__subdomainCount',
  DomainTtl = 'domain__ttl',
  Fuses = 'fuses',
  Id = 'id',
  TransactionId = 'transactionID'
}

export type InterfaceChanged = ResolverEvent & {
  __typename?: 'InterfaceChanged';
  /** The block number in which the event occurred */
  blockNumber: Scalars['Int']['output'];
  /** Concatenation of block number and log ID */
  id: Scalars['ID']['output'];
  /** The address of the contract that implements the interface */
  implementer: Scalars['Bytes']['output'];
  /** The ID of the EIP-1820 interface that was changed */
  interfaceID: Scalars['Bytes']['output'];
  /** Used to derive relationships to Resolvers */
  resolver: Resolver;
  /** The transaction ID for the transaction in which the event occurred */
  transactionID: Scalars['Bytes']['output'];
};

export type InterfaceChanged_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<InterfaceChanged_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  implementer?: InputMaybe<Scalars['Bytes']['input']>;
  implementer_contains?: InputMaybe<Scalars['Bytes']['input']>;
  implementer_gt?: InputMaybe<Scalars['Bytes']['input']>;
  implementer_gte?: InputMaybe<Scalars['Bytes']['input']>;
  implementer_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  implementer_lt?: InputMaybe<Scalars['Bytes']['input']>;
  implementer_lte?: InputMaybe<Scalars['Bytes']['input']>;
  implementer_not?: InputMaybe<Scalars['Bytes']['input']>;
  implementer_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  implementer_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  interfaceID?: InputMaybe<Scalars['Bytes']['input']>;
  interfaceID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  interfaceID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  interfaceID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  interfaceID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  interfaceID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  interfaceID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  interfaceID_not?: InputMaybe<Scalars['Bytes']['input']>;
  interfaceID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  interfaceID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  or?: InputMaybe<Array<InputMaybe<InterfaceChanged_Filter>>>;
  resolver?: InputMaybe<Scalars['String']['input']>;
  resolver_?: InputMaybe<Resolver_Filter>;
  resolver_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_gt?: InputMaybe<Scalars['String']['input']>;
  resolver_gte?: InputMaybe<Scalars['String']['input']>;
  resolver_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_lt?: InputMaybe<Scalars['String']['input']>;
  resolver_lte?: InputMaybe<Scalars['String']['input']>;
  resolver_not?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum InterfaceChanged_OrderBy {
  BlockNumber = 'blockNumber',
  Id = 'id',
  Implementer = 'implementer',
  InterfaceId = 'interfaceID',
  Resolver = 'resolver',
  ResolverAddress = 'resolver__address',
  ResolverContentHash = 'resolver__contentHash',
  ResolverId = 'resolver__id',
  TransactionId = 'transactionID'
}

export type MulticoinAddrChanged = ResolverEvent & {
  __typename?: 'MulticoinAddrChanged';
  /** The new address value for the given coin type */
  addr: Scalars['Bytes']['output'];
  /** Block number in which this event was emitted */
  blockNumber: Scalars['Int']['output'];
  /** The coin type of the changed address */
  coinType: Scalars['BigInt']['output'];
  /** Unique identifier for the event */
  id: Scalars['ID']['output'];
  /** Resolver associated with this event */
  resolver: Resolver;
  /** Transaction ID in which this event was emitted */
  transactionID: Scalars['Bytes']['output'];
};

export type MulticoinAddrChanged_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  addr?: InputMaybe<Scalars['Bytes']['input']>;
  addr_contains?: InputMaybe<Scalars['Bytes']['input']>;
  addr_gt?: InputMaybe<Scalars['Bytes']['input']>;
  addr_gte?: InputMaybe<Scalars['Bytes']['input']>;
  addr_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  addr_lt?: InputMaybe<Scalars['Bytes']['input']>;
  addr_lte?: InputMaybe<Scalars['Bytes']['input']>;
  addr_not?: InputMaybe<Scalars['Bytes']['input']>;
  addr_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  addr_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  and?: InputMaybe<Array<InputMaybe<MulticoinAddrChanged_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  coinType?: InputMaybe<Scalars['BigInt']['input']>;
  coinType_gt?: InputMaybe<Scalars['BigInt']['input']>;
  coinType_gte?: InputMaybe<Scalars['BigInt']['input']>;
  coinType_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  coinType_lt?: InputMaybe<Scalars['BigInt']['input']>;
  coinType_lte?: InputMaybe<Scalars['BigInt']['input']>;
  coinType_not?: InputMaybe<Scalars['BigInt']['input']>;
  coinType_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<MulticoinAddrChanged_Filter>>>;
  resolver?: InputMaybe<Scalars['String']['input']>;
  resolver_?: InputMaybe<Resolver_Filter>;
  resolver_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_gt?: InputMaybe<Scalars['String']['input']>;
  resolver_gte?: InputMaybe<Scalars['String']['input']>;
  resolver_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_lt?: InputMaybe<Scalars['String']['input']>;
  resolver_lte?: InputMaybe<Scalars['String']['input']>;
  resolver_not?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum MulticoinAddrChanged_OrderBy {
  Addr = 'addr',
  BlockNumber = 'blockNumber',
  CoinType = 'coinType',
  Id = 'id',
  Resolver = 'resolver',
  ResolverAddress = 'resolver__address',
  ResolverContentHash = 'resolver__contentHash',
  ResolverId = 'resolver__id',
  TransactionId = 'transactionID'
}

export type NameChanged = ResolverEvent & {
  __typename?: 'NameChanged';
  /** Block number where event occurred */
  blockNumber: Scalars['Int']['output'];
  /** Concatenation of block number and log ID */
  id: Scalars['ID']['output'];
  /** New ENS name value */
  name: Scalars['String']['output'];
  /** Used to derive relationships to Resolvers */
  resolver: Resolver;
  /** Unique transaction ID where event occurred */
  transactionID: Scalars['Bytes']['output'];
};

export type NameChanged_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<NameChanged_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<NameChanged_Filter>>>;
  resolver?: InputMaybe<Scalars['String']['input']>;
  resolver_?: InputMaybe<Resolver_Filter>;
  resolver_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_gt?: InputMaybe<Scalars['String']['input']>;
  resolver_gte?: InputMaybe<Scalars['String']['input']>;
  resolver_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_lt?: InputMaybe<Scalars['String']['input']>;
  resolver_lte?: InputMaybe<Scalars['String']['input']>;
  resolver_not?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum NameChanged_OrderBy {
  BlockNumber = 'blockNumber',
  Id = 'id',
  Name = 'name',
  Resolver = 'resolver',
  ResolverAddress = 'resolver__address',
  ResolverContentHash = 'resolver__contentHash',
  ResolverId = 'resolver__id',
  TransactionId = 'transactionID'
}

export type NameRegistered = RegistrationEvent & {
  __typename?: 'NameRegistered';
  /** The block number of the event */
  blockNumber: Scalars['Int']['output'];
  /** The expiry date of the registration */
  expiryDate: Scalars['BigInt']['output'];
  /** The unique identifier of the NameRegistered event */
  id: Scalars['ID']['output'];
  /** The account that registered the name */
  registrant: Account;
  /** The registration associated with the event */
  registration: Registration;
  /** The transaction ID associated with the event */
  transactionID: Scalars['Bytes']['output'];
};

export type NameRegistered_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<NameRegistered_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  expiryDate?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  expiryDate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_not?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<NameRegistered_Filter>>>;
  registrant?: InputMaybe<Scalars['String']['input']>;
  registrant_?: InputMaybe<Account_Filter>;
  registrant_contains?: InputMaybe<Scalars['String']['input']>;
  registrant_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant_ends_with?: InputMaybe<Scalars['String']['input']>;
  registrant_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant_gt?: InputMaybe<Scalars['String']['input']>;
  registrant_gte?: InputMaybe<Scalars['String']['input']>;
  registrant_in?: InputMaybe<Array<Scalars['String']['input']>>;
  registrant_lt?: InputMaybe<Scalars['String']['input']>;
  registrant_lte?: InputMaybe<Scalars['String']['input']>;
  registrant_not?: InputMaybe<Scalars['String']['input']>;
  registrant_not_contains?: InputMaybe<Scalars['String']['input']>;
  registrant_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  registrant_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  registrant_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  registrant_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant_starts_with?: InputMaybe<Scalars['String']['input']>;
  registrant_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registration?: InputMaybe<Scalars['String']['input']>;
  registration_?: InputMaybe<Registration_Filter>;
  registration_contains?: InputMaybe<Scalars['String']['input']>;
  registration_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_ends_with?: InputMaybe<Scalars['String']['input']>;
  registration_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_gt?: InputMaybe<Scalars['String']['input']>;
  registration_gte?: InputMaybe<Scalars['String']['input']>;
  registration_in?: InputMaybe<Array<Scalars['String']['input']>>;
  registration_lt?: InputMaybe<Scalars['String']['input']>;
  registration_lte?: InputMaybe<Scalars['String']['input']>;
  registration_not?: InputMaybe<Scalars['String']['input']>;
  registration_not_contains?: InputMaybe<Scalars['String']['input']>;
  registration_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  registration_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  registration_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  registration_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_starts_with?: InputMaybe<Scalars['String']['input']>;
  registration_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum NameRegistered_OrderBy {
  BlockNumber = 'blockNumber',
  ExpiryDate = 'expiryDate',
  Id = 'id',
  Registrant = 'registrant',
  RegistrantId = 'registrant__id',
  Registration = 'registration',
  RegistrationCost = 'registration__cost',
  RegistrationExpiryDate = 'registration__expiryDate',
  RegistrationId = 'registration__id',
  RegistrationLabelName = 'registration__labelName',
  RegistrationRegistrationDate = 'registration__registrationDate',
  TransactionId = 'transactionID'
}

export type NameRenewed = RegistrationEvent & {
  __typename?: 'NameRenewed';
  /** The block number of the event */
  blockNumber: Scalars['Int']['output'];
  /** The new expiry date of the registration */
  expiryDate: Scalars['BigInt']['output'];
  /** The unique identifier of the NameRenewed event */
  id: Scalars['ID']['output'];
  /** The registration associated with the event */
  registration: Registration;
  /** The transaction ID associated with the event */
  transactionID: Scalars['Bytes']['output'];
};

export type NameRenewed_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<NameRenewed_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  expiryDate?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  expiryDate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_not?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<NameRenewed_Filter>>>;
  registration?: InputMaybe<Scalars['String']['input']>;
  registration_?: InputMaybe<Registration_Filter>;
  registration_contains?: InputMaybe<Scalars['String']['input']>;
  registration_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_ends_with?: InputMaybe<Scalars['String']['input']>;
  registration_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_gt?: InputMaybe<Scalars['String']['input']>;
  registration_gte?: InputMaybe<Scalars['String']['input']>;
  registration_in?: InputMaybe<Array<Scalars['String']['input']>>;
  registration_lt?: InputMaybe<Scalars['String']['input']>;
  registration_lte?: InputMaybe<Scalars['String']['input']>;
  registration_not?: InputMaybe<Scalars['String']['input']>;
  registration_not_contains?: InputMaybe<Scalars['String']['input']>;
  registration_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  registration_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  registration_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  registration_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_starts_with?: InputMaybe<Scalars['String']['input']>;
  registration_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum NameRenewed_OrderBy {
  BlockNumber = 'blockNumber',
  ExpiryDate = 'expiryDate',
  Id = 'id',
  Registration = 'registration',
  RegistrationCost = 'registration__cost',
  RegistrationExpiryDate = 'registration__expiryDate',
  RegistrationId = 'registration__id',
  RegistrationLabelName = 'registration__labelName',
  RegistrationRegistrationDate = 'registration__registrationDate',
  TransactionId = 'transactionID'
}

export type NameTransferred = RegistrationEvent & {
  __typename?: 'NameTransferred';
  /** The block number of the event */
  blockNumber: Scalars['Int']['output'];
  /** The ID of the event */
  id: Scalars['ID']['output'];
  /** The new owner of the domain */
  newOwner: Account;
  /** The registration associated with the event */
  registration: Registration;
  /** The transaction ID of the event */
  transactionID: Scalars['Bytes']['output'];
};

export type NameTransferred_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<NameTransferred_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  newOwner?: InputMaybe<Scalars['String']['input']>;
  newOwner_?: InputMaybe<Account_Filter>;
  newOwner_contains?: InputMaybe<Scalars['String']['input']>;
  newOwner_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  newOwner_ends_with?: InputMaybe<Scalars['String']['input']>;
  newOwner_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  newOwner_gt?: InputMaybe<Scalars['String']['input']>;
  newOwner_gte?: InputMaybe<Scalars['String']['input']>;
  newOwner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  newOwner_lt?: InputMaybe<Scalars['String']['input']>;
  newOwner_lte?: InputMaybe<Scalars['String']['input']>;
  newOwner_not?: InputMaybe<Scalars['String']['input']>;
  newOwner_not_contains?: InputMaybe<Scalars['String']['input']>;
  newOwner_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  newOwner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  newOwner_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  newOwner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  newOwner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  newOwner_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  newOwner_starts_with?: InputMaybe<Scalars['String']['input']>;
  newOwner_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<NameTransferred_Filter>>>;
  registration?: InputMaybe<Scalars['String']['input']>;
  registration_?: InputMaybe<Registration_Filter>;
  registration_contains?: InputMaybe<Scalars['String']['input']>;
  registration_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_ends_with?: InputMaybe<Scalars['String']['input']>;
  registration_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_gt?: InputMaybe<Scalars['String']['input']>;
  registration_gte?: InputMaybe<Scalars['String']['input']>;
  registration_in?: InputMaybe<Array<Scalars['String']['input']>>;
  registration_lt?: InputMaybe<Scalars['String']['input']>;
  registration_lte?: InputMaybe<Scalars['String']['input']>;
  registration_not?: InputMaybe<Scalars['String']['input']>;
  registration_not_contains?: InputMaybe<Scalars['String']['input']>;
  registration_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  registration_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  registration_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  registration_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_starts_with?: InputMaybe<Scalars['String']['input']>;
  registration_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum NameTransferred_OrderBy {
  BlockNumber = 'blockNumber',
  Id = 'id',
  NewOwner = 'newOwner',
  NewOwnerId = 'newOwner__id',
  Registration = 'registration',
  RegistrationCost = 'registration__cost',
  RegistrationExpiryDate = 'registration__expiryDate',
  RegistrationId = 'registration__id',
  RegistrationLabelName = 'registration__labelName',
  RegistrationRegistrationDate = 'registration__registrationDate',
  TransactionId = 'transactionID'
}

export type NameUnwrapped = DomainEvent & {
  __typename?: 'NameUnwrapped';
  /** The block number at which the event occurred */
  blockNumber: Scalars['Int']['output'];
  /** The domain name associated with the event */
  domain: Domain;
  /** The unique identifier of the event */
  id: Scalars['ID']['output'];
  /** The account that owns the domain after it was unwrapped */
  owner: Account;
  /** The transaction hash of the transaction that triggered the event */
  transactionID: Scalars['Bytes']['output'];
};

export type NameUnwrapped_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<NameUnwrapped_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  domain?: InputMaybe<Scalars['String']['input']>;
  domain_?: InputMaybe<Domain_Filter>;
  domain_contains?: InputMaybe<Scalars['String']['input']>;
  domain_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_gt?: InputMaybe<Scalars['String']['input']>;
  domain_gte?: InputMaybe<Scalars['String']['input']>;
  domain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_lt?: InputMaybe<Scalars['String']['input']>;
  domain_lte?: InputMaybe<Scalars['String']['input']>;
  domain_not?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<NameUnwrapped_Filter>>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_?: InputMaybe<Account_Filter>;
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
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum NameUnwrapped_OrderBy {
  BlockNumber = 'blockNumber',
  Domain = 'domain',
  DomainCreatedAt = 'domain__createdAt',
  DomainExpiryDate = 'domain__expiryDate',
  DomainId = 'domain__id',
  DomainIsMigrated = 'domain__isMigrated',
  DomainLabelName = 'domain__labelName',
  DomainLabelhash = 'domain__labelhash',
  DomainName = 'domain__name',
  DomainSubdomainCount = 'domain__subdomainCount',
  DomainTtl = 'domain__ttl',
  Id = 'id',
  Owner = 'owner',
  OwnerId = 'owner__id',
  TransactionId = 'transactionID'
}

export type NameWrapped = DomainEvent & {
  __typename?: 'NameWrapped';
  /** The block number at which the wrapped domain was wrapped */
  blockNumber: Scalars['Int']['output'];
  /** The domain name associated with the wrapped domain */
  domain: Domain;
  /** The expiry date of the wrapped domain registration */
  expiryDate: Scalars['BigInt']['output'];
  /** The number of fuses associated with the wrapped domain */
  fuses: Scalars['Int']['output'];
  /** The unique identifier of the wrapped domain */
  id: Scalars['ID']['output'];
  /** The human-readable name of the wrapped domain */
  name?: Maybe<Scalars['String']['output']>;
  /** The account that owns the wrapped domain */
  owner: Account;
  /** The transaction hash of the transaction that wrapped the domain */
  transactionID: Scalars['Bytes']['output'];
};

export type NameWrapped_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<NameWrapped_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  domain?: InputMaybe<Scalars['String']['input']>;
  domain_?: InputMaybe<Domain_Filter>;
  domain_contains?: InputMaybe<Scalars['String']['input']>;
  domain_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_gt?: InputMaybe<Scalars['String']['input']>;
  domain_gte?: InputMaybe<Scalars['String']['input']>;
  domain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_lt?: InputMaybe<Scalars['String']['input']>;
  domain_lte?: InputMaybe<Scalars['String']['input']>;
  domain_not?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  expiryDate?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  expiryDate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_not?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fuses?: InputMaybe<Scalars['Int']['input']>;
  fuses_gt?: InputMaybe<Scalars['Int']['input']>;
  fuses_gte?: InputMaybe<Scalars['Int']['input']>;
  fuses_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  fuses_lt?: InputMaybe<Scalars['Int']['input']>;
  fuses_lte?: InputMaybe<Scalars['Int']['input']>;
  fuses_not?: InputMaybe<Scalars['Int']['input']>;
  fuses_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<NameWrapped_Filter>>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_?: InputMaybe<Account_Filter>;
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
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum NameWrapped_OrderBy {
  BlockNumber = 'blockNumber',
  Domain = 'domain',
  DomainCreatedAt = 'domain__createdAt',
  DomainExpiryDate = 'domain__expiryDate',
  DomainId = 'domain__id',
  DomainIsMigrated = 'domain__isMigrated',
  DomainLabelName = 'domain__labelName',
  DomainLabelhash = 'domain__labelhash',
  DomainName = 'domain__name',
  DomainSubdomainCount = 'domain__subdomainCount',
  DomainTtl = 'domain__ttl',
  ExpiryDate = 'expiryDate',
  Fuses = 'fuses',
  Id = 'id',
  Name = 'name',
  Owner = 'owner',
  OwnerId = 'owner__id',
  TransactionId = 'transactionID'
}

export type NewOwner = DomainEvent & {
  __typename?: 'NewOwner';
  /** The block number at which the event occurred */
  blockNumber: Scalars['Int']['output'];
  /** The domain name associated with the event */
  domain: Domain;
  /** The unique identifier of the event */
  id: Scalars['ID']['output'];
  /** The new account that owns the domain */
  owner: Account;
  /** The parent domain of the domain name associated with the event */
  parentDomain: Domain;
  /** The transaction hash of the transaction that triggered the event */
  transactionID: Scalars['Bytes']['output'];
};

export type NewOwner_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<NewOwner_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  domain?: InputMaybe<Scalars['String']['input']>;
  domain_?: InputMaybe<Domain_Filter>;
  domain_contains?: InputMaybe<Scalars['String']['input']>;
  domain_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_gt?: InputMaybe<Scalars['String']['input']>;
  domain_gte?: InputMaybe<Scalars['String']['input']>;
  domain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_lt?: InputMaybe<Scalars['String']['input']>;
  domain_lte?: InputMaybe<Scalars['String']['input']>;
  domain_not?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<NewOwner_Filter>>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_?: InputMaybe<Account_Filter>;
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
  parentDomain?: InputMaybe<Scalars['String']['input']>;
  parentDomain_?: InputMaybe<Domain_Filter>;
  parentDomain_contains?: InputMaybe<Scalars['String']['input']>;
  parentDomain_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  parentDomain_ends_with?: InputMaybe<Scalars['String']['input']>;
  parentDomain_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  parentDomain_gt?: InputMaybe<Scalars['String']['input']>;
  parentDomain_gte?: InputMaybe<Scalars['String']['input']>;
  parentDomain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  parentDomain_lt?: InputMaybe<Scalars['String']['input']>;
  parentDomain_lte?: InputMaybe<Scalars['String']['input']>;
  parentDomain_not?: InputMaybe<Scalars['String']['input']>;
  parentDomain_not_contains?: InputMaybe<Scalars['String']['input']>;
  parentDomain_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  parentDomain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  parentDomain_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  parentDomain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  parentDomain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  parentDomain_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  parentDomain_starts_with?: InputMaybe<Scalars['String']['input']>;
  parentDomain_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum NewOwner_OrderBy {
  BlockNumber = 'blockNumber',
  Domain = 'domain',
  DomainCreatedAt = 'domain__createdAt',
  DomainExpiryDate = 'domain__expiryDate',
  DomainId = 'domain__id',
  DomainIsMigrated = 'domain__isMigrated',
  DomainLabelName = 'domain__labelName',
  DomainLabelhash = 'domain__labelhash',
  DomainName = 'domain__name',
  DomainSubdomainCount = 'domain__subdomainCount',
  DomainTtl = 'domain__ttl',
  Id = 'id',
  Owner = 'owner',
  OwnerId = 'owner__id',
  ParentDomain = 'parentDomain',
  ParentDomainCreatedAt = 'parentDomain__createdAt',
  ParentDomainExpiryDate = 'parentDomain__expiryDate',
  ParentDomainId = 'parentDomain__id',
  ParentDomainIsMigrated = 'parentDomain__isMigrated',
  ParentDomainLabelName = 'parentDomain__labelName',
  ParentDomainLabelhash = 'parentDomain__labelhash',
  ParentDomainName = 'parentDomain__name',
  ParentDomainSubdomainCount = 'parentDomain__subdomainCount',
  ParentDomainTtl = 'parentDomain__ttl',
  TransactionId = 'transactionID'
}

export type NewResolver = DomainEvent & {
  __typename?: 'NewResolver';
  /** The block number at which the event occurred */
  blockNumber: Scalars['Int']['output'];
  /** The domain name associated with the event */
  domain: Domain;
  /** The unique identifier of the event */
  id: Scalars['ID']['output'];
  /** The new resolver contract address associated with the domain */
  resolver: Resolver;
  /** The transaction hash of the transaction that triggered the event */
  transactionID: Scalars['Bytes']['output'];
};

export type NewResolver_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<NewResolver_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  domain?: InputMaybe<Scalars['String']['input']>;
  domain_?: InputMaybe<Domain_Filter>;
  domain_contains?: InputMaybe<Scalars['String']['input']>;
  domain_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_gt?: InputMaybe<Scalars['String']['input']>;
  domain_gte?: InputMaybe<Scalars['String']['input']>;
  domain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_lt?: InputMaybe<Scalars['String']['input']>;
  domain_lte?: InputMaybe<Scalars['String']['input']>;
  domain_not?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<NewResolver_Filter>>>;
  resolver?: InputMaybe<Scalars['String']['input']>;
  resolver_?: InputMaybe<Resolver_Filter>;
  resolver_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_gt?: InputMaybe<Scalars['String']['input']>;
  resolver_gte?: InputMaybe<Scalars['String']['input']>;
  resolver_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_lt?: InputMaybe<Scalars['String']['input']>;
  resolver_lte?: InputMaybe<Scalars['String']['input']>;
  resolver_not?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum NewResolver_OrderBy {
  BlockNumber = 'blockNumber',
  Domain = 'domain',
  DomainCreatedAt = 'domain__createdAt',
  DomainExpiryDate = 'domain__expiryDate',
  DomainId = 'domain__id',
  DomainIsMigrated = 'domain__isMigrated',
  DomainLabelName = 'domain__labelName',
  DomainLabelhash = 'domain__labelhash',
  DomainName = 'domain__name',
  DomainSubdomainCount = 'domain__subdomainCount',
  DomainTtl = 'domain__ttl',
  Id = 'id',
  Resolver = 'resolver',
  ResolverAddress = 'resolver__address',
  ResolverContentHash = 'resolver__contentHash',
  ResolverId = 'resolver__id',
  TransactionId = 'transactionID'
}

export type NewTtl = DomainEvent & {
  __typename?: 'NewTTL';
  /** The block number at which the event occurred */
  blockNumber: Scalars['Int']['output'];
  /** The domain name associated with the event */
  domain: Domain;
  /** The unique identifier of the event */
  id: Scalars['ID']['output'];
  /** The transaction hash of the transaction that triggered the event */
  transactionID: Scalars['Bytes']['output'];
  /** The new TTL value (in seconds) associated with the domain */
  ttl: Scalars['BigInt']['output'];
};

export type NewTtl_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<NewTtl_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  domain?: InputMaybe<Scalars['String']['input']>;
  domain_?: InputMaybe<Domain_Filter>;
  domain_contains?: InputMaybe<Scalars['String']['input']>;
  domain_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_gt?: InputMaybe<Scalars['String']['input']>;
  domain_gte?: InputMaybe<Scalars['String']['input']>;
  domain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_lt?: InputMaybe<Scalars['String']['input']>;
  domain_lte?: InputMaybe<Scalars['String']['input']>;
  domain_not?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<NewTtl_Filter>>>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  ttl?: InputMaybe<Scalars['BigInt']['input']>;
  ttl_gt?: InputMaybe<Scalars['BigInt']['input']>;
  ttl_gte?: InputMaybe<Scalars['BigInt']['input']>;
  ttl_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  ttl_lt?: InputMaybe<Scalars['BigInt']['input']>;
  ttl_lte?: InputMaybe<Scalars['BigInt']['input']>;
  ttl_not?: InputMaybe<Scalars['BigInt']['input']>;
  ttl_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum NewTtl_OrderBy {
  BlockNumber = 'blockNumber',
  Domain = 'domain',
  DomainCreatedAt = 'domain__createdAt',
  DomainExpiryDate = 'domain__expiryDate',
  DomainId = 'domain__id',
  DomainIsMigrated = 'domain__isMigrated',
  DomainLabelName = 'domain__labelName',
  DomainLabelhash = 'domain__labelhash',
  DomainName = 'domain__name',
  DomainSubdomainCount = 'domain__subdomainCount',
  DomainTtl = 'domain__ttl',
  Id = 'id',
  TransactionId = 'transactionID',
  Ttl = 'ttl'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type PubkeyChanged = ResolverEvent & {
  __typename?: 'PubkeyChanged';
  /** Block number of the Ethereum block where the event occurred */
  blockNumber: Scalars['Int']['output'];
  /** Concatenation of block number and log ID */
  id: Scalars['ID']['output'];
  /** Used to derive relationships to Resolvers */
  resolver: Resolver;
  /** Transaction hash of the Ethereum transaction where the event occurred */
  transactionID: Scalars['Bytes']['output'];
  /** The x-coordinate of the new public key */
  x: Scalars['Bytes']['output'];
  /** The y-coordinate of the new public key */
  y: Scalars['Bytes']['output'];
};

export type PubkeyChanged_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PubkeyChanged_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PubkeyChanged_Filter>>>;
  resolver?: InputMaybe<Scalars['String']['input']>;
  resolver_?: InputMaybe<Resolver_Filter>;
  resolver_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_gt?: InputMaybe<Scalars['String']['input']>;
  resolver_gte?: InputMaybe<Scalars['String']['input']>;
  resolver_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_lt?: InputMaybe<Scalars['String']['input']>;
  resolver_lte?: InputMaybe<Scalars['String']['input']>;
  resolver_not?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  x?: InputMaybe<Scalars['Bytes']['input']>;
  x_contains?: InputMaybe<Scalars['Bytes']['input']>;
  x_gt?: InputMaybe<Scalars['Bytes']['input']>;
  x_gte?: InputMaybe<Scalars['Bytes']['input']>;
  x_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  x_lt?: InputMaybe<Scalars['Bytes']['input']>;
  x_lte?: InputMaybe<Scalars['Bytes']['input']>;
  x_not?: InputMaybe<Scalars['Bytes']['input']>;
  x_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  x_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  y?: InputMaybe<Scalars['Bytes']['input']>;
  y_contains?: InputMaybe<Scalars['Bytes']['input']>;
  y_gt?: InputMaybe<Scalars['Bytes']['input']>;
  y_gte?: InputMaybe<Scalars['Bytes']['input']>;
  y_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  y_lt?: InputMaybe<Scalars['Bytes']['input']>;
  y_lte?: InputMaybe<Scalars['Bytes']['input']>;
  y_not?: InputMaybe<Scalars['Bytes']['input']>;
  y_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  y_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum PubkeyChanged_OrderBy {
  BlockNumber = 'blockNumber',
  Id = 'id',
  Resolver = 'resolver',
  ResolverAddress = 'resolver__address',
  ResolverContentHash = 'resolver__contentHash',
  ResolverId = 'resolver__id',
  TransactionId = 'transactionID',
  X = 'x',
  Y = 'y'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  abiChanged?: Maybe<AbiChanged>;
  abiChangeds: Array<AbiChanged>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  addrChanged?: Maybe<AddrChanged>;
  addrChangeds: Array<AddrChanged>;
  authorisationChanged?: Maybe<AuthorisationChanged>;
  authorisationChangeds: Array<AuthorisationChanged>;
  contenthashChanged?: Maybe<ContenthashChanged>;
  contenthashChangeds: Array<ContenthashChanged>;
  domain?: Maybe<Domain>;
  domainEvent?: Maybe<DomainEvent>;
  domainEvents: Array<DomainEvent>;
  domains: Array<Domain>;
  expiryExtended?: Maybe<ExpiryExtended>;
  expiryExtendeds: Array<ExpiryExtended>;
  fusesSet?: Maybe<FusesSet>;
  fusesSets: Array<FusesSet>;
  interfaceChanged?: Maybe<InterfaceChanged>;
  interfaceChangeds: Array<InterfaceChanged>;
  multicoinAddrChanged?: Maybe<MulticoinAddrChanged>;
  multicoinAddrChangeds: Array<MulticoinAddrChanged>;
  nameChanged?: Maybe<NameChanged>;
  nameChangeds: Array<NameChanged>;
  nameRegistered?: Maybe<NameRegistered>;
  nameRegistereds: Array<NameRegistered>;
  nameRenewed?: Maybe<NameRenewed>;
  nameReneweds: Array<NameRenewed>;
  nameTransferred?: Maybe<NameTransferred>;
  nameTransferreds: Array<NameTransferred>;
  nameUnwrapped?: Maybe<NameUnwrapped>;
  nameUnwrappeds: Array<NameUnwrapped>;
  nameWrapped?: Maybe<NameWrapped>;
  nameWrappeds: Array<NameWrapped>;
  newOwner?: Maybe<NewOwner>;
  newOwners: Array<NewOwner>;
  newResolver?: Maybe<NewResolver>;
  newResolvers: Array<NewResolver>;
  newTTL?: Maybe<NewTtl>;
  newTTLs: Array<NewTtl>;
  pubkeyChanged?: Maybe<PubkeyChanged>;
  pubkeyChangeds: Array<PubkeyChanged>;
  registration?: Maybe<Registration>;
  registrationEvent?: Maybe<RegistrationEvent>;
  registrationEvents: Array<RegistrationEvent>;
  registrations: Array<Registration>;
  resolver?: Maybe<Resolver>;
  resolverEvent?: Maybe<ResolverEvent>;
  resolverEvents: Array<ResolverEvent>;
  resolvers: Array<Resolver>;
  textChanged?: Maybe<TextChanged>;
  textChangeds: Array<TextChanged>;
  transfer?: Maybe<Transfer>;
  transfers: Array<Transfer>;
  versionChanged?: Maybe<VersionChanged>;
  versionChangeds: Array<VersionChanged>;
  wrappedDomain?: Maybe<WrappedDomain>;
  wrappedDomains: Array<WrappedDomain>;
  wrappedTransfer?: Maybe<WrappedTransfer>;
  wrappedTransfers: Array<WrappedTransfer>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryAbiChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAbiChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AbiChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AbiChanged_Filter>;
};


export type QueryAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Account_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Account_Filter>;
};


export type QueryAddrChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAddrChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AddrChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AddrChanged_Filter>;
};


export type QueryAuthorisationChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAuthorisationChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AuthorisationChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AuthorisationChanged_Filter>;
};


export type QueryContenthashChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryContenthashChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ContenthashChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ContenthashChanged_Filter>;
};


export type QueryDomainArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDomainEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDomainEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DomainEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DomainEvent_Filter>;
};


export type QueryDomainsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Domain_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Domain_Filter>;
};


export type QueryExpiryExtendedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryExpiryExtendedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ExpiryExtended_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ExpiryExtended_Filter>;
};


export type QueryFusesSetArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFusesSetsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FusesSet_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FusesSet_Filter>;
};


export type QueryInterfaceChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryInterfaceChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<InterfaceChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<InterfaceChanged_Filter>;
};


export type QueryMulticoinAddrChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMulticoinAddrChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MulticoinAddrChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MulticoinAddrChanged_Filter>;
};


export type QueryNameChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryNameChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NameChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NameChanged_Filter>;
};


export type QueryNameRegisteredArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryNameRegisteredsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NameRegistered_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NameRegistered_Filter>;
};


export type QueryNameRenewedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryNameRenewedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NameRenewed_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NameRenewed_Filter>;
};


export type QueryNameTransferredArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryNameTransferredsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NameTransferred_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NameTransferred_Filter>;
};


export type QueryNameUnwrappedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryNameUnwrappedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NameUnwrapped_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NameUnwrapped_Filter>;
};


export type QueryNameWrappedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryNameWrappedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NameWrapped_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NameWrapped_Filter>;
};


export type QueryNewOwnerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryNewOwnersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NewOwner_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NewOwner_Filter>;
};


export type QueryNewResolverArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryNewResolversArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NewResolver_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NewResolver_Filter>;
};


export type QueryNewTtlArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryNewTtLsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NewTtl_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NewTtl_Filter>;
};


export type QueryPubkeyChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPubkeyChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PubkeyChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PubkeyChanged_Filter>;
};


export type QueryRegistrationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRegistrationEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRegistrationEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RegistrationEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RegistrationEvent_Filter>;
};


export type QueryRegistrationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Registration_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Registration_Filter>;
};


export type QueryResolverArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryResolverEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryResolverEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ResolverEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ResolverEvent_Filter>;
};


export type QueryResolversArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Resolver_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Resolver_Filter>;
};


export type QueryTextChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTextChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TextChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TextChanged_Filter>;
};


export type QueryTransferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTransfersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Transfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Transfer_Filter>;
};


export type QueryVersionChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryVersionChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VersionChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VersionChanged_Filter>;
};


export type QueryWrappedDomainArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryWrappedDomainsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WrappedDomain_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WrappedDomain_Filter>;
};


export type QueryWrappedTransferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryWrappedTransfersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WrappedTransfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WrappedTransfer_Filter>;
};

export type Registration = {
  __typename?: 'Registration';
  /** The cost associated with the domain registration */
  cost?: Maybe<Scalars['BigInt']['output']>;
  /** The domain name associated with the registration */
  domain: Domain;
  /** The events associated with the domain registration */
  events: Array<RegistrationEvent>;
  /** The expiry date of the domain */
  expiryDate: Scalars['BigInt']['output'];
  /** The unique identifier of the registration */
  id: Scalars['ID']['output'];
  /** The human-readable label name associated with the domain registration */
  labelName?: Maybe<Scalars['String']['output']>;
  /** The account that registered the domain */
  registrant: Account;
  /** The registration date of the domain */
  registrationDate: Scalars['BigInt']['output'];
};


export type RegistrationEventsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RegistrationEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RegistrationEvent_Filter>;
};

export type RegistrationEvent = {
  /** The block number of the event */
  blockNumber: Scalars['Int']['output'];
  /** The unique identifier of the registration event */
  id: Scalars['ID']['output'];
  /** The registration associated with the event */
  registration: Registration;
  /** The transaction ID associated with the event */
  transactionID: Scalars['Bytes']['output'];
};

export type RegistrationEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RegistrationEvent_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<RegistrationEvent_Filter>>>;
  registration?: InputMaybe<Scalars['String']['input']>;
  registration_?: InputMaybe<Registration_Filter>;
  registration_contains?: InputMaybe<Scalars['String']['input']>;
  registration_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_ends_with?: InputMaybe<Scalars['String']['input']>;
  registration_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_gt?: InputMaybe<Scalars['String']['input']>;
  registration_gte?: InputMaybe<Scalars['String']['input']>;
  registration_in?: InputMaybe<Array<Scalars['String']['input']>>;
  registration_lt?: InputMaybe<Scalars['String']['input']>;
  registration_lte?: InputMaybe<Scalars['String']['input']>;
  registration_not?: InputMaybe<Scalars['String']['input']>;
  registration_not_contains?: InputMaybe<Scalars['String']['input']>;
  registration_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  registration_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  registration_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  registration_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_starts_with?: InputMaybe<Scalars['String']['input']>;
  registration_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum RegistrationEvent_OrderBy {
  BlockNumber = 'blockNumber',
  Id = 'id',
  Registration = 'registration',
  RegistrationCost = 'registration__cost',
  RegistrationExpiryDate = 'registration__expiryDate',
  RegistrationId = 'registration__id',
  RegistrationLabelName = 'registration__labelName',
  RegistrationRegistrationDate = 'registration__registrationDate',
  TransactionId = 'transactionID'
}

export type Registration_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Registration_Filter>>>;
  cost?: InputMaybe<Scalars['BigInt']['input']>;
  cost_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cost_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cost_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cost_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cost_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cost_not?: InputMaybe<Scalars['BigInt']['input']>;
  cost_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  domain?: InputMaybe<Scalars['String']['input']>;
  domain_?: InputMaybe<Domain_Filter>;
  domain_contains?: InputMaybe<Scalars['String']['input']>;
  domain_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_gt?: InputMaybe<Scalars['String']['input']>;
  domain_gte?: InputMaybe<Scalars['String']['input']>;
  domain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_lt?: InputMaybe<Scalars['String']['input']>;
  domain_lte?: InputMaybe<Scalars['String']['input']>;
  domain_not?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  events_?: InputMaybe<RegistrationEvent_Filter>;
  expiryDate?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  expiryDate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_not?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  labelName?: InputMaybe<Scalars['String']['input']>;
  labelName_contains?: InputMaybe<Scalars['String']['input']>;
  labelName_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  labelName_ends_with?: InputMaybe<Scalars['String']['input']>;
  labelName_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  labelName_gt?: InputMaybe<Scalars['String']['input']>;
  labelName_gte?: InputMaybe<Scalars['String']['input']>;
  labelName_in?: InputMaybe<Array<Scalars['String']['input']>>;
  labelName_lt?: InputMaybe<Scalars['String']['input']>;
  labelName_lte?: InputMaybe<Scalars['String']['input']>;
  labelName_not?: InputMaybe<Scalars['String']['input']>;
  labelName_not_contains?: InputMaybe<Scalars['String']['input']>;
  labelName_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  labelName_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  labelName_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  labelName_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  labelName_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  labelName_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  labelName_starts_with?: InputMaybe<Scalars['String']['input']>;
  labelName_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Registration_Filter>>>;
  registrant?: InputMaybe<Scalars['String']['input']>;
  registrant_?: InputMaybe<Account_Filter>;
  registrant_contains?: InputMaybe<Scalars['String']['input']>;
  registrant_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant_ends_with?: InputMaybe<Scalars['String']['input']>;
  registrant_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant_gt?: InputMaybe<Scalars['String']['input']>;
  registrant_gte?: InputMaybe<Scalars['String']['input']>;
  registrant_in?: InputMaybe<Array<Scalars['String']['input']>>;
  registrant_lt?: InputMaybe<Scalars['String']['input']>;
  registrant_lte?: InputMaybe<Scalars['String']['input']>;
  registrant_not?: InputMaybe<Scalars['String']['input']>;
  registrant_not_contains?: InputMaybe<Scalars['String']['input']>;
  registrant_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  registrant_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  registrant_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  registrant_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant_starts_with?: InputMaybe<Scalars['String']['input']>;
  registrant_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registrationDate?: InputMaybe<Scalars['BigInt']['input']>;
  registrationDate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  registrationDate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  registrationDate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  registrationDate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  registrationDate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  registrationDate_not?: InputMaybe<Scalars['BigInt']['input']>;
  registrationDate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Registration_OrderBy {
  Cost = 'cost',
  Domain = 'domain',
  DomainCreatedAt = 'domain__createdAt',
  DomainExpiryDate = 'domain__expiryDate',
  DomainId = 'domain__id',
  DomainIsMigrated = 'domain__isMigrated',
  DomainLabelName = 'domain__labelName',
  DomainLabelhash = 'domain__labelhash',
  DomainName = 'domain__name',
  DomainSubdomainCount = 'domain__subdomainCount',
  DomainTtl = 'domain__ttl',
  Events = 'events',
  ExpiryDate = 'expiryDate',
  Id = 'id',
  LabelName = 'labelName',
  Registrant = 'registrant',
  RegistrantId = 'registrant__id',
  RegistrationDate = 'registrationDate'
}

export type Resolver = {
  __typename?: 'Resolver';
  /** The current value of the 'addr' record for this resolver, as determined by the associated events */
  addr?: Maybe<Account>;
  /** The address of the resolver contract */
  address: Scalars['Bytes']['output'];
  /** The set of observed SLIP-44 coin types for this resolver */
  coinTypes?: Maybe<Array<Scalars['BigInt']['output']>>;
  /** The content hash for this resolver, in binary format */
  contentHash?: Maybe<Scalars['Bytes']['output']>;
  /** The domain that this resolver is associated with */
  domain?: Maybe<Domain>;
  /** The events associated with this resolver */
  events: Array<ResolverEvent>;
  /** The unique identifier for this resolver, which is a concatenation of the resolver address and the domain namehash */
  id: Scalars['ID']['output'];
  /** The set of observed text record keys for this resolver */
  texts?: Maybe<Array<Scalars['String']['output']>>;
};


export type ResolverEventsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ResolverEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ResolverEvent_Filter>;
};

export type ResolverEvent = {
  /** The block number that the event occurred on */
  blockNumber: Scalars['Int']['output'];
  /** Concatenation of block number and log ID */
  id: Scalars['ID']['output'];
  /** Used to derive relationships to Resolvers */
  resolver: Resolver;
  /** The transaction hash of the event */
  transactionID: Scalars['Bytes']['output'];
};

export type ResolverEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ResolverEvent_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ResolverEvent_Filter>>>;
  resolver?: InputMaybe<Scalars['String']['input']>;
  resolver_?: InputMaybe<Resolver_Filter>;
  resolver_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_gt?: InputMaybe<Scalars['String']['input']>;
  resolver_gte?: InputMaybe<Scalars['String']['input']>;
  resolver_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_lt?: InputMaybe<Scalars['String']['input']>;
  resolver_lte?: InputMaybe<Scalars['String']['input']>;
  resolver_not?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum ResolverEvent_OrderBy {
  BlockNumber = 'blockNumber',
  Id = 'id',
  Resolver = 'resolver',
  ResolverAddress = 'resolver__address',
  ResolverContentHash = 'resolver__contentHash',
  ResolverId = 'resolver__id',
  TransactionId = 'transactionID'
}

export type Resolver_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  addr?: InputMaybe<Scalars['String']['input']>;
  addr_?: InputMaybe<Account_Filter>;
  addr_contains?: InputMaybe<Scalars['String']['input']>;
  addr_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  addr_ends_with?: InputMaybe<Scalars['String']['input']>;
  addr_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  addr_gt?: InputMaybe<Scalars['String']['input']>;
  addr_gte?: InputMaybe<Scalars['String']['input']>;
  addr_in?: InputMaybe<Array<Scalars['String']['input']>>;
  addr_lt?: InputMaybe<Scalars['String']['input']>;
  addr_lte?: InputMaybe<Scalars['String']['input']>;
  addr_not?: InputMaybe<Scalars['String']['input']>;
  addr_not_contains?: InputMaybe<Scalars['String']['input']>;
  addr_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  addr_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  addr_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  addr_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  addr_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  addr_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  addr_starts_with?: InputMaybe<Scalars['String']['input']>;
  addr_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  address?: InputMaybe<Scalars['Bytes']['input']>;
  address_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_gt?: InputMaybe<Scalars['Bytes']['input']>;
  address_gte?: InputMaybe<Scalars['Bytes']['input']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  address_lt?: InputMaybe<Scalars['Bytes']['input']>;
  address_lte?: InputMaybe<Scalars['Bytes']['input']>;
  address_not?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Resolver_Filter>>>;
  coinTypes?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  coinTypes_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  coinTypes_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  coinTypes_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  coinTypes_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  coinTypes_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  contentHash?: InputMaybe<Scalars['Bytes']['input']>;
  contentHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  contentHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  contentHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  contentHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  contentHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  contentHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  contentHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  contentHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  contentHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  domain?: InputMaybe<Scalars['String']['input']>;
  domain_?: InputMaybe<Domain_Filter>;
  domain_contains?: InputMaybe<Scalars['String']['input']>;
  domain_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_gt?: InputMaybe<Scalars['String']['input']>;
  domain_gte?: InputMaybe<Scalars['String']['input']>;
  domain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_lt?: InputMaybe<Scalars['String']['input']>;
  domain_lte?: InputMaybe<Scalars['String']['input']>;
  domain_not?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  events_?: InputMaybe<ResolverEvent_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Resolver_Filter>>>;
  texts?: InputMaybe<Array<Scalars['String']['input']>>;
  texts_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  texts_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  texts_not?: InputMaybe<Array<Scalars['String']['input']>>;
  texts_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  texts_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
};

export enum Resolver_OrderBy {
  Addr = 'addr',
  AddrId = 'addr__id',
  Address = 'address',
  CoinTypes = 'coinTypes',
  ContentHash = 'contentHash',
  Domain = 'domain',
  DomainCreatedAt = 'domain__createdAt',
  DomainExpiryDate = 'domain__expiryDate',
  DomainId = 'domain__id',
  DomainIsMigrated = 'domain__isMigrated',
  DomainLabelName = 'domain__labelName',
  DomainLabelhash = 'domain__labelhash',
  DomainName = 'domain__name',
  DomainSubdomainCount = 'domain__subdomainCount',
  DomainTtl = 'domain__ttl',
  Events = 'events',
  Id = 'id',
  Texts = 'texts'
}

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  abiChanged?: Maybe<AbiChanged>;
  abiChangeds: Array<AbiChanged>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  addrChanged?: Maybe<AddrChanged>;
  addrChangeds: Array<AddrChanged>;
  authorisationChanged?: Maybe<AuthorisationChanged>;
  authorisationChangeds: Array<AuthorisationChanged>;
  contenthashChanged?: Maybe<ContenthashChanged>;
  contenthashChangeds: Array<ContenthashChanged>;
  domain?: Maybe<Domain>;
  domainEvent?: Maybe<DomainEvent>;
  domainEvents: Array<DomainEvent>;
  domains: Array<Domain>;
  expiryExtended?: Maybe<ExpiryExtended>;
  expiryExtendeds: Array<ExpiryExtended>;
  fusesSet?: Maybe<FusesSet>;
  fusesSets: Array<FusesSet>;
  interfaceChanged?: Maybe<InterfaceChanged>;
  interfaceChangeds: Array<InterfaceChanged>;
  multicoinAddrChanged?: Maybe<MulticoinAddrChanged>;
  multicoinAddrChangeds: Array<MulticoinAddrChanged>;
  nameChanged?: Maybe<NameChanged>;
  nameChangeds: Array<NameChanged>;
  nameRegistered?: Maybe<NameRegistered>;
  nameRegistereds: Array<NameRegistered>;
  nameRenewed?: Maybe<NameRenewed>;
  nameReneweds: Array<NameRenewed>;
  nameTransferred?: Maybe<NameTransferred>;
  nameTransferreds: Array<NameTransferred>;
  nameUnwrapped?: Maybe<NameUnwrapped>;
  nameUnwrappeds: Array<NameUnwrapped>;
  nameWrapped?: Maybe<NameWrapped>;
  nameWrappeds: Array<NameWrapped>;
  newOwner?: Maybe<NewOwner>;
  newOwners: Array<NewOwner>;
  newResolver?: Maybe<NewResolver>;
  newResolvers: Array<NewResolver>;
  newTTL?: Maybe<NewTtl>;
  newTTLs: Array<NewTtl>;
  pubkeyChanged?: Maybe<PubkeyChanged>;
  pubkeyChangeds: Array<PubkeyChanged>;
  registration?: Maybe<Registration>;
  registrationEvent?: Maybe<RegistrationEvent>;
  registrationEvents: Array<RegistrationEvent>;
  registrations: Array<Registration>;
  resolver?: Maybe<Resolver>;
  resolverEvent?: Maybe<ResolverEvent>;
  resolverEvents: Array<ResolverEvent>;
  resolvers: Array<Resolver>;
  textChanged?: Maybe<TextChanged>;
  textChangeds: Array<TextChanged>;
  transfer?: Maybe<Transfer>;
  transfers: Array<Transfer>;
  versionChanged?: Maybe<VersionChanged>;
  versionChangeds: Array<VersionChanged>;
  wrappedDomain?: Maybe<WrappedDomain>;
  wrappedDomains: Array<WrappedDomain>;
  wrappedTransfer?: Maybe<WrappedTransfer>;
  wrappedTransfers: Array<WrappedTransfer>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionAbiChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAbiChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AbiChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AbiChanged_Filter>;
};


export type SubscriptionAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Account_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Account_Filter>;
};


export type SubscriptionAddrChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAddrChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AddrChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AddrChanged_Filter>;
};


export type SubscriptionAuthorisationChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAuthorisationChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AuthorisationChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AuthorisationChanged_Filter>;
};


export type SubscriptionContenthashChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionContenthashChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ContenthashChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ContenthashChanged_Filter>;
};


export type SubscriptionDomainArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDomainEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDomainEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DomainEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DomainEvent_Filter>;
};


export type SubscriptionDomainsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Domain_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Domain_Filter>;
};


export type SubscriptionExpiryExtendedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionExpiryExtendedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ExpiryExtended_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ExpiryExtended_Filter>;
};


export type SubscriptionFusesSetArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionFusesSetsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FusesSet_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FusesSet_Filter>;
};


export type SubscriptionInterfaceChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionInterfaceChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<InterfaceChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<InterfaceChanged_Filter>;
};


export type SubscriptionMulticoinAddrChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMulticoinAddrChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MulticoinAddrChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MulticoinAddrChanged_Filter>;
};


export type SubscriptionNameChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionNameChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NameChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NameChanged_Filter>;
};


export type SubscriptionNameRegisteredArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionNameRegisteredsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NameRegistered_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NameRegistered_Filter>;
};


export type SubscriptionNameRenewedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionNameRenewedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NameRenewed_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NameRenewed_Filter>;
};


export type SubscriptionNameTransferredArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionNameTransferredsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NameTransferred_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NameTransferred_Filter>;
};


export type SubscriptionNameUnwrappedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionNameUnwrappedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NameUnwrapped_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NameUnwrapped_Filter>;
};


export type SubscriptionNameWrappedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionNameWrappedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NameWrapped_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NameWrapped_Filter>;
};


export type SubscriptionNewOwnerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionNewOwnersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NewOwner_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NewOwner_Filter>;
};


export type SubscriptionNewResolverArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionNewResolversArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NewResolver_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NewResolver_Filter>;
};


export type SubscriptionNewTtlArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionNewTtLsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NewTtl_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NewTtl_Filter>;
};


export type SubscriptionPubkeyChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPubkeyChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PubkeyChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PubkeyChanged_Filter>;
};


export type SubscriptionRegistrationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionRegistrationEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionRegistrationEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RegistrationEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RegistrationEvent_Filter>;
};


export type SubscriptionRegistrationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Registration_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Registration_Filter>;
};


export type SubscriptionResolverArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionResolverEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionResolverEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ResolverEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ResolverEvent_Filter>;
};


export type SubscriptionResolversArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Resolver_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Resolver_Filter>;
};


export type SubscriptionTextChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTextChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TextChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TextChanged_Filter>;
};


export type SubscriptionTransferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTransfersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Transfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Transfer_Filter>;
};


export type SubscriptionVersionChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionVersionChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VersionChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VersionChanged_Filter>;
};


export type SubscriptionWrappedDomainArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionWrappedDomainsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WrappedDomain_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WrappedDomain_Filter>;
};


export type SubscriptionWrappedTransferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionWrappedTransfersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WrappedTransfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WrappedTransfer_Filter>;
};

export type TextChanged = ResolverEvent & {
  __typename?: 'TextChanged';
  /** Block number of the Ethereum block in which the event occurred */
  blockNumber: Scalars['Int']['output'];
  /** Concatenation of block number and log ID */
  id: Scalars['ID']['output'];
  /** The key of the text record that was changed */
  key: Scalars['String']['output'];
  /** Used to derive relationships to Resolvers */
  resolver: Resolver;
  /** Hash of the Ethereum transaction in which the event occurred */
  transactionID: Scalars['Bytes']['output'];
  /** The new value of the text record that was changed */
  value?: Maybe<Scalars['String']['output']>;
};

export type TextChanged_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TextChanged_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  key?: InputMaybe<Scalars['String']['input']>;
  key_contains?: InputMaybe<Scalars['String']['input']>;
  key_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  key_ends_with?: InputMaybe<Scalars['String']['input']>;
  key_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  key_gt?: InputMaybe<Scalars['String']['input']>;
  key_gte?: InputMaybe<Scalars['String']['input']>;
  key_in?: InputMaybe<Array<Scalars['String']['input']>>;
  key_lt?: InputMaybe<Scalars['String']['input']>;
  key_lte?: InputMaybe<Scalars['String']['input']>;
  key_not?: InputMaybe<Scalars['String']['input']>;
  key_not_contains?: InputMaybe<Scalars['String']['input']>;
  key_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  key_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  key_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  key_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  key_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  key_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  key_starts_with?: InputMaybe<Scalars['String']['input']>;
  key_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<TextChanged_Filter>>>;
  resolver?: InputMaybe<Scalars['String']['input']>;
  resolver_?: InputMaybe<Resolver_Filter>;
  resolver_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_gt?: InputMaybe<Scalars['String']['input']>;
  resolver_gte?: InputMaybe<Scalars['String']['input']>;
  resolver_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_lt?: InputMaybe<Scalars['String']['input']>;
  resolver_lte?: InputMaybe<Scalars['String']['input']>;
  resolver_not?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  value?: InputMaybe<Scalars['String']['input']>;
  value_contains?: InputMaybe<Scalars['String']['input']>;
  value_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  value_ends_with?: InputMaybe<Scalars['String']['input']>;
  value_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  value_gt?: InputMaybe<Scalars['String']['input']>;
  value_gte?: InputMaybe<Scalars['String']['input']>;
  value_in?: InputMaybe<Array<Scalars['String']['input']>>;
  value_lt?: InputMaybe<Scalars['String']['input']>;
  value_lte?: InputMaybe<Scalars['String']['input']>;
  value_not?: InputMaybe<Scalars['String']['input']>;
  value_not_contains?: InputMaybe<Scalars['String']['input']>;
  value_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  value_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  value_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  value_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  value_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  value_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  value_starts_with?: InputMaybe<Scalars['String']['input']>;
  value_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum TextChanged_OrderBy {
  BlockNumber = 'blockNumber',
  Id = 'id',
  Key = 'key',
  Resolver = 'resolver',
  ResolverAddress = 'resolver__address',
  ResolverContentHash = 'resolver__contentHash',
  ResolverId = 'resolver__id',
  TransactionId = 'transactionID',
  Value = 'value'
}

export type Transfer = DomainEvent & {
  __typename?: 'Transfer';
  /** The block number at which the event occurred */
  blockNumber: Scalars['Int']['output'];
  /** The domain name associated with the event */
  domain: Domain;
  /** The unique identifier of the event */
  id: Scalars['ID']['output'];
  /** The account that owns the domain after the transfer */
  owner: Account;
  /** The transaction hash of the transaction that triggered the event */
  transactionID: Scalars['Bytes']['output'];
};

export type Transfer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Transfer_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  domain?: InputMaybe<Scalars['String']['input']>;
  domain_?: InputMaybe<Domain_Filter>;
  domain_contains?: InputMaybe<Scalars['String']['input']>;
  domain_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_gt?: InputMaybe<Scalars['String']['input']>;
  domain_gte?: InputMaybe<Scalars['String']['input']>;
  domain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_lt?: InputMaybe<Scalars['String']['input']>;
  domain_lte?: InputMaybe<Scalars['String']['input']>;
  domain_not?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Transfer_Filter>>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_?: InputMaybe<Account_Filter>;
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
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum Transfer_OrderBy {
  BlockNumber = 'blockNumber',
  Domain = 'domain',
  DomainCreatedAt = 'domain__createdAt',
  DomainExpiryDate = 'domain__expiryDate',
  DomainId = 'domain__id',
  DomainIsMigrated = 'domain__isMigrated',
  DomainLabelName = 'domain__labelName',
  DomainLabelhash = 'domain__labelhash',
  DomainName = 'domain__name',
  DomainSubdomainCount = 'domain__subdomainCount',
  DomainTtl = 'domain__ttl',
  Id = 'id',
  Owner = 'owner',
  OwnerId = 'owner__id',
  TransactionId = 'transactionID'
}

export type VersionChanged = ResolverEvent & {
  __typename?: 'VersionChanged';
  /** The block number at which the event occurred */
  blockNumber: Scalars['Int']['output'];
  /** Unique identifier for this event */
  id: Scalars['ID']['output'];
  /** The resolver associated with this event */
  resolver: Resolver;
  /** The transaction hash associated with the event */
  transactionID: Scalars['Bytes']['output'];
  /** The new version number of the resolver */
  version: Scalars['BigInt']['output'];
};

export type VersionChanged_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<VersionChanged_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<VersionChanged_Filter>>>;
  resolver?: InputMaybe<Scalars['String']['input']>;
  resolver_?: InputMaybe<Resolver_Filter>;
  resolver_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_gt?: InputMaybe<Scalars['String']['input']>;
  resolver_gte?: InputMaybe<Scalars['String']['input']>;
  resolver_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_lt?: InputMaybe<Scalars['String']['input']>;
  resolver_lte?: InputMaybe<Scalars['String']['input']>;
  resolver_not?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  version?: InputMaybe<Scalars['BigInt']['input']>;
  version_gt?: InputMaybe<Scalars['BigInt']['input']>;
  version_gte?: InputMaybe<Scalars['BigInt']['input']>;
  version_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  version_lt?: InputMaybe<Scalars['BigInt']['input']>;
  version_lte?: InputMaybe<Scalars['BigInt']['input']>;
  version_not?: InputMaybe<Scalars['BigInt']['input']>;
  version_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum VersionChanged_OrderBy {
  BlockNumber = 'blockNumber',
  Id = 'id',
  Resolver = 'resolver',
  ResolverAddress = 'resolver__address',
  ResolverContentHash = 'resolver__contentHash',
  ResolverId = 'resolver__id',
  TransactionId = 'transactionID',
  Version = 'version'
}

export type WrappedDomain = {
  __typename?: 'WrappedDomain';
  /** The domain that is wrapped by this WrappedDomain */
  domain: Domain;
  /** The expiry date of the wrapped domain */
  expiryDate: Scalars['BigInt']['output'];
  /** The number of fuses remaining on the wrapped domain */
  fuses: Scalars['Int']['output'];
  /** unique identifier for each instance of the WrappedDomain entity */
  id: Scalars['ID']['output'];
  /** The name of the wrapped domain */
  name?: Maybe<Scalars['String']['output']>;
  /** The account that owns this WrappedDomain */
  owner: Account;
};

export type WrappedDomain_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<WrappedDomain_Filter>>>;
  domain?: InputMaybe<Scalars['String']['input']>;
  domain_?: InputMaybe<Domain_Filter>;
  domain_contains?: InputMaybe<Scalars['String']['input']>;
  domain_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_gt?: InputMaybe<Scalars['String']['input']>;
  domain_gte?: InputMaybe<Scalars['String']['input']>;
  domain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_lt?: InputMaybe<Scalars['String']['input']>;
  domain_lte?: InputMaybe<Scalars['String']['input']>;
  domain_not?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  expiryDate?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  expiryDate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_not?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fuses?: InputMaybe<Scalars['Int']['input']>;
  fuses_gt?: InputMaybe<Scalars['Int']['input']>;
  fuses_gte?: InputMaybe<Scalars['Int']['input']>;
  fuses_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  fuses_lt?: InputMaybe<Scalars['Int']['input']>;
  fuses_lte?: InputMaybe<Scalars['Int']['input']>;
  fuses_not?: InputMaybe<Scalars['Int']['input']>;
  fuses_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<WrappedDomain_Filter>>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_?: InputMaybe<Account_Filter>;
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
};

export enum WrappedDomain_OrderBy {
  Domain = 'domain',
  DomainCreatedAt = 'domain__createdAt',
  DomainExpiryDate = 'domain__expiryDate',
  DomainId = 'domain__id',
  DomainIsMigrated = 'domain__isMigrated',
  DomainLabelName = 'domain__labelName',
  DomainLabelhash = 'domain__labelhash',
  DomainName = 'domain__name',
  DomainSubdomainCount = 'domain__subdomainCount',
  DomainTtl = 'domain__ttl',
  ExpiryDate = 'expiryDate',
  Fuses = 'fuses',
  Id = 'id',
  Name = 'name',
  Owner = 'owner',
  OwnerId = 'owner__id'
}

export type WrappedTransfer = DomainEvent & {
  __typename?: 'WrappedTransfer';
  /** The block number at which the event occurred */
  blockNumber: Scalars['Int']['output'];
  /** The domain name associated with the event */
  domain: Domain;
  /** The unique identifier of the event */
  id: Scalars['ID']['output'];
  /** The account that owns the wrapped domain after the transfer */
  owner: Account;
  /** The transaction hash of the transaction that triggered the event */
  transactionID: Scalars['Bytes']['output'];
};

export type WrappedTransfer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<WrappedTransfer_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  domain?: InputMaybe<Scalars['String']['input']>;
  domain_?: InputMaybe<Domain_Filter>;
  domain_contains?: InputMaybe<Scalars['String']['input']>;
  domain_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_gt?: InputMaybe<Scalars['String']['input']>;
  domain_gte?: InputMaybe<Scalars['String']['input']>;
  domain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_lt?: InputMaybe<Scalars['String']['input']>;
  domain_lte?: InputMaybe<Scalars['String']['input']>;
  domain_not?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<WrappedTransfer_Filter>>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_?: InputMaybe<Account_Filter>;
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
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum WrappedTransfer_OrderBy {
  BlockNumber = 'blockNumber',
  Domain = 'domain',
  DomainCreatedAt = 'domain__createdAt',
  DomainExpiryDate = 'domain__expiryDate',
  DomainId = 'domain__id',
  DomainIsMigrated = 'domain__isMigrated',
  DomainLabelName = 'domain__labelName',
  DomainLabelhash = 'domain__labelhash',
  DomainName = 'domain__name',
  DomainSubdomainCount = 'domain__subdomainCount',
  DomainTtl = 'domain__ttl',
  Id = 'id',
  Owner = 'owner',
  OwnerId = 'owner__id',
  TransactionId = 'transactionID'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
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

export type GetEnsDomainsForAccountQueryVariables = Exact<{
  account: Scalars['String']['input'];
}>;


export type GetEnsDomainsForAccountQuery = { __typename?: 'Query', domains: Array<{ __typename?: 'Domain', name?: string | null }>, wrappedDomains: Array<{ __typename?: 'WrappedDomain', name?: string | null }> };


export const GetEnsDomainsForAccountDocument = gql`
    query getEnsDomainsForAccount($account: String!) {
  domains(where: {owner_in: [$account]}, orderBy: name) {
    name
  }
  wrappedDomains(where: {owner_in: [$account]}, orderBy: name) {
    name
  }
}
    `;
export type GetEnsDomainsForAccountQueryResult = Apollo.QueryResult<GetEnsDomainsForAccountQuery, GetEnsDomainsForAccountQueryVariables>;
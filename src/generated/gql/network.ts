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
};

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type Delegation = {
  __typename?: 'Delegation';
  delegator: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  operator?: Maybe<Operator>;
  /** Pool tokens held by a delegator in this Operator contract */
  poolTokenWei: Scalars['BigInt']['output'];
};

export type Delegation_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Delegation_Filter>>>;
  delegator?: InputMaybe<Scalars['String']['input']>;
  delegator_contains?: InputMaybe<Scalars['String']['input']>;
  delegator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_gt?: InputMaybe<Scalars['String']['input']>;
  delegator_gte?: InputMaybe<Scalars['String']['input']>;
  delegator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delegator_lt?: InputMaybe<Scalars['String']['input']>;
  delegator_lte?: InputMaybe<Scalars['String']['input']>;
  delegator_not?: InputMaybe<Scalars['String']['input']>;
  delegator_not_contains?: InputMaybe<Scalars['String']['input']>;
  delegator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delegator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  operator?: InputMaybe<Scalars['String']['input']>;
  operator_?: InputMaybe<Operator_Filter>;
  operator_contains?: InputMaybe<Scalars['String']['input']>;
  operator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_gt?: InputMaybe<Scalars['String']['input']>;
  operator_gte?: InputMaybe<Scalars['String']['input']>;
  operator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_lt?: InputMaybe<Scalars['String']['input']>;
  operator_lte?: InputMaybe<Scalars['String']['input']>;
  operator_not?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Delegation_Filter>>>;
  poolTokenWei?: InputMaybe<Scalars['BigInt']['input']>;
  poolTokenWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  poolTokenWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  poolTokenWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolTokenWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  poolTokenWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  poolTokenWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  poolTokenWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Delegation_OrderBy {
  Delegator = 'delegator',
  Id = 'id',
  Operator = 'operator',
  OperatorDelegatorCount = 'operator__delegatorCount',
  OperatorExchangeRate = 'operator__exchangeRate',
  OperatorFreeFundsWei = 'operator__freeFundsWei',
  OperatorId = 'operator__id',
  OperatorMetadataJsonString = 'operator__metadataJsonString',
  OperatorOwner = 'operator__owner',
  OperatorPoolTokenTotalSupplyWei = 'operator__poolTokenTotalSupplyWei',
  OperatorPoolValue = 'operator__poolValue',
  OperatorPoolValueBlockNumber = 'operator__poolValueBlockNumber',
  OperatorPoolValueTimestamp = 'operator__poolValueTimestamp',
  OperatorSlashingsCount = 'operator__slashingsCount',
  OperatorTotalValueInSponsorshipsWei = 'operator__totalValueInSponsorshipsWei',
  PoolTokenWei = 'poolTokenWei'
}

export type Flag = {
  __typename?: 'Flag';
  date?: Maybe<Scalars['BigInt']['output']>;
  flagger: Operator;
  id: Scalars['ID']['output'];
  result: Scalars['BigInt']['output'];
  sponsorship?: Maybe<Sponsorship>;
  target: Operator;
  targetSlashAmount?: Maybe<Scalars['BigInt']['output']>;
};

export type Flag_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Flag_Filter>>>;
  date?: InputMaybe<Scalars['BigInt']['input']>;
  date_gt?: InputMaybe<Scalars['BigInt']['input']>;
  date_gte?: InputMaybe<Scalars['BigInt']['input']>;
  date_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  date_lt?: InputMaybe<Scalars['BigInt']['input']>;
  date_lte?: InputMaybe<Scalars['BigInt']['input']>;
  date_not?: InputMaybe<Scalars['BigInt']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  flagger?: InputMaybe<Scalars['String']['input']>;
  flagger_?: InputMaybe<Operator_Filter>;
  flagger_contains?: InputMaybe<Scalars['String']['input']>;
  flagger_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  flagger_ends_with?: InputMaybe<Scalars['String']['input']>;
  flagger_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  flagger_gt?: InputMaybe<Scalars['String']['input']>;
  flagger_gte?: InputMaybe<Scalars['String']['input']>;
  flagger_in?: InputMaybe<Array<Scalars['String']['input']>>;
  flagger_lt?: InputMaybe<Scalars['String']['input']>;
  flagger_lte?: InputMaybe<Scalars['String']['input']>;
  flagger_not?: InputMaybe<Scalars['String']['input']>;
  flagger_not_contains?: InputMaybe<Scalars['String']['input']>;
  flagger_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  flagger_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  flagger_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  flagger_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  flagger_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  flagger_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  flagger_starts_with?: InputMaybe<Scalars['String']['input']>;
  flagger_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Flag_Filter>>>;
  result?: InputMaybe<Scalars['BigInt']['input']>;
  result_gt?: InputMaybe<Scalars['BigInt']['input']>;
  result_gte?: InputMaybe<Scalars['BigInt']['input']>;
  result_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  result_lt?: InputMaybe<Scalars['BigInt']['input']>;
  result_lte?: InputMaybe<Scalars['BigInt']['input']>;
  result_not?: InputMaybe<Scalars['BigInt']['input']>;
  result_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sponsorship?: InputMaybe<Scalars['String']['input']>;
  sponsorship_?: InputMaybe<Sponsorship_Filter>;
  sponsorship_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorship_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_gt?: InputMaybe<Scalars['String']['input']>;
  sponsorship_gte?: InputMaybe<Scalars['String']['input']>;
  sponsorship_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorship_lt?: InputMaybe<Scalars['String']['input']>;
  sponsorship_lte?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorship_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  target?: InputMaybe<Scalars['String']['input']>;
  targetSlashAmount?: InputMaybe<Scalars['BigInt']['input']>;
  targetSlashAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  targetSlashAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  targetSlashAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  targetSlashAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  targetSlashAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  targetSlashAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  targetSlashAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  target_?: InputMaybe<Operator_Filter>;
  target_contains?: InputMaybe<Scalars['String']['input']>;
  target_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  target_ends_with?: InputMaybe<Scalars['String']['input']>;
  target_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  target_gt?: InputMaybe<Scalars['String']['input']>;
  target_gte?: InputMaybe<Scalars['String']['input']>;
  target_in?: InputMaybe<Array<Scalars['String']['input']>>;
  target_lt?: InputMaybe<Scalars['String']['input']>;
  target_lte?: InputMaybe<Scalars['String']['input']>;
  target_not?: InputMaybe<Scalars['String']['input']>;
  target_not_contains?: InputMaybe<Scalars['String']['input']>;
  target_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  target_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  target_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  target_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  target_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  target_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  target_starts_with?: InputMaybe<Scalars['String']['input']>;
  target_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Flag_OrderBy {
  Date = 'date',
  Flagger = 'flagger',
  FlaggerDelegatorCount = 'flagger__delegatorCount',
  FlaggerExchangeRate = 'flagger__exchangeRate',
  FlaggerFreeFundsWei = 'flagger__freeFundsWei',
  FlaggerId = 'flagger__id',
  FlaggerMetadataJsonString = 'flagger__metadataJsonString',
  FlaggerOwner = 'flagger__owner',
  FlaggerPoolTokenTotalSupplyWei = 'flagger__poolTokenTotalSupplyWei',
  FlaggerPoolValue = 'flagger__poolValue',
  FlaggerPoolValueBlockNumber = 'flagger__poolValueBlockNumber',
  FlaggerPoolValueTimestamp = 'flagger__poolValueTimestamp',
  FlaggerSlashingsCount = 'flagger__slashingsCount',
  FlaggerTotalValueInSponsorshipsWei = 'flagger__totalValueInSponsorshipsWei',
  Id = 'id',
  Result = 'result',
  Sponsorship = 'sponsorship',
  SponsorshipCreator = 'sponsorship__creator',
  SponsorshipCumulativeSponsoring = 'sponsorship__cumulativeSponsoring',
  SponsorshipId = 'sponsorship__id',
  SponsorshipIsRunning = 'sponsorship__isRunning',
  SponsorshipMetadata = 'sponsorship__metadata',
  SponsorshipOperatorCount = 'sponsorship__operatorCount',
  SponsorshipProjectedInsolvency = 'sponsorship__projectedInsolvency',
  SponsorshipSpotApy = 'sponsorship__spotAPY',
  SponsorshipTotalPayoutWeiPerSec = 'sponsorship__totalPayoutWeiPerSec',
  SponsorshipTotalStakedWei = 'sponsorship__totalStakedWei',
  SponsorshipUnallocatedWei = 'sponsorship__unallocatedWei',
  Target = 'target',
  TargetSlashAmount = 'targetSlashAmount',
  TargetDelegatorCount = 'target__delegatorCount',
  TargetExchangeRate = 'target__exchangeRate',
  TargetFreeFundsWei = 'target__freeFundsWei',
  TargetId = 'target__id',
  TargetMetadataJsonString = 'target__metadataJsonString',
  TargetOwner = 'target__owner',
  TargetPoolTokenTotalSupplyWei = 'target__poolTokenTotalSupplyWei',
  TargetPoolValue = 'target__poolValue',
  TargetPoolValueBlockNumber = 'target__poolValueBlockNumber',
  TargetPoolValueTimestamp = 'target__poolValueTimestamp',
  TargetSlashingsCount = 'target__slashingsCount',
  TargetTotalValueInSponsorshipsWei = 'target__totalValueInSponsorshipsWei'
}

export type Node = {
  __typename?: 'Node';
  /** date created. This is a timestamp in seconds */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
  /** node ID = address */
  id: Scalars['ID']['output'];
  /** Epoch timestamp of the last time the node metadata was updated */
  lastSeen: Scalars['BigInt']['output'];
  /** Connection metadata, e.g. URL of the node, e.g. http://mynode.com:3000 */
  metadata: Scalars['String']['output'];
  /** Streams for which this node is registered as a storage node in the StreamStorageRegistry */
  storedStreams?: Maybe<Array<Stream>>;
};


export type NodeStoredStreamsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Stream_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Stream_Filter>;
};

export type Node_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Node_Filter>>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastSeen?: InputMaybe<Scalars['BigInt']['input']>;
  lastSeen_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastSeen_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastSeen_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastSeen_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastSeen_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastSeen_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastSeen_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  metadata?: InputMaybe<Scalars['String']['input']>;
  metadata_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadata_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_gt?: InputMaybe<Scalars['String']['input']>;
  metadata_gte?: InputMaybe<Scalars['String']['input']>;
  metadata_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_lt?: InputMaybe<Scalars['String']['input']>;
  metadata_lte?: InputMaybe<Scalars['String']['input']>;
  metadata_not?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadata_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadata_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadata_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Node_Filter>>>;
  storedStreams?: InputMaybe<Array<Scalars['String']['input']>>;
  storedStreams_?: InputMaybe<Stream_Filter>;
  storedStreams_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  storedStreams_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  storedStreams_not?: InputMaybe<Array<Scalars['String']['input']>>;
  storedStreams_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  storedStreams_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
};

export enum Node_OrderBy {
  CreatedAt = 'createdAt',
  Id = 'id',
  LastSeen = 'lastSeen',
  Metadata = 'metadata',
  StoredStreams = 'storedStreams'
}

export type Operator = {
  __typename?: 'Operator';
  /** All delegators who have delegated to this operator. Increased when Delegation is created and decreased when Delegation is removed */
  delegatorCount: Scalars['Int']['output'];
  delegators: Array<Delegation>;
  /** DATA/pooltoken exchange rate, equal to poolValue / totalSupply. Pool tokens are worth (exchangeRate * amount) DATA when undelegating. */
  exchangeRate: Scalars['BigDecimal']['output'];
  flagsOpened: Array<Flag>;
  flagsTargeted: Array<Flag>;
  /** DATA held by the operator, not yet staked. Updated by PoolValueUpdate event, so might be out of date if new DATA is sent via `ERC20.transfer`. */
  freeFundsWei: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  metadataJsonString: Scalars['String']['output'];
  nodes: Array<Scalars['String']['output']>;
  owner: Scalars['String']['output'];
  /** Total number of pool tokens in existence */
  poolTokenTotalSupplyWei: Scalars['BigInt']['output'];
  /** DATA staked, earned and held by the Operator contract = totalValueInSponsorshipsWei + freeFundsWei. Updated by PoolValueUpdate event, so might be out of date. */
  poolValue: Scalars['BigInt']['output'];
  /** Block number after which poolValue was the best approximation of total DATA staked, earned and held by the Operator contract. */
  poolValueBlockNumber: Scalars['BigInt']['output'];
  /** Timestamp in seconds when poolValue was the best approximation of total DATA staked, earned and held by the Operator contract. Shows how much the poolValue is out of date. */
  poolValueTimestamp: Scalars['BigInt']['output'];
  slashingEvents: Array<SlashingEvent>;
  slashingsCount: Scalars['Int']['output'];
  stakes: Array<Stake>;
  stakingEvents: Array<StakingEvent>;
  /** DATA staked and earned in sponsorship contracts. Updated by PoolValueUpdate event, so it will be out of date by the amount of earnings. */
  totalValueInSponsorshipsWei: Scalars['BigInt']['output'];
};


export type OperatorDelegatorsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Delegation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Delegation_Filter>;
};


export type OperatorFlagsOpenedArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Flag_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Flag_Filter>;
};


export type OperatorFlagsTargetedArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Flag_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Flag_Filter>;
};


export type OperatorSlashingEventsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SlashingEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SlashingEvent_Filter>;
};


export type OperatorStakesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Stake_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Stake_Filter>;
};


export type OperatorStakingEventsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<StakingEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<StakingEvent_Filter>;
};

export type OperatorDailyBucket = {
  __typename?: 'OperatorDailyBucket';
  /** The day of the bucket. This is a timestamp in seconds */
  date: Scalars['BigInt']['output'];
  /** All delegators joining this operator. Initialized from operator.delegatorCount */
  delegatorCountAtStart: Scalars['Int']['output'];
  /** Delegators joining this operator on this day. Updated when Delegation entity is created */
  delegatorCountChange: Scalars['Int']['output'];
  /** DATA held by the operator, not yet staked (first event in bucket) */
  freeFundsWei: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  /** Sum of losses during the bucket */
  lossesWei: Scalars['BigInt']['output'];
  operator: Operator;
  /** Sum of operator's share of earnings during the bucket */
  operatorsShareWei: Scalars['BigInt']['output'];
  /** DATA staked, earned and held by the Operator contract = totalValueInSponsorshipsWei + freeFundsWei (first event in bucket) */
  poolValue: Scalars['BigInt']['output'];
  /** Sum of earnings during the bucket, less operator's share */
  profitsWei: Scalars['BigInt']['output'];
  /** Momentary APY. Currently not used. TODO: calculate and add to subgraph */
  spotAPY: Scalars['BigInt']['output'];
  /** All DATA tokens delegated to this operator, by all delegators. Updated when Delegated event is fired */
  totalDelegatedWei: Scalars['BigInt']['output'];
  /** Total DATA tokens undelegated from this operator, by all delegators. Updated when Undelegated event is fired */
  totalUndelegatedWei: Scalars['BigInt']['output'];
  /** DATA staked and earned in sponsorship contracts (first event in bucket) */
  totalValueInSponsorshipsWei: Scalars['BigInt']['output'];
};

export type OperatorDailyBucket_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<OperatorDailyBucket_Filter>>>;
  date?: InputMaybe<Scalars['BigInt']['input']>;
  date_gt?: InputMaybe<Scalars['BigInt']['input']>;
  date_gte?: InputMaybe<Scalars['BigInt']['input']>;
  date_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  date_lt?: InputMaybe<Scalars['BigInt']['input']>;
  date_lte?: InputMaybe<Scalars['BigInt']['input']>;
  date_not?: InputMaybe<Scalars['BigInt']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  delegatorCountAtStart?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountAtStart_gt?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountAtStart_gte?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountAtStart_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  delegatorCountAtStart_lt?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountAtStart_lte?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountAtStart_not?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountAtStart_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  delegatorCountChange?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountChange_gt?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountChange_gte?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountChange_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  delegatorCountChange_lt?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountChange_lte?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountChange_not?: InputMaybe<Scalars['Int']['input']>;
  delegatorCountChange_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  freeFundsWei?: InputMaybe<Scalars['BigInt']['input']>;
  freeFundsWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  freeFundsWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  freeFundsWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  freeFundsWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  freeFundsWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  freeFundsWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  freeFundsWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lossesWei?: InputMaybe<Scalars['BigInt']['input']>;
  lossesWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lossesWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lossesWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lossesWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lossesWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lossesWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  lossesWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  operator?: InputMaybe<Scalars['String']['input']>;
  operator_?: InputMaybe<Operator_Filter>;
  operator_contains?: InputMaybe<Scalars['String']['input']>;
  operator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_gt?: InputMaybe<Scalars['String']['input']>;
  operator_gte?: InputMaybe<Scalars['String']['input']>;
  operator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_lt?: InputMaybe<Scalars['String']['input']>;
  operator_lte?: InputMaybe<Scalars['String']['input']>;
  operator_not?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operatorsShareWei?: InputMaybe<Scalars['BigInt']['input']>;
  operatorsShareWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  operatorsShareWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  operatorsShareWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  operatorsShareWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  operatorsShareWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  operatorsShareWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  operatorsShareWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<OperatorDailyBucket_Filter>>>;
  poolValue?: InputMaybe<Scalars['BigInt']['input']>;
  poolValue_gt?: InputMaybe<Scalars['BigInt']['input']>;
  poolValue_gte?: InputMaybe<Scalars['BigInt']['input']>;
  poolValue_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolValue_lt?: InputMaybe<Scalars['BigInt']['input']>;
  poolValue_lte?: InputMaybe<Scalars['BigInt']['input']>;
  poolValue_not?: InputMaybe<Scalars['BigInt']['input']>;
  poolValue_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  profitsWei?: InputMaybe<Scalars['BigInt']['input']>;
  profitsWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  profitsWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  profitsWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  profitsWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  profitsWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  profitsWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  profitsWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  spotAPY?: InputMaybe<Scalars['BigInt']['input']>;
  spotAPY_gt?: InputMaybe<Scalars['BigInt']['input']>;
  spotAPY_gte?: InputMaybe<Scalars['BigInt']['input']>;
  spotAPY_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  spotAPY_lt?: InputMaybe<Scalars['BigInt']['input']>;
  spotAPY_lte?: InputMaybe<Scalars['BigInt']['input']>;
  spotAPY_not?: InputMaybe<Scalars['BigInt']['input']>;
  spotAPY_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalDelegatedWei?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegatedWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegatedWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegatedWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalDelegatedWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegatedWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegatedWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegatedWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalUndelegatedWei?: InputMaybe<Scalars['BigInt']['input']>;
  totalUndelegatedWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalUndelegatedWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalUndelegatedWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalUndelegatedWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalUndelegatedWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalUndelegatedWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalUndelegatedWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalValueInSponsorshipsWei?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueInSponsorshipsWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueInSponsorshipsWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueInSponsorshipsWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalValueInSponsorshipsWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueInSponsorshipsWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueInSponsorshipsWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueInSponsorshipsWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum OperatorDailyBucket_OrderBy {
  Date = 'date',
  DelegatorCountAtStart = 'delegatorCountAtStart',
  DelegatorCountChange = 'delegatorCountChange',
  FreeFundsWei = 'freeFundsWei',
  Id = 'id',
  LossesWei = 'lossesWei',
  Operator = 'operator',
  OperatorDelegatorCount = 'operator__delegatorCount',
  OperatorExchangeRate = 'operator__exchangeRate',
  OperatorFreeFundsWei = 'operator__freeFundsWei',
  OperatorId = 'operator__id',
  OperatorMetadataJsonString = 'operator__metadataJsonString',
  OperatorOwner = 'operator__owner',
  OperatorPoolTokenTotalSupplyWei = 'operator__poolTokenTotalSupplyWei',
  OperatorPoolValue = 'operator__poolValue',
  OperatorPoolValueBlockNumber = 'operator__poolValueBlockNumber',
  OperatorPoolValueTimestamp = 'operator__poolValueTimestamp',
  OperatorSlashingsCount = 'operator__slashingsCount',
  OperatorTotalValueInSponsorshipsWei = 'operator__totalValueInSponsorshipsWei',
  OperatorsShareWei = 'operatorsShareWei',
  PoolValue = 'poolValue',
  ProfitsWei = 'profitsWei',
  SpotApy = 'spotAPY',
  TotalDelegatedWei = 'totalDelegatedWei',
  TotalUndelegatedWei = 'totalUndelegatedWei',
  TotalValueInSponsorshipsWei = 'totalValueInSponsorshipsWei'
}

export type Operator_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Operator_Filter>>>;
  delegatorCount?: InputMaybe<Scalars['Int']['input']>;
  delegatorCount_gt?: InputMaybe<Scalars['Int']['input']>;
  delegatorCount_gte?: InputMaybe<Scalars['Int']['input']>;
  delegatorCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  delegatorCount_lt?: InputMaybe<Scalars['Int']['input']>;
  delegatorCount_lte?: InputMaybe<Scalars['Int']['input']>;
  delegatorCount_not?: InputMaybe<Scalars['Int']['input']>;
  delegatorCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  delegators_?: InputMaybe<Delegation_Filter>;
  exchangeRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  exchangeRate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  flagsOpened_?: InputMaybe<Flag_Filter>;
  flagsTargeted_?: InputMaybe<Flag_Filter>;
  freeFundsWei?: InputMaybe<Scalars['BigInt']['input']>;
  freeFundsWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  freeFundsWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  freeFundsWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  freeFundsWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  freeFundsWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  freeFundsWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  freeFundsWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  metadataJsonString?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_contains?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_gt?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_gte?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadataJsonString_lt?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_lte?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_not?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_not_contains?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadataJsonString_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadataJsonString_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  nodes?: InputMaybe<Array<Scalars['String']['input']>>;
  nodes_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  nodes_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  nodes_not?: InputMaybe<Array<Scalars['String']['input']>>;
  nodes_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  nodes_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Operator_Filter>>>;
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
  poolTokenTotalSupplyWei?: InputMaybe<Scalars['BigInt']['input']>;
  poolTokenTotalSupplyWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  poolTokenTotalSupplyWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  poolTokenTotalSupplyWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolTokenTotalSupplyWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  poolTokenTotalSupplyWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  poolTokenTotalSupplyWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  poolTokenTotalSupplyWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolValue?: InputMaybe<Scalars['BigInt']['input']>;
  poolValueBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  poolValueBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  poolValueBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  poolValueBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolValueBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  poolValueBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  poolValueBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  poolValueBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolValueTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  poolValueTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  poolValueTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  poolValueTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolValueTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  poolValueTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  poolValueTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  poolValueTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolValue_gt?: InputMaybe<Scalars['BigInt']['input']>;
  poolValue_gte?: InputMaybe<Scalars['BigInt']['input']>;
  poolValue_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  poolValue_lt?: InputMaybe<Scalars['BigInt']['input']>;
  poolValue_lte?: InputMaybe<Scalars['BigInt']['input']>;
  poolValue_not?: InputMaybe<Scalars['BigInt']['input']>;
  poolValue_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  slashingEvents_?: InputMaybe<SlashingEvent_Filter>;
  slashingsCount?: InputMaybe<Scalars['Int']['input']>;
  slashingsCount_gt?: InputMaybe<Scalars['Int']['input']>;
  slashingsCount_gte?: InputMaybe<Scalars['Int']['input']>;
  slashingsCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  slashingsCount_lt?: InputMaybe<Scalars['Int']['input']>;
  slashingsCount_lte?: InputMaybe<Scalars['Int']['input']>;
  slashingsCount_not?: InputMaybe<Scalars['Int']['input']>;
  slashingsCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  stakes_?: InputMaybe<Stake_Filter>;
  stakingEvents_?: InputMaybe<StakingEvent_Filter>;
  totalValueInSponsorshipsWei?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueInSponsorshipsWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueInSponsorshipsWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueInSponsorshipsWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalValueInSponsorshipsWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueInSponsorshipsWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueInSponsorshipsWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalValueInSponsorshipsWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Operator_OrderBy {
  DelegatorCount = 'delegatorCount',
  Delegators = 'delegators',
  ExchangeRate = 'exchangeRate',
  FlagsOpened = 'flagsOpened',
  FlagsTargeted = 'flagsTargeted',
  FreeFundsWei = 'freeFundsWei',
  Id = 'id',
  MetadataJsonString = 'metadataJsonString',
  Nodes = 'nodes',
  Owner = 'owner',
  PoolTokenTotalSupplyWei = 'poolTokenTotalSupplyWei',
  PoolValue = 'poolValue',
  PoolValueBlockNumber = 'poolValueBlockNumber',
  PoolValueTimestamp = 'poolValueTimestamp',
  SlashingEvents = 'slashingEvents',
  SlashingsCount = 'slashingsCount',
  Stakes = 'stakes',
  StakingEvents = 'stakingEvents',
  TotalValueInSponsorshipsWei = 'totalValueInSponsorshipsWei'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Project = {
  __typename?: 'Project';
  /** Increases when various actions are triggered (e.g. purchase, stake, unstake). Used to generate unique ids */
  counter?: Maybe<Scalars['Int']['output']>;
  /** date created. This is a timestamp in seconds */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
  /** List of domain ids for the chains from which this project can be purchased */
  domainIds: Array<Scalars['BigInt']['output']>;
  /** project id = bytes32 */
  id: Scalars['ID']['output'];
  /** Flags a project as being a data union, true iff 'isDataUnion' field is set to 'true' in the metadata JSON */
  isDataUnion?: Maybe<Scalars['Boolean']['output']>;
  /** Project metadata JSON */
  metadata: Scalars['String']['output'];
  /** The minimum amount of seconds for which a subscription can be extended. This is a normal int value (not wei) */
  minimumSubscriptionSeconds: Scalars['BigInt']['output'];
  /** Payment details for the chains where the project can be purchased: mapping (uint32 => PaymentDetailsByChain) */
  paymentDetails: Array<ProjectPaymentDetails>;
  /** Permissions mapping (bytes32 => Permission) */
  permissions: Array<ProjectPermission>;
  /** Marketplace purchases */
  purchases: Array<ProjectPurchase>;
  /** Incremented/decremented when Stake/Unstake events are fired. It may not always be 1:1 with the stake (with future implementations) */
  score: Scalars['BigInt']['output'];
  /** Total tokens staked in the project by all stakers */
  stakedWei: Scalars['BigInt']['output'];
  /** Streams added to the project */
  streams: Array<Scalars['String']['output']>;
  /** Subscriptions mapping (address => TimeBasedSubscription) */
  subscriptions: Array<ProjectSubscription>;
  /** date updated. This is a timestamp in seconds */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
};


export type ProjectPaymentDetailsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectPaymentDetails_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProjectPaymentDetails_Filter>;
};


export type ProjectPermissionsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectPermission_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProjectPermission_Filter>;
};


export type ProjectPurchasesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectPurchase_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProjectPurchase_Filter>;
};


export type ProjectSubscriptionsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectSubscription_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProjectSubscription_Filter>;
};

export type ProjectPaymentDetails = {
  __typename?: 'ProjectPaymentDetails';
  /** Ethereum address, account where the payment is directed to for project purchases */
  beneficiary: Scalars['Bytes']['output'];
  /** The domainId of the chain where the project can be purchased. It's a unique id assigned by hyperlane to each chain */
  domainId?: Maybe<Scalars['BigInt']['output']>;
  /** payment details id = projectId + '-' + domainId */
  id: Scalars['ID']['output'];
  /** Project price per second. This is a DATA-wei denominated amount (10^18th of DATA token). */
  pricePerSecond?: Maybe<Scalars['BigInt']['output']>;
  /** Ethereum address, the token in which the payment goes to project beneficiary */
  pricingTokenAddress: Scalars['Bytes']['output'];
  /** Target project this payment details applies to */
  project: Project;
};

export type ProjectPaymentDetails_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ProjectPaymentDetails_Filter>>>;
  beneficiary?: InputMaybe<Scalars['Bytes']['input']>;
  beneficiary_contains?: InputMaybe<Scalars['Bytes']['input']>;
  beneficiary_gt?: InputMaybe<Scalars['Bytes']['input']>;
  beneficiary_gte?: InputMaybe<Scalars['Bytes']['input']>;
  beneficiary_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  beneficiary_lt?: InputMaybe<Scalars['Bytes']['input']>;
  beneficiary_lte?: InputMaybe<Scalars['Bytes']['input']>;
  beneficiary_not?: InputMaybe<Scalars['Bytes']['input']>;
  beneficiary_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  beneficiary_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  domainId?: InputMaybe<Scalars['BigInt']['input']>;
  domainId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  domainId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  domainId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  domainId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  domainId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  domainId_not?: InputMaybe<Scalars['BigInt']['input']>;
  domainId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ProjectPaymentDetails_Filter>>>;
  pricePerSecond?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerSecond_gt?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerSecond_gte?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerSecond_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pricePerSecond_lt?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerSecond_lte?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerSecond_not?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerSecond_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pricingTokenAddress?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pricingTokenAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pricingTokenAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  project?: InputMaybe<Scalars['String']['input']>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']['input']>;
  project_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_gt?: InputMaybe<Scalars['String']['input']>;
  project_gte?: InputMaybe<Scalars['String']['input']>;
  project_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_lt?: InputMaybe<Scalars['String']['input']>;
  project_lte?: InputMaybe<Scalars['String']['input']>;
  project_not?: InputMaybe<Scalars['String']['input']>;
  project_not_contains?: InputMaybe<Scalars['String']['input']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum ProjectPaymentDetails_OrderBy {
  Beneficiary = 'beneficiary',
  DomainId = 'domainId',
  Id = 'id',
  PricePerSecond = 'pricePerSecond',
  PricingTokenAddress = 'pricingTokenAddress',
  Project = 'project',
  ProjectCounter = 'project__counter',
  ProjectCreatedAt = 'project__createdAt',
  ProjectId = 'project__id',
  ProjectIsDataUnion = 'project__isDataUnion',
  ProjectMetadata = 'project__metadata',
  ProjectMinimumSubscriptionSeconds = 'project__minimumSubscriptionSeconds',
  ProjectScore = 'project__score',
  ProjectStakedWei = 'project__stakedWei',
  ProjectUpdatedAt = 'project__updatedAt'
}

export type ProjectPermission = {
  __typename?: 'ProjectPermission';
  /** canBuy permission enables a user to buy the project */
  canBuy?: Maybe<Scalars['Boolean']['output']>;
  /** canDelete permission allows deleting the project from the ProjectRegistry */
  canDelete?: Maybe<Scalars['Boolean']['output']>;
  /** canEdit permission enables changing the project's fields */
  canEdit?: Maybe<Scalars['Boolean']['output']>;
  /** canGrant permission allows granting and revoking permissions to this project */
  canGrant?: Maybe<Scalars['Boolean']['output']>;
  /** permission id = projectId + '-' + userAddress */
  id: Scalars['ID']['output'];
  /** Target project this permission applies to */
  project: Project;
  /** Ethereum address, owner of this permission */
  userAddress: Scalars['Bytes']['output'];
};

export type ProjectPermission_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ProjectPermission_Filter>>>;
  canBuy?: InputMaybe<Scalars['Boolean']['input']>;
  canBuy_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canBuy_not?: InputMaybe<Scalars['Boolean']['input']>;
  canBuy_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canDelete?: InputMaybe<Scalars['Boolean']['input']>;
  canDelete_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canDelete_not?: InputMaybe<Scalars['Boolean']['input']>;
  canDelete_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canEdit?: InputMaybe<Scalars['Boolean']['input']>;
  canEdit_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canEdit_not?: InputMaybe<Scalars['Boolean']['input']>;
  canEdit_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canGrant?: InputMaybe<Scalars['Boolean']['input']>;
  canGrant_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canGrant_not?: InputMaybe<Scalars['Boolean']['input']>;
  canGrant_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ProjectPermission_Filter>>>;
  project?: InputMaybe<Scalars['String']['input']>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']['input']>;
  project_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_gt?: InputMaybe<Scalars['String']['input']>;
  project_gte?: InputMaybe<Scalars['String']['input']>;
  project_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_lt?: InputMaybe<Scalars['String']['input']>;
  project_lte?: InputMaybe<Scalars['String']['input']>;
  project_not?: InputMaybe<Scalars['String']['input']>;
  project_not_contains?: InputMaybe<Scalars['String']['input']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  userAddress?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  userAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum ProjectPermission_OrderBy {
  CanBuy = 'canBuy',
  CanDelete = 'canDelete',
  CanEdit = 'canEdit',
  CanGrant = 'canGrant',
  Id = 'id',
  Project = 'project',
  ProjectCounter = 'project__counter',
  ProjectCreatedAt = 'project__createdAt',
  ProjectId = 'project__id',
  ProjectIsDataUnion = 'project__isDataUnion',
  ProjectMetadata = 'project__metadata',
  ProjectMinimumSubscriptionSeconds = 'project__minimumSubscriptionSeconds',
  ProjectScore = 'project__score',
  ProjectStakedWei = 'project__stakedWei',
  ProjectUpdatedAt = 'project__updatedAt',
  UserAddress = 'userAddress'
}

export type ProjectPurchase = {
  __typename?: 'ProjectPurchase';
  /** The amount of tokens paid to marketplace for project subscription */
  fee: Scalars['BigInt']['output'];
  /** project purchase id = projectId + '-' + subscriberAddress + '-' + counter */
  id: Scalars['ID']['output'];
  /** The amount of tokens paid to beneficiary for project subscription */
  price: Scalars['BigInt']['output'];
  /** Target project this purchase is for */
  project: Project;
  /** purchase date. This is a timestamp in seconds */
  purchasedAt?: Maybe<Scalars['BigInt']['output']>;
  /** Ethereum address, the account initiating the project purchase */
  subscriber: Scalars['Bytes']['output'];
  /** The amount of seconds by which the subscription is extended */
  subscriptionSeconds: Scalars['BigInt']['output'];
};

export type ProjectPurchase_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ProjectPurchase_Filter>>>;
  fee?: InputMaybe<Scalars['BigInt']['input']>;
  fee_gt?: InputMaybe<Scalars['BigInt']['input']>;
  fee_gte?: InputMaybe<Scalars['BigInt']['input']>;
  fee_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fee_lt?: InputMaybe<Scalars['BigInt']['input']>;
  fee_lte?: InputMaybe<Scalars['BigInt']['input']>;
  fee_not?: InputMaybe<Scalars['BigInt']['input']>;
  fee_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ProjectPurchase_Filter>>>;
  price?: InputMaybe<Scalars['BigInt']['input']>;
  price_gt?: InputMaybe<Scalars['BigInt']['input']>;
  price_gte?: InputMaybe<Scalars['BigInt']['input']>;
  price_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  price_lt?: InputMaybe<Scalars['BigInt']['input']>;
  price_lte?: InputMaybe<Scalars['BigInt']['input']>;
  price_not?: InputMaybe<Scalars['BigInt']['input']>;
  price_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  project?: InputMaybe<Scalars['String']['input']>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']['input']>;
  project_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_gt?: InputMaybe<Scalars['String']['input']>;
  project_gte?: InputMaybe<Scalars['String']['input']>;
  project_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_lt?: InputMaybe<Scalars['String']['input']>;
  project_lte?: InputMaybe<Scalars['String']['input']>;
  project_not?: InputMaybe<Scalars['String']['input']>;
  project_not_contains?: InputMaybe<Scalars['String']['input']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  purchasedAt?: InputMaybe<Scalars['BigInt']['input']>;
  purchasedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  purchasedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  purchasedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  purchasedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  purchasedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  purchasedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  purchasedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  subscriber?: InputMaybe<Scalars['Bytes']['input']>;
  subscriber_contains?: InputMaybe<Scalars['Bytes']['input']>;
  subscriber_gt?: InputMaybe<Scalars['Bytes']['input']>;
  subscriber_gte?: InputMaybe<Scalars['Bytes']['input']>;
  subscriber_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  subscriber_lt?: InputMaybe<Scalars['Bytes']['input']>;
  subscriber_lte?: InputMaybe<Scalars['Bytes']['input']>;
  subscriber_not?: InputMaybe<Scalars['Bytes']['input']>;
  subscriber_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  subscriber_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  subscriptionSeconds?: InputMaybe<Scalars['BigInt']['input']>;
  subscriptionSeconds_gt?: InputMaybe<Scalars['BigInt']['input']>;
  subscriptionSeconds_gte?: InputMaybe<Scalars['BigInt']['input']>;
  subscriptionSeconds_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  subscriptionSeconds_lt?: InputMaybe<Scalars['BigInt']['input']>;
  subscriptionSeconds_lte?: InputMaybe<Scalars['BigInt']['input']>;
  subscriptionSeconds_not?: InputMaybe<Scalars['BigInt']['input']>;
  subscriptionSeconds_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum ProjectPurchase_OrderBy {
  Fee = 'fee',
  Id = 'id',
  Price = 'price',
  Project = 'project',
  ProjectCounter = 'project__counter',
  ProjectCreatedAt = 'project__createdAt',
  ProjectId = 'project__id',
  ProjectIsDataUnion = 'project__isDataUnion',
  ProjectMetadata = 'project__metadata',
  ProjectMinimumSubscriptionSeconds = 'project__minimumSubscriptionSeconds',
  ProjectScore = 'project__score',
  ProjectStakedWei = 'project__stakedWei',
  ProjectUpdatedAt = 'project__updatedAt',
  PurchasedAt = 'purchasedAt',
  Subscriber = 'subscriber',
  SubscriptionSeconds = 'subscriptionSeconds'
}

export type ProjectStakeByUser = {
  __typename?: 'ProjectStakeByUser';
  /** stake id = projectId + '-' + userAddress */
  id: Scalars['ID']['output'];
  /** Target project this stake is for */
  project: Project;
  /** Ethereum address, the account initiating the stake */
  user: Scalars['Bytes']['output'];
  /** All tokens staked by a given user */
  userStake: Scalars['BigInt']['output'];
};

export type ProjectStakeByUser_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ProjectStakeByUser_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ProjectStakeByUser_Filter>>>;
  project?: InputMaybe<Scalars['String']['input']>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']['input']>;
  project_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_gt?: InputMaybe<Scalars['String']['input']>;
  project_gte?: InputMaybe<Scalars['String']['input']>;
  project_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_lt?: InputMaybe<Scalars['String']['input']>;
  project_lte?: InputMaybe<Scalars['String']['input']>;
  project_not?: InputMaybe<Scalars['String']['input']>;
  project_not_contains?: InputMaybe<Scalars['String']['input']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['Bytes']['input']>;
  userStake?: InputMaybe<Scalars['BigInt']['input']>;
  userStake_gt?: InputMaybe<Scalars['BigInt']['input']>;
  userStake_gte?: InputMaybe<Scalars['BigInt']['input']>;
  userStake_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  userStake_lt?: InputMaybe<Scalars['BigInt']['input']>;
  userStake_lte?: InputMaybe<Scalars['BigInt']['input']>;
  userStake_not?: InputMaybe<Scalars['BigInt']['input']>;
  userStake_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  user_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user_gt?: InputMaybe<Scalars['Bytes']['input']>;
  user_gte?: InputMaybe<Scalars['Bytes']['input']>;
  user_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  user_lt?: InputMaybe<Scalars['Bytes']['input']>;
  user_lte?: InputMaybe<Scalars['Bytes']['input']>;
  user_not?: InputMaybe<Scalars['Bytes']['input']>;
  user_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum ProjectStakeByUser_OrderBy {
  Id = 'id',
  Project = 'project',
  ProjectCounter = 'project__counter',
  ProjectCreatedAt = 'project__createdAt',
  ProjectId = 'project__id',
  ProjectIsDataUnion = 'project__isDataUnion',
  ProjectMetadata = 'project__metadata',
  ProjectMinimumSubscriptionSeconds = 'project__minimumSubscriptionSeconds',
  ProjectScore = 'project__score',
  ProjectStakedWei = 'project__stakedWei',
  ProjectUpdatedAt = 'project__updatedAt',
  User = 'user',
  UserStake = 'userStake'
}

export type ProjectStakingDayBucket = {
  __typename?: 'ProjectStakingDayBucket';
  /** The day of the bucket */
  date: Scalars['BigInt']['output'];
  /** bucket id = projectId + '-' + date */
  id: Scalars['ID']['output'];
  /** Target project this stake is for */
  project: Project;
  /** The amount of tokens staked when the bucket starts */
  stakeAtStart: Scalars['BigInt']['output'];
  /** The amount of tokens staked/unstaked on this day */
  stakeChange: Scalars['BigInt']['output'];
  /** The amount of tokens staked on this day */
  stakingsWei: Scalars['BigInt']['output'];
  /** The amount of tokens unstaked on this day */
  unstakingsWei: Scalars['BigInt']['output'];
};

export type ProjectStakingDayBucket_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ProjectStakingDayBucket_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<ProjectStakingDayBucket_Filter>>>;
  project?: InputMaybe<Scalars['String']['input']>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']['input']>;
  project_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_gt?: InputMaybe<Scalars['String']['input']>;
  project_gte?: InputMaybe<Scalars['String']['input']>;
  project_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_lt?: InputMaybe<Scalars['String']['input']>;
  project_lte?: InputMaybe<Scalars['String']['input']>;
  project_not?: InputMaybe<Scalars['String']['input']>;
  project_not_contains?: InputMaybe<Scalars['String']['input']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stakeAtStart?: InputMaybe<Scalars['BigInt']['input']>;
  stakeAtStart_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stakeAtStart_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stakeAtStart_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakeAtStart_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stakeAtStart_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stakeAtStart_not?: InputMaybe<Scalars['BigInt']['input']>;
  stakeAtStart_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakeChange?: InputMaybe<Scalars['BigInt']['input']>;
  stakeChange_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stakeChange_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stakeChange_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakeChange_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stakeChange_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stakeChange_not?: InputMaybe<Scalars['BigInt']['input']>;
  stakeChange_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakingsWei?: InputMaybe<Scalars['BigInt']['input']>;
  stakingsWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stakingsWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stakingsWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakingsWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stakingsWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stakingsWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  stakingsWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unstakingsWei?: InputMaybe<Scalars['BigInt']['input']>;
  unstakingsWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  unstakingsWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  unstakingsWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unstakingsWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  unstakingsWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  unstakingsWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  unstakingsWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum ProjectStakingDayBucket_OrderBy {
  Date = 'date',
  Id = 'id',
  Project = 'project',
  ProjectCounter = 'project__counter',
  ProjectCreatedAt = 'project__createdAt',
  ProjectId = 'project__id',
  ProjectIsDataUnion = 'project__isDataUnion',
  ProjectMetadata = 'project__metadata',
  ProjectMinimumSubscriptionSeconds = 'project__minimumSubscriptionSeconds',
  ProjectScore = 'project__score',
  ProjectStakedWei = 'project__stakedWei',
  ProjectUpdatedAt = 'project__updatedAt',
  StakeAtStart = 'stakeAtStart',
  StakeChange = 'stakeChange',
  StakingsWei = 'stakingsWei',
  UnstakingsWei = 'unstakingsWei'
}

export type ProjectSubscription = {
  __typename?: 'ProjectSubscription';
  /** Subscription expiration time. This is a timestamp in seconds */
  endTimestamp?: Maybe<Scalars['BigInt']['output']>;
  /** subscription id = projectId + '-' + subscriberAddress */
  id: Scalars['ID']['output'];
  /** Target project this permission applies to */
  project: Project;
  /** Ethereum address, owner of this subscription */
  userAddress: Scalars['Bytes']['output'];
};

export type ProjectSubscription_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ProjectSubscription_Filter>>>;
  endTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ProjectSubscription_Filter>>>;
  project?: InputMaybe<Scalars['String']['input']>;
  project_?: InputMaybe<Project_Filter>;
  project_contains?: InputMaybe<Scalars['String']['input']>;
  project_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_gt?: InputMaybe<Scalars['String']['input']>;
  project_gte?: InputMaybe<Scalars['String']['input']>;
  project_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_lt?: InputMaybe<Scalars['String']['input']>;
  project_lte?: InputMaybe<Scalars['String']['input']>;
  project_not?: InputMaybe<Scalars['String']['input']>;
  project_not_contains?: InputMaybe<Scalars['String']['input']>;
  project_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  project_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  project_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  project_starts_with?: InputMaybe<Scalars['String']['input']>;
  project_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  userAddress?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  userAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum ProjectSubscription_OrderBy {
  EndTimestamp = 'endTimestamp',
  Id = 'id',
  Project = 'project',
  ProjectCounter = 'project__counter',
  ProjectCreatedAt = 'project__createdAt',
  ProjectId = 'project__id',
  ProjectIsDataUnion = 'project__isDataUnion',
  ProjectMetadata = 'project__metadata',
  ProjectMinimumSubscriptionSeconds = 'project__minimumSubscriptionSeconds',
  ProjectScore = 'project__score',
  ProjectStakedWei = 'project__stakedWei',
  ProjectUpdatedAt = 'project__updatedAt',
  UserAddress = 'userAddress'
}

export type Project_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Project_Filter>>>;
  counter?: InputMaybe<Scalars['Int']['input']>;
  counter_gt?: InputMaybe<Scalars['Int']['input']>;
  counter_gte?: InputMaybe<Scalars['Int']['input']>;
  counter_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  counter_lt?: InputMaybe<Scalars['Int']['input']>;
  counter_lte?: InputMaybe<Scalars['Int']['input']>;
  counter_not?: InputMaybe<Scalars['Int']['input']>;
  counter_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  domainIds?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  domainIds_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  domainIds_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  domainIds_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  domainIds_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  domainIds_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isDataUnion?: InputMaybe<Scalars['Boolean']['input']>;
  isDataUnion_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isDataUnion_not?: InputMaybe<Scalars['Boolean']['input']>;
  isDataUnion_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  metadata?: InputMaybe<Scalars['String']['input']>;
  metadata_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadata_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_gt?: InputMaybe<Scalars['String']['input']>;
  metadata_gte?: InputMaybe<Scalars['String']['input']>;
  metadata_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_lt?: InputMaybe<Scalars['String']['input']>;
  metadata_lte?: InputMaybe<Scalars['String']['input']>;
  metadata_not?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadata_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadata_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadata_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  minimumSubscriptionSeconds?: InputMaybe<Scalars['BigInt']['input']>;
  minimumSubscriptionSeconds_gt?: InputMaybe<Scalars['BigInt']['input']>;
  minimumSubscriptionSeconds_gte?: InputMaybe<Scalars['BigInt']['input']>;
  minimumSubscriptionSeconds_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minimumSubscriptionSeconds_lt?: InputMaybe<Scalars['BigInt']['input']>;
  minimumSubscriptionSeconds_lte?: InputMaybe<Scalars['BigInt']['input']>;
  minimumSubscriptionSeconds_not?: InputMaybe<Scalars['BigInt']['input']>;
  minimumSubscriptionSeconds_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Project_Filter>>>;
  paymentDetails?: InputMaybe<Array<Scalars['String']['input']>>;
  paymentDetails_?: InputMaybe<ProjectPaymentDetails_Filter>;
  paymentDetails_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  paymentDetails_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  paymentDetails_not?: InputMaybe<Array<Scalars['String']['input']>>;
  paymentDetails_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  paymentDetails_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  permissions?: InputMaybe<Array<Scalars['String']['input']>>;
  permissions_?: InputMaybe<ProjectPermission_Filter>;
  permissions_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  permissions_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  permissions_not?: InputMaybe<Array<Scalars['String']['input']>>;
  permissions_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  permissions_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  purchases?: InputMaybe<Array<Scalars['String']['input']>>;
  purchases_?: InputMaybe<ProjectPurchase_Filter>;
  purchases_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  purchases_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  purchases_not?: InputMaybe<Array<Scalars['String']['input']>>;
  purchases_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  purchases_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  score?: InputMaybe<Scalars['BigInt']['input']>;
  score_gt?: InputMaybe<Scalars['BigInt']['input']>;
  score_gte?: InputMaybe<Scalars['BigInt']['input']>;
  score_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  score_lt?: InputMaybe<Scalars['BigInt']['input']>;
  score_lte?: InputMaybe<Scalars['BigInt']['input']>;
  score_not?: InputMaybe<Scalars['BigInt']['input']>;
  score_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakedWei?: InputMaybe<Scalars['BigInt']['input']>;
  stakedWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakedWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  stakedWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  streams?: InputMaybe<Array<Scalars['String']['input']>>;
  streams_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  streams_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  streams_not?: InputMaybe<Array<Scalars['String']['input']>>;
  streams_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  streams_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  subscriptions?: InputMaybe<Array<Scalars['String']['input']>>;
  subscriptions_?: InputMaybe<ProjectSubscription_Filter>;
  subscriptions_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  subscriptions_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  subscriptions_not?: InputMaybe<Array<Scalars['String']['input']>>;
  subscriptions_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  subscriptions_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Project_OrderBy {
  Counter = 'counter',
  CreatedAt = 'createdAt',
  DomainIds = 'domainIds',
  Id = 'id',
  IsDataUnion = 'isDataUnion',
  Metadata = 'metadata',
  MinimumSubscriptionSeconds = 'minimumSubscriptionSeconds',
  PaymentDetails = 'paymentDetails',
  Permissions = 'permissions',
  Purchases = 'purchases',
  Score = 'score',
  StakedWei = 'stakedWei',
  Streams = 'streams',
  Subscriptions = 'subscriptions',
  UpdatedAt = 'updatedAt'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  delegation?: Maybe<Delegation>;
  delegations: Array<Delegation>;
  flag?: Maybe<Flag>;
  flags: Array<Flag>;
  node?: Maybe<Node>;
  nodes: Array<Node>;
  operator?: Maybe<Operator>;
  operatorDailyBucket?: Maybe<OperatorDailyBucket>;
  operatorDailyBuckets: Array<OperatorDailyBucket>;
  operators: Array<Operator>;
  project?: Maybe<Project>;
  projectPaymentDetails: Array<ProjectPaymentDetails>;
  projectPermission?: Maybe<ProjectPermission>;
  projectPermissions: Array<ProjectPermission>;
  projectPurchase?: Maybe<ProjectPurchase>;
  projectPurchases: Array<ProjectPurchase>;
  projectSearch: Array<Project>;
  projectStakeByUser?: Maybe<ProjectStakeByUser>;
  projectStakeByUsers: Array<ProjectStakeByUser>;
  projectStakingDayBucket?: Maybe<ProjectStakingDayBucket>;
  projectStakingDayBuckets: Array<ProjectStakingDayBucket>;
  projectSubscription?: Maybe<ProjectSubscription>;
  projectSubscriptions: Array<ProjectSubscription>;
  projects: Array<Project>;
  queueEntries: Array<QueueEntry>;
  queueEntry?: Maybe<QueueEntry>;
  slashingEvent?: Maybe<SlashingEvent>;
  slashingEvents: Array<SlashingEvent>;
  sponsoringEvent?: Maybe<SponsoringEvent>;
  sponsoringEvents: Array<SponsoringEvent>;
  sponsorship?: Maybe<Sponsorship>;
  sponsorshipDailyBucket?: Maybe<SponsorshipDailyBucket>;
  sponsorshipDailyBuckets: Array<SponsorshipDailyBucket>;
  sponsorships: Array<Sponsorship>;
  stake?: Maybe<Stake>;
  stakes: Array<Stake>;
  stakingEvent?: Maybe<StakingEvent>;
  stakingEvents: Array<StakingEvent>;
  stream?: Maybe<Stream>;
  streamPermission?: Maybe<StreamPermission>;
  streamPermissions: Array<StreamPermission>;
  streams: Array<Stream>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryDelegationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDelegationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Delegation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Delegation_Filter>;
};


export type QueryFlagArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFlagsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Flag_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Flag_Filter>;
};


export type QueryNodeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryNodesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Node_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Node_Filter>;
};


export type QueryOperatorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryOperatorDailyBucketArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryOperatorDailyBucketsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OperatorDailyBucket_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OperatorDailyBucket_Filter>;
};


export type QueryOperatorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Operator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Operator_Filter>;
};


export type QueryProjectArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProjectPaymentDetailsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectPaymentDetails_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProjectPaymentDetails_Filter>;
};


export type QueryProjectPermissionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProjectPermissionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectPermission_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProjectPermission_Filter>;
};


export type QueryProjectPurchaseArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProjectPurchasesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectPurchase_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProjectPurchase_Filter>;
};


export type QueryProjectSearchArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  text: Scalars['String']['input'];
};


export type QueryProjectStakeByUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProjectStakeByUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectStakeByUser_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProjectStakeByUser_Filter>;
};


export type QueryProjectStakingDayBucketArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProjectStakingDayBucketsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectStakingDayBucket_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProjectStakingDayBucket_Filter>;
};


export type QueryProjectSubscriptionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProjectSubscriptionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectSubscription_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProjectSubscription_Filter>;
};


export type QueryProjectsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Project_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Project_Filter>;
};


export type QueryQueueEntriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<QueueEntry_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<QueueEntry_Filter>;
};


export type QueryQueueEntryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySlashingEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySlashingEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SlashingEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SlashingEvent_Filter>;
};


export type QuerySponsoringEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySponsoringEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SponsoringEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SponsoringEvent_Filter>;
};


export type QuerySponsorshipArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySponsorshipDailyBucketArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySponsorshipDailyBucketsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SponsorshipDailyBucket_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SponsorshipDailyBucket_Filter>;
};


export type QuerySponsorshipsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Sponsorship_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Sponsorship_Filter>;
};


export type QueryStakeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStakesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Stake_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Stake_Filter>;
};


export type QueryStakingEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStakingEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<StakingEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StakingEvent_Filter>;
};


export type QueryStreamArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStreamPermissionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStreamPermissionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<StreamPermission_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StreamPermission_Filter>;
};


export type QueryStreamsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Stream_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Stream_Filter>;
};

export type QueueEntry = {
  __typename?: 'QueueEntry';
  amount: Scalars['BigInt']['output'];
  date: Scalars['BigInt']['output'];
  delegator: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  operator: Operator;
};

export type QueueEntry_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<QueueEntry_Filter>>>;
  date?: InputMaybe<Scalars['BigInt']['input']>;
  date_gt?: InputMaybe<Scalars['BigInt']['input']>;
  date_gte?: InputMaybe<Scalars['BigInt']['input']>;
  date_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  date_lt?: InputMaybe<Scalars['BigInt']['input']>;
  date_lte?: InputMaybe<Scalars['BigInt']['input']>;
  date_not?: InputMaybe<Scalars['BigInt']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  delegator?: InputMaybe<Scalars['String']['input']>;
  delegator_contains?: InputMaybe<Scalars['String']['input']>;
  delegator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_gt?: InputMaybe<Scalars['String']['input']>;
  delegator_gte?: InputMaybe<Scalars['String']['input']>;
  delegator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delegator_lt?: InputMaybe<Scalars['String']['input']>;
  delegator_lte?: InputMaybe<Scalars['String']['input']>;
  delegator_not?: InputMaybe<Scalars['String']['input']>;
  delegator_not_contains?: InputMaybe<Scalars['String']['input']>;
  delegator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delegator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  operator?: InputMaybe<Scalars['String']['input']>;
  operator_?: InputMaybe<Operator_Filter>;
  operator_contains?: InputMaybe<Scalars['String']['input']>;
  operator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_gt?: InputMaybe<Scalars['String']['input']>;
  operator_gte?: InputMaybe<Scalars['String']['input']>;
  operator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_lt?: InputMaybe<Scalars['String']['input']>;
  operator_lte?: InputMaybe<Scalars['String']['input']>;
  operator_not?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<QueueEntry_Filter>>>;
};

export enum QueueEntry_OrderBy {
  Amount = 'amount',
  Date = 'date',
  Delegator = 'delegator',
  Id = 'id',
  Operator = 'operator',
  OperatorDelegatorCount = 'operator__delegatorCount',
  OperatorExchangeRate = 'operator__exchangeRate',
  OperatorFreeFundsWei = 'operator__freeFundsWei',
  OperatorId = 'operator__id',
  OperatorMetadataJsonString = 'operator__metadataJsonString',
  OperatorOwner = 'operator__owner',
  OperatorPoolTokenTotalSupplyWei = 'operator__poolTokenTotalSupplyWei',
  OperatorPoolValue = 'operator__poolValue',
  OperatorPoolValueBlockNumber = 'operator__poolValueBlockNumber',
  OperatorPoolValueTimestamp = 'operator__poolValueTimestamp',
  OperatorSlashingsCount = 'operator__slashingsCount',
  OperatorTotalValueInSponsorshipsWei = 'operator__totalValueInSponsorshipsWei'
}

export type SlashingEvent = {
  __typename?: 'SlashingEvent';
  amount: Scalars['BigInt']['output'];
  date: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  operator: Operator;
  sponsorship: Sponsorship;
};

export type SlashingEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<SlashingEvent_Filter>>>;
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
  operator?: InputMaybe<Scalars['String']['input']>;
  operator_?: InputMaybe<Operator_Filter>;
  operator_contains?: InputMaybe<Scalars['String']['input']>;
  operator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_gt?: InputMaybe<Scalars['String']['input']>;
  operator_gte?: InputMaybe<Scalars['String']['input']>;
  operator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_lt?: InputMaybe<Scalars['String']['input']>;
  operator_lte?: InputMaybe<Scalars['String']['input']>;
  operator_not?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<SlashingEvent_Filter>>>;
  sponsorship?: InputMaybe<Scalars['String']['input']>;
  sponsorship_?: InputMaybe<Sponsorship_Filter>;
  sponsorship_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorship_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_gt?: InputMaybe<Scalars['String']['input']>;
  sponsorship_gte?: InputMaybe<Scalars['String']['input']>;
  sponsorship_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorship_lt?: InputMaybe<Scalars['String']['input']>;
  sponsorship_lte?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorship_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum SlashingEvent_OrderBy {
  Amount = 'amount',
  Date = 'date',
  Id = 'id',
  Operator = 'operator',
  OperatorDelegatorCount = 'operator__delegatorCount',
  OperatorExchangeRate = 'operator__exchangeRate',
  OperatorFreeFundsWei = 'operator__freeFundsWei',
  OperatorId = 'operator__id',
  OperatorMetadataJsonString = 'operator__metadataJsonString',
  OperatorOwner = 'operator__owner',
  OperatorPoolTokenTotalSupplyWei = 'operator__poolTokenTotalSupplyWei',
  OperatorPoolValue = 'operator__poolValue',
  OperatorPoolValueBlockNumber = 'operator__poolValueBlockNumber',
  OperatorPoolValueTimestamp = 'operator__poolValueTimestamp',
  OperatorSlashingsCount = 'operator__slashingsCount',
  OperatorTotalValueInSponsorshipsWei = 'operator__totalValueInSponsorshipsWei',
  Sponsorship = 'sponsorship',
  SponsorshipCreator = 'sponsorship__creator',
  SponsorshipCumulativeSponsoring = 'sponsorship__cumulativeSponsoring',
  SponsorshipId = 'sponsorship__id',
  SponsorshipIsRunning = 'sponsorship__isRunning',
  SponsorshipMetadata = 'sponsorship__metadata',
  SponsorshipOperatorCount = 'sponsorship__operatorCount',
  SponsorshipProjectedInsolvency = 'sponsorship__projectedInsolvency',
  SponsorshipSpotApy = 'sponsorship__spotAPY',
  SponsorshipTotalPayoutWeiPerSec = 'sponsorship__totalPayoutWeiPerSec',
  SponsorshipTotalStakedWei = 'sponsorship__totalStakedWei',
  SponsorshipUnallocatedWei = 'sponsorship__unallocatedWei'
}

export type SponsoringEvent = {
  __typename?: 'SponsoringEvent';
  amount: Scalars['BigInt']['output'];
  date: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  sponsor: Scalars['String']['output'];
  sponsorship: Sponsorship;
};

export type SponsoringEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<SponsoringEvent_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<SponsoringEvent_Filter>>>;
  sponsor?: InputMaybe<Scalars['String']['input']>;
  sponsor_contains?: InputMaybe<Scalars['String']['input']>;
  sponsor_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsor_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsor_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsor_gt?: InputMaybe<Scalars['String']['input']>;
  sponsor_gte?: InputMaybe<Scalars['String']['input']>;
  sponsor_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsor_lt?: InputMaybe<Scalars['String']['input']>;
  sponsor_lte?: InputMaybe<Scalars['String']['input']>;
  sponsor_not?: InputMaybe<Scalars['String']['input']>;
  sponsor_not_contains?: InputMaybe<Scalars['String']['input']>;
  sponsor_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsor_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsor_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsor_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsor_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsor_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsor_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsor_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship?: InputMaybe<Scalars['String']['input']>;
  sponsorship_?: InputMaybe<Sponsorship_Filter>;
  sponsorship_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorship_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_gt?: InputMaybe<Scalars['String']['input']>;
  sponsorship_gte?: InputMaybe<Scalars['String']['input']>;
  sponsorship_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorship_lt?: InputMaybe<Scalars['String']['input']>;
  sponsorship_lte?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorship_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum SponsoringEvent_OrderBy {
  Amount = 'amount',
  Date = 'date',
  Id = 'id',
  Sponsor = 'sponsor',
  Sponsorship = 'sponsorship',
  SponsorshipCreator = 'sponsorship__creator',
  SponsorshipCumulativeSponsoring = 'sponsorship__cumulativeSponsoring',
  SponsorshipId = 'sponsorship__id',
  SponsorshipIsRunning = 'sponsorship__isRunning',
  SponsorshipMetadata = 'sponsorship__metadata',
  SponsorshipOperatorCount = 'sponsorship__operatorCount',
  SponsorshipProjectedInsolvency = 'sponsorship__projectedInsolvency',
  SponsorshipSpotApy = 'sponsorship__spotAPY',
  SponsorshipTotalPayoutWeiPerSec = 'sponsorship__totalPayoutWeiPerSec',
  SponsorshipTotalStakedWei = 'sponsorship__totalStakedWei',
  SponsorshipUnallocatedWei = 'sponsorship__unallocatedWei'
}

export type Sponsorship = {
  __typename?: 'Sponsorship';
  creator: Scalars['String']['output'];
  cumulativeSponsoring: Scalars['BigInt']['output'];
  flags: Array<Flag>;
  id: Scalars['ID']['output'];
  isRunning: Scalars['Boolean']['output'];
  metadata?: Maybe<Scalars['String']['output']>;
  operatorCount: Scalars['Int']['output'];
  projectedInsolvency: Scalars['BigInt']['output'];
  slashingEvents: Array<SlashingEvent>;
  sponsoringEvents: Array<SponsoringEvent>;
  spotAPY: Scalars['BigInt']['output'];
  stakes: Array<Stake>;
  stakingEvents: Array<StakingEvent>;
  stream?: Maybe<Stream>;
  totalPayoutWeiPerSec: Scalars['BigInt']['output'];
  totalStakedWei: Scalars['BigInt']['output'];
  unallocatedWei: Scalars['BigInt']['output'];
};


export type SponsorshipFlagsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Flag_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Flag_Filter>;
};


export type SponsorshipSlashingEventsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SlashingEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SlashingEvent_Filter>;
};


export type SponsorshipSponsoringEventsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SponsoringEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SponsoringEvent_Filter>;
};


export type SponsorshipStakesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Stake_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Stake_Filter>;
};


export type SponsorshipStakingEventsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<StakingEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<StakingEvent_Filter>;
};

export type SponsorshipDailyBucket = {
  __typename?: 'SponsorshipDailyBucket';
  date: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  operatorCount: Scalars['Int']['output'];
  projectedInsolvency: Scalars['BigInt']['output'];
  sponsorship: Sponsorship;
  spotAPY: Scalars['BigInt']['output'];
  totalPayoutsCumulative: Scalars['BigInt']['output'];
  totalStakedWei: Scalars['BigInt']['output'];
  unallocatedWei: Scalars['BigInt']['output'];
};

export type SponsorshipDailyBucket_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SponsorshipDailyBucket_Filter>>>;
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
  operatorCount?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_gt?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_gte?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  operatorCount_lt?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_lte?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_not?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<SponsorshipDailyBucket_Filter>>>;
  projectedInsolvency?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_gt?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_gte?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  projectedInsolvency_lt?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_lte?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_not?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sponsorship?: InputMaybe<Scalars['String']['input']>;
  sponsorship_?: InputMaybe<Sponsorship_Filter>;
  sponsorship_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorship_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_gt?: InputMaybe<Scalars['String']['input']>;
  sponsorship_gte?: InputMaybe<Scalars['String']['input']>;
  sponsorship_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorship_lt?: InputMaybe<Scalars['String']['input']>;
  sponsorship_lte?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorship_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  spotAPY?: InputMaybe<Scalars['BigInt']['input']>;
  spotAPY_gt?: InputMaybe<Scalars['BigInt']['input']>;
  spotAPY_gte?: InputMaybe<Scalars['BigInt']['input']>;
  spotAPY_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  spotAPY_lt?: InputMaybe<Scalars['BigInt']['input']>;
  spotAPY_lte?: InputMaybe<Scalars['BigInt']['input']>;
  spotAPY_not?: InputMaybe<Scalars['BigInt']['input']>;
  spotAPY_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalPayoutsCumulative?: InputMaybe<Scalars['BigInt']['input']>;
  totalPayoutsCumulative_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalPayoutsCumulative_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalPayoutsCumulative_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalPayoutsCumulative_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalPayoutsCumulative_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalPayoutsCumulative_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalPayoutsCumulative_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalStakedWei?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalStakedWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unallocatedWei?: InputMaybe<Scalars['BigInt']['input']>;
  unallocatedWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  unallocatedWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  unallocatedWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unallocatedWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  unallocatedWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  unallocatedWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  unallocatedWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum SponsorshipDailyBucket_OrderBy {
  Date = 'date',
  Id = 'id',
  OperatorCount = 'operatorCount',
  ProjectedInsolvency = 'projectedInsolvency',
  Sponsorship = 'sponsorship',
  SponsorshipCreator = 'sponsorship__creator',
  SponsorshipCumulativeSponsoring = 'sponsorship__cumulativeSponsoring',
  SponsorshipId = 'sponsorship__id',
  SponsorshipIsRunning = 'sponsorship__isRunning',
  SponsorshipMetadata = 'sponsorship__metadata',
  SponsorshipOperatorCount = 'sponsorship__operatorCount',
  SponsorshipProjectedInsolvency = 'sponsorship__projectedInsolvency',
  SponsorshipSpotApy = 'sponsorship__spotAPY',
  SponsorshipTotalPayoutWeiPerSec = 'sponsorship__totalPayoutWeiPerSec',
  SponsorshipTotalStakedWei = 'sponsorship__totalStakedWei',
  SponsorshipUnallocatedWei = 'sponsorship__unallocatedWei',
  SpotApy = 'spotAPY',
  TotalPayoutsCumulative = 'totalPayoutsCumulative',
  TotalStakedWei = 'totalStakedWei',
  UnallocatedWei = 'unallocatedWei'
}

export type Sponsorship_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Sponsorship_Filter>>>;
  creator?: InputMaybe<Scalars['String']['input']>;
  creator_contains?: InputMaybe<Scalars['String']['input']>;
  creator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  creator_ends_with?: InputMaybe<Scalars['String']['input']>;
  creator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creator_gt?: InputMaybe<Scalars['String']['input']>;
  creator_gte?: InputMaybe<Scalars['String']['input']>;
  creator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  creator_lt?: InputMaybe<Scalars['String']['input']>;
  creator_lte?: InputMaybe<Scalars['String']['input']>;
  creator_not?: InputMaybe<Scalars['String']['input']>;
  creator_not_contains?: InputMaybe<Scalars['String']['input']>;
  creator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  creator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  creator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  creator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  creator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creator_starts_with?: InputMaybe<Scalars['String']['input']>;
  creator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  cumulativeSponsoring?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeSponsoring_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeSponsoring_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeSponsoring_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeSponsoring_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeSponsoring_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeSponsoring_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeSponsoring_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  flags_?: InputMaybe<Flag_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isRunning?: InputMaybe<Scalars['Boolean']['input']>;
  isRunning_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isRunning_not?: InputMaybe<Scalars['Boolean']['input']>;
  isRunning_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  metadata?: InputMaybe<Scalars['String']['input']>;
  metadata_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadata_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_gt?: InputMaybe<Scalars['String']['input']>;
  metadata_gte?: InputMaybe<Scalars['String']['input']>;
  metadata_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_lt?: InputMaybe<Scalars['String']['input']>;
  metadata_lte?: InputMaybe<Scalars['String']['input']>;
  metadata_not?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadata_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadata_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadata_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operatorCount?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_gt?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_gte?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  operatorCount_lt?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_lte?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_not?: InputMaybe<Scalars['Int']['input']>;
  operatorCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Sponsorship_Filter>>>;
  projectedInsolvency?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_gt?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_gte?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  projectedInsolvency_lt?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_lte?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_not?: InputMaybe<Scalars['BigInt']['input']>;
  projectedInsolvency_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  slashingEvents_?: InputMaybe<SlashingEvent_Filter>;
  sponsoringEvents_?: InputMaybe<SponsoringEvent_Filter>;
  spotAPY?: InputMaybe<Scalars['BigInt']['input']>;
  spotAPY_gt?: InputMaybe<Scalars['BigInt']['input']>;
  spotAPY_gte?: InputMaybe<Scalars['BigInt']['input']>;
  spotAPY_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  spotAPY_lt?: InputMaybe<Scalars['BigInt']['input']>;
  spotAPY_lte?: InputMaybe<Scalars['BigInt']['input']>;
  spotAPY_not?: InputMaybe<Scalars['BigInt']['input']>;
  spotAPY_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakes_?: InputMaybe<Stake_Filter>;
  stakingEvents_?: InputMaybe<StakingEvent_Filter>;
  stream?: InputMaybe<Scalars['String']['input']>;
  stream_?: InputMaybe<Stream_Filter>;
  stream_contains?: InputMaybe<Scalars['String']['input']>;
  stream_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_ends_with?: InputMaybe<Scalars['String']['input']>;
  stream_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_gt?: InputMaybe<Scalars['String']['input']>;
  stream_gte?: InputMaybe<Scalars['String']['input']>;
  stream_in?: InputMaybe<Array<Scalars['String']['input']>>;
  stream_lt?: InputMaybe<Scalars['String']['input']>;
  stream_lte?: InputMaybe<Scalars['String']['input']>;
  stream_not?: InputMaybe<Scalars['String']['input']>;
  stream_not_contains?: InputMaybe<Scalars['String']['input']>;
  stream_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  stream_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  stream_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  stream_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_starts_with?: InputMaybe<Scalars['String']['input']>;
  stream_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  totalPayoutWeiPerSec?: InputMaybe<Scalars['BigInt']['input']>;
  totalPayoutWeiPerSec_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalPayoutWeiPerSec_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalPayoutWeiPerSec_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalPayoutWeiPerSec_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalPayoutWeiPerSec_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalPayoutWeiPerSec_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalPayoutWeiPerSec_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalStakedWei?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalStakedWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalStakedWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unallocatedWei?: InputMaybe<Scalars['BigInt']['input']>;
  unallocatedWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  unallocatedWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  unallocatedWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unallocatedWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  unallocatedWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  unallocatedWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  unallocatedWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Sponsorship_OrderBy {
  Creator = 'creator',
  CumulativeSponsoring = 'cumulativeSponsoring',
  Flags = 'flags',
  Id = 'id',
  IsRunning = 'isRunning',
  Metadata = 'metadata',
  OperatorCount = 'operatorCount',
  ProjectedInsolvency = 'projectedInsolvency',
  SlashingEvents = 'slashingEvents',
  SponsoringEvents = 'sponsoringEvents',
  SpotApy = 'spotAPY',
  Stakes = 'stakes',
  StakingEvents = 'stakingEvents',
  Stream = 'stream',
  StreamCreatedAt = 'stream__createdAt',
  StreamId = 'stream__id',
  StreamMetadata = 'stream__metadata',
  StreamUpdatedAt = 'stream__updatedAt',
  TotalPayoutWeiPerSec = 'totalPayoutWeiPerSec',
  TotalStakedWei = 'totalStakedWei',
  UnallocatedWei = 'unallocatedWei'
}

export type Stake = {
  __typename?: 'Stake';
  allocatedWei: Scalars['BigInt']['output'];
  amount: Scalars['BigInt']['output'];
  date?: Maybe<Scalars['BigInt']['output']>;
  id: Scalars['ID']['output'];
  operator: Operator;
  sponsorship?: Maybe<Sponsorship>;
};

export type Stake_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  allocatedWei?: InputMaybe<Scalars['BigInt']['input']>;
  allocatedWei_gt?: InputMaybe<Scalars['BigInt']['input']>;
  allocatedWei_gte?: InputMaybe<Scalars['BigInt']['input']>;
  allocatedWei_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  allocatedWei_lt?: InputMaybe<Scalars['BigInt']['input']>;
  allocatedWei_lte?: InputMaybe<Scalars['BigInt']['input']>;
  allocatedWei_not?: InputMaybe<Scalars['BigInt']['input']>;
  allocatedWei_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Stake_Filter>>>;
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
  operator?: InputMaybe<Scalars['String']['input']>;
  operator_?: InputMaybe<Operator_Filter>;
  operator_contains?: InputMaybe<Scalars['String']['input']>;
  operator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_gt?: InputMaybe<Scalars['String']['input']>;
  operator_gte?: InputMaybe<Scalars['String']['input']>;
  operator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_lt?: InputMaybe<Scalars['String']['input']>;
  operator_lte?: InputMaybe<Scalars['String']['input']>;
  operator_not?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Stake_Filter>>>;
  sponsorship?: InputMaybe<Scalars['String']['input']>;
  sponsorship_?: InputMaybe<Sponsorship_Filter>;
  sponsorship_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorship_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_gt?: InputMaybe<Scalars['String']['input']>;
  sponsorship_gte?: InputMaybe<Scalars['String']['input']>;
  sponsorship_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorship_lt?: InputMaybe<Scalars['String']['input']>;
  sponsorship_lte?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorship_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Stake_OrderBy {
  AllocatedWei = 'allocatedWei',
  Amount = 'amount',
  Date = 'date',
  Id = 'id',
  Operator = 'operator',
  OperatorDelegatorCount = 'operator__delegatorCount',
  OperatorExchangeRate = 'operator__exchangeRate',
  OperatorFreeFundsWei = 'operator__freeFundsWei',
  OperatorId = 'operator__id',
  OperatorMetadataJsonString = 'operator__metadataJsonString',
  OperatorOwner = 'operator__owner',
  OperatorPoolTokenTotalSupplyWei = 'operator__poolTokenTotalSupplyWei',
  OperatorPoolValue = 'operator__poolValue',
  OperatorPoolValueBlockNumber = 'operator__poolValueBlockNumber',
  OperatorPoolValueTimestamp = 'operator__poolValueTimestamp',
  OperatorSlashingsCount = 'operator__slashingsCount',
  OperatorTotalValueInSponsorshipsWei = 'operator__totalValueInSponsorshipsWei',
  Sponsorship = 'sponsorship',
  SponsorshipCreator = 'sponsorship__creator',
  SponsorshipCumulativeSponsoring = 'sponsorship__cumulativeSponsoring',
  SponsorshipId = 'sponsorship__id',
  SponsorshipIsRunning = 'sponsorship__isRunning',
  SponsorshipMetadata = 'sponsorship__metadata',
  SponsorshipOperatorCount = 'sponsorship__operatorCount',
  SponsorshipProjectedInsolvency = 'sponsorship__projectedInsolvency',
  SponsorshipSpotApy = 'sponsorship__spotAPY',
  SponsorshipTotalPayoutWeiPerSec = 'sponsorship__totalPayoutWeiPerSec',
  SponsorshipTotalStakedWei = 'sponsorship__totalStakedWei',
  SponsorshipUnallocatedWei = 'sponsorship__unallocatedWei'
}

export type StakingEvent = {
  __typename?: 'StakingEvent';
  amount: Scalars['BigInt']['output'];
  date: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  operator: Operator;
  sponsorship: Sponsorship;
};

export type StakingEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<StakingEvent_Filter>>>;
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
  operator?: InputMaybe<Scalars['String']['input']>;
  operator_?: InputMaybe<Operator_Filter>;
  operator_contains?: InputMaybe<Scalars['String']['input']>;
  operator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_gt?: InputMaybe<Scalars['String']['input']>;
  operator_gte?: InputMaybe<Scalars['String']['input']>;
  operator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_lt?: InputMaybe<Scalars['String']['input']>;
  operator_lte?: InputMaybe<Scalars['String']['input']>;
  operator_not?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<StakingEvent_Filter>>>;
  sponsorship?: InputMaybe<Scalars['String']['input']>;
  sponsorship_?: InputMaybe<Sponsorship_Filter>;
  sponsorship_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorship_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_gt?: InputMaybe<Scalars['String']['input']>;
  sponsorship_gte?: InputMaybe<Scalars['String']['input']>;
  sponsorship_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorship_lt?: InputMaybe<Scalars['String']['input']>;
  sponsorship_lte?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_contains?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sponsorship_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sponsorship_starts_with?: InputMaybe<Scalars['String']['input']>;
  sponsorship_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum StakingEvent_OrderBy {
  Amount = 'amount',
  Date = 'date',
  Id = 'id',
  Operator = 'operator',
  OperatorDelegatorCount = 'operator__delegatorCount',
  OperatorExchangeRate = 'operator__exchangeRate',
  OperatorFreeFundsWei = 'operator__freeFundsWei',
  OperatorId = 'operator__id',
  OperatorMetadataJsonString = 'operator__metadataJsonString',
  OperatorOwner = 'operator__owner',
  OperatorPoolTokenTotalSupplyWei = 'operator__poolTokenTotalSupplyWei',
  OperatorPoolValue = 'operator__poolValue',
  OperatorPoolValueBlockNumber = 'operator__poolValueBlockNumber',
  OperatorPoolValueTimestamp = 'operator__poolValueTimestamp',
  OperatorSlashingsCount = 'operator__slashingsCount',
  OperatorTotalValueInSponsorshipsWei = 'operator__totalValueInSponsorshipsWei',
  Sponsorship = 'sponsorship',
  SponsorshipCreator = 'sponsorship__creator',
  SponsorshipCumulativeSponsoring = 'sponsorship__cumulativeSponsoring',
  SponsorshipId = 'sponsorship__id',
  SponsorshipIsRunning = 'sponsorship__isRunning',
  SponsorshipMetadata = 'sponsorship__metadata',
  SponsorshipOperatorCount = 'sponsorship__operatorCount',
  SponsorshipProjectedInsolvency = 'sponsorship__projectedInsolvency',
  SponsorshipSpotApy = 'sponsorship__spotAPY',
  SponsorshipTotalPayoutWeiPerSec = 'sponsorship__totalPayoutWeiPerSec',
  SponsorshipTotalStakedWei = 'sponsorship__totalStakedWei',
  SponsorshipUnallocatedWei = 'sponsorship__unallocatedWei'
}

export type Stream = {
  __typename?: 'Stream';
  /** date created. This is a timestamp in seconds */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
  /** stream ID = 'creator address'/'path' where path can be any string */
  id: Scalars['ID']['output'];
  /** Stream metadata JSON */
  metadata: Scalars['String']['output'];
  /** Permissions that each Ethereum address owns to this stream */
  permissions?: Maybe<Array<StreamPermission>>;
  sponsorships?: Maybe<Array<Sponsorship>>;
  /** Nodes the have been registered as storage nodes to this stream in the StreamStorageRegistry */
  storageNodes?: Maybe<Array<Node>>;
  /** date updated. This is a timestamp in seconds */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
};


export type StreamPermissionsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<StreamPermission_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<StreamPermission_Filter>;
};


export type StreamSponsorshipsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Sponsorship_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Sponsorship_Filter>;
};


export type StreamStorageNodesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Node_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Node_Filter>;
};

export type StreamPermission = {
  __typename?: 'StreamPermission';
  /** canDelete permission allows deleting the stream from the StreamRegistry */
  canDelete?: Maybe<Scalars['Boolean']['output']>;
  /** Edit permission enables changing the stream's metadata */
  canEdit?: Maybe<Scalars['Boolean']['output']>;
  /** grant permission allows granting and revoking permissions to this stream */
  canGrant?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  /** publishExpiration timestamp tells until what time this address may publish data to the stream */
  publishExpiration?: Maybe<Scalars['BigInt']['output']>;
  /** Target stream this permission applies to */
  stream?: Maybe<Stream>;
  /** subscribeExpires timestamp tells until what time this address may subscribe to the stream */
  subscribeExpiration?: Maybe<Scalars['BigInt']['output']>;
  /** Ethereum address, owner of this permission */
  userAddress: Scalars['Bytes']['output'];
};

export type StreamPermission_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<StreamPermission_Filter>>>;
  canDelete?: InputMaybe<Scalars['Boolean']['input']>;
  canDelete_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canDelete_not?: InputMaybe<Scalars['Boolean']['input']>;
  canDelete_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canEdit?: InputMaybe<Scalars['Boolean']['input']>;
  canEdit_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canEdit_not?: InputMaybe<Scalars['Boolean']['input']>;
  canEdit_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canGrant?: InputMaybe<Scalars['Boolean']['input']>;
  canGrant_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canGrant_not?: InputMaybe<Scalars['Boolean']['input']>;
  canGrant_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<StreamPermission_Filter>>>;
  publishExpiration?: InputMaybe<Scalars['BigInt']['input']>;
  publishExpiration_gt?: InputMaybe<Scalars['BigInt']['input']>;
  publishExpiration_gte?: InputMaybe<Scalars['BigInt']['input']>;
  publishExpiration_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  publishExpiration_lt?: InputMaybe<Scalars['BigInt']['input']>;
  publishExpiration_lte?: InputMaybe<Scalars['BigInt']['input']>;
  publishExpiration_not?: InputMaybe<Scalars['BigInt']['input']>;
  publishExpiration_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stream?: InputMaybe<Scalars['String']['input']>;
  stream_?: InputMaybe<Stream_Filter>;
  stream_contains?: InputMaybe<Scalars['String']['input']>;
  stream_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_ends_with?: InputMaybe<Scalars['String']['input']>;
  stream_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_gt?: InputMaybe<Scalars['String']['input']>;
  stream_gte?: InputMaybe<Scalars['String']['input']>;
  stream_in?: InputMaybe<Array<Scalars['String']['input']>>;
  stream_lt?: InputMaybe<Scalars['String']['input']>;
  stream_lte?: InputMaybe<Scalars['String']['input']>;
  stream_not?: InputMaybe<Scalars['String']['input']>;
  stream_not_contains?: InputMaybe<Scalars['String']['input']>;
  stream_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  stream_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  stream_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  stream_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stream_starts_with?: InputMaybe<Scalars['String']['input']>;
  stream_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  subscribeExpiration?: InputMaybe<Scalars['BigInt']['input']>;
  subscribeExpiration_gt?: InputMaybe<Scalars['BigInt']['input']>;
  subscribeExpiration_gte?: InputMaybe<Scalars['BigInt']['input']>;
  subscribeExpiration_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  subscribeExpiration_lt?: InputMaybe<Scalars['BigInt']['input']>;
  subscribeExpiration_lte?: InputMaybe<Scalars['BigInt']['input']>;
  subscribeExpiration_not?: InputMaybe<Scalars['BigInt']['input']>;
  subscribeExpiration_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  userAddress?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  userAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  userAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum StreamPermission_OrderBy {
  CanDelete = 'canDelete',
  CanEdit = 'canEdit',
  CanGrant = 'canGrant',
  Id = 'id',
  PublishExpiration = 'publishExpiration',
  Stream = 'stream',
  StreamCreatedAt = 'stream__createdAt',
  StreamId = 'stream__id',
  StreamMetadata = 'stream__metadata',
  StreamUpdatedAt = 'stream__updatedAt',
  SubscribeExpiration = 'subscribeExpiration',
  UserAddress = 'userAddress'
}

export type Stream_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Stream_Filter>>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  metadata?: InputMaybe<Scalars['String']['input']>;
  metadata_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadata_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_gt?: InputMaybe<Scalars['String']['input']>;
  metadata_gte?: InputMaybe<Scalars['String']['input']>;
  metadata_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_lt?: InputMaybe<Scalars['String']['input']>;
  metadata_lte?: InputMaybe<Scalars['String']['input']>;
  metadata_not?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadata_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadata_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadata_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Stream_Filter>>>;
  permissions_?: InputMaybe<StreamPermission_Filter>;
  sponsorships_?: InputMaybe<Sponsorship_Filter>;
  storageNodes_?: InputMaybe<Node_Filter>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Stream_OrderBy {
  CreatedAt = 'createdAt',
  Id = 'id',
  Metadata = 'metadata',
  Permissions = 'permissions',
  Sponsorships = 'sponsorships',
  StorageNodes = 'storageNodes',
  UpdatedAt = 'updatedAt'
}

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  delegation?: Maybe<Delegation>;
  delegations: Array<Delegation>;
  flag?: Maybe<Flag>;
  flags: Array<Flag>;
  node?: Maybe<Node>;
  nodes: Array<Node>;
  operator?: Maybe<Operator>;
  operatorDailyBucket?: Maybe<OperatorDailyBucket>;
  operatorDailyBuckets: Array<OperatorDailyBucket>;
  operators: Array<Operator>;
  project?: Maybe<Project>;
  projectPaymentDetails: Array<ProjectPaymentDetails>;
  projectPermission?: Maybe<ProjectPermission>;
  projectPermissions: Array<ProjectPermission>;
  projectPurchase?: Maybe<ProjectPurchase>;
  projectPurchases: Array<ProjectPurchase>;
  projectStakeByUser?: Maybe<ProjectStakeByUser>;
  projectStakeByUsers: Array<ProjectStakeByUser>;
  projectStakingDayBucket?: Maybe<ProjectStakingDayBucket>;
  projectStakingDayBuckets: Array<ProjectStakingDayBucket>;
  projectSubscription?: Maybe<ProjectSubscription>;
  projectSubscriptions: Array<ProjectSubscription>;
  projects: Array<Project>;
  queueEntries: Array<QueueEntry>;
  queueEntry?: Maybe<QueueEntry>;
  slashingEvent?: Maybe<SlashingEvent>;
  slashingEvents: Array<SlashingEvent>;
  sponsoringEvent?: Maybe<SponsoringEvent>;
  sponsoringEvents: Array<SponsoringEvent>;
  sponsorship?: Maybe<Sponsorship>;
  sponsorshipDailyBucket?: Maybe<SponsorshipDailyBucket>;
  sponsorshipDailyBuckets: Array<SponsorshipDailyBucket>;
  sponsorships: Array<Sponsorship>;
  stake?: Maybe<Stake>;
  stakes: Array<Stake>;
  stakingEvent?: Maybe<StakingEvent>;
  stakingEvents: Array<StakingEvent>;
  stream?: Maybe<Stream>;
  streamPermission?: Maybe<StreamPermission>;
  streamPermissions: Array<StreamPermission>;
  streams: Array<Stream>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionDelegationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDelegationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Delegation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Delegation_Filter>;
};


export type SubscriptionFlagArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionFlagsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Flag_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Flag_Filter>;
};


export type SubscriptionNodeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionNodesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Node_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Node_Filter>;
};


export type SubscriptionOperatorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionOperatorDailyBucketArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionOperatorDailyBucketsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OperatorDailyBucket_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OperatorDailyBucket_Filter>;
};


export type SubscriptionOperatorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Operator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Operator_Filter>;
};


export type SubscriptionProjectArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProjectPaymentDetailsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectPaymentDetails_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProjectPaymentDetails_Filter>;
};


export type SubscriptionProjectPermissionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProjectPermissionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectPermission_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProjectPermission_Filter>;
};


export type SubscriptionProjectPurchaseArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProjectPurchasesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectPurchase_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProjectPurchase_Filter>;
};


export type SubscriptionProjectStakeByUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProjectStakeByUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectStakeByUser_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProjectStakeByUser_Filter>;
};


export type SubscriptionProjectStakingDayBucketArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProjectStakingDayBucketsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectStakingDayBucket_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProjectStakingDayBucket_Filter>;
};


export type SubscriptionProjectSubscriptionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProjectSubscriptionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProjectSubscription_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProjectSubscription_Filter>;
};


export type SubscriptionProjectsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Project_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Project_Filter>;
};


export type SubscriptionQueueEntriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<QueueEntry_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<QueueEntry_Filter>;
};


export type SubscriptionQueueEntryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSlashingEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSlashingEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SlashingEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SlashingEvent_Filter>;
};


export type SubscriptionSponsoringEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSponsoringEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SponsoringEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SponsoringEvent_Filter>;
};


export type SubscriptionSponsorshipArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSponsorshipDailyBucketArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSponsorshipDailyBucketsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SponsorshipDailyBucket_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SponsorshipDailyBucket_Filter>;
};


export type SubscriptionSponsorshipsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Sponsorship_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Sponsorship_Filter>;
};


export type SubscriptionStakeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionStakesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Stake_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Stake_Filter>;
};


export type SubscriptionStakingEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionStakingEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<StakingEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StakingEvent_Filter>;
};


export type SubscriptionStreamArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionStreamPermissionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionStreamPermissionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<StreamPermission_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StreamPermission_Filter>;
};


export type SubscriptionStreamsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Stream_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Stream_Filter>;
};

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

export type OperatorFieldsFragment = { __typename?: 'Operator', id: string, delegatorCount: number, poolValue: any, totalValueInSponsorshipsWei: any, freeFundsWei: any, poolValueTimestamp: any, poolValueBlockNumber: any, poolTokenTotalSupplyWei: any, exchangeRate: any, metadataJsonString: string, owner: string, stakes: Array<{ __typename?: 'Stake', amount: any, allocatedWei: any, date?: any | null, operator: { __typename?: 'Operator', id: string }, sponsorship?: { __typename?: 'Sponsorship', id: string } | null }>, delegators: Array<{ __typename?: 'Delegation', poolTokenWei: any, operator?: { __typename?: 'Operator', id: string } | null }> };

export type GetAllOperatorsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAllOperatorsQuery = { __typename?: 'Query', operators: Array<{ __typename?: 'Operator', id: string, delegatorCount: number, poolValue: any, totalValueInSponsorshipsWei: any, freeFundsWei: any, poolValueTimestamp: any, poolValueBlockNumber: any, poolTokenTotalSupplyWei: any, exchangeRate: any, metadataJsonString: string, owner: string, stakes: Array<{ __typename?: 'Stake', amount: any, allocatedWei: any, date?: any | null, operator: { __typename?: 'Operator', id: string }, sponsorship?: { __typename?: 'Sponsorship', id: string } | null }>, delegators: Array<{ __typename?: 'Delegation', poolTokenWei: any, operator?: { __typename?: 'Operator', id: string } | null }> }> };

export type SponsorshipFieldsFragment = { __typename?: 'Sponsorship', id: string, metadata?: string | null, isRunning: boolean, totalPayoutWeiPerSec: any, operatorCount: number, totalStakedWei: any, unallocatedWei: any, projectedInsolvency: any, creator: string, stream?: { __typename?: 'Stream', id: string, metadata: string } | null, stakes: Array<{ __typename?: 'Stake', amount: any, allocatedWei: any, date?: any | null, operator: { __typename?: 'Operator', id: string } }> };

export type GetAllSponsorshipsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  streamContains?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAllSponsorshipsQuery = { __typename?: 'Query', sponsorships: Array<{ __typename?: 'Sponsorship', id: string, metadata?: string | null, isRunning: boolean, totalPayoutWeiPerSec: any, operatorCount: number, totalStakedWei: any, unallocatedWei: any, projectedInsolvency: any, creator: string, stream?: { __typename?: 'Stream', id: string, metadata: string } | null, stakes: Array<{ __typename?: 'Stake', amount: any, allocatedWei: any, date?: any | null, operator: { __typename?: 'Operator', id: string } }> }> };

export type GetSponsorshipsByCreatorQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  streamContains?: InputMaybe<Scalars['String']['input']>;
  creator: Scalars['String']['input'];
}>;


export type GetSponsorshipsByCreatorQuery = { __typename?: 'Query', sponsorships: Array<{ __typename?: 'Sponsorship', id: string, metadata?: string | null, isRunning: boolean, totalPayoutWeiPerSec: any, operatorCount: number, totalStakedWei: any, unallocatedWei: any, projectedInsolvency: any, creator: string, stream?: { __typename?: 'Stream', id: string, metadata: string } | null, stakes: Array<{ __typename?: 'Stake', amount: any, allocatedWei: any, date?: any | null, operator: { __typename?: 'Operator', id: string } }> }> };

export type GetSponsorshipByIdQueryVariables = Exact<{
  sponsorshipId: Scalars['ID']['input'];
}>;


export type GetSponsorshipByIdQuery = { __typename?: 'Query', sponsorship?: { __typename?: 'Sponsorship', id: string, metadata?: string | null, isRunning: boolean, totalPayoutWeiPerSec: any, operatorCount: number, totalStakedWei: any, unallocatedWei: any, projectedInsolvency: any, creator: string, stream?: { __typename?: 'Stream', id: string, metadata: string } | null, stakes: Array<{ __typename?: 'Stake', amount: any, allocatedWei: any, date?: any | null, operator: { __typename?: 'Operator', id: string } }> } | null };

export type ProjectFieldsFragment = { __typename?: 'Project', id: string, domainIds: Array<any>, score: any, metadata: string, streams: Array<string>, minimumSubscriptionSeconds: any, createdAt?: any | null, updatedAt?: any | null, isDataUnion?: boolean | null, paymentDetails: Array<{ __typename?: 'ProjectPaymentDetails', domainId?: any | null, beneficiary: any, pricingTokenAddress: any, pricePerSecond?: any | null }>, subscriptions: Array<{ __typename?: 'ProjectSubscription', userAddress: any, endTimestamp?: any | null }>, permissions: Array<{ __typename?: 'ProjectPermission', userAddress: any, canBuy?: boolean | null, canDelete?: boolean | null, canEdit?: boolean | null, canGrant?: boolean | null }>, purchases: Array<{ __typename?: 'ProjectPurchase', subscriber: any, subscriptionSeconds: any, price: any, fee: any, purchasedAt?: any | null }> };

export type GetProjectQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetProjectQuery = { __typename?: 'Query', project?: { __typename?: 'Project', id: string, domainIds: Array<any>, score: any, metadata: string, streams: Array<string>, minimumSubscriptionSeconds: any, createdAt?: any | null, updatedAt?: any | null, isDataUnion?: boolean | null, paymentDetails: Array<{ __typename?: 'ProjectPaymentDetails', domainId?: any | null, beneficiary: any, pricingTokenAddress: any, pricePerSecond?: any | null }>, subscriptions: Array<{ __typename?: 'ProjectSubscription', userAddress: any, endTimestamp?: any | null }>, permissions: Array<{ __typename?: 'ProjectPermission', userAddress: any, canBuy?: boolean | null, canDelete?: boolean | null, canEdit?: boolean | null, canGrant?: boolean | null }>, purchases: Array<{ __typename?: 'ProjectPurchase', subscriber: any, subscriptionSeconds: any, price: any, fee: any, purchasedAt?: any | null }> } | null };

export type GetProjectsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Project_Filter>;
}>;


export type GetProjectsQuery = { __typename?: 'Query', projects: Array<{ __typename?: 'Project', id: string, domainIds: Array<any>, score: any, metadata: string, streams: Array<string>, minimumSubscriptionSeconds: any, createdAt?: any | null, updatedAt?: any | null, isDataUnion?: boolean | null, paymentDetails: Array<{ __typename?: 'ProjectPaymentDetails', domainId?: any | null, beneficiary: any, pricingTokenAddress: any, pricePerSecond?: any | null }>, subscriptions: Array<{ __typename?: 'ProjectSubscription', userAddress: any, endTimestamp?: any | null }>, permissions: Array<{ __typename?: 'ProjectPermission', userAddress: any, canBuy?: boolean | null, canDelete?: boolean | null, canEdit?: boolean | null, canGrant?: boolean | null }>, purchases: Array<{ __typename?: 'ProjectPurchase', subscriber: any, subscriptionSeconds: any, price: any, fee: any, purchasedAt?: any | null }> }> };

export type GetProjectsByTextQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  text: Scalars['String']['input'];
}>;


export type GetProjectsByTextQuery = { __typename?: 'Query', projectSearch: Array<{ __typename?: 'Project', id: string, domainIds: Array<any>, score: any, metadata: string, streams: Array<string>, minimumSubscriptionSeconds: any, createdAt?: any | null, updatedAt?: any | null, isDataUnion?: boolean | null, paymentDetails: Array<{ __typename?: 'ProjectPaymentDetails', domainId?: any | null, beneficiary: any, pricingTokenAddress: any, pricePerSecond?: any | null }>, subscriptions: Array<{ __typename?: 'ProjectSubscription', userAddress: any, endTimestamp?: any | null }>, permissions: Array<{ __typename?: 'ProjectPermission', userAddress: any, canBuy?: boolean | null, canDelete?: boolean | null, canEdit?: boolean | null, canGrant?: boolean | null }>, purchases: Array<{ __typename?: 'ProjectPurchase', subscriber: any, subscriptionSeconds: any, price: any, fee: any, purchasedAt?: any | null }> }> };

export type GetProjectSubscriptionsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetProjectSubscriptionsQuery = { __typename?: 'Query', project?: { __typename?: 'Project', subscriptions: Array<{ __typename?: 'ProjectSubscription', userAddress: any, endTimestamp?: any | null }> } | null };

export type GetProjectForPurchaseQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetProjectForPurchaseQuery = { __typename?: 'Query', project?: { __typename?: 'Project', streams: Array<string>, paymentDetails: Array<{ __typename?: 'ProjectPaymentDetails', domainId?: any | null, beneficiary: any, pricingTokenAddress: any, pricePerSecond?: any | null }> } | null };

export type StreamFieldsFragment = { __typename?: 'Stream', id: string, metadata: string, permissions?: Array<{ __typename?: 'StreamPermission', id: string, canGrant?: boolean | null, canEdit?: boolean | null, canDelete?: boolean | null, userAddress: any }> | null };

export type GetStreamByIdQueryVariables = Exact<{
  streamId: Scalars['ID']['input'];
}>;


export type GetStreamByIdQuery = { __typename?: 'Query', stream?: { __typename?: 'Stream', id: string, metadata: string, permissions?: Array<{ __typename?: 'StreamPermission', id: string, canGrant?: boolean | null, canEdit?: boolean | null, canDelete?: boolean | null, userAddress: any }> | null } | null };

export type SponsorshipDailyBucketFieldsFragment = { __typename?: 'SponsorshipDailyBucket', id: string, operatorCount: number, projectedInsolvency: any, spotAPY: any, totalPayoutsCumulative: any, totalStakedWei: any, unallocatedWei: any, date: any, sponsorship: { __typename?: 'Sponsorship', id: string } };

export type GetSponsorshipDailyBucketsQueryVariables = Exact<{
  where: SponsorshipDailyBucket_Filter;
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetSponsorshipDailyBucketsQuery = { __typename?: 'Query', sponsorshipDailyBuckets: Array<{ __typename?: 'SponsorshipDailyBucket', id: string, operatorCount: number, projectedInsolvency: any, spotAPY: any, totalPayoutsCumulative: any, totalStakedWei: any, unallocatedWei: any, date: any, sponsorship: { __typename?: 'Sponsorship', id: string } }> };

export const OperatorFieldsFragmentDoc = gql`
    fragment OperatorFields on Operator {
  id
  stakes {
    operator {
      id
    }
    amount
    allocatedWei
    date
    sponsorship {
      id
    }
  }
  delegators {
    operator {
      id
    }
    poolTokenWei
  }
  delegatorCount
  poolValue
  totalValueInSponsorshipsWei
  freeFundsWei
  poolValueTimestamp
  poolValueBlockNumber
  poolTokenTotalSupplyWei
  exchangeRate
  metadataJsonString
  owner
}
    `;
export const SponsorshipFieldsFragmentDoc = gql`
    fragment SponsorshipFields on Sponsorship {
  id
  stream {
    id
    metadata
  }
  metadata
  isRunning
  totalPayoutWeiPerSec
  stakes {
    operator {
      id
    }
    amount
    allocatedWei
    date
  }
  operatorCount
  totalStakedWei
  unallocatedWei
  projectedInsolvency
  creator
}
    `;
export const ProjectFieldsFragmentDoc = gql`
    fragment ProjectFields on Project {
  id
  domainIds
  score
  metadata
  streams
  minimumSubscriptionSeconds
  createdAt
  updatedAt
  isDataUnion
  paymentDetails {
    domainId
    beneficiary
    pricingTokenAddress
    pricePerSecond
  }
  subscriptions {
    userAddress
    endTimestamp
  }
  permissions {
    userAddress
    canBuy
    canDelete
    canEdit
    canGrant
  }
  purchases {
    subscriber
    subscriptionSeconds
    price
    fee
    purchasedAt
  }
}
    `;
export const StreamFieldsFragmentDoc = gql`
    fragment StreamFields on Stream {
  id
  metadata
  permissions {
    id
    canGrant
    canEdit
    canDelete
    userAddress
  }
}
    `;
export const SponsorshipDailyBucketFieldsFragmentDoc = gql`
    fragment SponsorshipDailyBucketFields on SponsorshipDailyBucket {
  id
  operatorCount
  projectedInsolvency
  spotAPY
  totalPayoutsCumulative
  totalStakedWei
  unallocatedWei
  date
  sponsorship {
    id
  }
}
    `;
export const GetAllOperatorsDocument = gql`
    query getAllOperators($first: Int, $skip: Int) {
  operators(first: $first, skip: $skip) {
    ...OperatorFields
  }
}
    ${OperatorFieldsFragmentDoc}`;
export type GetAllOperatorsQueryResult = Apollo.QueryResult<GetAllOperatorsQuery, GetAllOperatorsQueryVariables>;
export const GetAllSponsorshipsDocument = gql`
    query getAllSponsorships($first: Int, $skip: Int, $streamContains: String) {
  sponsorships(
    first: $first
    skip: $skip
    where: {stream_contains: $streamContains}
  ) {
    ...SponsorshipFields
  }
}
    ${SponsorshipFieldsFragmentDoc}`;
export type GetAllSponsorshipsQueryResult = Apollo.QueryResult<GetAllSponsorshipsQuery, GetAllSponsorshipsQueryVariables>;
export const GetSponsorshipsByCreatorDocument = gql`
    query getSponsorshipsByCreator($first: Int, $skip: Int, $streamContains: String, $creator: String!) {
  sponsorships(
    first: $first
    skip: $skip
    where: {creator: $creator, stream_contains: $streamContains}
  ) {
    ...SponsorshipFields
  }
}
    ${SponsorshipFieldsFragmentDoc}`;
export type GetSponsorshipsByCreatorQueryResult = Apollo.QueryResult<GetSponsorshipsByCreatorQuery, GetSponsorshipsByCreatorQueryVariables>;
export const GetSponsorshipByIdDocument = gql`
    query getSponsorshipById($sponsorshipId: ID!) {
  sponsorship(id: $sponsorshipId) {
    ...SponsorshipFields
  }
}
    ${SponsorshipFieldsFragmentDoc}`;
export type GetSponsorshipByIdQueryResult = Apollo.QueryResult<GetSponsorshipByIdQuery, GetSponsorshipByIdQueryVariables>;
export const GetProjectDocument = gql`
    query getProject($id: ID!) {
  project(id: $id) {
    ...ProjectFields
  }
}
    ${ProjectFieldsFragmentDoc}`;
export type GetProjectQueryResult = Apollo.QueryResult<GetProjectQuery, GetProjectQueryVariables>;
export const GetProjectsDocument = gql`
    query getProjects($first: Int, $skip: Int, $where: Project_filter) {
  projects(
    first: $first
    skip: $skip
    orderBy: score
    orderDirection: desc
    where: $where
  ) {
    ...ProjectFields
  }
}
    ${ProjectFieldsFragmentDoc}`;
export type GetProjectsQueryResult = Apollo.QueryResult<GetProjectsQuery, GetProjectsQueryVariables>;
export const GetProjectsByTextDocument = gql`
    query getProjectsByText($first: Int, $skip: Int, $text: String!) {
  projectSearch(first: $first, skip: $skip, text: $text) {
    ...ProjectFields
  }
}
    ${ProjectFieldsFragmentDoc}`;
export type GetProjectsByTextQueryResult = Apollo.QueryResult<GetProjectsByTextQuery, GetProjectsByTextQueryVariables>;
export const GetProjectSubscriptionsDocument = gql`
    query getProjectSubscriptions($id: ID!) {
  project(id: $id) {
    subscriptions {
      userAddress
      endTimestamp
    }
  }
}
    `;
export type GetProjectSubscriptionsQueryResult = Apollo.QueryResult<GetProjectSubscriptionsQuery, GetProjectSubscriptionsQueryVariables>;
export const GetProjectForPurchaseDocument = gql`
    query getProjectForPurchase($id: ID!) {
  project(id: $id) {
    streams
    paymentDetails {
      domainId
      beneficiary
      pricingTokenAddress
      pricePerSecond
    }
  }
}
    `;
export type GetProjectForPurchaseQueryResult = Apollo.QueryResult<GetProjectForPurchaseQuery, GetProjectForPurchaseQueryVariables>;
export const GetStreamByIdDocument = gql`
    query getStreamById($streamId: ID!) {
  stream(id: $streamId) {
    ...StreamFields
  }
}
    ${StreamFieldsFragmentDoc}`;
export type GetStreamByIdQueryResult = Apollo.QueryResult<GetStreamByIdQuery, GetStreamByIdQueryVariables>;
export const GetSponsorshipDailyBucketsDocument = gql`
    query getSponsorshipDailyBuckets($where: SponsorshipDailyBucket_filter!, $first: Int, $skip: Int) {
  sponsorshipDailyBuckets(first: $first, skip: $skip, where: $where) {
    ...SponsorshipDailyBucketFields
  }
}
    ${SponsorshipDailyBucketFieldsFragmentDoc}`;
export type GetSponsorshipDailyBucketsQueryResult = Apollo.QueryResult<GetSponsorshipDailyBucketsQuery, GetSponsorshipDailyBucketsQueryVariables>;
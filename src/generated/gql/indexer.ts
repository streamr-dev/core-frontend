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
};

export type Location = {
  __typename?: 'Location';
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
};

export type Neighbor = {
  __typename?: 'Neighbor';
  nodeId1: Scalars['String']['output'];
  nodeId2: Scalars['String']['output'];
  streamPartId: Scalars['String']['output'];
};

export type Neighbors = {
  __typename?: 'Neighbors';
  cursor?: Maybe<Scalars['String']['output']>;
  items: Array<Neighbor>;
};

export type Node = {
  __typename?: 'Node';
  id: Scalars['String']['output'];
  ipAddress?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Location>;
};

export type Nodes = {
  __typename?: 'Nodes';
  cursor?: Maybe<Scalars['String']['output']>;
  items: Array<Node>;
};

export enum OrderDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Query = {
  __typename?: 'Query';
  neighbors: Neighbors;
  nodes: Nodes;
  streams: Streams;
  summary: Summary;
};


export type QueryNeighborsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  node?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  streamPart?: InputMaybe<Scalars['String']['input']>;
};


export type QueryNodesArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  ids?: InputMaybe<Array<Scalars['String']['input']>>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryStreamsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  ids?: InputMaybe<Array<Scalars['String']['input']>>;
  orderBy?: InputMaybe<StreamOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  owner?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  searchTerm?: InputMaybe<Scalars['String']['input']>;
};

export type Stream = {
  __typename?: 'Stream';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  messagesPerSecond: Scalars['Float']['output'];
  peerCount: Scalars['Int']['output'];
  publisherCount?: Maybe<Scalars['Int']['output']>;
  subscriberCount?: Maybe<Scalars['Int']['output']>;
};

export enum StreamOrderBy {
  Description = 'DESCRIPTION',
  Id = 'ID',
  MessagesPerSecond = 'MESSAGES_PER_SECOND',
  PeerCount = 'PEER_COUNT',
  PublisherCount = 'PUBLISHER_COUNT',
  SubscriberCount = 'SUBSCRIBER_COUNT'
}

export type Streams = {
  __typename?: 'Streams';
  cursor?: Maybe<Scalars['String']['output']>;
  items: Array<Stream>;
};

export type Summary = {
  __typename?: 'Summary';
  messagesPerSecond: Scalars['Float']['output'];
  nodeCount: Scalars['Int']['output'];
  streamCount: Scalars['Int']['output'];
};

export type GetStreamsQueryVariables = Exact<{
  streamIds?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<StreamOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  search?: InputMaybe<Scalars['String']['input']>;
  owner?: InputMaybe<Scalars['String']['input']>;
  cursor?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetStreamsQuery = { __typename?: 'Query', streams: { __typename?: 'Streams', cursor?: string | null, items: Array<{ __typename?: 'Stream', id: string, description?: string | null, peerCount: number, messagesPerSecond: number, subscriberCount?: number | null, publisherCount?: number | null }> } };

export type GetGlobalStreamsStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGlobalStreamsStatsQuery = { __typename?: 'Query', summary: { __typename?: 'Summary', streamCount: number, messagesPerSecond: number } };


export const GetStreamsDocument = gql`
    query getStreams($streamIds: [String!], $first: Int, $orderBy: StreamOrderBy, $orderDirection: OrderDirection, $search: String, $owner: String, $cursor: String) {
  streams(
    pageSize: $first
    ids: $streamIds
    orderBy: $orderBy
    orderDirection: $orderDirection
    owner: $owner
    searchTerm: $search
    cursor: $cursor
  ) {
    items {
      id
      description
      peerCount
      messagesPerSecond
      subscriberCount
      publisherCount
    }
    cursor
  }
}
    `;
export type GetStreamsQueryResult = Apollo.QueryResult<GetStreamsQuery, GetStreamsQueryVariables>;
export const GetGlobalStreamsStatsDocument = gql`
    query getGlobalStreamsStats {
  summary {
    streamCount
    messagesPerSecond
  }
}
    `;
export type GetGlobalStreamsStatsQueryResult = Apollo.QueryResult<GetGlobalStreamsStatsQuery, GetGlobalStreamsStatsQueryVariables>;
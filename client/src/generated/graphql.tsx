import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type Block = {
  __typename?: 'Block';
  blocked: User;
  blockedId: Scalars['Int']['output'];
  blocker: User;
  blockerId: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Float']['output'];
};

export type FieldError = {
  __typename?: 'FieldError';
  additional_info?: Maybe<Scalars['String']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
};

export enum FriendRequestEnum {
  Accept = 'ACCEPT',
  Reject = 'REJECT'
}

export type FriendRequestToken = {
  __typename?: 'FriendRequestToken';
  createdAt: Scalars['String']['output'];
  deletedDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['Int']['output'];
  max_limit?: Maybe<Scalars['Int']['output']>;
  status: Scalars['String']['output'];
  token: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  usage_count: Scalars['Int']['output'];
  user: User;
  userId: Scalars['Int']['output'];
};

export type FriendRequestTokenOrError = {
  __typename?: 'FriendRequestTokenOrError';
  errors?: Maybe<Array<FieldError>>;
  token?: Maybe<FriendRequestToken>;
};

export type FriendRequests = {
  __typename?: 'FriendRequests';
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  requestToken: FriendRequestToken;
  requestTokenId: Scalars['Int']['output'];
  sender: User;
  senderId: Scalars['Int']['output'];
  status: Scalars['String']['output'];
};

export type FriendsConnection = {
  __typename?: 'FriendsConnection';
  edges: Array<FriendsEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type FriendsEdge = {
  __typename?: 'FriendsEdge';
  cursor: Scalars['String']['output'];
  node: User;
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type Message = {
  __typename?: 'Message';
  channelId: Scalars['Int']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  creator: User;
  creatorId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
};

export type MessageEdge = {
  __typename?: 'MessageEdge';
  cursor: Scalars['String']['output'];
  node: Message;
};

export type MessagesConnection = {
  __typename?: 'MessagesConnection';
  edges: Array<MessageEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Float']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptFriendRequest?: Maybe<FieldError>;
  blockFriendRequestToken?: Maybe<FieldError>;
  blockUser?: Maybe<FieldError>;
  createDefaultTokens?: Maybe<FieldError>;
  createFriendRequest?: Maybe<FieldError>;
  createHoaxUsers?: Maybe<FieldError>;
  createHoaxUsersAndAddToFriends?: Maybe<FieldError>;
  createMessage?: Maybe<FieldError>;
  createMessageFriend?: Maybe<FieldError>;
  handleFriendRequest?: Maybe<FieldError>;
  login: LoginResponse;
  logout: Scalars['Boolean']['output'];
  regenerateFriendRequestToken: FriendRequestTokenOrError;
  register: LoginResponse;
  rejectFriendRequest?: Maybe<FieldError>;
  resetUsageCountFriendRequestToken?: Maybe<FieldError>;
  toggleBlockFriendRequestToken?: Maybe<FieldError>;
  unblockFriendRequestToken?: Maybe<FieldError>;
  unblockUser?: Maybe<FieldError>;
  updateMaxLimitFriendRequestToken?: Maybe<FieldError>;
  updatePassword?: Maybe<FieldError>;
  updateUsername?: Maybe<FieldError>;
};


export type MutationAcceptFriendRequestArgs = {
  friendRequestId: Scalars['Int']['input'];
};


export type MutationBlockFriendRequestTokenArgs = {
  tokenId: Scalars['Int']['input'];
};


export type MutationBlockUserArgs = {
  userId: Scalars['Float']['input'];
};


export type MutationCreateFriendRequestArgs = {
  friendRequestToken: Scalars['String']['input'];
};


export type MutationCreateHoaxUsersArgs = {
  secret_key: Scalars['String']['input'];
};


export type MutationCreateHoaxUsersAndAddToFriendsArgs = {
  secret_key: Scalars['String']['input'];
  userId: Scalars['Int']['input'];
};


export type MutationCreateMessageArgs = {
  content: Scalars['String']['input'];
};


export type MutationCreateMessageFriendArgs = {
  content: Scalars['String']['input'];
  friendId: Scalars['Int']['input'];
};


export type MutationHandleFriendRequestArgs = {
  actionType: FriendRequestEnum;
  friendRequestId: Scalars['Int']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  oauthProof?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRegenerateFriendRequestTokenArgs = {
  tokenId: Scalars['Int']['input'];
};


export type MutationRegisterArgs = {
  donotuse?: InputMaybe<Scalars['Int']['input']>;
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationRejectFriendRequestArgs = {
  friendRequestId: Scalars['Int']['input'];
};


export type MutationResetUsageCountFriendRequestTokenArgs = {
  tokenId: Scalars['Int']['input'];
};


export type MutationToggleBlockFriendRequestTokenArgs = {
  tokenId: Scalars['Int']['input'];
};


export type MutationUnblockFriendRequestTokenArgs = {
  tokenId: Scalars['Int']['input'];
};


export type MutationUnblockUserArgs = {
  userId: Scalars['Float']['input'];
};


export type MutationUpdateMaxLimitFriendRequestTokenArgs = {
  new_max_limit?: InputMaybe<Scalars['Int']['input']>;
  tokenId: Scalars['Int']['input'];
};


export type MutationUpdatePasswordArgs = {
  newPassword: Scalars['String']['input'];
  oldPassword?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateUsernameArgs = {
  newUsername: Scalars['String']['input'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PaginationCursorArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  friendRequestTokensOfUser: Array<FriendRequestToken>;
  getFriendRequests: Array<FriendRequests>;
  getFriends: FriendsConnection;
  getMessages: MessagesConnection;
  getUserByPublicId: UserResponse;
  hello: Scalars['String']['output'];
  user?: Maybe<User>;
};


export type QueryGetFriendsArgs = {
  input: PaginationCursorArgs;
};


export type QueryGetMessagesArgs = {
  input: PaginationCursorArgs;
};


export type QueryGetUserByPublicIdArgs = {
  publicId: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  messageAdded: Message;
  usrMessageAdded: Message;
};

export type User = {
  __typename?: 'User';
  avatarBgColor: Scalars['String']['output'];
  blockers: Array<Block>;
  blocking: Array<Block>;
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  friends: Array<User>;
  generatedDefaultFriendRequestTokens: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  identifier: Scalars['String']['output'];
  numberOfFriendRequests: Scalars['Int']['output'];
  updateUsernameAttempts: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  error?: Maybe<FieldError>;
  isBlocked?: Maybe<Scalars['Boolean']['output']>;
  user?: Maybe<User>;
};

export type CreatorFragmentFragment = { __typename?: 'User', username: string, id: number };

export type ErrorFragmentFragment = { __typename?: 'FieldError', message: string };

export type FriendRequestTokensFragmentFragment = { __typename?: 'FriendRequestToken', createdAt: string, id: number, usage_count: number, token: string, status: string, max_limit?: number | null };

export type LoginResponseFragmentFragment = { __typename?: 'LoginResponse', user?: { __typename?: 'User', username: string, updatedAt: string, id: number, email: string, createdAt: string, updateUsernameAttempts: number, identifier: string, generatedDefaultFriendRequestTokens: boolean } | null, errors?: Array<{ __typename?: 'FieldError', message: string }> | null };

export type MessageFragmentFragment = { __typename?: 'Message', content: string, createdAt: string, creatorId: number, id: number, updatedAt: string, channelId: number };

export type MessageWithCreatorFragmentFragment = { __typename?: 'Message', content: string, createdAt: string, creatorId: number, id: number, updatedAt: string, channelId: number, creator: { __typename?: 'User', username: string, id: number } };

export type RequestToken_GetFriendRequesFragmentFragment = { __typename?: 'FriendRequestToken', id: number, token: string };

export type SenderFragmentFragment = { __typename?: 'User', id: number, identifier: string, username: string };

export type UserFragmentFragment = { __typename?: 'User', username: string, updatedAt: string, id: number, email: string, createdAt: string, updateUsernameAttempts: number, identifier: string, generatedDefaultFriendRequestTokens: boolean };

export type AcceptFriendRequestMutationVariables = Exact<{
  friendRequestId: Scalars['Int']['input'];
}>;


export type AcceptFriendRequestMutation = { __typename?: 'Mutation', acceptFriendRequest?: { __typename?: 'FieldError', message: string } | null };

export type BlockFriendRequestTokenMutationVariables = Exact<{
  tokenId: Scalars['Int']['input'];
}>;


export type BlockFriendRequestTokenMutation = { __typename?: 'Mutation', blockFriendRequestToken?: { __typename?: 'FieldError', message: string } | null };

export type BlockUserMutationVariables = Exact<{
  userId: Scalars['Float']['input'];
}>;


export type BlockUserMutation = { __typename?: 'Mutation', blockUser?: { __typename?: 'FieldError', message: string } | null };

export type CreateDefaultTokensMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateDefaultTokensMutation = { __typename?: 'Mutation', createDefaultTokens?: { __typename?: 'FieldError', message: string } | null };

export type CreateFriendRequestMutationVariables = Exact<{
  friendRequestToken: Scalars['String']['input'];
}>;


export type CreateFriendRequestMutation = { __typename?: 'Mutation', createFriendRequest?: { __typename?: 'FieldError', message: string } | null };

export type CreateMessageMutationVariables = Exact<{
  content: Scalars['String']['input'];
}>;


export type CreateMessageMutation = { __typename?: 'Mutation', createMessage?: { __typename?: 'FieldError', message: string } | null };

export type HandleFriendRequestMutationVariables = Exact<{
  actionType: FriendRequestEnum;
  friendRequestId: Scalars['Int']['input'];
}>;


export type HandleFriendRequestMutation = { __typename?: 'Mutation', handleFriendRequest?: { __typename?: 'FieldError', message: string } | null };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  oauthProof?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResponse', user?: { __typename?: 'User', username: string, updatedAt: string, id: number, email: string, createdAt: string, updateUsernameAttempts: number, identifier: string, generatedDefaultFriendRequestTokens: boolean } | null, errors?: Array<{ __typename?: 'FieldError', message: string }> | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegenerateFriendRequestTokenMutationVariables = Exact<{
  tokenId: Scalars['Int']['input'];
}>;


export type RegenerateFriendRequestTokenMutation = { __typename?: 'Mutation', regenerateFriendRequestToken: { __typename?: 'FriendRequestTokenOrError', errors?: Array<{ __typename?: 'FieldError', message: string }> | null, token?: { __typename?: 'FriendRequestToken', createdAt: string, id: number, usage_count: number, token: string, status: string, max_limit?: number | null } | null } };

export type RegisterMutationVariables = Exact<{
  password: Scalars['String']['input'];
  email: Scalars['String']['input'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'LoginResponse', user?: { __typename?: 'User', username: string, updatedAt: string, id: number, email: string, createdAt: string, updateUsernameAttempts: number, identifier: string, generatedDefaultFriendRequestTokens: boolean } | null, errors?: Array<{ __typename?: 'FieldError', message: string }> | null } };

export type RejectFriendRequestMutationVariables = Exact<{
  friendRequestId: Scalars['Int']['input'];
}>;


export type RejectFriendRequestMutation = { __typename?: 'Mutation', rejectFriendRequest?: { __typename?: 'FieldError', message: string } | null };

export type ResetUsageCountFriendRequestTokenMutationVariables = Exact<{
  tokenId: Scalars['Int']['input'];
}>;


export type ResetUsageCountFriendRequestTokenMutation = { __typename?: 'Mutation', resetUsageCountFriendRequestToken?: { __typename?: 'FieldError', message: string } | null };

export type ToggleBlockFriendRequestTokenMutationVariables = Exact<{
  tokenId: Scalars['Int']['input'];
}>;


export type ToggleBlockFriendRequestTokenMutation = { __typename?: 'Mutation', toggleBlockFriendRequestToken?: { __typename?: 'FieldError', message: string } | null };

export type UnblockFriendRequestTokenMutationVariables = Exact<{
  tokenId: Scalars['Int']['input'];
}>;


export type UnblockFriendRequestTokenMutation = { __typename?: 'Mutation', unblockFriendRequestToken?: { __typename?: 'FieldError', message: string } | null };

export type UnblockUserMutationVariables = Exact<{
  userId: Scalars['Float']['input'];
}>;


export type UnblockUserMutation = { __typename?: 'Mutation', unblockUser?: { __typename?: 'FieldError', message: string } | null };

export type UpdateMaxLimitFriendRequestTokenMutationVariables = Exact<{
  tokenId: Scalars['Int']['input'];
  newMaxLimit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type UpdateMaxLimitFriendRequestTokenMutation = { __typename?: 'Mutation', updateMaxLimitFriendRequestToken?: { __typename?: 'FieldError', message: string } | null };

export type UpdatePasswordMutationVariables = Exact<{
  newPassword: Scalars['String']['input'];
  oldPassword?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdatePasswordMutation = { __typename?: 'Mutation', updatePassword?: { __typename?: 'FieldError', message: string } | null };

export type UpdateUsernameMutationVariables = Exact<{
  newUsername: Scalars['String']['input'];
}>;


export type UpdateUsernameMutation = { __typename?: 'Mutation', updateUsername?: { __typename?: 'FieldError', message: string } | null };

export type FriendRequestTokensOfUserQueryVariables = Exact<{ [key: string]: never; }>;


export type FriendRequestTokensOfUserQuery = { __typename?: 'Query', friendRequestTokensOfUser: Array<{ __typename?: 'FriendRequestToken', createdAt: string, id: number, usage_count: number, token: string, status: string, max_limit?: number | null }> };

export type GetFriendRequestsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFriendRequestsQuery = { __typename?: 'Query', getFriendRequests: Array<{ __typename?: 'FriendRequests', id: number, createdAt: string, status: string, sender: { __typename?: 'User', id: number, identifier: string, username: string }, requestToken: { __typename?: 'FriendRequestToken', id: number, token: string } }> };

export type GetFriendsQueryVariables = Exact<{
  input: PaginationCursorArgs;
}>;


export type GetFriendsQuery = { __typename?: 'Query', getFriends: { __typename?: 'FriendsConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, startCursor?: string | null }, edges: Array<{ __typename?: 'FriendsEdge', cursor: string, node: { __typename?: 'User', id: number, identifier: string, username: string, avatarBgColor: string } }> } };

export type GetMessagesQueryVariables = Exact<{
  input: PaginationCursorArgs;
}>;


export type GetMessagesQuery = { __typename?: 'Query', getMessages: { __typename?: 'MessagesConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, startCursor?: string | null }, edges: Array<{ __typename?: 'MessageEdge', cursor: string, node: { __typename?: 'Message', content: string, createdAt: string, creatorId: number, id: number, updatedAt: string, channelId: number, creator: { __typename?: 'User', username: string, id: number } } }> } };

export type GetUserByPublicIdQueryVariables = Exact<{
  publicId: Scalars['String']['input'];
}>;


export type GetUserByPublicIdQuery = { __typename?: 'Query', getUserByPublicId: { __typename?: 'UserResponse', isBlocked?: boolean | null, error?: { __typename?: 'FieldError', message: string } | null, user?: { __typename?: 'User', id: number, identifier: string, username: string } | null } };

export type UserQueryVariables = Exact<{ [key: string]: never; }>;


export type UserQuery = { __typename?: 'Query', user?: { __typename?: 'User', username: string, updatedAt: string, id: number, email: string, createdAt: string, updateUsernameAttempts: number, identifier: string, generatedDefaultFriendRequestTokens: boolean } | null };

export type MessageAddedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type MessageAddedSubscription = { __typename?: 'Subscription', messageAdded: { __typename?: 'Message', content: string, createdAt: string, creatorId: number, id: number, updatedAt: string, channelId: number, creator: { __typename?: 'User', username: string, id: number } } };

export type UsrMessageAddedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type UsrMessageAddedSubscription = { __typename?: 'Subscription', usrMessageAdded: { __typename?: 'Message', content: string, createdAt: string, creatorId: number, id: number, updatedAt: string, channelId: number, creator: { __typename?: 'User', username: string, id: number } } };

export const FriendRequestTokensFragmentFragmentDoc = gql`
    fragment FriendRequestTokensFragment on FriendRequestToken {
  createdAt
  id
  usage_count
  token
  status
  max_limit
}
    `;
export const UserFragmentFragmentDoc = gql`
    fragment UserFragment on User {
  username
  updatedAt
  id
  email
  createdAt
  updateUsernameAttempts
  identifier
  generatedDefaultFriendRequestTokens
}
    `;
export const ErrorFragmentFragmentDoc = gql`
    fragment ErrorFragment on FieldError {
  message
}
    `;
export const LoginResponseFragmentFragmentDoc = gql`
    fragment LoginResponseFragment on LoginResponse {
  user {
    ...UserFragment
  }
  errors {
    ...ErrorFragment
  }
}
    ${UserFragmentFragmentDoc}
${ErrorFragmentFragmentDoc}`;
export const MessageFragmentFragmentDoc = gql`
    fragment MessageFragment on Message {
  content
  createdAt
  creatorId
  id
  updatedAt
  channelId
}
    `;
export const CreatorFragmentFragmentDoc = gql`
    fragment CreatorFragment on User {
  username
  id
}
    `;
export const MessageWithCreatorFragmentFragmentDoc = gql`
    fragment MessageWithCreatorFragment on Message {
  ...MessageFragment
  creator {
    ...CreatorFragment
  }
}
    ${MessageFragmentFragmentDoc}
${CreatorFragmentFragmentDoc}`;
export const RequestToken_GetFriendRequesFragmentFragmentDoc = gql`
    fragment RequestToken_GetFriendRequesFragment on FriendRequestToken {
  id
  token
}
    `;
export const SenderFragmentFragmentDoc = gql`
    fragment SenderFragment on User {
  id
  identifier
  username
}
    `;
export const AcceptFriendRequestDocument = gql`
    mutation AcceptFriendRequest($friendRequestId: Int!) {
  acceptFriendRequest(friendRequestId: $friendRequestId) {
    ...ErrorFragment
  }
}
    ${ErrorFragmentFragmentDoc}`;

export function useAcceptFriendRequestMutation() {
  return Urql.useMutation<AcceptFriendRequestMutation, AcceptFriendRequestMutationVariables>(AcceptFriendRequestDocument);
};
export const BlockFriendRequestTokenDocument = gql`
    mutation BlockFriendRequestToken($tokenId: Int!) {
  blockFriendRequestToken(tokenId: $tokenId) {
    ...ErrorFragment
  }
}
    ${ErrorFragmentFragmentDoc}`;

export function useBlockFriendRequestTokenMutation() {
  return Urql.useMutation<BlockFriendRequestTokenMutation, BlockFriendRequestTokenMutationVariables>(BlockFriendRequestTokenDocument);
};
export const BlockUserDocument = gql`
    mutation BlockUser($userId: Float!) {
  blockUser(userId: $userId) {
    ...ErrorFragment
  }
}
    ${ErrorFragmentFragmentDoc}`;

export function useBlockUserMutation() {
  return Urql.useMutation<BlockUserMutation, BlockUserMutationVariables>(BlockUserDocument);
};
export const CreateDefaultTokensDocument = gql`
    mutation CreateDefaultTokens {
  createDefaultTokens {
    ...ErrorFragment
  }
}
    ${ErrorFragmentFragmentDoc}`;

export function useCreateDefaultTokensMutation() {
  return Urql.useMutation<CreateDefaultTokensMutation, CreateDefaultTokensMutationVariables>(CreateDefaultTokensDocument);
};
export const CreateFriendRequestDocument = gql`
    mutation CreateFriendRequest($friendRequestToken: String!) {
  createFriendRequest(friendRequestToken: $friendRequestToken) {
    ...ErrorFragment
  }
}
    ${ErrorFragmentFragmentDoc}`;

export function useCreateFriendRequestMutation() {
  return Urql.useMutation<CreateFriendRequestMutation, CreateFriendRequestMutationVariables>(CreateFriendRequestDocument);
};
export const CreateMessageDocument = gql`
    mutation CreateMessage($content: String!) {
  createMessage(content: $content) {
    ...ErrorFragment
  }
}
    ${ErrorFragmentFragmentDoc}`;

export function useCreateMessageMutation() {
  return Urql.useMutation<CreateMessageMutation, CreateMessageMutationVariables>(CreateMessageDocument);
};
export const HandleFriendRequestDocument = gql`
    mutation HandleFriendRequest($actionType: FriendRequestEnum!, $friendRequestId: Int!) {
  handleFriendRequest(actionType: $actionType, friendRequestId: $friendRequestId) {
    ...ErrorFragment
  }
}
    ${ErrorFragmentFragmentDoc}`;

export function useHandleFriendRequestMutation() {
  return Urql.useMutation<HandleFriendRequestMutation, HandleFriendRequestMutationVariables>(HandleFriendRequestDocument);
};
export const LoginDocument = gql`
    mutation Login($email: String!, $oauthProof: String, $password: String) {
  login(email: $email, oauthProof: $oauthProof, password: $password) {
    ...LoginResponseFragment
  }
}
    ${LoginResponseFragmentFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegenerateFriendRequestTokenDocument = gql`
    mutation RegenerateFriendRequestToken($tokenId: Int!) {
  regenerateFriendRequestToken(tokenId: $tokenId) {
    errors {
      ...ErrorFragment
    }
    token {
      ...FriendRequestTokensFragment
    }
  }
}
    ${ErrorFragmentFragmentDoc}
${FriendRequestTokensFragmentFragmentDoc}`;

export function useRegenerateFriendRequestTokenMutation() {
  return Urql.useMutation<RegenerateFriendRequestTokenMutation, RegenerateFriendRequestTokenMutationVariables>(RegenerateFriendRequestTokenDocument);
};
export const RegisterDocument = gql`
    mutation Register($password: String!, $email: String!) {
  register(password: $password, email: $email) {
    ...LoginResponseFragment
  }
}
    ${LoginResponseFragmentFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const RejectFriendRequestDocument = gql`
    mutation RejectFriendRequest($friendRequestId: Int!) {
  rejectFriendRequest(friendRequestId: $friendRequestId) {
    ...ErrorFragment
  }
}
    ${ErrorFragmentFragmentDoc}`;

export function useRejectFriendRequestMutation() {
  return Urql.useMutation<RejectFriendRequestMutation, RejectFriendRequestMutationVariables>(RejectFriendRequestDocument);
};
export const ResetUsageCountFriendRequestTokenDocument = gql`
    mutation ResetUsageCountFriendRequestToken($tokenId: Int!) {
  resetUsageCountFriendRequestToken(tokenId: $tokenId) {
    ...ErrorFragment
  }
}
    ${ErrorFragmentFragmentDoc}`;

export function useResetUsageCountFriendRequestTokenMutation() {
  return Urql.useMutation<ResetUsageCountFriendRequestTokenMutation, ResetUsageCountFriendRequestTokenMutationVariables>(ResetUsageCountFriendRequestTokenDocument);
};
export const ToggleBlockFriendRequestTokenDocument = gql`
    mutation ToggleBlockFriendRequestToken($tokenId: Int!) {
  toggleBlockFriendRequestToken(tokenId: $tokenId) {
    ...ErrorFragment
  }
}
    ${ErrorFragmentFragmentDoc}`;

export function useToggleBlockFriendRequestTokenMutation() {
  return Urql.useMutation<ToggleBlockFriendRequestTokenMutation, ToggleBlockFriendRequestTokenMutationVariables>(ToggleBlockFriendRequestTokenDocument);
};
export const UnblockFriendRequestTokenDocument = gql`
    mutation UnblockFriendRequestToken($tokenId: Int!) {
  unblockFriendRequestToken(tokenId: $tokenId) {
    ...ErrorFragment
  }
}
    ${ErrorFragmentFragmentDoc}`;

export function useUnblockFriendRequestTokenMutation() {
  return Urql.useMutation<UnblockFriendRequestTokenMutation, UnblockFriendRequestTokenMutationVariables>(UnblockFriendRequestTokenDocument);
};
export const UnblockUserDocument = gql`
    mutation UnblockUser($userId: Float!) {
  unblockUser(userId: $userId) {
    ...ErrorFragment
  }
}
    ${ErrorFragmentFragmentDoc}`;

export function useUnblockUserMutation() {
  return Urql.useMutation<UnblockUserMutation, UnblockUserMutationVariables>(UnblockUserDocument);
};
export const UpdateMaxLimitFriendRequestTokenDocument = gql`
    mutation UpdateMaxLimitFriendRequestToken($tokenId: Int!, $newMaxLimit: Int) {
  updateMaxLimitFriendRequestToken(tokenId: $tokenId, new_max_limit: $newMaxLimit) {
    ...ErrorFragment
  }
}
    ${ErrorFragmentFragmentDoc}`;

export function useUpdateMaxLimitFriendRequestTokenMutation() {
  return Urql.useMutation<UpdateMaxLimitFriendRequestTokenMutation, UpdateMaxLimitFriendRequestTokenMutationVariables>(UpdateMaxLimitFriendRequestTokenDocument);
};
export const UpdatePasswordDocument = gql`
    mutation UpdatePassword($newPassword: String!, $oldPassword: String) {
  updatePassword(newPassword: $newPassword, oldPassword: $oldPassword) {
    ...ErrorFragment
  }
}
    ${ErrorFragmentFragmentDoc}`;

export function useUpdatePasswordMutation() {
  return Urql.useMutation<UpdatePasswordMutation, UpdatePasswordMutationVariables>(UpdatePasswordDocument);
};
export const UpdateUsernameDocument = gql`
    mutation UpdateUsername($newUsername: String!) {
  updateUsername(newUsername: $newUsername) {
    ...ErrorFragment
  }
}
    ${ErrorFragmentFragmentDoc}`;

export function useUpdateUsernameMutation() {
  return Urql.useMutation<UpdateUsernameMutation, UpdateUsernameMutationVariables>(UpdateUsernameDocument);
};
export const FriendRequestTokensOfUserDocument = gql`
    query FriendRequestTokensOfUser {
  friendRequestTokensOfUser {
    ...FriendRequestTokensFragment
  }
}
    ${FriendRequestTokensFragmentFragmentDoc}`;

export function useFriendRequestTokensOfUserQuery(options?: Omit<Urql.UseQueryArgs<FriendRequestTokensOfUserQueryVariables>, 'query'>) {
  return Urql.useQuery<FriendRequestTokensOfUserQuery, FriendRequestTokensOfUserQueryVariables>({ query: FriendRequestTokensOfUserDocument, ...options });
};
export const GetFriendRequestsDocument = gql`
    query GetFriendRequests {
  getFriendRequests {
    id
    createdAt
    status
    sender {
      ...SenderFragment
    }
    requestToken {
      ...RequestToken_GetFriendRequesFragment
    }
  }
}
    ${SenderFragmentFragmentDoc}
${RequestToken_GetFriendRequesFragmentFragmentDoc}`;

export function useGetFriendRequestsQuery(options?: Omit<Urql.UseQueryArgs<GetFriendRequestsQueryVariables>, 'query'>) {
  return Urql.useQuery<GetFriendRequestsQuery, GetFriendRequestsQueryVariables>({ query: GetFriendRequestsDocument, ...options });
};
export const GetFriendsDocument = gql`
    query GetFriends($input: PaginationCursorArgs!) {
  getFriends(input: $input) {
    totalCount
    pageInfo {
      endCursor
      hasNextPage
      startCursor
    }
    edges {
      cursor
      node {
        id
        identifier
        username
        avatarBgColor
      }
    }
  }
}
    `;

export function useGetFriendsQuery(options: Omit<Urql.UseQueryArgs<GetFriendsQueryVariables>, 'query'>) {
  return Urql.useQuery<GetFriendsQuery, GetFriendsQueryVariables>({ query: GetFriendsDocument, ...options });
};
export const GetMessagesDocument = gql`
    query GetMessages($input: PaginationCursorArgs!) {
  getMessages(input: $input) {
    totalCount
    pageInfo {
      endCursor
      hasNextPage
      startCursor
    }
    edges {
      cursor
      node {
        ...MessageWithCreatorFragment
      }
    }
  }
}
    ${MessageWithCreatorFragmentFragmentDoc}`;

export function useGetMessagesQuery(options: Omit<Urql.UseQueryArgs<GetMessagesQueryVariables>, 'query'>) {
  return Urql.useQuery<GetMessagesQuery, GetMessagesQueryVariables>({ query: GetMessagesDocument, ...options });
};
export const GetUserByPublicIdDocument = gql`
    query GetUserByPublicId($publicId: String!) {
  getUserByPublicId(publicId: $publicId) {
    error {
      ...ErrorFragment
    }
    user {
      id
      identifier
      username
    }
    isBlocked
  }
}
    ${ErrorFragmentFragmentDoc}`;

export function useGetUserByPublicIdQuery(options: Omit<Urql.UseQueryArgs<GetUserByPublicIdQueryVariables>, 'query'>) {
  return Urql.useQuery<GetUserByPublicIdQuery, GetUserByPublicIdQueryVariables>({ query: GetUserByPublicIdDocument, ...options });
};
export const UserDocument = gql`
    query User {
  user {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;

export function useUserQuery(options?: Omit<Urql.UseQueryArgs<UserQueryVariables>, 'query'>) {
  return Urql.useQuery<UserQuery, UserQueryVariables>({ query: UserDocument, ...options });
};
export const MessageAddedDocument = gql`
    subscription MessageAdded {
  messageAdded {
    ...MessageWithCreatorFragment
  }
}
    ${MessageWithCreatorFragmentFragmentDoc}`;

export function useMessageAddedSubscription<TData = MessageAddedSubscription>(options?: Omit<Urql.UseSubscriptionArgs<MessageAddedSubscriptionVariables>, 'query'>, handler?: Urql.SubscriptionHandler<MessageAddedSubscription, TData>) {
  return Urql.useSubscription<MessageAddedSubscription, TData, MessageAddedSubscriptionVariables>({ query: MessageAddedDocument, ...options }, handler);
};
export const UsrMessageAddedDocument = gql`
    subscription UsrMessageAdded {
  usrMessageAdded {
    ...MessageWithCreatorFragment
  }
}
    ${MessageWithCreatorFragmentFragmentDoc}`;

export function useUsrMessageAddedSubscription<TData = UsrMessageAddedSubscription>(options?: Omit<Urql.UseSubscriptionArgs<UsrMessageAddedSubscriptionVariables>, 'query'>, handler?: Urql.SubscriptionHandler<UsrMessageAddedSubscription, TData>) {
  return Urql.useSubscription<UsrMessageAddedSubscription, TData, UsrMessageAddedSubscriptionVariables>({ query: UsrMessageAddedDocument, ...options }, handler);
};
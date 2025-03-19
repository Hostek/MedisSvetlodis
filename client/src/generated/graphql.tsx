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
};

export type FieldError = {
  __typename?: 'FieldError';
  additional_info?: Maybe<Scalars['String']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type Message = {
  __typename?: 'Message';
  content: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  creator: User;
  creatorId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createMessage?: Maybe<FieldError>;
  login: LoginResponse;
  logout: Scalars['Boolean']['output'];
  register: LoginResponse;
  updatePassword?: Maybe<FieldError>;
  updateUsername?: Maybe<FieldError>;
};


export type MutationCreateMessageArgs = {
  content: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  oauthProof?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRegisterArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationUpdatePasswordArgs = {
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};


export type MutationUpdateUsernameArgs = {
  newUsername: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  getAllMessages: Array<Message>;
  hello: Scalars['String']['output'];
  user?: Maybe<User>;
};

export type Subscription = {
  __typename?: 'Subscription';
  messageAdded: Message;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  updateUsernameAttempts: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type CreatorFragmentFragment = { __typename?: 'User', username: string, id: number };

export type ErrorFragmentFragment = { __typename?: 'FieldError', message: string };

export type LoginResponseFragmentFragment = { __typename?: 'LoginResponse', user?: { __typename?: 'User', username: string, updatedAt: string, id: number, email: string, createdAt: string } | null, errors?: Array<{ __typename?: 'FieldError', message: string }> | null };

export type MessageFragmentFragment = { __typename?: 'Message', content: string, createdAt: string, creatorId: number, id: number, updatedAt: string };

export type MessageWithCreatorFragmentFragment = { __typename?: 'Message', content: string, createdAt: string, creatorId: number, id: number, updatedAt: string, creator: { __typename?: 'User', username: string, id: number } };

export type UserFragmentFragment = { __typename?: 'User', username: string, updatedAt: string, id: number, email: string, createdAt: string };

export type CreateMessageMutationVariables = Exact<{
  content: Scalars['String']['input'];
}>;


export type CreateMessageMutation = { __typename?: 'Mutation', createMessage?: { __typename?: 'FieldError', message: string } | null };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  oauthProof?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResponse', user?: { __typename?: 'User', username: string, updatedAt: string, id: number, email: string, createdAt: string } | null, errors?: Array<{ __typename?: 'FieldError', message: string }> | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  password: Scalars['String']['input'];
  email: Scalars['String']['input'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'LoginResponse', user?: { __typename?: 'User', username: string, updatedAt: string, id: number, email: string, createdAt: string } | null, errors?: Array<{ __typename?: 'FieldError', message: string }> | null } };

export type GetAllMessagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllMessagesQuery = { __typename?: 'Query', getAllMessages: Array<{ __typename?: 'Message', content: string, createdAt: string, creatorId: number, id: number, updatedAt: string, creator: { __typename?: 'User', username: string, id: number } }> };

export type UserQueryVariables = Exact<{ [key: string]: never; }>;


export type UserQuery = { __typename?: 'Query', user?: { __typename?: 'User', username: string, updatedAt: string, id: number, email: string, createdAt: string } | null };

export type MessageAddedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type MessageAddedSubscription = { __typename?: 'Subscription', messageAdded: { __typename?: 'Message', content: string, createdAt: string, creatorId: number, id: number, updatedAt: string, creator: { __typename?: 'User', username: string, id: number } } };

export const UserFragmentFragmentDoc = gql`
    fragment UserFragment on User {
  username
  updatedAt
  id
  email
  createdAt
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
export const GetAllMessagesDocument = gql`
    query GetAllMessages {
  getAllMessages {
    ...MessageWithCreatorFragment
  }
}
    ${MessageWithCreatorFragmentFragmentDoc}`;

export function useGetAllMessagesQuery(options?: Omit<Urql.UseQueryArgs<GetAllMessagesQueryVariables>, 'query'>) {
  return Urql.useQuery<GetAllMessagesQuery, GetAllMessagesQueryVariables>({ query: GetAllMessagesDocument, ...options });
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
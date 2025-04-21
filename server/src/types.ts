import { Request, Response } from "express"
import { Redis } from "ioredis"
import { Field, InputType, Int, ObjectType } from "type-graphql"
import { User } from "./entities/User.js"
import { FriendRequestToken } from "./entities/FriendRequestToken.js"

@ObjectType()
export class FieldError {
    @Field()
    message: string
    @Field({ nullable: true })
    additional_info?: string
    @Field({ nullable: true })
    key?: string
}

@ObjectType()
export class SuccessOrError {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[]

    @Field(() => String, { nullable: true })
    success?: String
}

@ObjectType()
export class LoginResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[]

    @Field(() => User, { nullable: true })
    user?: User
}

@ObjectType()
export class UserResponse {
    @Field(() => FieldError, { nullable: true })
    error?: FieldError

    @Field(() => User, { nullable: true })
    user?: User

    @Field(() => Boolean, { nullable: true })
    isBlocked?: boolean
}

@ObjectType()
export class FriendRequestTokenOrError {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[]

    @Field(() => FriendRequestToken, { nullable: true })
    token?: FriendRequestToken
}

export interface MyContext {
    req: Request
    res: Response
    redis: Redis
    ip: string
}

export type Probably<T> = T | undefined | null

@InputType()
export class PaginationCursorArgs {
    @Field({ nullable: true })
    before?: string

    @Field({ nullable: true })
    after?: string

    @Field(() => Int, { defaultValue: 10 })
    first: number
}

@ObjectType()
export class PageInfo {
    @Field({ nullable: true })
    startCursor?: string

    @Field({ nullable: true })
    endCursor?: string

    @Field()
    hasNextPage: boolean
}

@ObjectType()
export class FriendsConnection {
    @Field(() => [FriendsEdge])
    edges: FriendsEdge[]

    @Field(() => PageInfo)
    pageInfo: PageInfo

    @Field(() => Int)
    totalCount: number
}

@ObjectType()
export class FriendsEdge {
    @Field(() => User)
    node: User

    @Field()
    cursor: string
}

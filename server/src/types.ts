import { Request, Response } from "express"
import { Redis } from "ioredis"
import { Field, ObjectType } from "type-graphql"
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

import { Request, Response } from "express"
import { Redis } from "ioredis"
import { Field, ObjectType } from "type-graphql"
import { User } from "./entities/User.js"

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
export class LoginResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[]

    @Field(() => User, { nullable: true })
    user?: User
}

export interface MyContext {
    req: Request
    res: Response
    redis: Redis
    ip: string
}

export type Probably<T> = T | undefined | null

import { Field, Int, ObjectType } from "type-graphql"
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Relation,
    UpdateDateColumn,
} from "typeorm"
import { User } from "./User.js"
import { FRIEND_REQUEST_TOKEN_STATUS_TYPE } from "@hostek/shared"

@ObjectType()
@Entity()
export class FriendRequestToken extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date

    @Field(() => Int)
    @Column("int")
    userId: number

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.friendRequestTokens)
    creator: Relation<User>

    @Field(() => String)
    @Column("text")
    token: string

    @Field(() => Int)
    @Column("int", { default: 0 })
    usage_count: number

    @Field(() => Int, { nullable: true })
    @Column("int", { nullable: true })
    max_limit?: number | null

    @Field(() => String)
    @Column({
        type: "varchar",
        length: "30",
    })
    status: FRIEND_REQUEST_TOKEN_STATUS_TYPE
}

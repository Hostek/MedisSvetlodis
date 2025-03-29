import { Field, Int, ObjectType } from "type-graphql"
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    // Index,
    ManyToOne,
    PrimaryGeneratedColumn,
    Relation,
    Unique,
} from "typeorm"
import { User } from "./User.js"
import { FRIEND_REQUEST_TOKEN_STATUS_TYPE } from "@hostek/shared"
import { FriendRequestToken } from "./FriendRequestToken.js"

@ObjectType()
@Entity()
// @Unique(["senderId", "requestTokenId"])
@Unique("UQ_TOKEN_SENDER", ["requestTokenId", "senderId"])
// @Index(["requestTokenId", "senderId"])
export class FriendRequests extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => Int)
    @Column("int")
    senderId: number

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.sentFriendRequests)
    sender: Relation<User>

    @Field(() => Int)
    @Column("int")
    requestTokenId: number

    @Field(() => FriendRequestToken)
    @ManyToOne(() => FriendRequestToken, (t) => t.friendRequests)
    requestToken: Relation<FriendRequestToken>

    @Field(() => String)
    @Column({
        type: "varchar",
        length: "30",
        default: "pending",
    })
    status: FRIEND_REQUEST_TOKEN_STATUS_TYPE
}

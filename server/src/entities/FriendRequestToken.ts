import { Field, Int, ObjectType } from "type-graphql"
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Relation,
    UpdateDateColumn,
} from "typeorm"
import { User } from "./User.js"
import { FRIEND_REQUEST_TOKEN_STATUS_TYPE } from "@hostek/shared"
import { FriendRequests } from "./FriendsRequests.js"

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
    user: Relation<User>

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
        default: "active",
    })
    status: FRIEND_REQUEST_TOKEN_STATUS_TYPE

    @Field(() => Date, { nullable: true })
    @Column("timestamptz", { nullable: true })
    deletedDate: Date

    @OneToMany(() => FriendRequests, (t) => t.requestToken, {
        onDelete: "CASCADE",
    })
    friendRequests: Relation<FriendRequests>[]
}

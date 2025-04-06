import { Field, Int, ObjectType } from "type-graphql"
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    Relation,
    UpdateDateColumn,
} from "typeorm"
import { Message } from "./Message.js"
import { FriendRequestToken } from "./FriendRequestToken.js"
import { FriendRequests } from "./FriendsRequests.js"
import { Block } from "./Block.js"

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date

    @Column()
    password!: string

    @Field(() => String)
    @Column({ unique: true })
    email!: string

    @Field(() => String)
    @Column()
    username: string

    @Field(() => String)
    @Column({ type: "text", unique: true })
    identifier: string

    @Field(() => Int)
    @Column("int", { default: 3 })
    updateUsernameAttempts: number

    // did user generate their default tokens?
    @Field(() => Boolean)
    @Column({ type: "boolean", default: false })
    generatedDefaultFriendRequestTokens: boolean

    @Field(() => Int)
    @Column({ type: "int", default: 0 })
    numberOfFriendRequests: number

    @Field(() => [User])
    @ManyToMany(() => User, (user) => user.friends)
    @JoinTable({
        name: "user_friends",
        joinColumn: { name: "user_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "friend_id", referencedColumnName: "id" },
    })
    friends: User[]

    @OneToMany(() => Message, (m) => m.creator, {
        onDelete: "CASCADE",
    })
    messages: Relation<Message>[]

    @OneToMany(() => FriendRequestToken, (t) => t.user, {
        onDelete: "CASCADE",
    })
    friendRequestTokens: Relation<FriendRequestToken>[]

    @OneToMany(() => FriendRequests, (t) => t.sender, {
        onDelete: "CASCADE",
    })
    sentFriendRequests: Relation<FriendRequests>[]

    @Field(() => [Block])
    @OneToMany(() => Block, (block) => block.blocker)
    blocking!: Relation<Block>[]

    @Field(() => [Block])
    @OneToMany(() => Block, (block) => block.blocked)
    blockers!: Relation<Block>[]
}

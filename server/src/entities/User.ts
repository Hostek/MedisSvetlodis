import { Field, Int, ObjectType } from "type-graphql"
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    Relation,
    UpdateDateColumn,
} from "typeorm"
import { Message } from "./Message.js"
import { FriendRequestToken } from "./FriendRequestToken.js"

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

    @OneToMany(() => Message, (m) => m.creator, {
        onDelete: "CASCADE",
    })
    messages: Relation<Message>[]

    @Field(() => Int)
    @Column("int", { default: 3 })
    updateUsernameAttempts: number

    @OneToMany(() => Message, (m) => m.creator, {
        onDelete: "CASCADE",
    })
    friendRequestTokens: Relation<FriendRequestToken>[]
}

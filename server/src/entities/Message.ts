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
import { Channel } from "./Channel.js"

@ObjectType()
@Entity()
export class Message extends BaseEntity {
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
    creatorId: number

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.messages)
    creator: Relation<User>

    @Field(() => String)
    @Column("text")
    content: string

    @Field(() => Int)
    @Column("int")
    channelId!: number

    @ManyToOne(() => Channel, (channel) => channel.messages)
    channel!: Relation<Channel>
}

import { Field, ObjectType } from "type-graphql"
import {
    BaseEntity,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    Column,
    OneToMany,
    Unique,
    Relation,
} from "typeorm"
import { Message } from "./Message.js"

@ObjectType()
@Entity()
@Unique(["uniqueIdentifier"])
export class Channel extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number

    @Field(() => Date)
    @CreateDateColumn()
    createdAt!: Date

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt!: Date

    @Field()
    @Column()
    uniqueIdentifier!: string

    @Field(() => [Message])
    @OneToMany(() => Message, (message) => message.channel)
    messages!: Relation<Message>[]
}

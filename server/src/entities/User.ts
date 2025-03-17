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
    @Column({ unique: true })
    username: string

    @OneToMany(() => Message, (m) => m.creator, {
        onDelete: "CASCADE",
    })
    messages: Relation<Message>[]
}

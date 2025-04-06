import {
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Unique,
    Relation,
    BaseEntity,
    Column,
} from "typeorm"
import { User } from "./User.js"
import { Field, Int, ObjectType } from "type-graphql"

/*
Block user ...
*/

@ObjectType()
@Entity()
@Unique(["blockerId", "blockedId"])
export class Block extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number

    @Field(() => Int)
    @Column("int")
    blockerId: number

    @Field(() => Int)
    @Column("int")
    blockedId: number

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.blocking)
    blocker!: Relation<User>

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.blockers)
    blocked!: Relation<User>

    @Field(() => Date)
    @CreateDateColumn()
    createdAt!: Date
}

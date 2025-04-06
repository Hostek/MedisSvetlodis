import {
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Unique,
    Relation,
} from "typeorm"
import { User } from "./User.js"
import { Field, ObjectType } from "type-graphql"

@ObjectType()
@Entity()
@Unique(["blocker", "blocked"])
export class Block {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number

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

import { Column, Entity, ObjectIdColumn } from "typeorm";

@Entity()
export abstract class User {
    @ObjectIdColumn()
    _id?: string;

    @Column()
    id: string;

    @Column()

    email: string;

    @Column()
    password: string;
}
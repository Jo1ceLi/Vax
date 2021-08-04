import { Column, Entity, ObjectIdColumn } from "typeorm";

@Entity()
export abstract class User {
    @ObjectIdColumn()
    _id?: string;

    @Column({unique: true})
    id: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column()
    role: Role
}

enum Role {
    Admin,
    GovernmentSupervisor,
    HospitalSupervisor,
    User
}
import { Column, Entity, ObjectIdColumn } from "typeorm";
import { ObjectID } from 'mongodb';
import { Period } from "./Period";

@Entity()
export class SKU {
    @ObjectIdColumn()
    _id?: string;

    @ObjectIdColumn()
    hospital_id: ObjectID;

    @Column("datetime")
    date: Date;
    
    @Column(type => Period)
    periods: Period[];
}
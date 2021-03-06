import { Doctor } from './../model/Doctor';
import { Human } from "../shared/interface/Human";
import { Column, Entity, ObjectIdColumn, PrimaryColumn } from "typeorm";
import { Vaccine } from "../shared/interface/Vaccine";
import { Priority } from "../model/Priority";

@Entity()
export abstract class People implements Human{
    @ObjectIdColumn()
    _id?: string;

    @Column({unique: true})
    id: string;

    @Column()
    name: string;
    
    @Column()
    priority: Priority;
    
    @Column()
    vaccined: Vaccine[];

    Vax(){}
}
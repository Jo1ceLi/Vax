import { Column, Entity, ObjectIdColumn } from "typeorm";

@Entity()
export class Hospital{
    @ObjectIdColumn()
    _id?: string
        
    @Column()
    name: string;

    @Column()
    city: string

    @Column()
    district: string;
    
    @Column()
    tel: string
}
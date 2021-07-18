import { Column } from "typeorm";

export class Period {
    @Column()
    time: Date;

    @Column()
    az_reservation_quota: number;
    
    @Column()
    az_stock: number;

    @Column()
    bnt_reservation_quota: number;

    @Column()
    bnt_stock: number;
    
    @Column()
    moderna_reservation_quota: number;

    @Column()
    moderna_stock: number;

    constructor(time = new Date(), az_reservation_quota = 99, az_stock = 99, bnt_reservation_quota = 100, bnt_stock = 100, moderna_reservation_quota = 100, moderna_stock = 50) {
        this.time = time;
        this.az_reservation_quota = az_reservation_quota;
        this.az_stock = az_stock;
        this.bnt_reservation_quota = bnt_reservation_quota;
        this.bnt_stock = bnt_stock;
        this.moderna_reservation_quota = moderna_reservation_quota;
        this.moderna_stock = moderna_stock;
    }
}
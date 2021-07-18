import { Vaccine } from './Vaccine';

export interface VaccineInventory {
    vaccine: Vaccine;
    amount: number;
}

// export interface VaccineInventories {
//     vaccineInventories: VaccineInventory[];
// }

// export interface VaccineInventory {
//     [index: number]: Vaccine | number;
//     vaccine: Vaccine;
//     amount: number;
// }

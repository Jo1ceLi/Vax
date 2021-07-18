import { AZ } from './AZ';
import { VaccineInventory } from '../shared/interface/VaccineInventory'
import { BNTVaccineInventory } from './BNTVaccineInventory';

export class AZVaccineInventory implements VaccineInventory {
    vaccine = AZ;
    amount: number;
    constructor(amountOfAZ: number) {
        this.amount = amountOfAZ;
    }
}

var azvi = new AZVaccineInventory(400000);
var bntvi = new BNTVaccineInventory();

var nationalVaccineInventory: VaccineInventory[] = [];
nationalVaccineInventory.push(azvi);
nationalVaccineInventory.push(bntvi);

console.log(`We've ${nationalVaccineInventory[0].amount}  of ${nationalVaccineInventory[0].vaccine.name}`);

import { VaccineInventory } from '../shared/interface/VaccineInventory';
import { BNT } from './BNT';


export class BNTVaccineInventory extends BNT implements VaccineInventory {
    vaccine: BNT;
    amount = 50000;
}

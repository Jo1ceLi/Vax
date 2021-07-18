import { Vaccine } from '../shared/interface/Vaccine';
import { VaccineInventory } from '../shared/interface/VaccineInventory';
import { InjectLicense } from '../shared/interface/InjectLicense';
import { Hospital } from '../shared/interface/Hospital';

class NTUHospital implements Hospital{
    injectors: InjectLicense[] = [];
    vaccineInventory: VaccineInventory[] = [];
    addInjector(injector: InjectLicense) {
        this.injectors.push(injector);
    }
    distributeVaccineToInjector(vaccine: Vaccine) {
        var vaxInventory = this.vaccineInventory.find(vaccines => {
            vaccines.vaccine = vaccine;
        });
        vaxInventory!.amount -= 1;
    }
}


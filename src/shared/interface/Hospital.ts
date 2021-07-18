import { Vaccine } from './Vaccine';
import { VaccineInventory } from './VaccineInventory';
import { InjectLicense } from './InjectLicense';

export interface Hospital {
    injectors: InjectLicense[];
    vaccineInventory: VaccineInventory[];
    addInjector(injector: InjectLicense);
    distributeVaccineToInjector(vaccine: Vaccine);
}

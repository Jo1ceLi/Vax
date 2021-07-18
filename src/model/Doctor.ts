import { Vaccine } from '../shared/interface/Vaccine';
import { InjectLicense } from '../shared/interface/InjectLicense';
import { MedicalLicense } from '../shared/interface/MedicalLicense';
import { Human } from '../shared/interface/Human';
import { Priority } from "./Priority";
import { People } from '../Entity/People';

export class Doctor implements Human, InjectLicense, MedicalLicense, People {
    id: string;
    name: string;
    injectRecord: any[];
    priority: Priority;
    vaccined: Vaccine[];
    Vax() {

    }
    injectVaccineToPatient(vaccine: Vaccine, patient: Human) {
        this.injectRecord.push({injector: this, patient, vaccine});
        patient.Vax(vaccine, this);
    }
    treatPatient(patient: Human) {
    };
}

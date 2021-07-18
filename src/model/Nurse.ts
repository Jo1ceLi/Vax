import { Vaccine } from '../shared/interface/Vaccine';
import { InjectLicense } from '../shared/interface/InjectLicense';
import { Human } from '../shared/interface/Human';
// import { Person } from './NonMedicalStaff';
import { Priority } from "./Priority";

class Nurse implements Human, InjectLicense {
    id: string;
    name: string;
    priority: Priority;
    vaccined: Vaccine[];
    injectVaccineToPatient(vaccine: Vaccine, patient: Human) {
        patient.Vax(vaccine, this);
    }
    Vax() {

    }
}

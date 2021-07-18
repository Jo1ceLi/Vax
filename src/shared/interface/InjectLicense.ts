import { Vaccine } from './Vaccine';
import { Human } from "./Human";

export interface InjectLicense {
    injectVaccineToPatient(vaccine: Vaccine, patient: Human);
}

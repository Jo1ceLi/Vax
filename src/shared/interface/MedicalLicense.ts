import { Human } from "./Human";

export interface MedicalLicense {
    treatPatient(patient: Human): any;
}

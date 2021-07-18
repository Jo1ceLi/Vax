import { Vaccine } from './Vaccine';
import { Priority } from "../../model/Priority";
import { InjectLicense } from './InjectLicense';


export interface Human {
    id: string;
    name: string;
    priority: Priority;
    vaccined: Vaccine[];
    Vax(accine: Vaccine, injector: InjectLicense);
}

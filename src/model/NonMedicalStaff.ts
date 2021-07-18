import { AZ } from './AZ';
import { Doctor } from './Doctor';
import { Vaccine } from '../shared/interface/Vaccine';
import { InjectLicense } from '../shared/interface/InjectLicense';
import { Human } from '../shared/interface/Human';
import { Priority } from './Priority';


export class NonMedicalStaff implements Human {
    id: any;
    name: any;
    vaccined: Vaccine[] = [];
    readonly priority: Priority;
    Vax(vaccine: Vaccine, injector: InjectLicense) {
        this.vaccined.push(vaccine);
        console.log(`${this.name} has vaccined a ${vaccine.name} vaccine by ${injector.constructor.name}`);
    }
}

var John = new NonMedicalStaff();
var dr = new Doctor();
John.Vax(AZ, dr);


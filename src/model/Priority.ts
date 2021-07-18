// class NTUHostpitalVaccineInventory {
//     private vaccineInventory: VaccineInventory[] = [];
//     in(vaccineStock: VaccineInventory) {
//         var vaccineInv = this.vaccineInventory.find(vaccine => {
//             vaccine.name = vaccineStock.name
//         });
//         if(vaccineInv){
//             vaccineInv.amount += vaccineStock.amount;
//         }else{
//             this.vaccineInventory.push(vaccineStock);
//         }
//     }
// }

export enum Priority {
    first = 1,
    second = 2,
    third = 3,
    fourth = 4,
    fifth = 5,
    sixth = 6,
    seventh = 7,
    eighth = 8,
    ninth = 9
}

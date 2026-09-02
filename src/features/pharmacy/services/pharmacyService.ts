import type {Medicine, PharmacyOrder} from '../types/pharmacy';

const medicines: Medicine[] = [
  {id:'MED-001',name:'Amoxicillin',category:'Antibiotic',strength:'500 mg',packSize:'21 capsules',stock:18,reorderLevel:30,price:420,status:'Low stock'},
  {id:'MED-002',name:'Paracetamol',category:'Analgesic',strength:'500 mg',packSize:'100 tablets',stock:146,reorderLevel:50,price:180,status:'In stock'},
  {id:'MED-003',name:'Metformin',category:'Diabetes',strength:'500 mg',packSize:'60 tablets',stock:0,reorderLevel:20,price:650,status:'Out of stock'},
  {id:'MED-004',name:'Cetirizine',category:'Antihistamine',strength:'10 mg',packSize:'30 tablets',stock:64,reorderLevel:25,price:290,status:'In stock'},
  {id:'MED-005',name:'Omeprazole',category:'Gastrointestinal',strength:'20 mg',packSize:'28 capsules',stock:12,reorderLevel:20,price:510,status:'Low stock'},
  {id:'MED-006',name:'Artemether-Lumefantrine',category:'Antimalarial',strength:'20/120 mg',packSize:'24 tablets',stock:82,reorderLevel:30,price:760,status:'In stock'},
];

const orders: PharmacyOrder[] = [
  {id:'RX-1048',patient:'Jane Wanjiku',items:3,total:1450,status:'Ready',createdAt:'Today, 09:42'},
  {id:'RX-1047',patient:'Daniel Otieno',items:1,total:650,status:'Processing',createdAt:'Today, 09:16'},
  {id:'RX-1046',patient:'Amina Hassan',items:2,total:940,status:'Collected',createdAt:'Yesterday, 16:20'},
  {id:'RX-1045',patient:'Peter Mwangi',items:4,total:2200,status:'Collected',createdAt:'Yesterday, 14:05'},
];

export const pharmacyService = {
  getMedicines: () => medicines,
  getOrders: () => orders,
  getLowStock: () => medicines.filter((medicine) => medicine.status !== 'In stock'),
};

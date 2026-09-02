import {pharmacyService} from './pharmacyService';

export const inventoryService = {
  getSummary: () => {
    const medicines = pharmacyService.getMedicines();
    return {
      products: medicines.length,
      units: medicines.reduce((total, medicine) => total + medicine.stock, 0),
      lowStock: medicines.filter((medicine) => medicine.status === 'Low stock').length,
      outOfStock: medicines.filter((medicine) => medicine.status === 'Out of stock').length,
    };
  },
};

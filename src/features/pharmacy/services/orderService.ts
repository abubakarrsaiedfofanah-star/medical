import {pharmacyService} from './pharmacyService';

export const orderService = {
  getRecent: () => pharmacyService.getOrders(),
  getOpenCount: () => pharmacyService.getOrders().filter((order) => order.status !== 'Collected').length,
};

import {AlertTriangle, ArrowUpRight, Package} from 'lucide-react';
import type {Medicine} from '../types/pharmacy';

export default function MedicineCard({medicine}:{medicine:Medicine}){
  const progress = Math.min(100, Math.round((medicine.stock / Math.max(medicine.reorderLevel * 2, 1)) * 100));
  return <article className="medicine-card"><div className="medicine-card-top"><div className="medicine-icon"><Package size={18}/></div><span className={`stock-pill ${medicine.status.toLowerCase().replaceAll(' ','-')}`}>{medicine.status}</span></div><h3>{medicine.name}</h3><p>{medicine.strength} · {medicine.packSize}</p><div className="medicine-stock"><div><span>Current stock</span><strong>{medicine.stock} units</strong></div><ArrowUpRight size={17}/></div><div className="stock-bar"><i style={{width:`${progress}%`}}/></div>{medicine.status !== 'In stock' && <small className="medicine-alert"><AlertTriangle size={13}/> Reorder at {medicine.reorderLevel} units</small>}</article>;
}

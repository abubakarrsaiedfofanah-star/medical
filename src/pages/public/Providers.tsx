import {useMemo, useState} from 'react';
import {ArrowRight, Building2, MapPin, Search, ShieldCheck, Stethoscope} from 'lucide-react';
import {Link} from 'react-router-dom';
import PublicNav from '../../components/PublicNav';
import PublicFooter from '../../components/PublicFooter';

type Provider = {name: string; type: string; location: string; specialty: string; image: string};
const providers: Provider[] = [
  {name: 'Nairobi Care Centre', type: 'Clinic', location: 'Nairobi, Kenya', specialty: 'Family medicine and outpatient care', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80'},
  {name: 'Mara Health Pharmacy', type: 'Pharmacy', location: 'Nairobi, Kenya', specialty: 'Prescription fulfilment and refills', image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=900&q=80'},
  {name: 'ClearPath Diagnostics', type: 'Laboratory', location: 'Mombasa, Kenya', specialty: 'Sample collection and lab results', image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=900&q=80'},
];
function portalPath(type: string){const role=type.toLowerCase(); return role === 'pharmacy' ? '/pharmacy' : `/dashboard/${role}`;}

export default function Providers(){
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');
  const filtered = useMemo(() => providers.filter(provider => {
    const matchesType = type === 'All' || provider.type === type;
    const text = `${provider.name} ${provider.location} ${provider.specialty}`.toLowerCase();
    return matchesType && text.includes(query.toLowerCase().trim());
  }), [query, type]);
  return <><PublicNav/><main className="public-page providers-page"><div className="page-title"><span className="eyebrow">FIND CARE / 01</span><h1>Find the right care, closer to you.</h1><p>Explore participating providers, pharmacies and laboratories in the SAIED network.</p></div><section className="provider-tools" aria-label="Find care filters"><label><Search size={18}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search by name, service or location" aria-label="Search providers"/></label><div className="filter-tabs">{['All','Clinic','Pharmacy','Laboratory'].map(option=><button type="button" key={option} className={type === option ? 'active' : ''} onClick={()=>setType(option)}>{option}</button>)}</div></section><div className="provider-grid">{filtered.map(provider=><article className="provider-card" key={provider.name}><img src={provider.image} alt={`${provider.name} facility`}/><div className="provider-card-body"><span className="provider-type"><Building2 size={15}/> {provider.type}</span><h2>{provider.name}</h2><p>{provider.specialty}</p><small><MapPin size={14}/> {provider.location}</small><Link className="red-text" to={`/auth?mode=register&role=${provider.type.toLowerCase()}&next=${encodeURIComponent(portalPath(provider.type))}`}>Request care <ArrowRight size={15}/></Link></div></article>)}</div>{filtered.length === 0 && <div className="empty-state"><ShieldCheck size={24}/><h2>No matching providers</h2><p>Try another search or choose a different care type.</p></div>}<section className="provider-cta"><div><span className="eyebrow light">READY WHEN YOU ARE</span><h2>Need help choosing a care path?</h2><p>Use the SAIED assistant to organize your concern before connecting with a professional.</p></div><Link className="white-btn" to="/ai">Ask SAIED AI <Stethoscope size={17}/></Link></section></main><PublicFooter/></>;
}

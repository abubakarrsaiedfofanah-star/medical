import {Link} from 'react-router-dom';
import {ArrowUpRight,HeartPulse,Mail,MapPin,ShieldCheck} from 'lucide-react';

const portalLinks = [
  ['Patient portal','/dashboard/patient'], ['Doctor portal','/dashboard/doctor'], ['Nurse portal','/dashboard/nurse'],
  ['Pharmacist portal','/dashboard/pharmacist'], ['Pharmacy portal','/pharmacy'], ['Clinic portal','/dashboard/clinic'],
  ['Hospital portal','/dashboard/hospital'], ['Laboratory portal','/dashboard/laboratory'],
];

export default function PublicFooter(){return <footer className="public-footer"><div className="footer-main"><div className="footer-brand"><Link className="logo" to="/"><span className="logo-mark"><HeartPulse size={19}/></span><span>SAIED<small>CONNECTED CARE</small></span></Link><p>One secure network for better-connected healthcare across every stage of care.</p><div className="footer-trust"><ShieldCheck size={15}/> Built around privacy and patient choice</div></div><div className="footer-column"><h3>Explore</h3><Link to="/services">All services <ArrowUpRight size={13}/></Link><Link to="/ai">AI Health Assistant <ArrowUpRight size={13}/></Link><Link to="/communications">Communications <ArrowUpRight size={13}/></Link><Link to="/subscriptions">Plans <ArrowUpRight size={13}/></Link></div><div className="footer-column"><h3>Portals</h3>{portalLinks.slice(0,4).map(([label,path])=><Link to={path} key={path}>{label} <ArrowUpRight size={13}/></Link>)}</div><div className="footer-column"><h3>Organizations</h3>{portalLinks.slice(4).map(([label,path])=><Link to={path} key={path}>{label} <ArrowUpRight size={13}/></Link>)}<Link to="/verify/receipt/demo">Verify a receipt <ArrowUpRight size={13}/></Link></div></div><div className="footer-bottom"><span>© 2026 SAIED Healthcare</span><span className="footer-location"><MapPin size={14}/> Kenya · <Mail size={14}/> support@saied.example</span><span>Privacy · Security · Terms</span></div></footer>}

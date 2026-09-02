import {useParams} from 'react-router-dom';
import {ArrowLeft,CalendarDays,FileText,HeartPulse,MessageSquare,Package,Receipt,Settings,ShieldCheck,Stethoscope,Users,Wallet} from 'lucide-react';
import {Link} from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const sections: Record<string,{title:string;description:string;icon: typeof Users}> = {
  patients:{title:'Patients',description:'Review and manage people connected to your care workspace.',icon:Users},
  appointments:{title:'Appointments',description:'View upcoming visits, schedules and appointment requests.',icon:CalendarDays},
  records:{title:'Medical Records',description:'Access authorized clinical records and care history.',icon:FileText},
  prescriptions:{title:'Prescriptions',description:'Review prescriptions and medication instructions.',icon:Stethoscope},
  pharmacy:{title:'Pharmacy',description:'Review medicines, dispensing and prescription fulfilment.',icon:Package},
  payments:{title:'Payments',description:'Track authorized payments, balances and receipts.',icon:Wallet},
  receipts:{title:'Receipts',description:'View and verify receipts connected to your care.',icon:Receipt},
  messages:{title:'Messages',description:'Keep secure conversations with your care team in one place.',icon:MessageSquare},
  security:{title:'Security',description:'Review account protection and privacy settings.',icon:ShieldCheck},
  settings:{title:'Settings',description:'Manage your workspace preferences and account details.',icon:Settings},
};

export default function PortalSection(){
  const {role='patient',section='dashboard'}=useParams();
  const current=sections[section] || {title:'Dashboard',description:'Your secure healthcare workspace overview.',icon:HeartPulse};
  const Icon=current.icon;
  return <div className="app-shell"><Sidebar role={role}/><div className="main-area"><Topbar role={role}/><main className="dashboard section-view"><div className="section-view-head"><div className="section-view-icon"><Icon size={26}/></div><span className="eyebrow">SAIED {role.toUpperCase()} PORTAL</span><h1>{current.title}</h1><p>{current.description}</p></div><section className="section-view-empty"><HeartPulse size={28}/><h2>{current.title} workspace</h2><p>This secure workspace is ready for your connected healthcare data.</p><Link className="red-btn" to={`/dashboard/${role}`}>Back to dashboard <ArrowLeft size={16}/></Link></section></main></div></div>;
}

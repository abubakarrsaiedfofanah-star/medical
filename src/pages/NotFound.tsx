import {ArrowLeft,HeartPulse} from 'lucide-react';
import {Link} from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';

export default function NotFound(){return <><PublicNav/><main className="not-found"><div className="not-found-icon"><HeartPulse size={28}/></div><span className="eyebrow">SAIED / 404</span><h1>That page is not available.</h1><p>The address may be outdated or the workspace may require a different role.</p><div className="not-found-actions"><Link className="red-btn" to="/"><ArrowLeft size={17}/> Back home</Link><Link className="outline-btn" to="/services">View portals</Link></div></main><PublicFooter/></>}

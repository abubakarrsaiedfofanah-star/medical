import {useEffect,useState} from 'react'; import {Link, useLocation, useNavigate} from 'react-router-dom';
import {BarChart3, Boxes, LayoutDashboard, LogOut, PackageSearch, Pill, ShoppingCart} from 'lucide-react';
import {authService} from '../../authentication/authService';

const links = [
  {label:'Overview', path:'/pharmacy', icon:LayoutDashboard},
  {label:'Inventory', path:'/pharmacy/inventory', icon:Boxes},
  {label:'Medicines', path:'/pharmacy/medicines', icon:Pill},
  {label:'Orders', path:'/pharmacy/orders', icon:ShoppingCart},
  {label:'Sales', path:'/pharmacy/sales', icon:BarChart3},
];

export default function PharmacyNav(){
  const location = useLocation();
  const navigate = useNavigate();
  const [user,setUser]=useState(authService.getUser());
  useEffect(()=>{let active=true; const updateUser=(currentUser: Awaited<ReturnType<typeof authService.getCurrentUser>>)=>{if(active)setUser(currentUser)}; authService.getCurrentUser().then(updateUser).catch(()=>updateUser(null)); const unsubscribe=authService.subscribe(updateUser); return ()=>{active=false;unsubscribe()}},[]);
  async function signOut(){await authService.signOut(); navigate('/', {replace:true});}
  const displayName=user?.name || 'Pharmacy user';
  const initials=displayName.split(/\s+/).map(part=>part[0]).join('').slice(0,2).toUpperCase();
  return <aside className="pharmacy-nav">
    <Link to="/pharmacy" className="pharmacy-brand"><span><PackageSearch size={21}/></span><div>SAIED <small>PHARMACY</small></div></Link>
    <div className="pharmacy-nav-label">Workspace</div>
    <nav aria-label="Pharmacy workspace navigation">{links.map(({label,path,icon:Icon})=><Link className={location.pathname === path ? 'active' : ''} aria-current={location.pathname === path ? 'page' : undefined} to={path} key={path}><Icon size={18}/>{label}</Link>)}</nav>
    <div className="pharmacy-nav-footer"><div className="pharmacy-user"><span>{initials}</span><div><strong>{displayName}</strong><small>{user?.role || 'Pharmacy'}</small></div></div><button type="button" title="Sign out" aria-label="Sign out" onClick={signOut}><LogOut size={17}/></button></div>
  </aside>;
}

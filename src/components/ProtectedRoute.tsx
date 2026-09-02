import { Navigate, useLocation } from 'react-router-dom'; import {useEffect,useState} from 'react';
import type { ReactNode } from 'react';
import {authService} from '../features/authentication/authService';

const mobileRoles = new Set(['patient','doctor','nurse','pharmacist','pharmacy','clinic','hospital','laboratory']);
const validPortalRoles = new Set(['patient','doctor','nurse','pharmacist','pharmacy','clinic','hospital','laboratory','admin']);

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [user,setUser] = useState<Awaited<ReturnType<typeof authService.getCurrentUser>>>(authService.getUser());
  const [checking,setChecking] = useState(!authService.getUser());
  useEffect(()=>{let active=true; const updateUser=(currentUser: Awaited<ReturnType<typeof authService.getCurrentUser>>)=>{if(active){setUser(currentUser);setChecking(false)}}; authService.getCurrentUser().then(updateUser).catch(()=>updateUser(null)); const unsubscribe=authService.subscribe(updateUser); return ()=>{active=false;unsubscribe()}},[]);
  if (checking) return <main className="portal portal-loading" aria-live="polite">Checking your secure session...</main>;
  const requestedRole = location.pathname.includes('/pharmacy') ? 'pharmacy' : location.pathname.split('/')[2];
  if (requestedRole && !validPortalRoles.has(requestedRole)) return <Navigate to="/" replace />;
  const isNativeApp = typeof window !== 'undefined' && Boolean((window as Window & {Capacitor?: {isNativePlatform?: () => boolean}}).Capacitor?.isNativePlatform?.());
  if (user?.role === 'admin' && isNativeApp && !mobileRoles.has(requestedRole || '')) {
    return <Navigate to="/" replace />;
  }
  if (user && (!requestedRole || requestedRole === user.role)) return children;
  if (user && requestedRole && requestedRole !== user.role) return <Navigate to={user.role === 'pharmacy' ? '/pharmacy' : `/dashboard/${user.role}`} replace />;
  const role = location.pathname.includes('/pharmacy') ? 'pharmacy' : location.pathname.split('/')[2] || 'patient';
  const authMode = role === 'patient' ? 'register' : 'login';
  return <Navigate to={`/auth?mode=${authMode}&role=${role}&next=${encodeURIComponent(location.pathname)}`} replace />;
}

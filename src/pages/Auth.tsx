import {useState} from 'react';
import type {FormEvent} from 'react';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import {ArrowRight, HeartPulse, ShieldCheck} from 'lucide-react';
import {authService} from '../features/authentication/authService';

const roles = ['patient','doctor','nurse','pharmacist','pharmacy','clinic','hospital','laboratory'] as const;

export default function Auth(){
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [mode, setMode] = useState(params.get('mode') === 'register' ? 'register' : 'login');
  const [name, setName] = useState('');
  const demoRequested = import.meta.env.DEV && params.get('demo') === '1';
  const [email, setEmail] = useState(demoRequested ? 'demo@saied.local' : '');
  const [password, setPassword] = useState(demoRequested ? 'Demo1234' : '');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const requestedRole = params.get('role');
  const adminLogin = requestedRole === 'admin' && mode === 'login';
  const roleLocked = adminLogin || roles.includes(requestedRole as typeof roles[number]);
  const [role, setRole] = useState(roleLocked ? requestedRole as string : 'patient');
  const requestedDestination = params.get('next');
  const destination = requestedDestination?.startsWith('/') && !requestedDestination.startsWith('//') ? requestedDestination : (role === 'pharmacy' ? '/pharmacy' : `/dashboard/${role}`);

  async function submit(event: FormEvent){
    event.preventDefault();
    if(submitting) return;
    setError('');
    if(mode === 'register' && role === 'admin'){setError('Admin accounts are created by an administrator.'); return;}
    if(mode === 'register' && password !== confirmPassword){setError('Passwords do not match.'); return;}
    setSubmitting(true);
    try { const user = mode === 'register' ? await authService.register(name,email,password,role) : await authService.signIn(email,password,role); const roleDestination = user.role === 'pharmacy' ? '/pharmacy' : `/dashboard/${user.role}`; navigate(requestedDestination && user.role === role ? destination : roleDestination, {replace:true}); }
    catch { setError('We could not authenticate those details. Please check your email and password.'); setSubmitting(false); }
  }

  return <main className="auth-page"><section className="auth-art"><Link className="logo auth-logo" to="/"><span className="logo-mark"><HeartPulse size={20}/></span><span>SAIED<small>CONNECTED CARE</small></span></Link><div className="auth-art-copy"><span className="eyebrow">YOUR CARE NETWORK</span><h1>Healthcare that knows where to meet you.</h1><p>One secure place for appointments, records, prescriptions, conversations and care teams.</p><div className="auth-art-note"><ShieldCheck size={18}/><span><strong>Private by design</strong><small>Your care stays connected to the people you choose.</small></span></div></div></section><section className="auth-panel"><div className="auth-form-wrap"><span className="eyebrow">{mode === 'register' ? 'CREATE YOUR ACCOUNT' : 'WELCOME BACK'}</span><h2>{mode === 'register' ? 'Start with SAIED.' : 'Sign in to continue.'}</h2><p className="auth-subtitle">{roleLocked ? `Create your ${role} account.` : mode === 'register' ? 'Create your account and choose the workspace you need.' : 'Access your healthcare workspace securely.'}</p><div className="auth-switch"><button type="button" className={mode === 'login' ? 'active' : ''} onClick={()=>setMode('login')}>Sign in</button><button type="button" className={mode === 'register' ? 'active' : ''} onClick={()=>setMode('register')}>Register</button></div><form onSubmit={submit}>{mode === 'register' && <label>Full name<input required value={name} onChange={event=>setName(event.target.value)} placeholder="Your full name"/></label>}<label>Email address<input required type="email" value={email} onChange={event=>setEmail(event.target.value)} placeholder="you@example.com"/></label><label>Password<input required minLength={8} type="password" value={password} onChange={event=>setPassword(event.target.value)} placeholder="At least 8 characters"/></label>{mode === 'register' && <label>Confirm password<input required minLength={8} type="password" value={confirmPassword} onChange={event=>setConfirmPassword(event.target.value)} placeholder="Repeat your password"/></label>}{mode === 'register' && !roleLocked && <label>Choose your portal<select value={role} onChange={event=>setRole(event.target.value)}>{roles.map(option=><option value={option} key={option}>{option[0].toUpperCase()+option.slice(1)}</option>)}</select></label>}{error && <p className="form-error" role="alert">{error}</p>}<button className="red-btn auth-submit" type="submit">{mode === 'register' ? 'Create account' : 'Sign in'} <ArrowRight size={18}/></button></form><p className="auth-legal">Passwords are required for every SAIED account. By continuing, you agree to SAIED’s privacy and security practices.</p></div></section></main>;
}

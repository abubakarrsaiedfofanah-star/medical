import {useState} from 'react';
import {Bell,Check,MessageSquare,X} from 'lucide-react';
import {Link} from 'react-router-dom';

type Notice={id:number;title:string;detail:string;unread:boolean};
const initialNotices:Notice[]=[
  {id:1,title:'Secure workspace ready',detail:'Your latest portal updates are available.',unread:true},
  {id:2,title:'Care team message',detail:'Open secure messages to review conversations.',unread:true},
  {id:3,title:'Privacy reminder',detail:'Only share records with authorized care teams.',unread:false},
];

export default function NotificationBell(){
  const [open,setOpen]=useState(false);
  const [notices,setNotices]=useState(initialNotices);
  const unread=notices.filter(notice=>notice.unread).length;
  function markAllRead(){setNotices(current=>current.map(notice=>({...notice,unread:false})))}
  return <div className="notification-center"><button className="icon-btn" type="button" aria-label={`Notifications${unread?`, ${unread} unread`:''}`} aria-expanded={open} onClick={()=>setOpen(value=>!value)}><Bell size={19}/>{unread>0&&<span className="notification-count">{unread}</span>}</button>{open&&<div className="notification-panel" role="dialog" aria-label="Notifications"><div className="notification-head"><strong>Notifications</strong><div><button type="button" onClick={markAllRead} aria-label="Mark all notifications as read" title="Mark all as read"><Check size={16}/></button><button type="button" onClick={()=>setOpen(false)} aria-label="Close notifications"><X size={16}/></button></div></div><div className="notification-list">{notices.map(notice=><div className={`notification-item${notice.unread?' unread':''}`} key={notice.id}><span className="notification-dot"/><div><strong>{notice.title}</strong><p>{notice.detail}</p></div></div>)}</div><Link className="notification-link" to="/communications" onClick={()=>setOpen(false)}><MessageSquare size={15}/> Open secure messages</Link></div>}</div>;
}

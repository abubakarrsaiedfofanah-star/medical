import {useState} from 'react'; import type {FormEvent} from 'react';
import {Search} from 'lucide-react';
import {useNavigate} from 'react-router-dom';

export default function PortalSearch({role}:{role:string}){
  const [query,setQuery]=useState('');
  const navigate=useNavigate();
  function submit(event:FormEvent){event.preventDefault(); const value=query.trim(); if(value) navigate(`/dashboard/${role}/records?search=${encodeURIComponent(value)}`);}
  return <form className="search" role="search" onSubmit={submit}><Search size={18}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search patients, records, services..." aria-label="Search portal"/><button type="submit" aria-label="Submit search" title="Search"><Search size={16}/></button></form>;
}

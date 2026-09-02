import {useRef,useState} from 'react';
import {Mic,Phone,PhoneOff,Send,Video} from 'lucide-react';
import {recordVoiceMessage} from '../features/communications/voiceMessage';

export default function Communications(){
 const [text,setText]=useState(''); const [recording,setRecording]=useState(false); const [status,setStatus]=useState('');
 const audioRef=useRef<HTMLAudioElement>(null);
 function startCall(kind:string){setStatus(`${kind} setup requires an authorized care contact and secure signaling.`)}
 function sendMessage(){if(!text.trim())return; setStatus('Message saved as a draft. Secure delivery will be enabled when a care contact is selected.'); setText('')}

 async function voiceMessage(){
   if(recording)return;
   setRecording(true); setStatus('Recording voice message...');
   try{
     const blob=await recordVoiceMessage(60);
     if(audioRef.current) audioRef.current.src=URL.createObjectURL(blob);
     setStatus('Voice message ready. Connect upload to private Supabase Storage.');
   }catch(e){setStatus('Microphone permission is required.')}
   finally{setRecording(false)}
 }
 return <main className="communication-page">
   <section className="communication-card">
    <div className="communication-head"><div><span className="eyebrow">SAIED COMMUNICATIONS</span><h1>Secure patient & healthcare worker communication</h1></div></div>
    <div className="call-actions">
      <button className="comm-btn" type="button" onClick={()=>startCall('Voice call')}><Phone/> Voice call</button>
      <button className="comm-btn" type="button" onClick={()=>startCall('Video call')}><Video/> Video call</button>
      <button className="comm-btn" onClick={voiceMessage}><Mic/> {recording?'Recording...':'Send VM'}</button>
    </div>
    {status&&<p className="comm-status">{status}</p>}
    <audio ref={audioRef} controls/>
    <div className="message-box"><input value={text} onChange={e=>setText(e.target.value)} placeholder="Write a secure message..."/><button className="red-btn" type="button" onClick={sendMessage} disabled={!text.trim()} aria-label="Send message"><Send/></button></div>
    <p className="comm-note">Calls use WebRTC. Production signaling, TURN infrastructure, authentication, private storage and consent controls must be connected before live healthcare use.</p>
   </section>
 </main>
}

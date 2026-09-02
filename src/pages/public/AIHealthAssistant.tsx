import {useState} from 'react';
import {HeartPulse,Send,ShieldAlert} from 'lucide-react';
import PublicNav from '../../components/PublicNav';
import PublicFooter from '../../components/PublicFooter';
import {askSaiedAI} from '../../features/health-assistant/aiClient';

export default function AIHealthAssistant(){
 const [message,setMessage]=useState(''); const [answer,setAnswer]=useState(''); const [loading,setLoading]=useState(false);
 async function send(){if(!message.trim())return;setLoading(true);try{const r=await askSaiedAI(message);setAnswer(r.answer)}catch{setAnswer('The SAIED AI service is currently unavailable. Please use the provider search or contact a healthcare professional.')}finally{setLoading(false)}}
 return <><PublicNav/><main className="ai-page"><section className="ai-hero"><span className="eyebrow"><HeartPulse/> SAIED HEALTH ASSISTANT</span><h1>Explain your health concern in your own words.</h1><p>SAIED can help organize what you tell it and prepare a summary for a qualified healthcare professional.</p><div className="ai-warning"><ShieldAlert/><span><strong>Important:</strong> This assistant does not replace a doctor, nurse or pharmacist and does not independently diagnose or prescribe.</span></div><div className="ai-box"><textarea maxLength={2000} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Example: I have had a headache for two days..."/><div className="ai-controls"><small>{message.length}/2000. Avoid names, ID numbers, and other identifying details.</small><button className="red-btn" onClick={send} disabled={loading||!message.trim()}><Send/> {loading?'Thinking...':'Ask SAIED AI'}</button></div></div>{answer&&<article className="ai-answer"><h3>SAIED AI response</h3><p>{answer}</p></article>}</section></main><PublicFooter/></>
}

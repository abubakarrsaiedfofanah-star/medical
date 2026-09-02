export type AIResult={answer:string; urgency:string; handoff_required:boolean};

const AI_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000';
const MAX_MESSAGE_LENGTH = 2000;

function request(path:string, message:string):Promise<AIResult>{
  const trimmed = message.trim();
  if (!trimmed || trimmed.length > MAX_MESSAGE_LENGTH) {
    return Promise.reject(new Error(`Message must be between 1 and ${MAX_MESSAGE_LENGTH} characters`));
  }
  return fetch(`${AI_URL}${path}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:trimmed})})
    .then(r=>{if(!r.ok) throw new Error('AI service unavailable'); return r.json() as Promise<AIResult>});
}

export async function askSaiedAI(message:string):Promise<AIResult>{
  return request('/chat', message);
}
export async function triageSaiedAI(message:string):Promise<AIResult>{
  return request('/triage', message);
}

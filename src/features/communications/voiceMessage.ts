export async function recordVoiceMessage(seconds = 120) {
  if (!navigator.mediaDevices?.getUserMedia) throw new Error('Microphone is not supported.');
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const recorder = new MediaRecorder(stream);
  const chunks: BlobPart[] = [];

  recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };

  const promise = new Promise<Blob>((resolve, reject) => {
    recorder.onerror = () => reject(new Error('Voice recording failed.'));
    recorder.onstop = () => resolve(new Blob(chunks, { type: recorder.mimeType || 'audio/webm' }));
  });

  recorder.start();
  setTimeout(() => {
    if (recorder.state !== 'inactive') recorder.stop();
    stream.getTracks().forEach(t => t.stop());
  }, seconds * 1000);

  return promise;
}

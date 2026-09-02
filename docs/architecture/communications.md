# SAIED Voice, VM & Video Architecture

## Patient
A patient can:
1. Open a verified doctor/nurse/pharmacist/clinic conversation.
2. Send text.
3. Record and send a voice message (VM).
4. Start a voice call.
5. Start a video call.
6. See missed-call history.
7. Receive appointment reminders.

## Healthcare worker
Authorized workers can:
- receive/respond to messages;
- send VMs;
- call patients;
- video-call patients;
- communicate with other authorized workers;
- connect communication to an encounter/appointment.

## Call technology
WebRTC provides peer-to-peer media. SAIED needs an authenticated signaling service and a TURN server for production reliability. Supabase Realtime can be used for signaling events.

## Voice messages
MediaRecorder creates an audio file. Upload it to a private storage bucket and return a short-lived signed URL. Apply file-size/duration limits and malware/content controls.

## Healthcare privacy
- Do not expose message bodies in push notifications.
- Do not automatically record calls.
- Require explicit recording consent if recording is introduced.
- Restrict conversations to authorized participants.
- Keep audit metadata.
- Provide report/block/escalation mechanisms.

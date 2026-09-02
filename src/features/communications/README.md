# SAIED Communications

Patients and authorized healthcare workers can communicate through:

- Secure text messaging
- Voice messages (VM)
- Voice calls
- Video calls
- Call history
- Missed-call notifications
- Appointment-linked conversations
- Provider availability/presence
- Patient-to-provider communication
- Provider-to-patient communication
- Organization staff communication

## Recommended production architecture

WebRTC handles real-time audio/video. Supabase Realtime or another authenticated signaling channel can exchange:
- SDP offers/answers
- ICE candidates
- ringing/accepted/rejected/ended events

A TURN server is required for reliable calls across difficult networks. Do not rely only on a public STUN server.

Voice messages should be recorded in-browser, uploaded to private storage, and accessed through short-lived signed URLs.

Security:
- Only authorized conversation participants can read messages.
- Clinical information should not be placed in ordinary push notifications.
- Store call/message audit metadata, not unnecessary recordings.
- Explicitly ask for microphone/camera permissions.
- Do not record calls unless all required consent/legal requirements are satisfied.
- Add block/report/escalation controls.

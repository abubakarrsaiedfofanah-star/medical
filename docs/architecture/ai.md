# SAIED AI architecture

Patient -> SAIED AI UI -> AI gateway -> self-hosted medical model -> safety gate -> clinician handoff.

Recommended initial model: MedGemma 1.5 4B IT. Google describes it as an open multimodal medical model intended as a starting point for healthcare application development. It can work with medical text/images and has medical document/EHR understanding capabilities, but its outputs are preliminary and require independent verification. See the model card before use.

For a free development setup, run the model on your own computer/server. "Free model" does not mean free infrastructure: GPU/CPU hosting, storage, bandwidth and monitoring can still cost money.

AI features planned:
1. Symptom intake.
2. Plain-language rewriting.
3. Clinician summary.
4. Translation assistance.
5. Appointment/service routing.
6. Medication information education (not prescribing).
7. Lab-report explanation assistance (not diagnosis).
8. Red-flag escalation.
9. Provider handoff.
10. Conversation audit/consent controls.

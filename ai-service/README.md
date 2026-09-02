# SAIED Free Medical AI Service

This service is designed around a self-hosted/open medical model so SAIED does not depend on a paid AI API for every patient message.

Recommended model: Google MedGemma 1.5 4B instruction-tuned for medical text/image application development. It is available through Hugging Face, but its use is governed by the Health AI Developer Foundations terms and it requires validation/adaptation for the intended use.

Important:
- AI is an assistant, not a doctor.
- Never let AI independently diagnose, prescribe, dispense medication, or make emergency decisions.
- Escalate red-flag symptoms to a human professional/emergency service.
- Do not send identifiable patient data to a model until the privacy/security architecture is approved.
- For production, run the model in a controlled backend, not inside the public browser.

Run the example:
  python -m venv .venv
  pip install -r requirements.txt
  uvicorn app:app --host 0.0.0.0 --port 8000

Set MODEL_ID to a model you are licensed/authorized to use.

import { useParams } from 'react-router-dom';
import QRReceipt from '../components/QRReceipt';
export default function VerifyReceipt() {
  const { token } = useParams();
  const receiptToken = token?.trim() || 'invalid';
  return <main className="portal"><section className="portal-card receipt-verification"><div className="icon-box">✓</div><div className="verification-copy"><span className="eyebrow">SAIED RECEIPT CHECK</span><h1>Receipt verification</h1><p>Reference: <strong>{receiptToken}</strong></p><p className="verification-status">This receipt link is ready for verification by the authorized SAIED service.</p></div><QRReceipt receiptRef={receiptToken} verificationToken={receiptToken}/><small className="verification-note">Scan this code to open the secure verification page. Do not share receipt tokens publicly.</small></section></main>;
}

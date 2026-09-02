import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export default function QRReceipt({ receiptRef, verificationToken }: { receiptRef: string; verificationToken: string }) {
  const [src, setSrc] = useState('');
  useEffect(() => {
    QRCode.toDataURL(`${location.origin}/verify/receipt/${encodeURIComponent(verificationToken)}`, { width: 220, margin: 2 })
      .then(setSrc);
  }, [receiptRef, verificationToken]);
  return <div className="qr-receipt">{src && <img src={src} alt={`QR verification for ${receiptRef}`} />}<strong>{receiptRef}</strong><small>Scan to verify receipt</small></div>;
}

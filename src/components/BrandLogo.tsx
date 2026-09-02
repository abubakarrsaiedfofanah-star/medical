import {HeartPulse} from 'lucide-react';

export default function BrandLogo({size = 'header'}: {size?: 'header' | 'footer'}) {
  return <span className={`logo-mark brand-mark-${size}`} aria-hidden="true"><HeartPulse size={size === 'header' ? 21 : 19}/></span>;
}

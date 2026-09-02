import {Routes,Route} from 'react-router-dom';
import PortalSection from './pages/PortalSection';
import NotFound from './pages/NotFound';
import Home from './pages/public/Home'; import Services from './pages/public/Services'; import Subscriptions from './pages/public/Subscriptions'; import Contact from './pages/public/Contact'; import Providers from './pages/public/Providers'; import Dashboard from './pages/RoleDashboard'; import VerifyReceipt from './pages/VerifyReceipt'; import AIHealthAssistant from './pages/public/AIHealthAssistant'; import Communications from './pages/Communications';
import PharmacyDashboard from './pages/pharmacy/PharmacyDashboard'; import Inventory from './pages/pharmacy/Inventory'; import Medicines from './pages/pharmacy/Medicines'; import Orders from './pages/pharmacy/Orders'; import Sales from './pages/pharmacy/Sales';
import Auth from './pages/Auth'; import ProtectedRoute from './components/ProtectedRoute';
export default function App(){return <Routes>
<Route path="/" element={<Home/>}/><Route path="/services" element={<Services/>}/><Route path="/providers" element={<Providers/>}/><Route path="/subscriptions" element={<Subscriptions/>}/><Route path="/contact" element={<Contact/>}/>
<Route path="/auth" element={<Auth/>}/><Route path="/verify/receipt/:token" element={<VerifyReceipt/>}/><Route path="/ai" element={<AIHealthAssistant/>}/><Route path="/communications" element={<ProtectedRoute><Communications/></ProtectedRoute>}/>
<Route path="/dashboard/:role/:section" element={<ProtectedRoute><PortalSection/></ProtectedRoute>}/><Route path="/dashboard/:role/*" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/><Route path="/portal/:role/*" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
<Route path="/pharmacy" element={<ProtectedRoute><PharmacyDashboard/></ProtectedRoute>}/><Route path="/pharmacy/inventory" element={<ProtectedRoute><Inventory/></ProtectedRoute>}/><Route path="/pharmacy/medicines" element={<ProtectedRoute><Medicines/></ProtectedRoute>}/><Route path="/pharmacy/orders" element={<ProtectedRoute><Orders/></ProtectedRoute>}/><Route path="/pharmacy/sales" element={<ProtectedRoute><Sales/></ProtectedRoute>}/>
<Route path="*" element={<NotFound/>}/>
</Routes>}

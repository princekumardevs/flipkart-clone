import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import EntryGate from './pages/EntryGate';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';

function AppLayout() {
  const location = useLocation();
  const isEntryPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-flipkart-light">
      {!isEntryPage && <Navbar />}
      <main className={isEntryPage ? '' : 'pt-[108px] md:pt-[56px]'}>
        <Routes>
          <Route path="/" element={<EntryGate />} />
          <Route path="/home" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Router>
            <AppLayout />
            <Toaster
              position="bottom-center"
              toastOptions={{
                duration: 2000,
                style: {
                  background: '#212121',
                  color: '#fff',
                  fontSize: '14px',
                  borderRadius: '2px',
                },
              }}
            />
          </Router>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;

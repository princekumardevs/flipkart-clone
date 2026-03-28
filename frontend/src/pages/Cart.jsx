import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { refreshCartCount } = useCart();

  const fetchCart = useCallback(async () => {
    try {
      let sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem('sessionId', sessionId);
      }
      const { data } = await api.get(`/api/cart/${sessionId}`);
      setCartItems(data.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await api.patch(`/api/cart/${itemId}`, { quantity: newQuantity });
      await refreshCartCount();
      fetchCart();
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/api/cart/${itemId}`);
      toast.success('Item removed');
      await refreshCartCount();
      fetchCart();
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce((acc, item) => acc + (parseFloat(item.product.price) * item.quantity), 0);
  const totalOriginal = cartItems.reduce((acc, item) => acc + ((item.product.originalPrice ? parseFloat(item.product.originalPrice) : parseFloat(item.product.price)) * item.quantity), 0);
  const discount = totalOriginal - totalAmount;
  const deliveryCharges = totalAmount >= 499 ? 0 : 40;
  const finalAmount = totalAmount + deliveryCharges;

  if (loading) {
     return <div className="min-h-screen bg-flipkart-light pt-4 p-2"><div className="w-full h-[500px] bg-white animate-pulse"></div></div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-flipkart-light pt-4 px-[10px] pb-8">
        <div className="max-w-[1248px] mx-auto bg-white shadow-[0_1px_1px_0_rgba(0,0,0,.16)] rounded-sm min-h-[60vh] flex flex-col items-center justify-center py-10">
          <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="Empty Cart" className="w-[200px] md:w-[250px] mb-8" />
          <h2 className="text-[18px] text-flipkart-dark font-medium mb-3">Missing Cart items?</h2>
          <p className="text-[12px] text-flipkart-grey mb-6">Login to see the items you added previously</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-flipkart-orange text-white px-16 py-[10px] rounded-sm font-medium text-[14px] shadow-sm hover:-translate-y-px transition-transform"
          >
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-flipkart-light pt-8 px-2 pb-8">
      <div className="max-w-[1248px] mx-auto flex flex-col lg:flex-row gap-4">
        
        {/* Left: Cart Items */}
        <div className="flex-1">
           <div className="bg-white rounded-sm shadow-[0_1px_2px_0_rgba(0,0,0,.2)] mb-4">
              <div className="px-6 py-4 flex items-center justify-between border-b border-[#f0f0f0]">
                <h2 className="text-[18px] font-medium text-flipkart-dark">Flipkart ({totalItems})</h2>
              </div>
              
              {cartItems.map((item) => (
                <div key={item.id} className="p-6 border-b border-[#f0f0f0] flex flex-col md:flex-row gap-6 relative">
                  
                  {/* Image & Qty */}
                  <div className="flex flex-col items-center gap-4 w-[112px] shrink-0">
                    <div className="w-[112px] h-[112px] flex items-center justify-center">
                      <img src={item.product.images?.[0] || 'https://picsum.photos/112/112'} alt={item.product.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex items-center gap-2">
                       <button 
                         onClick={() => updateQuantity(item.id, item.quantity - 1)}
                         disabled={item.quantity <= 1}
                         className="w-7 h-7 rounded-full border border-[#c2c2c2] bg-white flex items-center justify-center text-[18px] font-bold text-flipkart-dark disabled:opacity-40"
                       >-</button>
                       <div className="w-[42px] h-7 border border-[#c2c2c2] bg-white flex items-center justify-center text-[14px] font-medium">
                         {item.quantity}
                       </div>
                       <button 
                         onClick={() => updateQuantity(item.id, item.quantity + 1)}
                         className="w-7 h-7 rounded-full border border-[#c2c2c2] bg-white flex items-center justify-center text-[18px] font-bold text-flipkart-dark"
                       >+</button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-[16px] text-flipkart-dark font-medium hover:text-flipkart-blue cursor-pointer inline-block w-fit">{item.product.name}</h3>
                    <p className="text-[14px] text-flipkart-grey mt-1 mb-4">{item.product.brand || 'Generic'}</p>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[14px] text-flipkart-grey line-through">₹{item.product.originalPrice ? parseFloat(item.product.originalPrice).toLocaleString() : ''}</span>
                      <span className="text-[18px] font-medium text-flipkart-dark">₹{parseFloat(item.product.price).toLocaleString()}</span>
                      {discount > 0 && <span className="text-[14px] text-flipkart-green font-medium">{item.product.discountPercent}% Off</span>}
                    </div>
                    
                    <div className="mt-8 flex items-center gap-6">
                      <button className="text-[16px] font-medium text-flipkart-dark hover:text-flipkart-blue">SAVE FOR LATER</button>
                      <button onClick={() => removeItem(item.id)} className="text-[16px] font-medium text-flipkart-dark hover:text-flipkart-blue">REMOVE</button>
                    </div>
                  </div>

                  {/* Delivery ETA */}
                  <div className="hidden md:block w-[200px] text-[14px] text-flipkart-dark">
                    Delivery by {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })} | <span className={`${deliveryCharges === 0 ? 'text-flipkart-green' : ''}`}>{deliveryCharges === 0 ? 'Free' : `₹${deliveryCharges}`}</span>
                  </div>
                </div>
              ))}

              {/* Place Order CTA */}
              <div className="p-4 flex justify-end shadow-[0_-2px_10px_0_rgba(0,0,0,.1)] bg-white sticky bottom-0 z-10 w-full">
                <button 
                  onClick={() => navigate('/checkout')}
                  className="bg-flipkart-orange text-white px-[40px] py-[16px] rounded-sm font-medium text-[16px] shadow-sm uppercase tracking-wide"
                >
                  Place Order
                </button>
              </div>

           </div>
        </div>

        {/* Right: Price Details */}
        <div className="w-full lg:w-[350px] shrink-0 sticky top-[72px] self-start">
           <div className="bg-white rounded-sm shadow-[0_1px_2px_0_rgba(0,0,0,.2)] pb-4">
             <div className="px-6 py-4 border-b border-[#f0f0f0]">
                <h3 className="text-[16px] text-flipkart-grey font-medium uppercase tracking-wide">Price Details</h3>
             </div>
             <div className="px-6 box-border font-medium">
               <div className="flex justify-between mt-5 text-[16px] text-flipkart-dark">
                 <span>Price ({totalItems} items)</span>
                 <span>₹{totalOriginal.toLocaleString()}</span>
               </div>
               <div className="flex justify-between mt-5 text-[16px] text-flipkart-dark">
                 <span>Discount</span>
                 <span className="text-flipkart-green">− ₹{discount.toLocaleString()}</span>
               </div>
               <div className="flex justify-between mt-5 text-[16px] text-flipkart-dark">
                 <span>Delivery Charges</span>
                 <span className="text-flipkart-green">{deliveryCharges === 0 ? 'Free' : `₹${deliveryCharges}`}</span>
               </div>
               <div className="flex justify-between mt-5 pt-5 text-[18px] text-flipkart-dark font-bold border-t border-dashed border-[#e0e0e0]">
                 <span>Total Amount</span>
                 <span>₹{finalAmount.toLocaleString()}</span>
               </div>
               <div className="text-[16px] text-flipkart-green mt-5 font-medium tracking-tight">
                 You will save ₹{discount.toLocaleString()} on this order
               </div>
             </div>
           </div>
           
           <div className="mt-4 flex items-center justify-start gap-4 text-flipkart-grey px-4">
             <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/shield_b33c0c.svg" className="w-[29px] h-[35px]" alt="Safe" />
             <div className="text-[13px] font-medium">Safe and Secure Payments.Easy returns.100% Authentic products.</div>
           </div>
        </div>

      </div>
    </div>
  );
}

export default Cart;

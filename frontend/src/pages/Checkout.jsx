import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';

function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await api.get('/api/addresses', { headers: { Authorization: `Bearer ${token}` } });
          const fetchedAddresses = res.data.data;
          setAddresses(fetchedAddresses);
          if (fetchedAddresses.length > 0) {
            setSelectedAddress(fetchedAddresses[0]);
          } else {
            setShowNewAddressForm(true);
          }
        } else {
          setShowNewAddressForm(true);
        }
      } catch (error) {
        setShowNewAddressForm(true);
      }
    };
    fetchAddresses();
  }, []);

  const fetchCart = useCallback(async () => {
    try {
      let sessionId = localStorage.getItem('sessionId');
      const { data } = await api.get(`/api/cart/${sessionId}`);
      setCartItems(data.data);
      if (data.data.length === 0) {
        navigate('/cart');
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
    }
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = 'Enter a valid 6-digit pincode';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const placeOrderWithData = async (addressData) => {
    setPlacingOrder(true);
    try {
      const sessionId = localStorage.getItem('sessionId');
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      const { data } = await api.post('/api/orders', {
        sessionId,
        ...addressData
      }, config);
      toast.success('Order placed successfully!');
      navigate(`/order-success?order=${data.data.orderNumber}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to place order');
      setPlacingOrder(false);
    }
  };

  const handleDeliverHere = () => {
    if (selectedAddress) {
      placeOrderWithData(selectedAddress);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSavingAddress(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Save the address to backend
        const res = await api.post('/api/addresses', formData, { headers: { Authorization: `Bearer ${token}` } });
        placeOrderWithData(res.data.data);
      } else {
        // Guest checkout, just place order directly
        placeOrderWithData(formData);
      }
    } catch (error) {
      toast.error('Failed to save address');
      setSavingAddress(false);
    }
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce((acc, item) => acc + (parseFloat(item.product.price) * item.quantity), 0);
  const totalOriginal = cartItems.reduce((acc, item) => acc + ((item.product.originalPrice ? parseFloat(item.product.originalPrice) : parseFloat(item.product.price)) * item.quantity), 0);
  const discount = totalOriginal - totalAmount;
  const deliveryCharges = totalAmount >= 499 ? 0 : 40;
  const finalAmount = totalAmount + deliveryCharges;

  if (loading) {
     return <div className="min-h-[calc(100vh-56px)] bg-flipkart-light pt-4 p-2"><div className="max-w-[1248px] mx-auto h-[500px] bg-white animate-pulse"></div></div>;
  }

  const InputClass = (name) => `w-full px-4 py-[14px] border ${errors[name] ? 'border-red-500 bg-red-50' : 'border-[#e0e0e0]'} rounded-sm text-[16px] bg-white outline-none focus:border-flipkart-blue transition-colors`;

  return (
    <div className="min-h-[calc(100vh-56px)] bg-flipkart-light pt-8 px-2 pb-8">
      <div className="max-w-[1248px] mx-auto flex flex-col lg:flex-row gap-4">
        
        {/* Left: Checkout Steps */}
        <div className="flex-1 space-y-4">
          
          {/* Step 1 */}
          <div className="bg-white rounded-sm shadow-[0_1px_2px_0_rgba(0,0,0,.2)]">
            <div className="px-6 py-4 flex items-center justify-between border-b border-[#f0f0f0]">
               <h2 className="text-[16px] font-medium text-flipkart-dark uppercase flex items-center gap-4">
                 <span className="bg-[#f0f0f0] text-flipkart-blue w-6 h-6 rounded-sm flex items-center justify-center text-[13px] font-medium">1</span>
                 Login
               </h2>
               <div className="text-[14px] font-medium text-flipkart-dark flex items-center gap-2">
                 Guest User <svg className="w-4 h-4 text-flipkart-blue" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
               </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-sm shadow-[0_1px_2px_0_rgba(0,0,0,.2)]">
            <div className="px-6 py-4 bg-flipkart-blue text-white flex items-center justify-between">
               <h2 className="text-[16px] font-medium uppercase flex items-center gap-4">
                 <span className="bg-white text-flipkart-blue w-6 h-6 rounded-sm flex items-center justify-center text-[13px] font-medium">2</span>
                 Delivery Address
               </h2>
            </div>
            <div className="p-6 bg-[#f5faff]">
              
              {!showNewAddressForm && addresses.length > 0 && (
                <div className="mb-6 space-y-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className={`p-4 border bg-white cursor-pointer ${selectedAddress?.id === addr.id ? 'border-flipkart-blue bg-[#f4f8ff]' : 'border-[#e0e0e0] hover:border-flipkart-blue'}`} onClick={() => setSelectedAddress(addr)}>
                      <div className="flex items-start gap-4">
                        <input type="radio" checked={selectedAddress?.id === addr.id} readOnly className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <span className="font-medium text-[14px] text-flipkart-dark">{addr.fullName}</span>
                            <span className="font-medium text-[14px] text-flipkart-dark">{addr.phone}</span>
                          </div>
                          <p className="text-[14px] text-flipkart-dark">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}, {addr.city}, {addr.state} - <span className="font-medium">{addr.pincode}</span></p>
                          
                          {selectedAddress?.id === addr.id && (
                            <button 
                              onClick={handleDeliverHere}
                              disabled={placingOrder}
                              className="mt-4 bg-flipkart-orange hover:bg-[#f65a0b] text-white px-10 py-3 rounded-sm font-medium text-[14px] shadow-sm uppercase tracking-wide transition-colors disabled:opacity-60"
                            >
                              {placingOrder ? 'Processing...' : 'Deliver Here'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="bg-white border border-[#e0e0e0] p-4 flex items-center font-medium text-[14px] text-flipkart-blue hover:text-[#1a5cbd] cursor-pointer" onClick={() => setShowNewAddressForm(true)}>
                    <span className="mr-4 text-xl leading-none">+</span> Add a new address
                  </div>
                </div>
              )}

              {showNewAddressForm && (
                <form onSubmit={handleSubmit} className="bg-white p-6 border border-[#f0f0f0] shadow-sm max-w-[800px]">
                  <h3 className="text-[14px] text-flipkart-blue font-medium uppercase tracking-wide mb-6">Add a new address</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Name" className={InputClass('fullName')} />
                      {errors.fullName && <p className="text-[12px] text-red-500 mt-1">{errors.fullName}</p>}
                    </div>
                    <div>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="10-digit mobile number" className={InputClass('phone')} />
                      {errors.phone && <p className="text-[12px] text-red-500 mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="Pincode" className={InputClass('pincode')} />
                      {errors.pincode && <p className="text-[12px] text-red-500 mt-1">{errors.pincode}</p>}
                    </div>
                    <div>
                      <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City/District/Town" className={InputClass('city')} />
                      {errors.city && <p className="text-[12px] text-red-500 mt-1">{errors.city}</p>}
                    </div>
                  </div>

                  <div className="mb-4">
                    <textarea name="addressLine1" value={formData.addressLine1} onChange={handleInputChange} placeholder="Address (Area and Street)" rows="3" className={`${InputClass('addressLine1')} py-3 resize-none`} />
                    {errors.addressLine1 && <p className="text-[12px] text-red-500 mt-1">{errors.addressLine1}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div>
                      <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="State" className={InputClass('state')} />
                      {errors.state && <p className="text-[12px] text-red-500 mt-1">{errors.state}</p>}
                    </div>
                    <div>
                      <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleInputChange} placeholder="Locality / Landmark (Optional)" className={InputClass('addressLine2')} />
                    </div>
                  </div>

                  <div className="flex justify-start items-center gap-4">
                    <button 
                      type="submit" 
                      disabled={savingAddress || placingOrder}
                      className="bg-flipkart-orange hover:bg-[#f65a0b] text-white px-10 py-3 rounded-sm font-medium text-[14px] shadow-sm uppercase tracking-wide transition-colors disabled:opacity-60"
                    >
                      {savingAddress || placingOrder ? 'Processing...' : 'Save and Deliver Here'}
                    </button>
                    {addresses.length > 0 && (
                      <button 
                        type="button" 
                        onClick={() => setShowNewAddressForm(false)}
                        className="text-[14px] text-flipkart-blue hover:text-[#1a5cbd] font-medium uppercase px-4"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}
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
                 <span>Total Payable</span>
                 <span>₹{finalAmount.toLocaleString()}</span>
               </div>
               <div className="text-[16px] text-flipkart-green mt-5 font-medium tracking-tight">
                 Your Total Savings on this order ₹{discount.toLocaleString()}
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

export default Checkout;

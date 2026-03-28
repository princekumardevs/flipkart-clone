import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (loading) {
    return <div className="min-h-[calc(100vh-56px)] bg-flipkart-light pt-8 px-4 flex justify-center"><div className="w-full max-w-[1000px] h-[400px] bg-white animate-pulse"></div></div>;
  }

  return (
    <div className="bg-flipkart-light min-h-[calc(100vh-56px)] py-8 px-4 flex justify-center">
      <div className="w-full max-w-[1000px] flex flex-col gap-4">
        {orders.length === 0 ? (
          <div className="bg-white rounded-sm shadow-sm p-8 flex flex-col items-center justify-center min-h-[400px]">
            <img src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/empty-orders_20bbd5.png" alt="No Orders" className="w-[200px] mb-6" />
            <h2 className="text-[18px] font-medium mb-4">You have no orders</h2>
            <button 
              onClick={() => navigate('/')}
              className="bg-flipkart-orange text-white px-8 py-2.5 rounded-sm font-medium shadow-sm"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-sm shadow-[0_1px_2px_0_rgba(0,0,0,.2)] hover:shadow-[0_3px_16px_0_rgba(0,0,0,.11)] transition-shadow">
              <div className="p-4 border-b border-[#f0f0f0] bg-[#f5faff] flex justify-between items-center rounded-t-sm">
                <div>
                  <span className="text-[14px] font-bold text-flipkart-dark uppercase">Order {order.orderNumber}</span>
                  <p className="text-[12px] text-flipkart-grey mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className="text-[16px] font-bold text-flipkart-dark">₹{parseFloat(order.total).toLocaleString()}</span>
                  <p className="text-[12px] text-flipkart-green font-medium mt-1 uppercase text-xs">Status: {order.status}</p>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-start sm:items-center border-b border-[#f0f0f0] last:border-0 pb-4 last:pb-0">
                    <div className="w-[80px] h-[80px] shrink-0 flex items-center justify-center cursor-pointer" onClick={() => navigate(`/product/${item.product.id}`)}>
                      <img src={item.product.images?.[0] || 'https://picsum.photos/100/100'} alt={item.product.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[14px] font-medium text-flipkart-dark hover:text-flipkart-blue cursor-pointer line-clamp-1" onClick={() => navigate(`/product/${item.product.id}`)}>
                        {item.product.name}
                      </h3>
                      <p className="text-[12px] text-flipkart-grey mt-1">Quantity: <span className="font-bold text-flipkart-dark">{item.quantity}</span></p>
                    </div>
                    <div className="shrink-0 text-right w-[100px]">
                      <span className="text-[14px] font-bold text-flipkart-dark">₹{parseFloat(item.price).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Orders;

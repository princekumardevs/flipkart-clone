import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { getProductImage, handleProductImageError } from '../lib/productImages';

function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderNumber = searchParams.get('order');

  useEffect(() => {
    if (!orderNumber) {
      navigate('/');
      return;
    }

    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/api/orders/${orderNumber}`);
        setOrder(data.data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderNumber, navigate]);

  // Estimated delivery (5-7 days from now)
  const getEstimatedDelivery = () => {
    const start = new Date();
    start.setDate(start.getDate() + 5);
    const end = new Date();
    end.setDate(end.getDate() + 7);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return `${start.toLocaleDateString('en-IN', options)} - ${end.toLocaleDateString('en-IN', options)}`;
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="bg-white rounded shadow-sm p-8 animate-pulse text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4" />
          <div className="h-6 bg-gray-200 rounded w-64 mx-auto mb-3" />
          <div className="h-4 bg-gray-200 rounded w-40 mx-auto" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-8 sm:py-12 text-center">
        <p className="text-lg text-[#878787]">Order not found</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-8 py-2.5 bg-[#2874f0] text-white font-semibold rounded-sm hover:bg-[#1a5bc4] cursor-pointer"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Success Banner */}
      <div className="bg-white rounded shadow-sm p-5 sm:p-8 text-center mb-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#388e3c] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#212121] mb-2">Order Placed Successfully!</h1>
        <p className="text-[14px] sm:text-base text-[#878787] mb-1">Thank you for your order</p>
        <p className="text-[13px] sm:text-sm text-[#2874f0] font-semibold break-all">
          Order Number: <span className="text-base sm:text-lg">{order.orderNumber}</span>
        </p>
      </div>

      {/* Order Details */}
      <div className="bg-white rounded shadow-sm mb-4">
        <h3 className="text-base font-semibold text-[#212121] px-4 sm:px-6 py-3 border-b border-[#f0f0f0]">
          Order Details
        </h3>

        {/* Items */}
        {order.items.map((item) => (
          <div key={item.id} className="flex gap-3 sm:gap-4 px-4 sm:px-6 py-4 border-b border-[#f0f0f0]">
            <img
              src={getProductImage(item.product)}
              alt={item.product.name}
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded"
              onError={(event) => handleProductImageError(event, item.product?.category?.name)}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-[#212121]">{item.product.name}</p>
              <p className="text-xs text-[#878787] mt-0.5">Qty: {item.quantity}</p>
              <p className="text-sm font-semibold text-[#212121] mt-1">
                ₹{(parseFloat(item.price) * item.quantity).toLocaleString()}
              </p>
            </div>
          </div>
        ))}

        {/* Price Summary */}
        <div className="px-4 sm:px-6 py-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>₹{parseFloat(order.subtotal).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Delivery</span>
            {parseFloat(order.deliveryCharge) === 0 ? (
              <span className="text-[#388e3c]">FREE</span>
            ) : (
              <span>₹{parseFloat(order.deliveryCharge)}</span>
            )}
          </div>
          <div className="border-t border-[#e0e0e0] pt-2 flex justify-between font-bold text-base">
            <span>Total</span>
            <span>₹{parseFloat(order.total).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="bg-white rounded shadow-sm mb-4">
        <div className="px-6 py-4">
          <h3 className="text-base font-semibold text-[#212121] mb-3">Delivery Address</h3>
          <p className="text-sm font-semibold text-[#212121]">{order.fullName}</p>
          <p className="text-sm text-[#212121] mt-1">
            {order.addressLine1}
            {order.addressLine2 && `, ${order.addressLine2}`}
          </p>
          <p className="text-sm text-[#212121]">
            {order.city}, {order.state} - {order.pincode}
          </p>
          <p className="text-sm text-[#212121] mt-1">Phone: {order.phone}</p>
        </div>
        <div className="px-4 sm:px-6 py-3 bg-[#f1f3f6] border-t border-[#f0f0f0]">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#2874f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-[#212121]">
              Estimated Delivery: <strong>{getEstimatedDelivery()}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Continue Shopping */}
      <div className="text-center">
        <button
          onClick={() => navigate('/')}
          className="w-full sm:w-auto px-8 sm:px-12 py-3 bg-[#2874f0] text-white font-semibold rounded-sm hover:bg-[#1a5bc4] transition-colors cursor-pointer shadow-md"
          id="continue-shopping-btn"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default OrderSuccess;

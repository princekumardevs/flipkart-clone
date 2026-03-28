import { useNavigate } from 'react-router-dom';

function CartSummary({ cartItems }) {
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + parseFloat(item.product.price) * item.quantity;
  }, 0);

  const totalOriginalPrice = cartItems.reduce((sum, item) => {
    const origPrice = item.product.originalPrice ? parseFloat(item.product.originalPrice) : parseFloat(item.product.price);
    return sum + origPrice * item.quantity;
  }, 0);

  const discount = totalOriginalPrice - totalPrice;
  const deliveryCharge = totalPrice >= 499 ? 0 : 40;
  const total = totalPrice + deliveryCharge;

  return (
    <div className="bg-white rounded shadow-sm sticky top-24 border border-gray-100/50">
      <h3 className="text-[15px] text-flipkart-grey font-bold uppercase tracking-wide px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        Price Details
      </h3>

      <div className="px-6 py-5 space-y-4">
        <div className="flex justify-between text-[15px] text-flipkart-dark">
          <span>Price ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
          <span>₹{totalOriginalPrice.toLocaleString()}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-[15px] text-flipkart-dark">
            <span>Discount</span>
            <span className="text-flipkart-green font-medium">− ₹{discount.toLocaleString()}</span>
          </div>
        )}

        <div className="flex justify-between text-[15px] text-flipkart-dark">
          <span>Delivery Charges</span>
          {deliveryCharge === 0 ? (
            <span className="text-flipkart-green font-medium">FREE</span>
          ) : (
            <span>₹{deliveryCharge}</span>
          )}
        </div>

        <div className="border-t border-dashed border-gray-200 pt-4 mt-1 flex justify-between text-[18px] font-bold text-flipkart-dark">
          <span>Total Amount</span>
          <span>₹{total.toLocaleString()}</span>
        </div>

        {discount > 0 && (
          <p className="text-[14px] text-flipkart-green font-bold tracking-wide pt-2">
            You will save ₹{discount.toLocaleString()} on this order
          </p>
        )}
      </div>

      <div className="px-6 pb-6 pt-2">
        <button
          onClick={() => navigate('/checkout')}
          className="w-full py-3.5 bg-flipkart-orange text-white font-bold text-[16px] rounded-sm hover:-translate-y-0.5 transition-transform cursor-pointer shadow-md"
          id="place-order-btn"
        >
          PLACE ORDER
        </button>
      </div>
    </div>
  );
}

export default CartSummary;

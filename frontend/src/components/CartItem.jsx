import toast from 'react-hot-toast';
import api from '../lib/api';
import { getSessionId } from '../lib/session';
import { useCart } from '../context/CartContext';

function CartItem({ item, onUpdate }) {
  const { refreshCartCount } = useCart();

  const product = item.product;
  const price = parseFloat(product.price);
  const subtotal = price * item.quantity;

  const updateQuantity = async (newQty) => {
    if (newQty < 1) return;
    try {
      await api.patch(`/api/cart/${item.id}`, { quantity: newQty });
      refreshCartCount();
      onUpdate();
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async () => {
    try {
      await api.delete(`/api/cart/${item.id}`);
      toast.success('Item removed');
      refreshCartCount();
      onUpdate();
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  return (
    <div className="bg-white p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-6 hover:bg-gray-50/50 transition-colors" id={`cart-item-${item.id}`}>
      {/* Image */}
      <div className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 p-3 flex items-center justify-center">
        <img
          src={product.images?.[0] || 'https://picsum.photos/200/200'}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col">
        <h3 className="text-[16px] text-flipkart-dark font-medium mb-1 line-clamp-2 leading-snug hover:text-flipkart-blue transition-colors cursor-pointer">{product.name}</h3>
        {product.brand && (
          <p className="text-[13px] text-gray-400 font-semibold mb-2 uppercase tracking-wide">{product.brand}</p>
        )}

        {/* Price */}
        <div className="flex items-center gap-3 mb-4 mt-1">
          <span className="text-[18px] font-bold text-flipkart-dark">₹{price.toLocaleString()}</span>
          {product.originalPrice && parseFloat(product.originalPrice) > price && (
            <>
              <span className="text-[14px] text-flipkart-grey line-through font-medium">₹{parseFloat(product.originalPrice).toLocaleString()}</span>
              <span className="text-[14px] text-flipkart-green font-bold tracking-tight">{product.discountPercent}% OFF</span>
            </>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-6 mt-auto">
          <div className="flex items-center border border-gray-200 rounded-full bg-white shadow-sm overflow-hidden">
            <button
              onClick={() => updateQuantity(item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-10 h-8 flex items-center justify-center text-flipkart-dark hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M5 12h14" />
              </svg>
            </button>
            <span className="w-10 h-8 flex items-center justify-center text-[15px] font-bold border-x border-gray-200 bg-gray-50 text-flipkart-dark">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.quantity + 1)}
              className="w-10 h-8 flex items-center justify-center text-flipkart-dark hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>

          <button
            onClick={removeItem}
            className="text-[14px] text-flipkart-dark font-bold hover:text-flipkart-blue transition-colors cursor-pointer"
          >
            REMOVE
          </button>
        </div>
      </div>

      {/* Subtotal */}
      <div className="shrink-0 text-right hidden lg:block">
        <p className="text-[18px] font-bold text-flipkart-dark">₹{subtotal.toLocaleString()}</p>
      </div>
    </div>
  );
}

export default CartItem;

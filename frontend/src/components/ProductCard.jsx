import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const price = parseFloat(product.price);
  const originalPrice = product.originalPrice ? parseFloat(product.originalPrice) : null;

  return (
    <div 
      onClick={() => navigate(`/product/${product.id}`)}
      className="flex flex-col p-2.5 sm:p-4 bg-white hover:shadow-[0_3px_16px_0_rgba(0,0,0,.11)] hover:z-10 transition-shadow cursor-pointer relative group border-t border-l border-[#f0f0f0] h-full min-w-0"
    >
      <div className="w-full h-[120px] sm:h-[150px] md:h-[200px] flex items-center justify-center mb-3 sm:mb-4 relative pointer-events-none">
        <img
           src={product.images?.[0] || 'https://picsum.photos/400/400'}
           alt={product.name}
           className="max-h-full max-w-full object-contain"
        />
        {product.discountPercent > 0 && (
           <span className="absolute top-0 right-0 bg-flipkart-green text-white text-[10px] sm:text-[11px] font-bold px-1 py-[2px] rounded-sm">
             {product.discountPercent}% OFF
           </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
          className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 p-1.5 rounded-full bg-white/80 hover:bg-white shadow-sm pointer-events-auto transition-transform active:scale-90 z-20"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={isWishlisted(product.id) ? "#ff6161" : "none"} stroke={isWishlisted(product.id) ? "#ff6161" : "#c2c2c2"} strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col flex-1 items-center text-center">
        {/* Title */}
        <h3 className="text-[13px] sm:text-[14px] text-flipkart-dark font-medium leading-[1.3] line-clamp-2 hover:text-flipkart-blue">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-[2px] bg-flipkart-green text-white text-[11px] sm:text-[12px] font-bold px-[6px] py-[2px] rounded-sm">
              {parseFloat(product.rating).toFixed(1)}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 8.25L2.5 9.75L3 7L1 5L3.83 4.67L5 2L6.17 4.67L9 5L7 7L7.5 9.75L5 8.25Z" />
              </svg>
            </span>
            <span className="text-[12px] sm:text-[14px] text-flipkart-grey font-medium truncate">
              ({product.ratingCount?.toLocaleString()})
            </span>
          </div>
        )}

        {/* Price Box */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-2">
          <span className="text-[14px] sm:text-[16px] font-bold text-flipkart-dark">₹{price.toLocaleString()}</span>
          {originalPrice && originalPrice > price && (
            <>
              <span className="text-[12px] sm:text-[14px] text-flipkart-grey line-through">₹{originalPrice.toLocaleString()}</span>
              <span className="text-[11px] sm:text-[13px] text-flipkart-green font-bold">{product.discountPercent}% off</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

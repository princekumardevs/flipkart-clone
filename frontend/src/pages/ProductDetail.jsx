import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshCartCount } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/api/products/${id}`);
        if (isMounted) setProduct(data.data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        toast.error('Product not found');
        navigate('/');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProduct();
    return () => { isMounted = false; };
  }, [id, navigate]);

  const handleAction = async (isBuyNow = false) => {
    setAddingToCart(true);
    try {
      let sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem('sessionId', sessionId);
      }
      await api.post('/api/cart', {
        sessionId,
        productId: product.id,
        quantity: 1
      });
      await refreshCartCount();
      
      if (isBuyNow) {
        navigate('/checkout');
      } else {
        toast.success('Item added to cart');
        navigate('/cart');
      }
    } catch (error) {
      toast.error('Failed to process request');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-flipkart-light pt-8 px-2 pb-8">
        <div className="max-w-[1248px] mx-auto bg-white p-4 md:p-6 shadow-[0_1px_1px_0_rgba(0,0,0,.16)] min-h-[600px] flex flex-col md:flex-row relative">
           <div className="w-full md:w-[45%] lg:w-[40%] bg-gray-100 mr-8 mb-6 md:mb-0"></div>
           <div className="w-full md:w-[55%] lg:w-[60%] space-y-4">
              <div className="h-6 bg-gray-200 w-3/4"></div>
              <div className="h-8 bg-gray-200 w-1/4"></div>
              <div className="h-10 bg-gray-200 w-full mt-8"></div>
           </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const price = parseFloat(product.price);
  const originalPrice = product.originalPrice ? parseFloat(product.originalPrice) : null;
  const images = product.images?.length > 0 ? product.images : ['https://picsum.photos/400/400'];

  return (
    <div className="min-h-screen bg-flipkart-light pt-4 px-[10px] pb-8">
      <div className="max-w-[1248px] mx-auto bg-white shadow-[0_1px_1px_0_rgba(0,0,0,.16)] rounded-sm flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Column: Images & Actions */}
        <div className="w-full md:w-[40%] border-r border-[#f0f0f0] flex flex-col items-center pt-8 pb-4 sticky top-[56px] self-start h-auto md:h-[calc(100vh-56px)] overflow-y-auto">
          <div className="flex gap-4 p-4 w-full h-[350px] md:h-[450px]">
            {/* Thumbnails */}
            <div className="w-[64px] flex flex-col gap-2 overflow-y-auto scrollbar-hide">
              {images.map((img, index) => (
                <div 
                  key={index} 
                  onMouseEnter={() => setSelectedImage(index)}
                  className={`w-[64px] h-[64px] p-1 border cursor-pointer ${selectedImage === index ? 'border-flipkart-blue' : 'border-[#f0f0f0] hover:border-flipkart-grey'}`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
            
            {/* Main Image */}
            <div className="flex-1 flex items-center justify-center border border-[#f0f0f0] p-4 relative">
              <img src={images[selectedImage]} alt={product.name} className="max-w-full max-h-full object-contain" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex w-full gap-2 px-6 mt-4">
             <button 
               onClick={() => handleAction(false)}
               disabled={addingToCart || product.stock === 0}
               className="flex-1 py-[18px] bg-flipkart-yellow hover:bg-[#d69600] transition-colors text-white font-bold text-[16px] rounded-sm shadow-[0_1px_2px_0_rgba(0,0,0,.2)] flex items-center justify-center gap-2"
             >
               <svg className="w-4 h-4" fill="white" viewBox="0 0 16 16">
                  <path d="M15.32 2.405H4.887C3 2.405 2.46.805 2.46.805L2.257.21C2.208.085 2.083 0 1.946 0H.336C.1 0-.064.24.024.46l.644 1.945L3.11 9.767c.047.237.248.402.49.402h9.522c.26 0 .484-.183.528-.44l1.83-7.5c.032-.132.002-.27-.08-.372-.08-.104-.21-.157-.34-.148zM5.336 12.672c-1.1 0-1.996.896-1.996 1.996 0 1.1.896 1.996 1.996 1.996 1.1 0 1.996-.896 1.996-1.996 0-1.1-.896-1.996-1.996-1.996zm7.252 0c-1.1 0-1.996.896-1.996 1.996 0 1.1.896 1.996 1.996 1.996 1.1 0 1.996-.896 1.996-1.996 0-1.1-.896-1.996-1.996-1.996z" />
               </svg>
               ADD TO CART
             </button>
             <button 
               onClick={() => handleAction(true)}
               disabled={addingToCart || product.stock === 0}
               className="flex-1 py-[18px] bg-flipkart-orange hover:bg-[#f65a0b] transition-colors text-white font-bold text-[16px] rounded-sm shadow-[0_1px_2px_0_rgba(0,0,0,.2)] flex items-center justify-center gap-2"
             >
               <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24">
                 <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L12 12.586l5.293-5.293a1 1 0 111.414 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414z" clipRule="evenodd"/>
               </svg>
               BUY NOW
             </button>
          </div>
        </div>

        {/* Right Column: Product Details */}
        <div className="w-full md:w-[60%] p-6 md:p-8">
          
          {/* Breadcrumbs */}
          <div className="flex items-center text-[12px] text-flipkart-grey mb-2 font-medium">
            <Link to="/" className="hover:text-flipkart-blue">Home</Link>
            <span className="mx-2">›</span>
            <span>{product.category?.name || 'Category'}</span>
            <span className="mx-2">›</span>
            <span>{product.brand}</span>
          </div>

          {/* Title & Brand */}
          <h1 className="text-[18px] text-flipkart-dark leading-relaxed mb-2">
            {product.name}
          </h1>

          {/* Rating Badge */}
          {product.rating > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-[4px] bg-flipkart-green text-white text-[13px] font-bold px-[6px] py-[2px] rounded-sm">
                {parseFloat(product.rating).toFixed(1)}
                <svg width="11" height="11" viewBox="0 0 10 10" fill="white">
                  <path d="M5 8.25L2.5 9.75L3 7L1 5L3.83 4.67L5 2L6.17 4.67L9 5L7 7L7.5 9.75L5 8.25Z" />
                </svg>
              </span>
              <span className="text-[14px] text-flipkart-grey font-medium hover:text-flipkart-blue cursor-pointer">
                {product.ratingCount?.toLocaleString()} Ratings & Reviews
              </span>
            </div>
          )}

          <div className="text-[14px] text-flipkart-green font-medium mb-2">Extra ₹{product.discountPercent}% off</div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-[28px] font-medium text-flipkart-dark">₹{price.toLocaleString()}</span>
            {originalPrice && originalPrice > price && (
              <>
                <span className="text-[16px] text-flipkart-grey line-through">₹{originalPrice.toLocaleString()}</span>
                <span className="text-[16px] text-flipkart-green font-bold">{product.discountPercent}% off</span>
              </>
            )}
          </div>
          
          <div className="text-[14px] text-flipkart-dark mb-6 flex items-center gap-2">
             <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="FA" className="h-[21px]" />
          </div>

          {/* Available Offers */}
          <div className="mb-8">
            <div className="text-[16px] font-medium text-flipkart-dark mb-3">Available offers</div>
            <div className="flex items-start gap-2 mb-2">
              <img src="https://rukminim2.flixcart.com/www/36/36/promos/06/09/2016/c22c9fc4-0555-4460-8401-bf5c28d7ba29.png?q=90" alt="tag" className="w-[18px] h-[18px] mt-0.5" />
              <div className="text-[14px] text-flipkart-dark">
                <strong className="font-medium">Bank Offer</strong> 5% Cashback on Flipkart Axis Bank Card <span className="text-flipkart-blue font-medium cursor-pointer">T&C</span>
              </div>
            </div>
            <div className="flex items-start gap-2 mb-2">
              <img src="https://rukminim2.flixcart.com/www/36/36/promos/06/09/2016/c22c9fc4-0555-4460-8401-bf5c28d7ba29.png?q=90" alt="tag" className="w-[18px] h-[18px] mt-0.5" />
              <div className="text-[14px] text-flipkart-dark">
                <strong className="font-medium">Special Price</strong> Get extra {product.discountPercent}% off (price inclusive of cashback/coupon) <span className="text-flipkart-blue font-medium cursor-pointer">T&C</span>
              </div>
            </div>
          </div>

          {/* Specifications Table styled as grid */}
          <div className="border border-[#f0f0f0] rounded-sm p-6 mt-8">
            <h2 className="text-[18px] font-medium text-flipkart-dark mb-4">Specifications</h2>
            <div className="flex flex-col">
              <div className="text-[16px] font-medium text-flipkart-dark border-b border-[#f0f0f0] pb-3 mb-3">General</div>
              <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-4">
                 <div className="text-[14px] text-flipkart-grey">Brand</div>
                 <div className="text-[14px] text-flipkart-dark">{product.brand || 'Generic'}</div>
                 
                 <div className="text-[14px] text-flipkart-grey">Stock Status</div>
                 <div className="text-[14px] text-flipkart-dark">{product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}</div>

                 {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                   <React.Fragment key={key}>
                     <div className="text-[14px] text-flipkart-grey capitalize">{key}</div>
                     <div className="text-[14px] text-flipkart-dark">{value}</div>
                   </React.Fragment>
                 ))}
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
             <div className="mt-8 border border-[#f0f0f0] rounded-sm p-6">
                <h2 className="text-[18px] font-medium text-flipkart-dark mb-4">Product Description</h2>
                <div className="text-[14px] text-flipkart-dark leading-[1.8]">
                  {product.description}
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default ProductDetail;

import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

function Wishlist() {
  const { wishlist } = useWishlist();

  return (
    <div className="bg-flipkart-light min-h-[calc(100vh-56px)] flex justify-center pt-8 pb-16 px-4">
      <div className="max-w-[1248px] w-full flex flex-col md:flex-row gap-4">
        
        {/* Sidebar Info */}
        <div className="w-full md:w-[280px] shrink-0 hidden md:block">
          <div className="bg-white rounded-sm shadow-[0_1px_2px_0_rgba(0,0,0,.2)] p-4 flex flex-col gap-4">
            <h2 className="text-[16px] font-medium text-flipkart-black">My Wishlist ({wishlist.length})</h2>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-sm shadow-[0_1px_2px_0_rgba(0,0,0,.2)] min-h-[500px]">
          <div className="p-4 border-b border-[#f0f0f0]">
            <h1 className="text-[18px] font-medium text-flipkart-black">My Wishlist ({wishlist.length})</h1>
          </div>
          
          {wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px]">
              <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/mywishlist-empty_39f7a5.png" alt="Empty Wishlist" className="w-[200px] mb-6" />
              <h2 className="text-[18px] font-medium mb-2">Empty Wishlist</h2>
              <p className="text-[14px] text-flipkart-grey mb-6">You have no items in your wishlist. Start adding!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 border-l border-[#f0f0f0] border-t">
              {wishlist.map((item) => (
                <div key={item.id || item.productId} className="h-full">
                  <ProductCard product={item.product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;

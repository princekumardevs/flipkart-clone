import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import CategoryFilter from '../components/CategoryFilter';
import ProductCard from '../components/ProductCard';

function Home() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const searchQuery = searchParams.get('search') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory) params.category = selectedCategory;

      const { data } = await api.get('/api/products', { params });
      setProducts(data.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory]);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await api.get('/api/categories');
      setCategories(data.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="max-w-[1248px] mx-auto px-2 lg:px-0">
        {searchQuery && (
          <div className="pt-4 pb-2 px-2">
            <p className="text-[14px] text-[#878787] font-medium tracking-wide">
              Showing results for "<span className="text-[#212121]">{searchQuery}</span>"
            </p>
          </div>
        )}

        <div className="bg-white mt-4 mb-8 shadow-[0_1px_1px_0_rgba(0,0,0,.16)] rounded-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-[#f0f0f0]">
            <h2 className="text-[22px] font-bold text-[#212121]">
              {searchQuery ? `Search Results` : (selectedCategory ? `Featured Collection` : `Best of Electronics & Home`)}
            </h2>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-5 p-4 gap-4">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className="animate-pulse bg-white flex flex-col p-4 h-[300px]">
                    <div className="w-full h-[150px] bg-gray-200 mb-4 rounded-sm"></div>
                    <div className="h-4 bg-gray-200 w-3/4 mx-auto mb-2 rounded-sm"></div>
                    <div className="h-4 bg-gray-200 w-1/2 mx-auto rounded-sm"></div>
                 </div>
               ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
               <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
               <p className="text-[#212121] text-[18px] font-medium">Sorry, no products found!</p>
               <p className="text-[#878787] text-[14px] mt-1">Please check the spelling or try searching for something else</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 border-l border-t border-[#f0f0f0]">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;

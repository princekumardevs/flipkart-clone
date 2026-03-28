function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="bg-white shadow-[0_1px_1px_0_rgba(0,0,0,.16)] mt-[56px] w-full z-40 relative">
      <div className="max-w-[1248px] mx-auto px-4 flex items-center justify-between overflow-x-auto scrollbar-hide py-3">
        <div 
          onClick={() => onCategoryChange(null)}
          className={`flex flex-col items-center justify-center cursor-pointer group px-2 shrink-0 ${selectedCategory === null ? 'text-flipkart-blue' : 'text-flipkart-dark hover:text-flipkart-blue'}`}
        >
          <div className="w-16 h-[64px] bg-flipkart-light rounded-full flex items-center justify-center mb-1 overflow-hidden transition-transform group-hover:scale-105">
            <span className="text-[14px] font-bold">All</span>
          </div>
          <span className="text-[14px] font-medium whitespace-nowrap">Everything</span>
        </div>

        {categories.map((cat) => (
          <div 
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`flex flex-col items-center justify-center cursor-pointer group px-2 shrink-0 ${selectedCategory === cat.id ? 'text-flipkart-blue' : 'text-flipkart-dark hover:text-flipkart-blue'}`}
          >
            <div className="w-16 h-[64px] bg-flipkart-light rounded-full flex items-center justify-center mb-1 overflow-hidden transition-transform group-hover:scale-105">
              <span className="text-[20px]">{cat.name.charAt(0)}</span>
            </div>
            <span className="text-[14px] font-medium whitespace-nowrap">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;

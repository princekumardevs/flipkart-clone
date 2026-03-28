import { useState } from 'react';

function ImageCarousel({ images = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const displayImages = images.length > 0 ? images : ['https://picsum.photos/400/400'];

  return (
    <div className="flex flex-col-reverse md:flex-row gap-3">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[400px]">
        {displayImages.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-colors cursor-pointer ${
              selectedIndex === index ? 'border-[#2874f0]' : 'border-[#e0e0e0] hover:border-[#c0c0c0]'
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-contain p-1"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 flex items-center justify-center bg-white rounded border border-[#f0f0f0] min-h-[300px] md:min-h-[400px] p-4">
        <img
          src={displayImages[selectedIndex]}
          alt="Product"
          className="max-w-full max-h-[350px] object-contain transition-opacity"
        />
      </div>
    </div>
  );
}

export default ImageCarousel;

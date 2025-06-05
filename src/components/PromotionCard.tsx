import React from 'react';

interface PromotionCardProps {
  title: string;
  subtitle: string;
  expirationDate: string;
  backgroundColor: string;
  backgroundImage: string;
  partnerName: string;
  partnerDescription: string;
  partnerLogo: string;
  isLiked?: boolean;
  price?: string;
  onLikeClick?: () => void;
}

export const PromotionCard: React.FC<PromotionCardProps> = ({
  title,
  subtitle,
  expirationDate,
  backgroundColor,
  backgroundImage,
  partnerName,
  partnerDescription,
  partnerLogo,
  price,
  isLiked = false,
  onLikeClick,
}) => {
  return (
    <div className="relative rounded-xl overflow-hidden shadow-md">
      <div className="relative">
        {/* Background Image */}
        <div 
          className="h-32 w-full bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            backgroundColor 
          }}
        />
        
        {/* Text Content Overlay */}
        <div className="absolute top-0 left-0 right-0 p-4 text-white">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
          <p className="text-sm mb-1 text-gray-800">{subtitle}</p>
          <p className="text-sm mb-1 text-gray-800">{price}</p>
          <span className="text-xs opacity-80 text-gray-600">{expirationDate}</span>
        </div>

        {/* Like Button */}
        <button 
          onClick={onLikeClick}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/50 hover:bg-white transition-colors"
          aria-label="Добавить в избранные"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={isLiked ? '#FF3B30' : 'none'}
            stroke={isLiked ? '#FF3B30' : 'gray'}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
      
      {/* Partner Info */}
      <div className="flex items-center gap-3 p-3 border-t border-gray-100 bg-white">
        <img 
          src={partnerLogo} 
          alt={partnerName}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="font-medium text-sm">{partnerName}</span>
          <span className="text-xs text-gray-600">{partnerDescription}</span>
        </div>
      </div>
    </div>
  );
}; 
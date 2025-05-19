type MenuItemProps = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  backgroundColor?: string;
  textColor?: string;
  onClick?: () => void;
  rounded?: 'full' | 'none' | 'top' | 'bottom';
};

export const MenuItem = ({
  icon,
  title,
  subtitle,
  backgroundColor,
  textColor,
  onClick,
  rounded = 'full',
}: MenuItemProps) => {
  const getRoundedClass = () => {
    switch (rounded) {
      case 'none':
        return 'rounded-none';
      case 'top':
        return 'rounded-t-2xl';
      case 'bottom':
        return 'rounded-b-2xl';
      case 'full':
      default:
        return 'rounded-2xl';
    }
  };

  return (
    <div 
      className={`bg-white p-4 cursor-pointer ${getRoundedClass()}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-full
            ${textColor || 'text-blue-600'} 
            ${backgroundColor || 'bg-blue-100'}`}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-gray-900">{title}</h3>
          {subtitle && <p className="text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};
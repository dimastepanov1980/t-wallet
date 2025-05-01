export const MenuItem = ({ icon, title, subtitle, onClick }: { 
    icon: React.ReactNode, 
    title: string, 
    subtitle?: string,
    onClick?: () => void 
  }) => (
    <div 
      className="bg-white rounded-2xl p-4 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          {icon}
        </div>
        <div>
          <h3 className="text-gray-900">{title}</h3>
          <p className="text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  ); 
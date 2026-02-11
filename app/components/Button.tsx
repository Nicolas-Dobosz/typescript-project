interface ButtonProps {
    label: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
  }
  
  export default function MyButton({ label, onClick, variant = 'primary' }: ButtonProps) {
    const bgColor = variant === 'primary' ? 'bg-blue-500' : 'bg-gray-500';
  
    return (
      <button 
        onClick={onClick}
        className={`${bgColor} text-white px-4 py-2 rounded-md hover:opacity-80 transition`}
      >
        {label}
      </button>
    );
  }
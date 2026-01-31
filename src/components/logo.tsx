import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'default' | 'white' | 'dark';
}

/**
 * Modern minimalist logo for Domain Manager
 * Features a stylized "D" with interconnected nodes representing domains/DNS
 */
export function Logo({ className, size = 'md', showText = false, variant = 'default' }: LogoProps) {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-9 w-9',
    lg: 'h-12 w-12',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  };

  const iconColor = variant === 'white' ? '#ffffff' : variant === 'dark' ? '#1f2937' : '#ffffff';
  const bgColor = variant === 'white' ? 'bg-white/10' : variant === 'dark' ? 'bg-gray-100' : 'bg-gradient-to-br from-blue-500 to-blue-600';

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn('flex items-center justify-center rounded-xl', sizes[size], bgColor)}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-7 w-7'
          )}
        >
          {/* Outer ring representing global network */}
          <circle
            cx="16"
            cy="16"
            r="11"
            stroke={iconColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="3 2"
            opacity="0.6"
          />
          
          {/* Central hexagon/node - represents the domain hub */}
          <path
            d="M16 7L22.5 11V19.5L16 24L9.5 19.5V11L16 7Z"
            stroke={iconColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* Inner core - the central domain */}
          <circle
            cx="16"
            cy="15.5"
            r="3"
            fill={iconColor}
          />
          
          {/* Connection nodes - representing DNS endpoints */}
          <circle cx="16" cy="7" r="1.5" fill={iconColor} />
          <circle cx="22.5" cy="11" r="1.5" fill={iconColor} />
          <circle cx="22.5" cy="20" r="1.5" fill={iconColor} />
          <circle cx="16" cy="24" r="1.5" fill={iconColor} />
          <circle cx="9.5" cy="20" r="1.5" fill={iconColor} />
          <circle cx="9.5" cy="11" r="1.5" fill={iconColor} />
        </svg>
      </div>
      {showText && (
        <span className={cn('font-semibold', textSizes[size], variant === 'dark' ? 'text-gray-900' : 'text-white')}>
          Domain Manager
        </span>
      )}
    </div>
  );
}

/**
 * Standalone icon version without container background
 */
export function LogoIcon({ className, color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer ring representing global network */}
      <circle
        cx="16"
        cy="16"
        r="11"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="3 2"
        opacity="0.6"
      />
      
      {/* Central hexagon/node - represents the domain hub */}
      <path
        d="M16 7L22.5 11V19.5L16 24L9.5 19.5V11L16 7Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Inner core - the central domain */}
      <circle
        cx="16"
        cy="15.5"
        r="3"
        fill={color}
      />
      
      {/* Connection nodes - representing DNS endpoints */}
      <circle cx="16" cy="7" r="1.5" fill={color} />
      <circle cx="22.5" cy="11" r="1.5" fill={color} />
      <circle cx="22.5" cy="20" r="1.5" fill={color} />
      <circle cx="16" cy="24" r="1.5" fill={color} />
      <circle cx="9.5" cy="20" r="1.5" fill={color} />
      <circle cx="9.5" cy="11" r="1.5" fill={color} />
    </svg>
  );
}

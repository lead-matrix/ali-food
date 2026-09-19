import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light' | 'emblem' | 'banner';
  showSubtitle?: boolean;
}

export const AliFoodLogo: React.FC<LogoProps> = ({
  className = '',
  variant = 'dark',
  showSubtitle = true,
}) => {
  // Pure emblem variant
  if (variant === 'emblem') {
    return (
      <div className={`flex items-center select-none ${className}`}>
        <img
          src="/images/alifood-emblem.png"
          alt="M/S Ali Food — Your Trusted Meat Source"
          className="h-12 md:h-14 w-auto object-contain drop-shadow-md hover:scale-105 transition-transform"
        />
      </div>
    );
  }

  // Full official header banner
  if (variant === 'banner') {
    return (
      <div className={`flex items-center select-none ${className}`}>
        <img
          src="/images/alifood-clean-banner.png"
          alt="M/S Ali Food — Your Trusted Meat Source"
          className="h-11 sm:h-12 md:h-14 w-auto object-contain drop-shadow-md rounded"
        />
      </div>
    );
  }

  // Default corporate logo:
  // On desktop / wide viewports: uses the official clean header banner
  // With responsive fallback to emblem + wordmark on tight mobile viewports
  const isLight = variant === 'light';

  return (
    <div className={`flex items-center select-none ${className}`}>
      {/* Official Header Banner for tablet & desktop */}
      <div className="hidden sm:block">
        <img
          src="/images/alifood-clean-banner.png"
          alt="M/S Ali Food — Your Trusted Meat Source"
          className="h-12 md:h-14 w-auto object-contain drop-shadow-sm rounded"
        />
      </div>

      {/* Responsive mobile emblem + typography (prevents banner squishing on small phones) */}
      <div className="flex sm:hidden items-center gap-2.5">
        <img
          src="/images/alifood-emblem.png"
          alt="M/S Ali Food"
          className="w-11 h-11 object-contain drop-shadow flex-shrink-0"
        />
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline gap-1">
            <span className="text-[10px] font-black tracking-widest text-[#F5A623] font-mono uppercase">
              M/S
            </span>
            <span className={`text-xl font-black font-serif italic ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Ali Food
            </span>
          </div>
          {showSubtitle && (
            <span className={`text-[9px] font-medium uppercase tracking-tight ${isLight ? 'text-slate-600' : 'text-[#F5A623]'}`}>
              Your Trusted Meat Source
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

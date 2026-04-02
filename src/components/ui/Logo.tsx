'use client';

import { useState } from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 40, className = '' }: LogoProps) {
  const [imgError, setImgError] = useState(false);

  if (!imgError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/nihongo-community-logo.png"
        alt="SAP Nihongo Community"
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
        onError={() => setImgError(true)}
      />
    );
  }

  // Fallback badge if image not yet added to /public
  return (
    <div
      style={{ width: size, height: size }}
      className={`bg-[#1B2A4A] rounded-full flex items-center justify-center flex-shrink-0 ${className}`}
    >
      <span className="text-white font-bold" style={{ fontSize: size * 0.3 }}>
        日
      </span>
    </div>
  );
}

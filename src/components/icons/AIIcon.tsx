'use client';

import Image from "next/image";
import React from "react";

interface AIIconProps {
  size?: number;
  className?: string;
  active?: boolean;
}

export function AIIcon({ size = 18, className, active = false }: AIIconProps) {
  return (
    <Image
      src="/icons/ai.png"
      alt="AI"
      width={size}
      height={size}
      unoptimized
      className={`${className} ${active ? "filter invert brightness-0" : ""}`}
    />
  );
}

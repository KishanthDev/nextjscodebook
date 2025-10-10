import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

// Filter only actual icons (exclude "Icon" and other non-component exports)
export const LucideIconMap = Object.entries(LucideIcons)
  .filter(([key]) => key !== 'Icon') // <- filters out the base "Icon" factory
  .reduce<Record<string, React.FC<LucideProps>>>((acc, [key, value]) => {
    acc[key] = value as React.FC<LucideProps>;
    return acc;
  }, {});

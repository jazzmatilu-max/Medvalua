interface MedvaluaLogoProps {
  className?: string;
}

export function MedvaluaLogo({ className }: MedvaluaLogoProps) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Líneas de energía / onda de electro azul */}
      <path 
        d="M2 12h5l2-4 2 8 2-6 2 4h5" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      {/* Pequeños puntos de energía */}
      <circle cx="3" cy="12" r="1" fill="currentColor" />
      <circle cx="21" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

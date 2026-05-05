interface OxLogoProps {
  size?: number;
  glow?: boolean;
  className?: string;
}

export default function OxLogo({ size = 40, glow = true, className = '' }: OxLogoProps) {
  return (
    <img
      src="https://cdn.poehali.dev/projects/9cf785ba-1ef2-4065-96b9-eecf1d42ed04/bucket/45aae85e-4d2d-4d63-92af-83e395e5dcc8.jpg"
      alt="OxiwisAI"
      width={size}
      height={size}
      className={`rounded-lg object-cover ${glow ? 'drop-shadow-[0_0_12px_rgba(150,180,255,0.5)]' : ''} ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

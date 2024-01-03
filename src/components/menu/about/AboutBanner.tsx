interface AboutBannerProps {
  href?: string;
  color?: string;
  img?: string;
  alt?: string;
  children?: React.ReactNode;
}

export default function AboutBanner({
  href,
  color,
  img,
  alt,
  children,
}: AboutBannerProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="block flex items-center gap-2 rounded-md px-4 py-0.5 text-center text-sm text-white opacity-75 shadow-sm transition-all duration-150 hover:opacity-100"
      style={{
        backgroundColor: color,
      }}
    >
      {img && <img src={img} alt={alt} className="h-4" />}
      <p>{children}</p>
    </a>
  );
}

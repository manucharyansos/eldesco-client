import { mediaUrl } from '@/lib/media';

type Props = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> & { src?: string | null };

/** Plain <img> that understands CMS paths (uploads are served by the API). Empty src renders nothing. */
export function Img({ src, alt = '', loading = 'lazy', decoding = 'async', ...rest }: Props) {
  const url = mediaUrl(src);
  if (!url) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt={alt} loading={loading} decoding={decoding} {...rest} />;
}

import type { ImageProps } from 'next/image';

/**
 * Converts the next/image static image URL to a regular path.
 *
 * Example:
 *
 * /_next/static/media/404.ea2b1f50.png -> /assets/images/404.png
 */
const convertURL = (url: string) => {
  return url
    .replace(/\/_next\/static\/media\//, '/') // Use actual images location
    .replace(/(?<=\.)(.+)(?=png|jp?eg|tiff?|webp|bmp|gif|svg)/, '');
};

const Image = (props: ImageProps) => {
  let imageSize = '50px';
  // Regular path to image resource
  if (typeof props.src === 'string') {
    return <img src={props.src} alt="image element" />;
  }

  let src: string;
  // StaticImageData - an import of image resource
  if ('src' in props.src) {
    src = props.src.src;
  } else {
    // StaticRequire
    src = props.src.default.src;
  }

  if (src.toString().includes('arrow')) {
    imageSize = '15px';
  }

  return (
    <img
      src={convertURL(src)}
      alt="image element"
      height={imageSize}
      width={imageSize}
      style={props.alt.includes('down') ? { transform: 'rotate(180deg)' } : {}}
    />
  );
};

export default Image;

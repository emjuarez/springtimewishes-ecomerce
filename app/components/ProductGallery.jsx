import {Image} from '@shopify/hydrogen';
import {useRef} from 'react';
import '../styles/product-gallery.css';

export function ProductGallery({media}) {
  const scrollRef = useRef(null);

  if (!media?.nodes?.length) return null;

  return (
    <div className="product-gallery" ref={scrollRef}>
      {media.nodes.map((item) => {
        if (item.mediaContentType === 'IMAGE') {
          return (
            <div key={item.id} className="product-gallery__item">
              <Image
                data={item.image}
                aspectRatio="3/4"
                sizes="(min-width: 1024px) 40vw, 100vw"
                loading="lazy"
              />
            </div>
          );
        }

        if (item.mediaContentType === 'VIDEO') {
          return (
            <div key={item.id} className="product-gallery__item">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="product-gallery__video"
              >
                {item.sources.map((source) => (
                  <source
                    key={source.url}
                    src={source.url}
                    type={source.mimeType}
                  />
                ))}
              </video>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

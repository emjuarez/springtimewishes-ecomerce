import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination, Autoplay} from 'swiper/modules';
import {useRef} from 'react';

import 'swiper/css';
import 'swiper/css/pagination';

/**
 * @param {{
 *   images: Array<{src: string, alt: string}>;
 *   autoplay?: boolean;
 *   loop?: boolean;
 * }}
 */
export function ImageCarousel({images, autoplay = false, loop = true}) {
  const swiperRef = useRef(null); // ✅ referencia a la instancia de Swiper

  return (
    <div className="image-carousel-container">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={0}
        loop={loop}
        onSwiper={(swiper) => (swiperRef.current = swiper)} 
        breakpoints={{
          0: {
            direction: 'vertical', // ✅ mobile → scroll vertical
            slidesPerView: "3"
          },
          769: {
            direction: 'horizontal', // ✅ desktop → horizontal
            slidesPerView: "1"
          },
        }}
        pagination={{
          clickable: true,
          el: '.custom-pagination',
        }}
        autoplay={
          autoplay
            ? {delay: 3000, disableOnInteraction: false}
            : false
        }
        className="image-carousel"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div
              className="carousel-slide"
              onClick={() => swiperRef.current?.slideNext()} // ✅ click avanza
              style={{cursor: 'pointer'}}
            >
              <img src={image.src} alt={image.alt} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

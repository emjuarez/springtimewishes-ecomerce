import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Pagination, Autoplay} from 'swiper/modules';
import {useRef} from 'react';

// Importa los estilos base de Swiper
import 'swiper/css';
import 'swiper/css/pagination';

/**
 * @param {{
 *   images: Array<{src: string, alt: string}>;
 *   autoplay?: boolean;
 *   loop?: boolean;
 * }}
 */
export function ImageCarousel({images, autoplay = true, loop = true}) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="image-carousel-container">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        loop={loop}
        pagination={{
          clickable: true,
          el: '.custom-pagination',
        }}
        autoplay={
          autoplay
            ? {
                delay: 3000,
                disableOnInteraction: false,
              }
            : false
        }
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        className="image-carousel"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="carousel-slide">
              <img src={image.src} alt={image.alt} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navegación custom */}
      <div className="carousel-navigation">
        <button ref={prevRef} className="carousel-arrow carousel-arrow-prev" aria-label="Previous slide">
            <img src={"../../public/images/carousel/leftArrow.png"} alt="" className='arrowImg'/>
        </button>
        
        <button ref={nextRef} className="carousel-arrow carousel-arrow-next" aria-label="Next slide">
            <img src={"../../public/images/carousel/rightArrow.png"} alt="" className='arrowImg'/>
        </button>
      </div>
    </div>
  );
}

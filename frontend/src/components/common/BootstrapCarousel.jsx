import React, { useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const BootstrapCarousel = ({ images }) => {
  const carouselRef = useRef(null);

  useEffect(() => {
    import('bootstrap').then(({ Carousel }) => {
      if (carouselRef.current) {
        // 캐러셀 인스턴스가 이미 있다면 파괴하고 새로 생성하여 중복을 방지합니다.
        const carouselInstance = Carousel.getInstance(carouselRef.current);
        if (carouselInstance) {
          carouselInstance.dispose();
        }
        new Carousel(carouselRef.current);
      }
    });
  }, [images]);

  // 1. 캐러셀에 표시할 슬라이드 데이터 재구성
  // 원본 이미지 2개 + 합성 이미지 1개 = 총 3개의 슬라이드
  const slides = [
    // 첫 번째 슬라이드: 흑백 이미지
    {
      type: 'single',
      src: images[0],
      style: { filter: 'brightness(200%)' },
      alt: 'Grayscale Image',
    },
    // 두 번째 슬라이드: 열화상 이미지
    {
      type: 'single',
      src: images[1],
      alt: 'Thermal Image',
    },
    // 세 번째 슬라이드: 합성 이미지
    {
      type: 'composite',
      srcs: [images[0], images[1]], // 흑백, 열화상 이미지 소스 모두 포함
      alt: 'Composite Image',
    },
  ];

  return (
    <div
      id="carouselExample"
      className="carousel slide h-[100%]"
      data-bs-ride="carousel"
      ref={carouselRef}
    >
      <div className="carousel-inner h-[100%]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`carousel-item h-[100%] ${index === 0 ? 'active' : ''}`}
          >
            {slide.type === 'single' && (
              <img
                src={slide.src}
                style={{
                  ...slide.style,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                className="d-block w-100"
                alt={slide.alt}
              />
            )}
            {slide.type === 'composite' && (
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={slide.srcs[0]}
                  className="d-block w-100"
                  style={{
                    filter: 'brightness(200%)',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  alt={`Slide ${index}`}
                />
                <img
                  src={slide.srcs[1]}
                  className="d-block w-100"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    opacity: 0.45, // 투명도 조절 (0.0 ~ 1.0 사이 값)
                    // transform: 'scale(1.4)', // 배율 확대
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  alt={`Slide ${index}`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default BootstrapCarousel;

import React, { useState, memo, useCallback } from "react";
import styles from "./Widget.module.css";
import Image from "next/image";
import { SearchType } from "@/utils/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import Picture from "../../../public/svgs/Picture.svg";
import Video from "../../../public/svgs/Video.svg";
import Plus from "../../../public/svgs/Plus.svg";
import PrevArrow from "../../../public/svgs/PrevArrow.svg";
import NextArrow from "../../../public/svgs/NextArrow.svg";
import PlayIcon from "../../../public/svgs/Play.svg";

type searchProps = {
  searchResults?: SearchType;
};

const Widget = ({ searchResults }: searchProps) => {
  const images = searchResults?.data?.images?.value;
  const videos = searchResults?.data?.videos?.value;
  const [openMedia, setOpenMedia] = useState<"picture" | "video" | null>(null);

  const openInNewWindow = (url: string) => {
    window.open(url, "_blank");
  };

  const handleMediaClick = useCallback((type: "picture" | "video") => {
    setOpenMedia(type);
  }, []);

  if (!images && !videos) {
    return null;
  }

  return (
    <div className={styles.container}>
      {images && (
        <>
          {openMedia === "picture" ? (
            <div className={styles.carousel}>
              <Swiper
                style={
                  {
                    "--swiper-pagination-color": "#FFFFFF",
                    "--swiper-pagination-bullet-inactive-color": "#FFFFFFAA",
                    "--swiper-pagination-bullet-inactive-opacity": "1",
                  } as React.CSSProperties
                }
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                rewind={true}
                navigation={{
                  prevEl: `.${styles.prevArrow}`,
                  nextEl: `.${styles.nextArrow}`,
                }}
                modules={[Pagination, Navigation]}
                className={styles.swiper}
              >
                {images.map((image: any, index: number) => (
                  <SwiperSlide key={index}>
                    <Image
                      src={image.thumbnailUrl}
                      alt={`Image ${index + 1}`}
                      width={100}
                      height={100}
                      unoptimized
                      onClick={() => openInNewWindow(image.hostPageUrl)}
                    />
                  </SwiperSlide>
                ))}
                <div className={styles.prevArrow}>
                  <Image src={PrevArrow} alt="Previous" width={24} height={24} />
                </div>
                <div className={styles.nextArrow}>
                  <Image src={NextArrow} alt="Next" width={24} height={24} />
                </div>
              </Swiper>
            </div>
          ) : (
            <div
              className={styles.card}
              onClick={() => handleMediaClick("picture")}
            >
              <div className={styles.cardTitle}>
                <Image src={Picture} alt="Picture" className={styles.icon} width={24} height={24} />
                Search Images
              </div>
              <Image src={Plus} alt="Plus" className={styles.plus} width={24} height={24} />
            </div>
          )}
        </>
      )}

      {videos && (
        <>
          {openMedia === "video" ? (
            <div className={styles.carousel}>
              <Swiper
                style={
                  {
                    "--swiper-pagination-color": "#FFFFFF",
                    "--swiper-pagination-bullet-inactive-color": "#FFFFFFAA",
                    "--swiper-pagination-bullet-inactive-opacity": "1",
                  } as React.CSSProperties
                }
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                rewind={true}
                navigation={{
                  prevEl: `.${styles.prevArrow}`,
                  nextEl: `.${styles.nextArrow}`,
                }}
                modules={[Pagination, Navigation]}
                className={styles.swiper}
              >
                {videos.map((video: any, index: number) => (
                  <SwiperSlide key={index}>
                    <div className={styles.videoSlide}>
                      <Image
                        src={video.thumbnailUrl}
                        alt={`Video ${index + 1}`}
                        width={100}
                        height={100}
                        unoptimized
                        onClick={() => openInNewWindow(video.hostPageUrl)}
                      />
                      <div className={styles.playIcon}>
                        <Image src={PlayIcon} alt="Play" width={24} height={24} />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
                <div className={styles.prevArrow}>
                  <Image src={PrevArrow} alt="Previous" width={24} height={24} />
                </div>
                <div className={styles.nextArrow}>
                  <Image src={NextArrow} alt="Next" width={24} height={24} />
                </div>
              </Swiper>
            </div>
          ) : (
            <div
              className={styles.card}
              onClick={() => handleMediaClick("video")}
            >
              <div className={styles.cardTitle}>
                <Image src={Video} alt="Video" className={styles.icon} width={24} height={24} />
                Search Videos
              </div>
              <Image src={Plus} alt="Plus" className={styles.plus} width={24} height={24} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default memo(Widget);

import { comics } from '@/types/data'
import PATH from '@/utils/path'
import { Link, createSearchParams } from 'react-router-dom'
import 'swiper/css'
import 'swiper/css/pagination'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import imgError from '/img-error.webp'
import { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { ListPreviewComics } from '.'
import { DocumentIcon, LeftArrowIcon, RightArrowIcon } from '../Icon'
interface Props {
  data: comics[]
}
const RecentUpdateComics = ({ data }: Props) => {
  const isBigScreen = useMediaQuery({ query: '(min-width: 1160px)' })
  const isTablet = useMediaQuery({ query: '(max-width: 1160px)' })
  const isMobile = useMediaQuery({ maxWidth: 767 })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const el = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (el.current && el) {
      setIsLoading(false)
    }
  }, [el.current, el, data, isMobile])

  return (
    <div className='w-full min-h-[450px]'>
      {!isMobile && (
        <div className='flex h-[452px] mt-4 mx-0 xl:mx-[-40px]'>
          <button
            title='Trước'
            className='btn-prev-navigate text-gray-400 hover:bg-[#f8f8f9] dark:hover:bg-[rgba(255,255,255,0.08)] flex-shrink-0 h-[448px] w-[40px] hidden xl:flex items-center justify-center'
          >
            <LeftArrowIcon className='w-8 h-8' />
          </button>
          <div className='flex-1 w-full xl:max-w-[1200px] relative'>
            {data && (
              <div
                ref={el}
                className={`transition-all duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              >
                <Swiper
                  loop={true}
                  slidesPerView={1}
                  modules={[Pagination, Navigation]}
                  pagination={{ el: '.swiper-pagination-recommend', clickable: true }}
                  navigation={{
                    prevEl: '.btn-prev-navigate',
                    nextEl: '.btn-next-navigate'
                  }}
                >
                  {isBigScreen ? (
                    <SwiperSlide>{renderSwiperSlide(data.slice(0, 6), 3, '2')}</SwiperSlide>
                  ) : (
                    <SwiperSlide>{renderSwiperSlide(data.slice(0, 4), 2, '2')}</SwiperSlide>
                  )}
                  {isBigScreen ? (
                    <SwiperSlide>{renderSwiperSlide(data.slice(7, 13), 3, '2')}</SwiperSlide>
                  ) : (
                    <SwiperSlide>{renderSwiperSlide(data.slice(5, 9), 2, '2')}</SwiperSlide>
                  )}
                  {isBigScreen ? (
                    <SwiperSlide>{renderSwiperSlide(data.slice(14, 20), 3, '2')}</SwiperSlide>
                  ) : (
                    <SwiperSlide>{renderSwiperSlide(data.slice(10, 14), 2, '2')}</SwiperSlide>
                  )}
                  {isBigScreen ? (
                    <SwiperSlide>{renderSwiperSlide(data.slice(21, 27), 3, '2')}</SwiperSlide>
                  ) : (
                    <SwiperSlide>{renderSwiperSlide(data.slice(15, 19), 2, '2')}</SwiperSlide>
                  )}
                </Swiper>
                <div className='swiper-pagination-recommend inline-block absolute right-1/2 translate-x-1/2 mt-[6px]' />
              </div>
            )}
            {!data && Skeleton(isBigScreen, isTablet)}
          </div>
          <button
            title='Sau'
            className='btn-next-navigate text-gray-400 hover:bg-[#f8f8f9] dark:hover:bg-[rgba(255,255,255,0.08)] flex-shrink-0 h-[448px] w-[40px] hidden xl:flex items-center justify-center'
          >
            <RightArrowIcon className='w-8 h-8' />
          </button>
        </div>
      )}
      {isMobile && <ListPreviewComics data={data} />}
    </div>
  )
}
export default RecentUpdateComics

export const renderSwiperSlide = (data: comics[], perView: number, gap: string) => {
  return (
    <div className={`grid grid-cols-12 gap-${gap}`}>
      {data.map((item) => (
        <div key={item.manga_id} className={`col-span-${(12 / perView).toString()}`}>
          <div className='flex'>
            <Link to={`${PATH.comics}/${item.slug}`} title={item.title} className='flex-shrink-0'>
              <img
                src={item.cover_image}
                alt={item.title}
                title={item.title}
                loading='lazy'
                className='w-[165px] h-[220px] object-cover'
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null
                  currentTarget.src = imgError
                }}
              />
            </Link>
            <div className='pl-[15px] pr-2 leading-5 flex flex-col flex-1 justify-around overflow-hidden'>
              <div>
                <Link
                  to={`${PATH.comics}/${item}`}
                  className='text-black hover:text-primary dark:text-white dark:hover:text-primary text-lg font-bold leading-5 line-clamp-1'
                  title={item.title}
                >
                  {item.title}
                </Link>
                <span className='text-sm text-gray-400'>{item.updated_at}</span>
              </div>
              <div>
                <p className='inline-block text-black dark:text-white'>
                  <span className='mr-1 font-semibold'>Cập nhật:</span>
                  <Link
                    to={`${PATH.comics}/${item.slug}/${item.chapters[0]?.slug}`}
                    title={item.chapters[0]?.title}
                    className='text-primary dark:text-primary'
                  >
                    {item.chapters[0]?.title}
                  </Link>
                </p>
                <p className='line-clamp-2 mt-2 text-black dark:text-white'>{item.description}</p>
              </div>
              <div className='flex gap-1 items-center'>
                Thể loại:
                {item.genres.slice(0, 3).map((genre) => {
                  // console.log(genre)

                  return (
                    <Link
                      title={genre.name}
                      to={{
                        pathname: PATH.genres,
                        search: createSearchParams({
                          type: genre.name,
                          page: '1'
                        }).toString()
                      }}
                      key={genre.id}
                    >
                      <span className='py-[2px] px-1 text-[13px] text-gray-400 dark:text-gray-300 dark:hover:text-primary border-[#d9d9d9] hover:text-primary hover:border-primary border border-dashed truncate'>
                        {genre.name}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const Skeleton = (isBigScreen: boolean, isTabletOrMobile: boolean) => {
  return (
    <div className='grid grid-cols-12 gap-2 h-full w-full animate-pulse overflow-hidden'>
      {isBigScreen &&
        Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className='md:flex col-span-4'>
              <div className='flex items-center justify-center w-[165px] h-[220px] bg-gray-300 dark:bg-gray-700 flex-shrink-0'>
                <DocumentIcon className=' w-10 h-10 text-gray-200 dark:text-gray-600' />
              </div>
              <div className='w-full pl-[15px] pr-2 flex flex-col flex-1 justify-around'>
                <div>
                  <div className='h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-40 mb-4 -mt-2' />
                  <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-16 -mt-2' />
                </div>
                <div>
                  <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-44 mb-2.5' />
                  <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-46  mb-2.5' />
                  <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-40  mb-2.5' />
                </div>
                <div className='flex items-center gap-2'>
                  <div className='h-4 bg-gray-200 rounded-md dark:bg-gray-700 w-14' />
                  <div className='h-4 bg-gray-200 rounded-md dark:bg-gray-700 w-14' />
                  <div className='h-4 bg-gray-200 rounded-md dark:bg-gray-700 w-14' />
                </div>
              </div>
            </div>
          ))}
      {isTabletOrMobile &&
        Array(4)
          .fill(0)
          .map((_, i) => (
            <div key={i} className='md:flex col-span-6'>
              <div className='flex items-center justify-center w-[165px] h-[220px] bg-gray-300 dark:bg-gray-700 flex-shrink-0'>
                <DocumentIcon className=' w-10 h-10 text-gray-200 dark:text-gray-600' />
              </div>
              <div className='w-full pl-[15px] pr-2 flex flex-col flex-1 justify-around'>
                <div>
                  <div className='h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-40 mb-4 -mt-2' />
                  <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-16 -mt-2' />
                </div>
                <div>
                  <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-44 mb-2.5' />
                  <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-46  mb-2.5' />
                  <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-40  mb-2.5' />
                </div>
                <div className='flex items-center gap-2'>
                  <div className='h-4 bg-gray-200 rounded-md dark:bg-gray-700 w-14' />
                  <div className='h-4 bg-gray-200 rounded-md dark:bg-gray-700 w-14' />
                  <div className='h-4 bg-gray-200 rounded-md dark:bg-gray-700 w-14' />
                </div>
              </div>
            </div>
          ))}
    </div>
  )
}

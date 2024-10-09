import { comics } from '@/types/data'
import PATH from '@/utils/path'
import { Fragment, useState } from 'react'
import { Link, createSearchParams } from 'react-router-dom'
import 'swiper/css'
import { Autoplay, EffectCoverflow } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { CardItem } from '..'
import imgError from '/img-error.webp'
import { useMediaQuery } from 'react-responsive'
import { ListPreviewComics } from '.'
import { formatCurrency, timeAgo } from '@/utils/formatNumber'
import { DocumentIcon } from '../Icon'
interface Props {
  data: comics[]
}

const SlidePreviewComics = ({ data }: Props) => {
  const [activeSlide, setActiveSlide] = useState<number>()
  const isBigScreen = useMediaQuery({ query: '(min-width: 1280px)' })
  const isTablet = useMediaQuery({ query: '(max-width: 1279px)' })

  return (
    <div className='mt-[15px] min-h-[640px]'>
      {isBigScreen && (
        <>
          {data && (
            <div className='flex items-center gap-4'>
              <div className='w-[496px] hidden lg:flex flex-col gap-5 overflow-hidden'>
                <div className='h-[350px] cursor-grab'>
                  <Swiper
                    onSlideChange={(e) => setActiveSlide(e.realIndex)}
                    className='h-full'
                    style={{
                      overflow: 'unset'
                    }}
                    effect={'coverflow'}
                    slidesPerView={2}
                    centeredSlides={true}
                    loop={true}
                    grabCursor={true}
                    modules={[EffectCoverflow, Autoplay]}
                    autoplay={{
                      delay: 3000, // Thời gian chuyển sau mỗi 3 giây
                      disableOnInteraction: false // Không dừng khi người dùng tương tác
                    }}
                    coverflowEffect={{
                      rotate: 0,
                      stretch: 0,
                      depth: 100,
                      modifier: 2.5,
                      slideShadows: false
                    }}
                  >
                    {data.slice(0, 5).map((item) => (
                      <SwiperSlide key={item.id}>
                        {({ isActive }) => (
                          <Link to={`${PATH.comics}/${item.slug}`}>
                            <img
                              src={item.cover_image}
                              alt={item.title}
                              title={item.title}
                              loading='lazy'
                              className={`${
                                isActive && 'shadow-lg dark:shadow-gray-800 z-10'
                              } w-full h-full object-cover border-[10px] border-white dark:border-gray-900 block`}
                              onError={({ currentTarget }) => {
                                currentTarget.onerror = null
                                currentTarget.src = imgError
                              }}
                            />
                          </Link>
                        )}
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
                <div className='h-[263px]'>
                  {data.map((item, i) => (
                    <Fragment key={item.manga_id}>
                      {i === activeSlide && (
                        <>
                          <div className='flex items-center justify-between gap-6'>
                            <Link
                              to={`${PATH.comics}/${item.slug}`}
                              title={item.title}
                              className='hover:text-primary text-black dark:text-white dark:hover:text-primary font-semibold text-xl truncate'
                            >
                              {item.title}
                            </Link>
                            <Link
                              title='Đọc ngay chương mới nhất'
                              to={`${PATH.comics}/${item.slug}`}
                              className='text-white flex-shrink-0 text-sm bg-primary w-[100px] h-[34px] uppercase font-semibold flex items-center justify-center rounded text-center'
                            >
                              Đọc Ngay
                            </Link>
                          </div>
                          <span className='text-base text-gray-400 mt-4 block'>
                            {timeAgo(item.updatedAt)}
                          </span>
                          <p className='text-base mt-1 block truncate'>
                            <span className='mr-1 text-gray-400'>Cập nhật:</span>
                            <Link
                              to={`${PATH.comics}/${item.slug}/${item.chapters[0]?.slug}`}
                              title={item.chapters[0]?.title}
                              className='text-primary'
                            >
                              {item.chapters[0]?.title}
                            </Link>
                          </p>
                          <p className='text-base mt-1 block text-gray-400'>
                            <span>
                              Lượt xem:{' '}
                              <strong className='text-black dark:text-white font-normal'>
                                {formatCurrency(item.views)}
                              </strong>
                            </span>
                            <span className='ml-2'>
                              Theo dõi:{' '}
                              <strong className='text-black dark:text-white font-normal'>
                                {formatCurrency(item.followers)}
                              </strong>
                            </span>
                          </p>
                          <div className='flex gap-[6px] items-center mt-2'>
                            {item.genres.slice(0, 5).map((genre) => {
                              return genre.id !== undefined ? (
                                <Link
                                  to={{
                                    pathname: PATH.genres,
                                    search: createSearchParams({
                                      type: genre.id,
                                      page: '1'
                                    }).toString()
                                  }}
                                  title={genre.name}
                                  key={genre.id}
                                >
                                  <span className='py-1 px-2 text-[13px] border border-dashed border-[#d9d9d9] hover:text-primary hover:border-primary dark:text-gray-300 dark:hover:text-primary truncate'>
                                    {genre.name}
                                  </span>
                                </Link>
                              ) : null
                            })}
                          </div>
                          <p className='text-base text-gray-400 line-clamp-3 mt-4'>
                            {item.description}
                          </p>
                        </>
                      )}
                    </Fragment>
                  ))}
                </div>
              </div>
              <ul className='w-full lg:w-[688px] grid grid-cols-4 md:gap-3 lg:gap-x-1 gap-y-5'>
                {data.slice(5, 13).map((item) => (
                  <li key={item.manga_id}>
                    <CardItem data={item} />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!data && skeleton()}
        </>
      )}
      {isTablet && <ListPreviewComics data={data} />}
    </div>
  )
}
export default SlidePreviewComics

const skeleton = () => {
  return (
    <div className='flex items-center gap-4 animate-pulse'>
      <div className='w-[496px] hidden lg:flex flex-col gap-5 overflow-hidden'>
        <div className='h-[350px] flex items-center'>
          <div className='flex items-center justify-center w-[228px] h-[300px] -ml-14 bg-gray-300 dark:bg-gray-700 flex-shrink-0'>
            <DocumentIcon className=' w-16 h-16 text-gray-200 dark:text-gray-600' />
          </div>
          <div className='flex items-center justify-center w-[248px] -ml-14 border dark:border-gray-600 z-10 h-full bg-gray-300 dark:bg-gray-700 flex-shrink-0'>
            <DocumentIcon className=' w-16 h-16 text-gray-200 dark:text-gray-600' />
          </div>
          <div className='flex items-center justify-center w-[228px] h-[300px] -ml-14 bg-gray-300 dark:bg-gray-700 flex-shrink-0'>
            <DocumentIcon className=' w-16 h-16 text-gray-200 dark:text-gray-600' />
          </div>
        </div>
        <div className='h-[263px]'>
          <div className='flex items-center justify-between gap-6'>
            <span className='h-4 bg-gray-200 rounded-full dark:bg-gray-700 flex-shrink-0 w-[344px]' />
            <span className='h-9 bg-gray-200 rounded-lg dark:bg-gray-700 w-24' />
          </div>
          <div className='py-3 flex flex-col gap-2'>
            <span className='h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-64' />
            <span className='h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-[288px]' />
            <span className='h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-56' />
          </div>
          <div className='flex items-center gap-[6px] py-3'>
            <span className='h-6 bg-gray-200 rounded-md dark:bg-gray-700 w-14' />
            <span className='h-6 bg-gray-200 rounded-md dark:bg-gray-700 w-14' />
            <span className='h-6 bg-gray-200 rounded-md dark:bg-gray-700 w-14' />
            <span className='h-6 bg-gray-200 rounded-md dark:bg-gray-700 w-14' />
            <span className='h-6 bg-gray-200 rounded-md dark:bg-gray-700 w-14' />
          </div>
          <div className='pt-4'>
            <div className='h-3 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5' />
            <div className='h-3 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5' />
            <div className='h-3 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5' />
          </div>
        </div>
      </div>
      <ul className='lg:w-[688px] w-full grid grid-cols-4 md:gap-3 lg:gap-x-1 gap-y-5'>
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <li key={i} className='w-full h-[292px] overflow-hidden'>
              <div className='flex items-center justify-center w-full h-[220px] bg-gray-300 dark:bg-gray-700 flex-shrink-0'>
                <DocumentIcon className=' w-16 h-16 text-gray-200 dark:text-gray-600' />
              </div>
              <div className='mt-2 flex flex-col'>
                <span className='h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-40 mb-4 mt-1' />
                <span className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-16 mb-2' />
                <span className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-32' />
              </div>
            </li>
          ))}
      </ul>
    </div>
  )
}

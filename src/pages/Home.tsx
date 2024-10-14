import iconPopular from '/icon-popular.webp'
import iconRecentUpdate from '/icon-recentUpdate.webp'
import iconRecommend from '/icon-recommend.webp'
import { Banner } from '@/components'
import {
  CompletedPreviewComics,
  RecentUpdateComics,
  ListPreviewComics,
  SlidePreviewComics,
  TopPreviewComics,
  VipPreviewComics
} from '@/components/Preview'
// import { useQueryConfig } from '@/hooks'
import { comics } from '@/types/data'
import PATH from '@/utils/path'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'

import { Link, createSearchParams } from 'react-router-dom'
import { getManga, getVipManga } from '@/services/mangaService/getManga'
import { CompletedIcon, CrownIcon, RightArrowIcon } from '@/components/Icon'

const Home: React.FC = () => {
  const [manga, setManga] = useState<comics[]>([])
  const [vipManga, setVipManga] = useState<comics[]>([])

  useEffect(() => {
    ;(async () => {
      const data = await getManga()
      setManga(data.data.data)
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      const data = await getVipManga()
      setVipManga(data.data)
    })()
  }, [])

  return (
    <>
      <Helmet>
        <title>Đọc Truyện Tranh Online - VTruyen</title>
        <meta
          name='description'
          content='Web đọc truyện tranh online lớn nhất được cập nhật liên tục mỗi ngày - Cùng tham gia đọc truyện và thảo luận với hơn 10 triệu thành viên 🎉 tại VTruyen ❤️💛💚'
        />
      </Helmet>
      <div className='container px-4 xl:px-0'>
        <Banner />
        <section className='mt-10'>
          <div className='flex items-end'>
            <div className='flex items-center gap-2 lg:gap-4'>
              <CrownIcon className='w-10 h-10' />
              <h2 className='capitalize font-semibold mt-1 text-2xl lg:text-[28px] text-black dark:text-white   animated-text'>
                Truyện VIP
              </h2>
            </div>
            <Link
              title='Tất cả'
              to={{
                pathname: PATH.completed,
                search: createSearchParams({
                  page: '1'
                }).toString()
              }}
              className='flex flex-1 justify-end items-center gap-1 text-sm text-black dark:text-white hover:text-primary dark:hover:text-primary'
            >
              <span>Tất cả</span>
              <RightArrowIcon />
            </Link>
          </div>
          <VipPreviewComics data={vipManga as comics[]} />
        </section>
        <section className='mt-10'>
          {titleComicsPreview(iconRecentUpdate, 'Mới cập nhật', PATH.recent)}
          <RecentUpdateComics data={manga as comics[]} />
        </section>
        <section className='mt-16'>
          <TopPreviewComics />
        </section>
        <section className='mt-10'>
          {titleComicsPreview(iconRecommend, 'Đề xuất', '', false)}
          <ListPreviewComics data={manga as comics[]} />
        </section>
        <section className='mt-16'>
          {titleComicsPreview(iconPopular, 'Nổi bật', PATH.popular)}
          <SlidePreviewComics data={manga as comics[]} />
        </section>
        <section className='mt-10'>
          <div className='flex items-end'>
            <div className='flex items-center gap-2 lg:gap-4'>
              <CompletedIcon />
              <h2 className='capitalize font-semibold mt-1 text-2xl lg:text-[28px] text-black dark:text-white leading-5'>
                Đã hoàn thành
              </h2>
            </div>
            <Link
              title='Tất cả'
              to={{
                pathname: PATH.completed,
                search: createSearchParams({
                  page: '1'
                }).toString()
              }}
              className='flex flex-1 justify-end items-center gap-1 text-sm text-black dark:text-white hover:text-primary dark:hover:text-primary'
            >
              <span>Tất cả</span>
              <RightArrowIcon />
            </Link>
          </div>
          <CompletedPreviewComics data={manga as comics[]} />
        </section>
      </div>
    </>
  )
}
export default Home

const titleComicsPreview = (img: string, title: string, link?: string, showMore?: boolean) => {
  const isShowMore = showMore === undefined ? true : false

  return (
    <div className='flex items-end'>
      <div className='flex items-center gap-2 lg:gap-4'>
        <img src={img} alt='Icon' className='w-auto h-7 lg:h-[32px]' loading='lazy' />
        <h2 className='capitalize font-semibold mt-1 text-2xl lg:text-[28px] text-black dark:text-white leading-5'>
          {title}
        </h2>
      </div>
      {isShowMore && (
        <Link
          title='Tất cả'
          to={{
            pathname: link,
            search: createSearchParams({
              page: '1'
            }).toString()
          }}
          className='flex flex-1 justify-end items-center gap-1 text-sm text-black dark:text-white hover:text-primary dark:hover:text-primary'
        >
          <span>Tất cả</span>
          <RightArrowIcon />
        </Link>
      )}
    </div>
  )
}

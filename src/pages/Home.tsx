import comicApis from '@/apis/comicApis'
import iconPopular from '/icon-popular.webp'
import iconRecentUpdate from '/icon-recentUpdate.webp'
import iconRecommend from '/icon-recommend.webp'
import { Banner } from '@/components'
import {
  CompletedPreviewComics,
  RecentUpdateComics,
  ListPreviewComics,
  SlidePreviewComics,
  TopPreviewComics
} from '@/components/Preview'
import { useQueryConfig } from '@/hooks'
import { comics } from '@/types/data'
import PATH from '@/utils/path'
import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery } from 'react-query'
import { Link, createSearchParams } from 'react-router-dom'
import { getManga } from '@/services/mangaService/getManga'
import { CompletedIcon, RightArrowIcon } from '@/components/Icon'

const Home: React.FC = () => {
  const [manga, setManga] = useState([])

  useEffect(() => {
    ;(async () => {
      const data = await getManga()
      setManga(data.data)
    })()
  }, [])

  const queryConfig = useQueryConfig()

  // const dataRecentUpdatedComics = useMemo(() => dataRecentUpdated?.data.comics, [dataRecentUpdated])
  // const dataRecommendComics = useMemo(() => dataRecommend?.data, [dataRecommend])
  // const dataPopularComics = useMemo(() => dataPopular?.data.comics, [dataPopular])
  // const dataCompletedComics = useMemo(() => dataCompleted?.data.comics, [dataCompleted])

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
          {titleComicsPreview(iconRecentUpdate, 'Mới cập nhật', PATH.recent)}
          <RecentUpdateComics data={manga.data as comics[]} />
        </section>
        <section className='mt-16'>
          <TopPreviewComics />
        </section>
        <section className='mt-10'>
          {titleComicsPreview(iconRecommend, 'Đề xuất', '', false)}
          <ListPreviewComics data={manga.data as comics[]} />
        </section>
        <section className='mt-16'>
          {titleComicsPreview(iconPopular, 'Nổi bật', PATH.popular)}
          <SlidePreviewComics data={manga.data as comics[]} />
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
          <CompletedPreviewComics data={manga.data as comics[]} />
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

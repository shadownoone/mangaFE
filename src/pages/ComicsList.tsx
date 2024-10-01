import comicApis from '@/apis/comicApis'
import { CardItem, MiniPagination, Pagination } from '@/components'
import { useQueryConfig, useScrollTop, useTitle } from '@/hooks'
import PATH from '@/utils/path'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { Link, createSearchParams, useLocation } from 'react-router-dom'
import classNames from 'classnames'
import { useMediaQuery } from 'react-responsive'
import { NotFound } from '@/App'
import { Helmet } from 'react-helmet-async'
import { getMangaTop, getNewManga } from '@/services/mangaService/getManga'
import { DocumentIcon } from '@/components/Icon'

const ComicsList = () => {
  const [topMangas, setTopMangas] = useState([])
  const [newMangas, setNewMangas] = useState([])

  const isMobile = useMediaQuery({ maxWidth: 640 })
  const { pathname } = useLocation()
  const queryConfig = useQueryConfig()
  const title = useMemo(() => useTitle(pathname), [pathname])
  // const isTopAndNew = useMemo(
  //   () => pathname.includes(PATH.new) || pathname.includes(PATH.top),
  //   [pathname]
  // )

  useScrollTop([pathname, queryConfig])

  // const { data, isError } = useQuery({
  //   queryKey: [pathname, queryConfig],
  //   queryFn: () => comicApis.getComicsByUrl(pathname, queryConfig),
  //   staleTime: 3 * 60 * 1000,
  //   enabled: pathname !== PATH.new
  // })

  // const { data: dataNew, isError: isErrorNew } = useQuery({
  //   queryKey: [pathname, queryConfig],
  //   queryFn: () => comicApis.getNew(queryConfig),
  //   staleTime: 3 * 60 * 1000,
  //   enabled: pathname === PATH.new
  // })

  // const dataComics = useMemo(
  //   () => (pathname !== PATH.new ? data?.data : dataNew?.data),
  //   [pathname, data, dataNew]
  // )

  // const [totalPage, setTotalPage] = useState<number>()
  // useEffect(() => {
  //   if (dataComics) {
  //     setTotalPage(dataComics.total_pages as number)
  //   }
  // }, [pathname, dataComics])

  useEffect(() => {
    const fetchTopMangas = async () => {
      try {
        const response = await getMangaTop()

        // Kiểm tra nếu dữ liệu trả về có trường data và bên trong là mảng
        if (response.data && Array.isArray(response.data.data.data)) {
          setTopMangas(response.data.data.data) // Truy cập đúng mảng trong data
        } else {
          console.error('Dữ liệu trả về không phải là một mảng:', response)
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách top manga:', error)
      }
    }

    fetchTopMangas()
  }, [])

  useEffect(() => {
    const fetchNewMangas = async () => {
      try {
        const response = await getNewManga()

        // Kiểm tra nếu dữ liệu trả về có trường data và bên trong là mảng

        setNewMangas(response.data) // Truy cập đúng mảng trong data
      } catch (error) {
        console.error('Lỗi khi lấy danh sách top manga:', error)
      }
    }

    fetchNewMangas()
  }, [])

  return (
    <>
      <Helmet>
        <title>{`Truyện tranh ${title} online - VTruyen`}</title>
        <meta
          name='description'
          content={`Truyện tranh ${title} online - Tất cả truyện ${title} có thể tìm thấy tại VTruyen`}
        />
      </Helmet>
      <div className='container px-4 xl:px-0'>
        {
          <>
            <div className='mt-8 flex items-center justify-between h-9'>
              {topMangas ? (
                <div className='flex items-center gap-2'>
                  <Link
                    title='Tất cả truyện'
                    className={classNames(
                      'capitalize text-center px-2 py-1 rounded-md border border-primary leading-5 hover:underline',
                      {
                        'bg-primary text-white hover:no-underline': queryConfig.status === 'all',
                        'bg-transparent text-primary': queryConfig.status !== 'all'
                      }
                    )}
                    to={{
                      search: createSearchParams({
                        ...queryConfig,
                        page: '1',
                        status: 'all'
                      }).toString()
                    }}
                  >
                    tất cả
                  </Link>
                  <Link
                    title='Truyện đã hoàn thành'
                    className={classNames(
                      'capitalize text-center px-2 py-1 rounded-md border border-primary leading-5 hover:underline',
                      {
                        'bg-primary text-white hover:no-underline':
                          queryConfig.status === 'completed',
                        'bg-transparent text-primary': queryConfig.status !== 'completed'
                      }
                    )}
                    to={{
                      search: createSearchParams({
                        ...queryConfig,
                        page: '1',
                        status: 'completed'
                      }).toString()
                    }}
                  >
                    hoàn thành
                  </Link>
                  <Link
                    title='Truyện đang cập nhật'
                    className={classNames(
                      'capitalize text-center px-2 py-1 rounded-md border border-primary leading-5 hover:underline',
                      {
                        'bg-primary text-white hover:no-underline':
                          queryConfig.status === 'updating',
                        'bg-transparent text-primary': queryConfig.status !== 'updating'
                      }
                    )}
                    to={{
                      search: createSearchParams({
                        ...queryConfig,
                        page: '1',
                        status: 'updating'
                      }).toString()
                    }}
                  >
                    cập nhật
                  </Link>
                </div>
              ) : (
                <h2 className='capitalize font-semibold text-black dark:text-white text-xl lg:text-2xl'>
                  <strong className='text-primary'>{title}</strong>{' '}
                  <span className='hidden md:inline-block'>- trang {queryConfig.page}</span>
                </h2>
              )}
              {topMangas && isMobile ? null : (
                <>
                  {/* totalPage && (
                    <MiniPagination
                      queryConfig={queryConfig}
                      page={Number(queryConfig.page)}
                      totalPage={totalPage}
                    />
                  ) */}
                </>
              )}
            </div>
            <div className='mt-6 min-h-[600px]'>
              <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2 xl:gap-x-[3px] gap-y-5'>
                {pathname.includes(PATH.new) &&
                  newMangas.map((item) => (
                    <li key={item.manga_id}>
                      <CardItem data={item} />
                    </li>
                  ))}

                {pathname.includes(PATH.recent) &&
                  newMangas.map((item) => (
                    <li key={item.manga_id}>
                      <CardItem data={item} />
                    </li>
                  ))}

                {pathname.includes(PATH.completed) &&
                  newMangas.map((item) => (
                    <li key={item.manga_id}>
                      <CardItem data={item} />
                    </li>
                  ))}

                {pathname.includes(PATH.popular) &&
                  newMangas.map((item) => (
                    <li key={item.manga_id}>
                      <CardItem data={item} />
                    </li>
                  ))}

                {pathname.includes(PATH.top) &&
                  topMangas.map((item) => (
                    <li key={item.manga_id}>
                      <CardItem data={item} />
                    </li>
                  ))}
                {!newMangas && skeleton()}
              </ul>
            </div>
            <div className='mt-6'>
              {/* totalPage && (
                <Pagination
                  queryConfig={queryConfig}
                  page={Number(queryConfig.page)}
                  totalPage={totalPage}
                />
              ) */}
            </div>
          </>
        }
      </div>
    </>
  )
}
export default ComicsList

const skeleton = () => {
  return (
    <>
      {Array(21)
        .fill(0)
        .map((_, i) => (
          <li key={i} className='w-full min-h-[292px] overflow-hidden animate-pulse'>
            <div className='flex items-center justify-center w-full h-[240px] xl:h-[220px] bg-gray-300 dark:bg-gray-700 flex-shrink-0'>
              <DocumentIcon className=' w-16 h-16 text-gray-200 dark:text-gray-600' />
            </div>
            <div className='mt-2 flex flex-col'>
              <span className='h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-40 mb-4 mt-1' />
              <span className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-16 mb-2' />
              <span className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-32' />
            </div>
          </li>
        ))}
    </>
  )
}

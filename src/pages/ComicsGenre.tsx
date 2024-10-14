import { CardItem, MiniPagination, Pagination } from '@/components'
import { useQueryConfig, useScrollTop } from '@/hooks'
import { useEffect, useMemo, useState } from 'react'

import { Link, createSearchParams } from 'react-router-dom'
import classNames from 'classnames'

import { Helmet } from 'react-helmet-async'
import { getGenre, getMangaByGenre } from '@/services/genreService/getGenre'
import { getManga } from '@/services/mangaService/getManga'

import { useLocation } from 'react-router-dom'
import { DocumentIcon } from '@/components/Icon'
import { dataGenres } from '@/types/data'

const ComicsList = () => {
  const [genre, setGenre] = useState<dataGenres[]>([])
  const [mangas, setMangas] = useState<any[]>([]) // Đảm bảo mangas luôn là một mảng

  const queryConfig = useQueryConfig()
  const location = useLocation()

  const [totalPage, setTotalPage] = useState<number>()

  // Lấy type từ query string để xác định thể loại hiện tại
  const type = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return params.get('type') || 'all'
  }, [location.search])

  useScrollTop([queryConfig])

  useEffect(() => {
    // Gọi API lấy danh sách thể loại
    const fetchGenres = async () => {
      const data = await getGenre()
      setGenre(data.data.data)
    }
    fetchGenres()
  }, [])

  useEffect(() => {
    const fetchMangas = async () => {
      try {
        if (type === 'all') {
          const res = await getManga()
          setMangas(res.data.data)
        } else {
          const data = await getMangaByGenre(type, queryConfig)
          setMangas(data.data)
          console.log(data.data)

          setTotalPage(data.data.total_pages)
        }
      } catch (error) {
        console.error('Failed to fetch manga by genre', error)
      }
    }
    fetchMangas()
  }, [type]) // Thêm queryConfig để thay đổi trang cũng kích hoạt API

  return (
    <>
      <Helmet>
        <title>{`Truyện Thể loại ${genre?.find((item) => item.name === type)
          ?.name} - VTruyen`}</title>
        <meta
          name='description'
          content={`Truyện Thể loại ${genre?.find((item) => item.genre_id === type)
            ?.name} - ${genre?.find((item) => item.genre_id === type)?.name}`}
        />
      </Helmet>

      <div className='px-5 py-4 bg-[#f8f8f9] dark:bg-gray-800'>
        <ul className='container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-2 max-h-[154px] overflow-auto border-t-4 border-primary bg-white dark:bg-gray-900 py-3 px-2 sm:px-6 rounded shadow'>
          {genre &&
            genre.map((item) => (
              <li key={item.genre_id} id={item.genre_id}>
                <Link
                  title={item.name}
                  className={classNames(
                    'border dark:border-gray-600 text-black dark:text-white text-center min-w-[100px] sm:min-w-[130px] overflow-hidden rounded-md px-12 py-2 flex items-center justify-center font-semibold leading-5 whitespace-nowrap',
                    {
                      'text-white bg-primary': genre.map((item) => item.genre_id).includes(type)
                        ? type === item.genre_id
                        : item.genre_id === 'all',
                      'hover:text-primary hover:border-primary dark:hover:text-primary dark:hover:border-primary':
                        type !== item.genre_id
                    }
                  )}
                  to={{
                    search: createSearchParams({
                      ...queryConfig,
                      page: '1',
                      type: item.name
                    }).toString()
                  }}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          {/* {skeletonGenre()} */}
        </ul>
      </div>

      <div className='container px-4 xl:px-0'>
        {/* {data?.data.status === 404 || isError ? (
          <NotFound />
        ) : ( */}
        <>
          <div className='mt-8 flex items-center justify-between h-9'>
            <h2 className='capitalize font-semibold text-black dark:text-white text-2xl'>
              <strong className='text-primary'>Thể loại</strong>
              <span className='hidden md:inline-block'> - trang {queryConfig.page}</span>
            </h2>
            {totalPage && (
              <MiniPagination
                queryConfig={queryConfig}
                page={Number(queryConfig.page)}
                totalPage={totalPage}
              />
            )}
          </div>
          <div className='bg-gradient text-white rounded-lg p-2 pr-4 mt-3 shadow flex items-center gap-2'>
            <svg
              data-v-c3ad5561
              data-v-0eca6ff4
              xmlns='http://www.w3.org/2000/svg'
              xmlnsXlink='http://www.w3.org/1999/xlink'
              aria-hidden='true'
              role='img'
              className='w-8 h-8 fill-current text-white flex-shrink-0'
              viewBox='0 0 16 16'
            >
              <path d='M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2Zm.75 3.5a.749.749 0 1 1-1.499 0a.749.749 0 0 1 1.498 0ZM8 7a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 7Z' />
            </svg>
            {/* {descGenre && <p className='text-lg font-semibold'>{descGenre}</p>}
              {!descGenre && (
                <span className='h-3 bg-gray-50 rounded-full w-[600px] animate-pulse' />
              )} */}
          </div>
          <div className='mt-6 min-h-[600px]'>
            <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2 xl:gap-x-[3px] gap-y-5'>
              {mangas &&
                mangas.map((item) => (
                  <li key={item.manga_id}>
                    <CardItem data={item} />
                  </li>
                ))}
              {!mangas && skeletonListComic()}
            </ul>
          </div>
          <div className='mt-6'>
            {totalPage && (
              <Pagination
                queryConfig={queryConfig}
                page={Number(queryConfig.page)}
                totalPage={totalPage}
              />
            )}
          </div>
        </>
        {/* )} */}
      </div>
    </>
  )
}
export default ComicsList

// const skeletonGenre = () => {
//   return (
//     <>
//       {Array(24)
//         .fill(0)
//         .map((_, i) => (
//           <li key={i} className='col-span-1 flex-shrink-0'>
//             <div className='min-w-[130px] h-[34px] px-12 py-2 bg-gray-200 rounded-md dark:bg-gray-700' />
//           </li>
//         ))}
//     </>
//   )
// }

const skeletonListComic = () => {
  return (
    <>
      {Array(21)
        .fill(0)
        .map((_, i) => (
          <li key={i} className='w-full min-h-[300px] overflow-hidden animate-pulse'>
            <div className='flex items-center justify-center w-full h-[240px] lg:h-[220px] bg-gray-300 dark:bg-gray-700 flex-shrink-0'>
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

import PATH from '@/utils/path'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import imgError from '/img-error.webp'
import { historyDeleteComics } from '@/utils/history'
import { Helmet } from 'react-helmet-async'
import { getFavoriteBytUser } from '@/services/getUser/getUser'
import { favorite } from '@/types/data'

const History = () => {
  const [favorite, setFavorite] = useState<favorite[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFavoriteBytUser()
        setFavorite(data.data.user.favorites)
        console.log(data.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  // Hàm để xử lý việc bỏ yêu thích
  // const handleRemoveFavorite = async (mangaId: any) => {
  //   try {
  //     await removeFavoriteComic(mangaId) // Gọi API xóa yêu thích
  //     setFavorite((prevFavorites) => prevFavorites.filter(fav => fav.mangaId !== mangaId)) // Cập nhật danh sách
  //   } catch (error) {
  //     console.error('Error removing favorite:', error)
  //   }
  // }

  return (
    <>
      <Helmet>
        <title> Truyện Yêu Thích - VTruyen</title>
        <meta name='description' content='Lịch sử các bộ truyện bạn đã đọc' />
      </Helmet>
      <div className='container px-2 lg:px-0'>
        <div className='mt-6 flex items-center justify-between text-black dark:text-white'>
          <div className='flex items-center gap-2'>
            <Link to={PATH.home} className='flex items-center gap-1 hover:text-primary text-lg'>
              Trang chủ{' '}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                xmlnsXlink='http://www.w3.org/1999/xlink'
                aria-hidden='true'
                className='w-5 h-5'
                viewBox='0 0 48 48'
              >
                <path
                  fill='none'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={3}
                  d='M19 12L31 24L19 36'
                />
              </svg>
            </Link>
            <span className='flex items-center gap-1 text-lg'>Yêu Thích</span>
          </div>
          <div className='flex items-center'>
            <button
              onClick={() => historyDeleteComics()}
              className='active:scale-90 border border-gray-500 dark:border-gray-400 dark:hover:border-primary hover:border-primary hover:text-primary px-2 py-1 rounded-md'
            >
              Xóa tất cả
            </button>
          </div>
        </div>
        <div className='mt-8 min-h-[550px]'>
          {favorite && favorite.length > 0 ? (
            <div className={`grid grid-cols-12 gap-4 lg:gap-6`}>
              {favorite.map((favorites, index) => (
                <div
                  key={index}
                  className='col-span-12 sm:col-span-6 hover:bg-[rgba(0,0,0,0.04)] dark:hover:bg-[rgba(255,255,255,0.04)] rounded-lg'
                >
                  <div className='flex text-black dark:text-white'>
                    <Link to={`${PATH.comics}/${favorites.slug}`} className='flex-shrink-0'>
                      <img
                        src={favorites.coverImage}
                        alt={favorites.coverImage}
                        className='w-[165px] h-[220px] object-cover'
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null
                          currentTarget.src = imgError
                        }}
                      />
                    </Link>

                    <div className='pl-[15px] pr-2 flex flex-col flex-1'>
                      <Link
                        to={`${PATH.comics}/${favorites.slug}`}
                        className='text-lg font-bold leading-5 mt-3 hover:text-primary'
                      >
                        {favorites.mangaTitle}
                      </Link>

                      <button
                        // onClick={() => handleRemoveFavorite(favorites.mangaId)}
                        className='mt-4 bg-red-500 text-white py-2 px-4 rounded-md font-medium text-sm transition duration-300 ease-in-out hover:bg-red-600 hover:scale-105 active:bg-red-700 active:scale-95 w-[30%]'
                      >
                        Bỏ Yêu Thích
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <h3 className='text-2xl text-center'>Không có truyện yêu thích</h3>
          )}
        </div>
      </div>
    </>
  )
}

export default History

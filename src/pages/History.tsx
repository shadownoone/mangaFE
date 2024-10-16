import PATH from '@/utils/path'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import imgError from '/img-error.webp'
import { historyDeleteComics } from '@/utils/history'
import { Helmet } from 'react-helmet-async'
import { getHistoryBytUser } from '@/services/userService/getUser'
import { history } from '@/types/data'
import { handleDeleteToHistory } from '@/services/historyService/updateHistory'

const History = () => {
  const [readingHistory, setReadingHistory] = useState<history[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHistoryBytUser()
        setReadingHistory(data.data.user.readingHistory)
        console.log(data.data.user.readingHistory)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  // Hàm để xử lý việc bỏ yêu thích
  const handleRemoveHistory = async (historyId: any) => {
    try {
      await handleDeleteToHistory(historyId) // Gọi API xóa yêu thích
      setReadingHistory((prevHistory) => prevHistory.filter((his) => his.historyId !== historyId)) // Update local state
    } catch (error) {
      console.error('Error removing history:', error)
    }
  }

  return (
    <>
      <Helmet>
        <title>Lịch sử đọc truyện - VTruyen</title>
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
            <span className='flex items-center gap-1 text-lg'>Lịch sử</span>
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
          {readingHistory && readingHistory.length > 0 ? (
            <div className={`grid grid-cols-12 gap-4 lg:gap-6`}>
              {readingHistory.map((historyItem, index) => (
                <div
                  key={index}
                  className='col-span-12 sm:col-span-6 hover:bg-[rgba(0,0,0,0.04)] dark:hover:bg-[rgba(255,255,255,0.04)] rounded-lg'
                >
                  <div className='flex text-black dark:text-white'>
                    <Link to={`${PATH.comics}/${historyItem.slug}`} className='flex-shrink-0'>
                      <img
                        src={historyItem.imageTitle}
                        alt={historyItem.mangaTitle}
                        className='w-[165px] h-[220px] object-cover'
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null
                          currentTarget.src = imgError
                        }}
                      />
                    </Link>
                    <div className='pl-[15px] pr-2 flex flex-col flex-1'>
                      <Link
                        to={`/comics/${historyItem.slug}`}
                        className='text-lg font-bold leading-5 mt-3 hover:text-primary'
                      >
                        {historyItem.mangaTitle}
                      </Link>
                      <span className='text-sm mt-1'>Đọc chương {historyItem.chapterTitle}</span>
                      <Link
                        to={`/comics/${historyItem.slug}/${historyItem.chapterSlug}`}
                        className='text-primary mt-4'
                      >
                        {historyItem.chapterTitle}
                      </Link>
                      <p className='text-sm mt-1'>
                        Đọc lần cuối: {new Date(historyItem.last_read_at).toLocaleString()}
                      </p>
                      <div className='flex flex-col md:flex-row items-center gap-1 md:gap-3 mt-auto mb-4 md:mb-0'>
                        <Link
                          to={`/comics/${historyItem.slug}/${historyItem.chapterSlug}`}
                          className='border-[#4b8fd7] rounded-md w-full h-9 flex items-center justify-center border text-[#4b8fd7] active:scale-90'
                        >
                          Đọc tiếp
                        </Link>
                        <button
                          onClick={() => handleRemoveHistory(historyItem.historyId)}
                          className='border-primary rounded-md w-full h-9 flex items-center justify-center border text-primary active:scale-90'
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <h3 className='text-2xl text-center'>Không có lịch sử đọc</h3>
          )}
        </div>
      </div>
    </>
  )
}

export default History

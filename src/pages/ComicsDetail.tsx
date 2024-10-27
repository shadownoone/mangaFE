import { ListChapter, ListComment, RatingStar, SuggestComics } from '@/components'
import { useScrollTop } from '@/hooks'
import { formatCurrency } from '@/utils/formatNumber'
import PATH from '@/utils/path'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { Link, createSearchParams, useParams } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import imgError from '/img-error.webp'
import imgLoading from '/loading.gif'
import { NotFound } from '@/App'
import { Helmet } from 'react-helmet-async'
import { getMangaBySlug, getMangaTop } from '@/services/mangaService/getManga'
import { comics, favorite, Rating } from '@/types/data'

import { BookIcon, DocumentIcon, FavoriteIcon } from '@/components/Icon'
import {
  handleAddToFavorites,
  handleDeleteToFavorites
} from '@/services/favoriteService/postFavorite'
import { getFavoriteBytUser, getCurrentUser } from '@/services/userService/getUser'

const ComicsDetail = () => {
  const { slug } = useParams()
  const [manga, setManga] = useState<comics | null>()
  const [topMangas, setTopMangas] = useState<comics[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isShow, setIsShow] = useState<boolean>(false)
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const [favorite, setFavorite] = useState<favorite[]>([])
  const [currentUser, setCurrentUser] = useState(null)
  const description = useRef<HTMLParagraphElement>(null)

  useScrollTop([slug])

  useEffect(() => {
    if (description.current) {
      setIsShow(description.current.scrollHeight !== description.current.clientHeight)
    }
  }, [description.current])

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser()

        setCurrentUser(user) // Set current user state
      } catch (error) {
        console.error('Error fetching current user:', error)
      }
    }

    fetchCurrentUser()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMangaBySlug(slug)
        setManga(data.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [slug])

  useEffect(() => {
    const fetchTopMangas = async () => {
      try {
        const response = await getMangaTop()

        if (response.data && Array.isArray(response.data.data.data)) {
          setTopMangas(response.data.data.data)
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
    const fetchData = async () => {
      try {
        const userFavorite = await getFavoriteBytUser() // Gọi API lấy danh sách yêu thích của người dùng
        setFavorite(userFavorite.data.user.favorites)

        // Kiểm tra xem truyện hiện tại có trong danh sách yêu thích không
        const isFavoriteManga = userFavorite.data.user.favorites.some(
          (fav: any) => fav.slug === slug // So sánh slug từ URL với slug trong danh sách yêu thích
        )

        setIsFavorite(isFavoriteManga) // Cập nhật trạng thái
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [slug])

  // Function to handle adding to favorites
  const handleAddFavorite = async () => {
    if (!currentUser) {
      toast.warning('Please Login')
      return
    }

    if (manga) {
      try {
        await handleAddToFavorites(manga.manga_id)
        setIsFavorite(true)

        await fetchFavorites()
      } catch (error) {
        toast.error('Failed to add to favorites.')
      }
    }
  }

  // Hàm bỏ theo dõi
  const handleRemoveFavorite = async () => {
    if (favorite && slug) {
      try {
        // Tìm mục yêu thích có slug trùng khớp với slug hiện tại
        const currentFavorite = favorite.find((fav) => fav.slug === slug)

        // Nếu tìm thấy mục yêu thích, thực hiện xóa
        if (currentFavorite) {
          await handleDeleteToFavorites(currentFavorite.favoriteId)
          setIsFavorite(false)
          await fetchFavorites()
        } else {
        }
      } catch (error) {}
    } else {
    }
  }

  // Function to fetch the user's favorites
  const fetchFavorites = async () => {
    try {
      const userFavorite = await getFavoriteBytUser() // Gọi API lấy danh sách yêu thích của người dùng
      setFavorite(userFavorite.data.user.favorites)

      // Kiểm tra xem truyện hiện tại có trong danh sách yêu thích không
      const isFavoriteManga = userFavorite.data.user.favorites.some(
        (fav: any) => fav.slug === slug // So sánh slug từ URL với slug trong danh sách yêu thích
      )

      setIsFavorite(isFavoriteManga) // Cập nhật trạng thái
    } catch (error) {
      console.error('Error fetching favorites:', error)
    }
  }

  // Tính trung bình rating từ mảng ratings
  const averageRating = useMemo(() => {
    if (!manga?.ratings?.length) return 0 // Kiểm tra nếu không có manga hoặc không có rating
    const totalRating = manga.ratings.reduce(
      (sum: number, rating: Rating) => sum + rating.rating,
      0
    )
    return Math.round((totalRating / manga.ratings.length) * 10) / 10 // Lấy 1 số thập phân
  }, [manga])

  return (
    <>
      <Helmet>
        <title>{`${manga?.title}  - VTruyen`}</title>
        <meta
          name='description'
          content={`Đọc truyện tranh ${manga?.title} Tiếng Việt bản dịch Full mới nhất, ảnh đẹp chất lượng cao, cập nhật nhanh và sớm nhất tại VTruyen`}
        />
      </Helmet>
      {!(Number(manga?.status) === 404) && (
        <>
          <ToastContainer position='top-right' autoClose={3000} />
          <div className='w-full min-h-[400px] relative overflow-hidden'>
            <p
              className='bg-no-repeat bg-cover h-[400px]'
              style={{
                backgroundColor: 'rgba(0,0,0,0.4)',
                backgroundImage: `url('${manga?.cover_image}')`,
                filter: 'blur(60px)'
              }}
            />
          </div>
          <div className='container mt-[-300px] blur-0'>
            <div className='w-full'>
              <div className='h-full container rounded-t-lg bg-white dark:bg-gray-900 px-4 lg:px-10'>
                <div className='pt-[35px] pb-[30px] min-h-[300px]'>
                  {manga && (
                    <div className='flex flex-col sm:flex-row items-center sm:items-start gap-5'>
                      <figure className='w-[200px] h-[280px] sm:w-[240px] sm:h-[330px] dark:border dark:border-gray-600 -mt-20 flex-shrink-0 rounded-md overflow-hidden shadow-[0_0_5px_#444]'>
                        <img
                          src={manga.cover_image}
                          loading='lazy'
                          alt={manga.title}
                          className='h-full w-full object-cover pointer-events-none select-none'
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null
                            currentTarget.src = imgError
                          }}
                        />
                      </figure>
                      <div className='w-full'>
                        <div className='flex items-start lg:justify-between gap-6 -mt-2'>
                          <h2
                            title={manga.title}
                            className='font-semibold text-3xl -ml-1 text-black dark:text-white'
                          >
                            {manga.title}
                          </h2>
                          <RatingStar rating={averageRating} />
                        </div>
                        <span className='text-base text-black dark:text-white block capitalize mt-1'>
                          tác giả: <strong className='text-primary'>{manga.author}</strong>
                        </span>
                        <p className='flex flex-wrap items-center gap-x-4 gap-y-2 text-base mt-1 text-black dark:text-white capitalize'>
                          <span>
                            Lượt xem:{' '}
                            <strong className='text-[#4b8fd7]'>
                              {formatCurrency(manga.views)}
                            </strong>
                          </span>
                          <span>
                            theo dõi:{' '}
                            <strong className='text-[#64d363]'>
                              {formatCurrency(manga.followers)}
                            </strong>
                          </span>
                        </p>
                        <div className='flex flex-wrap gap-[6px] items-center my-2 mb-3 dark:text-white'>
                          Thể loại:
                          {manga.genres.map((genre) => {
                            return genre.name !== undefined ? (
                              <Link
                                to={{
                                  pathname: PATH.genres,
                                  search: createSearchParams({
                                    type: genre.name,
                                    page: '1'
                                  }).toString()
                                }}
                                title={genre.name}
                                key={genre.id}
                              >
                                <span className='py-1 px-2 text-[13px] border border-dashed border-[#d9d9d9] hover:text-primary hover:border-primary truncate'>
                                  {genre.name}
                                </span>
                              </Link>
                            ) : null
                          })}
                        </div>
                        <div className='relative'>
                          <p
                            ref={description}
                            className={`text-base text-black/70 dark:text-gray-300 ${
                              !isOpen && ' overflow-hidden max-h-[72px]'
                            }`}
                          >
                            {manga.description}
                          </p>
                          {isShow && isOpen && (
                            <button
                              title='Thu gọn mô tả'
                              onClick={() => setIsOpen((prev) => !prev)}
                            >
                              <span className='text-black dark:text-white'>Show less</span>
                            </button>
                          )}{' '}
                          {isShow && !isOpen && (
                            <button
                              title='Xem thêm mô tả'
                              className='absolute right-0 bg-white/90 dark:bg-gray-900/90 rounded-full bottom-0 z-10 w-[50px] overflow-hidden'
                              onClick={() => setIsOpen((prev) => !prev)}
                            >
                              <span className='text-black dark:text-white font-medium'>
                                ...more
                              </span>
                            </button>
                          )}
                        </div>
                        <div className='flex items-center gap-3 mt-2'>
                          <Link
                            title='Đọc ngay chương mới nhất'
                            to={`${PATH.comics}/${slug}/${manga.chapters[0].slug}`}
                            className='text-white flex-shrink-0 bg-gradient w-[140px] h-[38px] capitalize font-semibold flex items-center justify-center rounded gap-2'
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              xmlnsXlink='http://www.w3.org/1999/xlink'
                              aria-hidden='true'
                              className='w-6 h-6'
                              viewBox='0 0 32 32'
                            >
                              <path
                                fill='currentColor'
                                d='M19 10h7v2h-7zm0 5h7v2h-7zm0 5h7v2h-7zM6 10h7v2H6zm0 5h7v2H6zm0 5h7v2H6z'
                              />
                              <path
                                fill='currentColor'
                                d='M28 5H4a2.002 2.002 0 0 0-2 2v18a2.002 2.002 0 0 0 2 2h24a2.002 2.002 0 0 0 2-2V7a2.002 2.002 0 0 0-2-2ZM4 7h11v18H4Zm13 18V7h11v18Z'
                              />
                            </svg>
                            Đọc Ngay
                          </Link>
                          {isFavorite ? (
                            <button
                              onClick={handleRemoveFavorite}
                              title='Bỏ theo dõi'
                              className='text-red-600 border-red-600 border flex-shrink-0 text-lg w-[140px] h-[38px] capitalize font-semibold flex items-center justify-center rounded gap-2 active:scale-95'
                            >
                              <FavoriteIcon className='h-6 w-6' />
                              Bỏ theo dõi
                            </button>
                          ) : (
                            <button
                              onClick={handleAddFavorite}
                              title='Theo dõi'
                              className='text-primary border-primary border flex-shrink-0 text-lg w-[140px] h-[38px] capitalize font-semibold flex items-center justify-center rounded gap-2 active:scale-95'
                            >
                              <FavoriteIcon className='h-6 w-6' />
                              Theo dõi
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {!manga && skeleton()}
                </div>
                <div className='flex gap-4 lg:gap-[30px] justify-between'>
                  <div className='flex-1 max-w-[852px]'>
                    <section className='min-h-[400px]'>
                      <h3 className='flex items-center gap-2 border-b border-slate-200 dark:border-gray-500 pb-1 capitalize text-primary text-lg'>
                        <BookIcon className=' w-6 h-6 flex-shrink-0 text-primary' />
                        Danh sách chương
                      </h3>
                      {manga && manga.manga_id && (
                        <ListChapter
                          manga_id={manga.manga_id}
                          data={manga.chapters}
                          slug={manga.slug}
                        />
                      )}
                      {!manga && skeletonListChapter()}
                    </section>
                    {/* Comments Mangas */}
                    <section className='mt-2'>
                      {manga && <ListComment manga_id={manga.manga_id} />}
                    </section>
                  </div>
                  <div className='flex-shrink-0 w-[238px] hidden md:flex flex-col gap-6'>
                    <div className='sticky top-[50px]'>
                      <h4 className='px-5 pl-3 py-3 border dark:border-gray-500 flex items-center font-semibold text-lg text-black dark:text-white'>
                        Nổi bật
                      </h4>
                      <div className='border border-t-0 dark:border-gray-500 flex flex-col min-h-[600px]'>
                        {topMangas &&
                          topMangas
                            .slice(0, 7)
                            .map((item, i) => (
                              <SuggestComics
                                key={item.manga_id}
                                index={i}
                                title={item.title}
                                src={item.cover_image}
                                idChapter={
                                  item.chapters.length > 0 ? item.chapters[0].slug : undefined
                                }
                                chapter={
                                  item.chapters.length > 0 ? item.chapters[0].title : 'No chapters'
                                }
                                genres={item.genres.map((item) => item.name) as [string]}
                                idComic={item.slug}
                              />
                            ))}
                        {!topMangas && (
                          <div className='flex items-center justify-center gap-2 h-[300px] text-black dark:text-white'>
                            <img src={imgLoading} alt='loading icon' loading='lazy' />
                            Loading...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            onMouseDown={() => {
              setIsOpenModal(false)
              document.body.style.overflow = 'auto'
            }}
            className={`fixed inset-0 bg-[rgba(0,0,0,.6)] z-30 flex flex-col items-center justify-center duration-500 transition-all ${
              isOpenModal ? ' opacity-100 pointer-events-auto' : ' opacity-0 pointer-events-none'
            }`}
          >
            <div
              className='bg-white dark:bg-gray-900 p-5 rounded-lg'
              onMouseDown={(e) => e.stopPropagation()}
            >
              <section className='w-full sm:w-[450px] md:w-[550px] lg:w-[700px]'>
                {/* {manga && id && <ListDownloadChapter id={id} data={[]} />} */}
              </section>
            </div>
          </div>
        </>
      )}
      {Number(manga?.status) === 404 && <NotFound />}
    </>
  )
}
export default ComicsDetail

const skeleton = () => {
  return (
    <div className='flex flex-col sm:flex-row items-center sm:items-start gap-5'>
      <div className='-mt-20 flex items-center justify-center w-[200px] h-[280px] sm:w-[240px] sm:h-[330px] rounded-md bg-gray-300 dark:bg-gray-700 flex-shrink-0'>
        <DocumentIcon className=' w-10 h-10 text-gray-200 dark:text-gray-600' />
      </div>
      <div className='w-full overflow-hidden animate-pulse'>
        <div className='flex items-center xl:justify-between gap-6'>
          <div className='-ml-1 h-6 bg-gray-200 rounded-full dark:bg-gray-700 w-[450px]' />
          <div className='hidden lg:block -ml-1 h-6 bg-gray-200 rounded-full dark:bg-gray-700 w-48' />
        </div>
        <div className='h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mt-4' />
        <div className='flex items-center gap-4'>
          <div className='h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-40 mt-3' />
          <div className='h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-40 mt-3' />
        </div>
        <div className='flex items-center gap-[6px] my-4'>
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className='h-6 bg-gray-200 rounded-md dark:bg-gray-700 w-16' />
            ))}
        </div>
        <div className='h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-full mt-3' />
        <div className='h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-full mt-2' />
        <div className='h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-full mt-2' />
        <div className='flex items-center gap-3 mt-4'>
          <div className='w-[140px] h-[38px] bg-gray-200 rounded-md dark:bg-gray-700' />
          <div className='w-[140px] h-[38px] bg-gray-200 rounded-md dark:bg-gray-700' />
        </div>
      </div>
    </div>
  )
}

const skeletonListChapter = () => {
  return (
    <div className='animate-pulse'>
      <div className='my-5 h-[30px] bg-gray-200 rounded-md dark:bg-gray-700 w-[70px]' />
      <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-5 my-5 text-gray-800 font-semibold text-sm flex-wrap'>
        {Array(20)
          .fill(0)
          .map((_, i) => (
            <div key={i} className='rounded-sm h-[38px] pt-2 px-4 bg-gray-200 dark:bg-gray-700' />
          ))}
      </div>
    </div>
  )
}

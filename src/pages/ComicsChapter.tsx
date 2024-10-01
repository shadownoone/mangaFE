import { ListComment } from '@/components'
import { useScrollTop } from '@/hooks'
import PATH from '@/utils/path'
import classNames from 'classnames'

import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { comics, comicSingleChapter } from '@/types/data'

import { Helmet } from 'react-helmet-async'
import { getMangaBySlugAndChapter } from '@/services/mangaService/getManga'
import { DownArrowIcon, LeftArrowIcon, RightArrowIcon } from '@/components/Icon'

const ComicsChapter = () => {
  const { slug, slug_chapter } = useParams()
  const navigate = useNavigate()
  const [openList, setOpenList] = useState<boolean>(false)
  const [manga, setManga] = useState<comics | null>()
  const [chapter, setChapter] = useState<comicSingleChapter | null>()

  const [isFetching, setIsFetching] = useState(true)

  const handleChangeChapter = (type: 'prev' | 'next') => {
    if (manga) {
      // Đảo ngược danh sách chương để xử lý thứ tự nếu cần
      const chapters = [...manga.chapters].reverse()

      // Tìm vị trí của chương hiện tại trong danh sách
      const currentChapterIndex = chapters.findIndex((chapter) => chapter.slug === slug_chapter)

      // Xác định vị trí chương tiếp theo hoặc trước đó dựa trên loại hành động ('prev' hoặc 'next')
      const newChapterIndex = currentChapterIndex + (type === 'next' ? -1 : 1)

      // Kiểm tra xem chương mới có hợp lệ (trong phạm vi danh sách chapters)
      if (newChapterIndex >= 0 && newChapterIndex < chapters.length) {
        // Lấy thông tin của chương mới
        const newChapter = chapters[newChapterIndex]

        // Điều hướng đến chương mới
        navigate(`/comics/${slug}/${newChapter.slug}`)
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMangaBySlugAndChapter(slug, slug_chapter)
        setManga(data.data)

        const chapter = data.data.chapters.find((c: { slug: string }) => c.slug === slug_chapter)
        setChapter(chapter)

        setIsFetching(false)
      } catch (error) {
        console.error('Error fetching manga and chapters:', error)
      }
    }

    fetchData()
  }, [slug, slug_chapter])

  useScrollTop([slug_chapter])

  return (
    <>
      <Helmet>
        <title>{`${manga?.title} - ${chapter?.title} - VTruyen`}</title>
        <meta
          name='description'
          content={`Đọc truyện tranh ${manga?.title} ${chapter?.title}
            ?.name} Tiếng Việt bản dịch Full mới nhất, ảnh đẹp chất lượng cao, cập nhật nhanh và sớm nhất tại VTruyen`}
        />
      </Helmet>
      <div className='min-h-[60px] sticky top-0 left-0 z-20 bg-white dark:bg-gray-900 shadow-lg'>
        <div className='container max-w-4xl'>
          {manga && (
            <div className='flex items-center justify-between px-4 lg:px-0'>
              {Breadcrumb(manga.slug as string, slug_chapter as string, manga)}
              <div className='flex flex-1 sm:flex-none items-center justify-between gap-4 sm:gap-2 my-4'>
                <div className='flex items-center gap-2'>
                  <button
                    title='Tập trước'
                    onClick={() => handleChangeChapter('prev')}
                    className={classNames(
                      'flex items-center justify-center gap-1 px-3 h-8 border dark:border-gray-500 rounded-md leading-3 active:scale-95',
                      {
                        'hover:border-primary hover:text-primary dark:text-white dark:hover:border-primary dark:hover:text-primary':
                          Number(slug_chapter) !==
                          manga.chapters[manga.chapters.length - 1].chapter_id,
                        'opacity-60 cursor-default dark:text-white/60':
                          Number(slug_chapter) ===
                          manga.chapters[manga.chapters.length - 1].chapter_id
                      }
                    )}
                    // disabled={
                    //   Number(slug_chapter) === manga.chapters[manga.chapters.length - 1].chapter_id
                    // }
                  >
                    <LeftArrowIcon className='w-4 h-4 ' />
                  </button>
                  <button
                    className='px-3 py-[3px] text-black dark:text-white rounded-md relative border dark:border-gray-500'
                    onClick={() => setOpenList((prev) => !prev)}
                  >
                    <div className='flex items-center gap-2'>
                      <span className='line-clamp-1 max-w-[120px]'>
                        {(() => {
                          const currentChapter = manga.chapters.find(
                            (item) => item.slug === slug_chapter
                          ) // Tìm chapter hiện tại
                          return currentChapter ? currentChapter.title : manga.chapters[0].title // Hiển thị tiêu đề của chapter hiện tại
                        })()}
                      </span>
                      <DownArrowIcon className='w-4 h-4' />
                    </div>
                    <div
                      className={`absolute z-10 top-10 border dark:border-gray-500 shadow-lg bg-white dark:bg-gray-900 w-60 py-3 rounded translate-x-1/2 right-1/2 text-left duration-200 origin-top ${
                        openList
                          ? 'scale-100 pointer-events-auto'
                          : 'scale-[0.001] pointer-events-none'
                      }`}
                    >
                      <h5 className='text-lg px-4 pb-2 leading-5'>
                        All episodes {`(${manga?.chapters.length || 0})`}
                      </h5>
                      <ul className='overflow-auto text-sm h-max max-h-64 font-normal'>
                        {manga?.chapters.map((item) => (
                          // id nhận giá trị string
                          <li key={item.chapter_id} id={item.chapter_id.toString()}>
                            <Link
                              title={item.title}
                              to={`${PATH.comics}/${slug}/${item.slug}`} // Tạo link tới chapter dựa trên slug của chapter
                              className={`py-2 block truncate px-4 duration-100 hover:bg-[rgba(0,0,0,0.1)] dark:hover:bg-[rgba(255,255,255,0.1)] ${
                                item.chapter_id === Number(slug_chapter)
                                  ? 'text-primary font-bold'
                                  : ''
                              }`}
                            >
                              {item.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </button>
                  <button
                    title='Tập sau'
                    onClick={() => handleChangeChapter('next')}
                    className={classNames(
                      'flex items-center justify-center gap-1 px-3 h-8 border dark:border-gray-500 rounded-md leading-3 active:scale-95',
                      {
                        'hover:border-primary hover:text-primary dark:text-white dark:hover:border-primary dark:hover:text-primary':
                          Number(slug_chapter) !== manga.chapters[0].chapter_id,
                        'opacity-60 cursor-default dark:text-white/60':
                          Number(slug_chapter) === manga.chapters[0].chapter_id
                      }
                    )}
                    // disabled={Number(slug_chapter) === manga.chapters[0].chapter_id}
                  >
                    <RightArrowIcon />
                  </button>
                </div>
                {/* {ButtonDownload(slug as string, slug_chapter as string)} */}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='bg-[#111]' onMouseDown={() => setOpenList(false)}>
        <div className='container max-w-4xl'>
          <div className='flex flex-col min-h-screen h-full'>
            {isFetching ? (
              <h2 className='text-3xl text-white flex-1 flex items-center justify-center'>
                Đang tải chương...
              </h2>
            ) : chapter?.images && chapter.images.length > 0 ? (
              chapter?.images.map((item, index) => (
                <img
                  loading={index >= 3 ? 'lazy' : 'eager'}
                  src={item.image_url}
                  key={item.image_id}
                  alt={`Page ${item.image_id}`}
                  referrerPolicy='origin'
                  className='min-h-[200px] h-auto w-full bg-[rgba(255,255,255,0.8)] object-center'
                />
              ))
            ) : (
              <h2 className='text-3xl text-white flex-1 flex items-center justify-center'>
                Không tìm thấy chương
              </h2>
            )}

            {!isFetching &&
              !chapter && // Hoặc !isFetching && chapter?.images?.length === 0
              Array(10)
                .fill(0)
                .map((_, i) => <span key={i} className='aspect-[2/3] bg-zinc-700 animate-pulse' />)}
          </div>
        </div>
      </div>
      <div className='container max-w-4xl min-h-[60px]'>
        {manga && (
          <div className='flex items-center justify-center px-4 lg:px-0'>
            <div className='flex flex-1 sm:flex-none items-center justify-between gap-3 my-4'>
              <div className='flex items-center flex-wrap gap-3 text-black dark:text-white'>
                <button
                  title='Tập sau'
                  onClick={() => handleChangeChapter('prev')}
                  className={classNames(
                    'flex items-center justify-center gap-1 px-4 h-9 border rounded-md leading-3 active:scale-95',
                    {
                      'hover:border-primary hover:text-primary':
                        Number(slug_chapter) !==
                        manga.chapters[manga.chapters.length - 1].chapter_id,
                      'opacity-80 cursor-default':
                        Number(slug_chapter) ===
                        manga.chapters[manga.chapters.length - 1].chapter_id
                    }
                  )}
                  disabled={
                    Number(slug_chapter) === manga.chapters[manga.chapters.length - 1].chapter_id
                  }
                >
                  <LeftArrowIcon className='w-4 h-4' />
                  Tập trước
                </button>
                <button
                  title='Tập sau'
                  onClick={() => handleChangeChapter('next')}
                  className={classNames(
                    'flex items-center justify-center gap-1 min-w-[125px] px-4 h-9 border rounded-md leading-3 active:scale-95',
                    {
                      'hover:border-primary hover:text-primary':
                        Number(slug_chapter) !== manga.chapters[0].chapter_id,
                      'opacity-80 cursor-default':
                        Number(slug_chapter) === manga.chapters[0].chapter_id
                    }
                  )}
                  disabled={Number(slug_chapter) === manga.chapters[0].chapter_id}
                >
                  Tập sau
                  <RightArrowIcon className='w-4 h-4' />
                </button>
              </div>
              {/* {ButtonDownload(slug as string, slug_chapter as string)} */}
            </div>
          </div>
        )}
        {slug && <ListComment id={slug} />}
      </div>
    </>
  )
}
export default ComicsChapter

const Breadcrumb = (slug: string, idChapter: string, dataChapter: comics) => {
  return (
    <div className='hidden sm:flex items-center gap-1 my-4 dark:text-white'>
      <Link
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        }
        title='Trang chủ'
        to={PATH.home}
        className='hidden lg:flex items-center hover:text-primary text-lg'
      >
        Trang chủ
        <RightArrowIcon className='w-5 h-5 ' />
      </Link>

      <Link className='hidden' title='abc' to={`${PATH.comics}/${idChapter}`}></Link>

      <Link
        to={`${PATH.comics}/${slug}`}
        title={dataChapter.title}
        className='hidden md:flex items-center text-lg hover:text-primary'
      >
        <h2 className='max-w-[200px] line-clamp-1'>
          {dataChapter.title ? dataChapter.title : slug.split('-').join(' ')}
        </h2>
        <RightArrowIcon className='w-5 h-5 ' />
      </Link>
    </div>
  )
}

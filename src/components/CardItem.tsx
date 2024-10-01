import PATH from '@/utils/path'
import { Link } from 'react-router-dom'
import imgError from '/img-error.webp'
import { comics } from '@/types/data'

interface Props {
  data: comics
}

const CardItem = ({ data }: Props) => {
  const { manga_id, cover_image, title, updated_at, description, chapters = [], slug } = data

  // Kiểm tra xem chapters có ít nhất một phần tử không
  const firstChapterSlug = chapters.length > 0 ? chapters[0]?.slug : ''
  const firstChapterTitle = chapters.length > 0 ? chapters[0]?.title : ''

  return (
    <div className='relative'>
      <div className='w-full h-[240px] xl:h-[220px] overflow-hidden group'>
        <Link to={`${PATH.comics}/${slug}`} title={slug}>
          <img
            src={cover_image}
            title={slug}
            alt={slug}
            className='w-full h-full object-cover hover:scale-[1.15] transition-all duration-300 xl:pointer-events-none'
            loading='lazy'
            onError={({ currentTarget }) => {
              currentTarget.onerror = null
              currentTarget.src = imgError
            }}
          />
        </Link>
        <div className='hidden xl:block absolute top-[-15px] left-[-30px] opacity-0 group-hover:opacity-100 scale-[0.73] group-hover:scale-100 transition-all duration-300 h-[299px] group-hover:h-[330px] z-[2] shadow-2xl'>
          <div className='w-[226px] min-h-[330px] bg-white dark:bg-gray-900 dark:border dark:border-gray-800 dark:overflow-hidden'>
            <Link to={`${PATH.comics}/${slug}`} title={title}>
              <p
                className='bg-cover bg-no-repeat w-[226px] h-[160px] bg-[center_30%]'
                style={{
                  backgroundImage: `url('${cover_image}'), url('${imgError}')`
                }}
              />
            </Link>
            <div className='p-[10px]'>
              <Link
                to={`${PATH.comics}/${slug}`}
                title={slug}
                className='hover:text-primary dark:hover:text-primary text-black dark:text-white font-semibold text-base leading-5 block'
              >
                {title}
              </Link>
              <span className='text-sm text-gray-400 block'>{updated_at}</span>
              <p className='text-sm mt-[2px] inline-block text-black dark:text-white'>
                <span className='mr-1'>Cập nhật:</span>
                <Link
                  to={`${PATH.comics}/${slug}/${firstChapterSlug}`}
                  title={firstChapterTitle}
                  className='text-primary'
                >
                  {firstChapterTitle}
                </Link>
              </p>
              <p className='text-sm text-gray-400 line-clamp-2 h-10'>{description}</p>
              <Link
                title='Đọc ngay chương mới nhất'
                to={`${PATH.comics}/${slug}/${firstChapterSlug}`}
                className='text-white text-sm bg-primary w-full h-[30px] mt-[10px] uppercase font-semibold flex items-center justify-center rounded text-center'
              >
                Đọc Ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-2 flex flex-col text-black dark:text-white'>
        <Link
          to={`${PATH.comics}/${manga_id}`}
          title={title}
          className='hover:text-primary font-semibold text-base leading-4 line-clamp-1'
        >
          {title}
        </Link>
        <span className='text-sm text-gray-400 mt-2'>{updated_at}</span>
        <p className='inline-block text-sm truncate'>
          <span className='mr-1'>Cập nhật:</span>
          <Link
            to={`${PATH.chapters}/${manga_id}/${firstChapterSlug}`}
            title={firstChapterTitle}
            className='text-primary whitespace-nowrap'
          >
            {firstChapterTitle}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default CardItem

import { comicsChapter } from '@/types/data'
import { useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import PATH from '@/utils/path'
import { getChapter } from '@/services/chapterService/getChapter'
import { DownArrowIcon } from './Icon'

interface Props {
  data: comicsChapter
  manga_id: number

  slug: string
}

const ListChapter = ({ data, manga_id, slug }: Props) => {
  const newestChapter = useMemo(() => Number(data[0]?.name?.match(/\d+(\.\d+)?/)?.[0]), [data])
  const numberButton = 50
  const [dataChapter, setDataChapter] = useState<any>([])
  const [range, setRange] = useState([0, 50])
  const [active, setActive] = useState<number>(0)
  const [openList, setOpenList] = useState<boolean>(false)

  useEffect(() => {
    const fetchAndSetChapters = async () => {
      try {
        const chaptersData = await getChapter()

        const filteredChapters = chaptersData.data.data.filter(
          (chapter) => chapter.manga_id === manga_id
        )

        setDataChapter(filteredChapters)
      } catch (error) {}
    }
    fetchAndSetChapters()
  }, [manga_id])

  const handleRenderGroupChapter = (i: number) => {
    if (i === 0) {
      return `${i} - ${(i + 1) * 50 > newestChapter ? newestChapter : (i + 1) * 50}`
    } else {
      return `${i * 50 + 1} - ${
        (i + 1) * 50 >= Math.floor(newestChapter) ? newestChapter : (i + 1) * 50
      }`
    }
  }

  const handleChangeGroupChapter = (i: number) => {
    setActive(i)
    if (i === 0) {
      setRange([i, (i + 1) * 50 > newestChapter ? newestChapter : (i + 1) * 50])
    } else {
      setRange([
        i * 50 + 1,
        (i + 1) * 50 >= Math.floor(newestChapter) ? newestChapter : (i + 1) * 50
      ])
    }
  }

  return (
    <div onClick={() => setOpenList(false)}>
      <ul className='flex items-center gap-3 my-5 text-gray-800 font-semibold text-sm flex-wrap'>
        <li>
          <button
            className='text-black dark:text-white rounded-md relative font-normal text-base leading-5 py-1 px-3 border dark:border dark:border-gray-500 flex items-center gap-2'
            onClick={(e) => {
              e.stopPropagation()
              setOpenList((prev) => !prev)
            }}
          >
            <div className='flex items-center gap-2'>
              <span className='line-clamp-1 max-w-[140px]'>{`${range[0]} - ${
                dataChapter.length > 50 ? range[1] : dataChapter[0]?.chapter_number
              }`}</span>
              <DownArrowIcon className='h-4 w-4' />
            </div>
            <div
              className={`absolute z-10 top-8 border dark:border dark:border-gray-500 shadow-lg bg-white dark:bg-gray-900 w-32 rounded left-0 text-left duration-200 origin-top ${
                openList ? 'scale-100 pointer-events-auto' : 'scale-[0.001] pointer-events-none'
              }`}
            >
              <ul className='overflow-auto text-sm h-max max-h-72 font-normal pl-3 px-1'>
                {Array(numberButton)
                  .fill(0)
                  .map((_, i) => (
                    <li
                      key={i}
                      onClick={() => handleChangeGroupChapter(i)}
                      className={classNames(
                        'font-normal text-base leading-5 flex justify-start w-full truncate py-2',
                        {
                          'hover:text-primary': i !== active,
                          'text-primary': i === active,
                          'border-t border-dashed dark:border-gray-600': i !== 0,
                          hidden: !(i * 50 + 1 <= Math.floor(newestChapter))
                        }
                      )}
                    >
                      {handleRenderGroupChapter(i)}
                    </li>
                  ))}
              </ul>
            </div>
          </button>
        </li>
      </ul>
      <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-5 my-5 text-gray-800 dark:text-gray-200 font-semibold text-sm flex-wrap'>
        {dataChapter.map((item) => (
          <Link
            to={`${PATH.comics}/${slug}/${item.slug}`}
            title={item.title}
            key={item.chapter_id}
            className='rounded-sm font-normal text-base h-[38px] pt-2 px-4 bg-[#f6f6f6] dark:bg-gray-800 dark:hover:bg-primary/20 hover:bg-primary/10 hover:text-primary truncate'
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ListChapter

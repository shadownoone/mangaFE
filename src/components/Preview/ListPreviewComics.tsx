import { comics } from '@/types/data'
import { CardItem } from '..'
import { useMediaQuery } from 'react-responsive'
import { DocumentIcon } from '../Icon'
interface Props {
  data: comics[]
}

const ListPreviewComics = ({ data }: Props) => {
  const isBigScreen = useMediaQuery({ minWidth: 1281 })
  const isTablet = useMediaQuery({ maxWidth: 1280, minWidth: 1024 })
  const isTabletMini = useMediaQuery({ maxWidth: 1023, minWidth: 768 })
  const isMobile = useMediaQuery({ maxWidth: 767, minWidth: 640 })
  const isMobileMini = useMediaQuery({ maxWidth: 639 })

  // console.log(data)

  return (
    <ul className='mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2 xl:gap-x-[3px] gap-y-5'>
      {data && (
        <>
          {isBigScreen &&
            data.slice(0, 14).map((item) => (
              <li key={item.manga_id}>
                <CardItem data={item} />
              </li>
            ))}
          {(isTablet || isMobile) &&
            data.slice(0, 15).map((item) => (
              <li key={item.manga_id}>
                <CardItem data={item} />
              </li>
            ))}
          {(isTabletMini || isMobileMini) &&
            data.slice(0, 16).map((item) => (
              <li key={item.manga_id}>
                <CardItem data={item} />
              </li>
            ))}
        </>
      )}
      {!data && skeleton()}
    </ul>
  )
}
export default ListPreviewComics

const skeleton = () => {
  return (
    <>
      {Array(16)
        .fill(0)
        .map((_, i) => (
          <div key={i} className='w-full min-h-[292px] overflow-hidden animate-pulse'>
            <div className='flex items-center justify-center w-full h-[240px] xl:h-[220px] bg-gray-300 dark:bg-gray-700 flex-shrink-0'>
              <DocumentIcon className=' w-16 h-16 text-gray-200 dark:text-gray-600' />
            </div>
            <div className='mt-2 flex flex-col'>
              <span className='h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-40 mb-4 mt-1' />
              <span className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-16 mb-2' />
              <span className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-32' />
            </div>
          </div>
        ))}
    </>
  )
}

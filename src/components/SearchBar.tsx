import iconSearch from '/icon_search.webp'
import { SuggestComics } from '.'
import { useState } from 'react'
import { useQuery } from 'react-query'

import PATH from '@/utils/path'
import { createSearchParams, useNavigate } from 'react-router-dom'
import imgLoading from '/loading.gif'
import { searchManga } from '@/services/mangaService/getManga'
import { useQueryConfig } from '@/hooks'

const SearchBar = () => {
  const [valueForm, setValueForm] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const navigate = useNavigate()
  const queryConfig = useQueryConfig()

  const {
    data: dataSuggest,

    isLoading,
    refetch
  } = useQuery({
    queryKey: ['search', queryConfig],
    queryFn: () => searchManga({ ...queryConfig, q: valueForm }),
    staleTime: 3 * 60 * 1000,
    enabled: valueForm != '',
    keepPreviousData: true
  })
  const dataComicSuggest = dataSuggest?.data

  const handleClick = (id: string) => {
    navigate(`${PATH.comics}/${id}`)
    setValueForm('')
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (valueForm !== '') {
      navigate({
        pathname: PATH.search,
        search: createSearchParams({
          q: valueForm.trim(),
          page: '1'
        }).toString()
      })
    }
    setValueForm('')
  }

  return (
    <div className='w-full'>
      <div
        className={`bg-no-repeat bg-cover h-[100px] sm:bg-[url('/search-bg.webp')] sm:dark:relative sm:dark:after:content-[""] sm:dark:after:absolute sm:dark:after:inset-0 sm:dark:after:bg-gray-900/80`}
      >
        <div className='container h-full'>
          <div className='h-full flex items-center justify-center'>
            <form
              className='z-10 relative flex items-center dark:text-white w-[320px] sm:w-auto'
              onSubmit={(e) => {
                handleSearch(e)
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                })
              }}
            >
              <div className='flex-shrink-0 bg-white py-4 pl-[18px] pr-[14px] dark:bg-gray-900 hidden sm:block'>
                <p
                  className='bg-cover bg-no-repeat w-[18px] h-[18px]'
                  style={{
                    backgroundImage: `url(${iconSearch})`
                  }}
                />
              </div>
              <input
                onFocus={() => setIsOpen(true)}
                onBlur={() => setIsOpen(false)}
                onChange={(e) => {
                  setValueForm(e.target.value)
                  refetch()
                }}
                value={valueForm}
                type='text'
                placeholder='Tìm kiếm...'
                className='h-[36px] sm:h-[50px] leading-[50px] pr-4 pl-4 sm:pl-0 w-full sm:w-[320px] lg:w-[420px] outline-none dark:bg-gray-900'
              />
              <button
                title='Tìm Kiếm'
                className='text-white capitalize flex items-center justify-center bg-gray-700 sm:bg-gradient h-[36px] sm:h-[50px] w-[50px] sm:w-[100px] lg:w-[140px]'
              >
                <span className='sm:inline-block hidden'>Tìm Kiếm</span>
                <p
                  className='bg-cover bg-no-repeat w-[18px] h-[18px] inline-block sm:hidden'
                  style={{
                    backgroundImage: `url(${iconSearch})`
                  }}
                />
              </button>
              {isOpen && (
                <div
                  className='absolute top-[37px] md:top-[50px] left-0 z-40 border border-[#EDEDED] dark:border-gray-600 bg-white dark:bg-gray-900 w-full md:w-[470px] shadow-[0_2px_4px_0_rgba(0,0,0,0.10)] max-h-[280px] overflow-y-auto'
                  style={{
                    filter: 'blur(0)'
                  }}
                >
                  {dataComicSuggest?.length > 0 &&
                    valueForm &&
                    dataComicSuggest.map((item: any, i: any) => (
                      <div
                        key={item.slug}
                        onMouseDown={() => handleClick(item.slug)}
                        className='cursor-pointer'
                      >
                        <SuggestComics
                          index={i}
                          isStyleSearch={true}
                          title={item.title}
                          src={item.cover_image}
                          idComic={item.slug}
                          chapter={
                            item.chapters.length > 0 ? item.chapters[0].title : 'No chapters'
                          }
                          genres={item.genres.map((genre: any) => genre.name)}
                        />
                      </div>
                    ))}
                  {isLoading && (
                    <div className='flex items-center justify-center h-[100px] gap-2'>
                      <img src={imgLoading} alt='loading icon' loading='lazy' />
                      Loading...
                    </div>
                  )}
                  {Array.isArray(dataComicSuggest) && !dataComicSuggest.length && (
                    <div className='flex items-center justify-center h-[100px]'>Not found</div>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchBar

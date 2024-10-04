import { Link, NavLink, createSearchParams, useLocation, useMatch } from 'react-router-dom'
import PATH from '@/utils/path'
import { useEffect, useMemo, useState } from 'react'
import iconSearch from '/icon_search.webp'
import classNames from 'classnames'
import { SearchBar } from '.'
import { useQueryConfig } from '@/hooks'
import avatarUser from '../../public/avatarUser.jpg'

import { DarkIcon, DarkOrLightIcon, HistoryIcon, UserIcon } from './Icon'
import { getCurrentUser } from '@/services/getUser/getUser'
import { user } from '@/types/data'
import { handleLogout } from '@/services/Login/handleLogout'

const Header = () => {
  const queryConfig = useQueryConfig()
  const { pathname } = useLocation()
  const isMatchTop = useMemo(() => pathname.includes('/top'), [pathname])
  const [OpenTheme, setOpenTheme] = useState<boolean>(false)
  const [OpenNav, setOpenNav] = useState<boolean>(false)

  const [user, setUser] = useState<user | null>(null)

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)

  useEffect(() => {
    document.body.style.overflow = OpenNav ? 'hidden' : 'unset'
  }, [OpenNav])

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser()

      setUser(currentUser.data) // Cập nhật thông tin người dùng khi đăng nhập
    }

    fetchUser()
  }, [])

  useEffect(() => {
    setOpenNav(false)
  }, [pathname, queryConfig.q])

  const handleChangeTheme = (type: 'light' | 'dark') => {
    if (type === 'light') {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
      document.body.classList.remove('dark:bg-gray-900')
      localStorage.setItem('theme', 'light')
    }
    if (type === 'dark') {
      document.documentElement.classList.remove('light')
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark:bg-gray-900')
      localStorage.setItem('theme', 'dark')
    }
  }

  return (
    <div className='bg-white text-black dark:bg-gray-900 dark:text-white shadow dark:border-b dark:border-gray-700'>
      <div className='container px-4 xl:px-0 h-[74px] flex items-center justify-between'>
        <div className='flex items-center'>
          <Link
            to={PATH.home}
            title='VTruyen'
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              })
            }
          >
            <h1 title='Web đọc truyện Việt Nam' className='font-bold text-3xl text-primary'>
              VTruyện
            </h1>
          </Link>
          {/* navigate */}
          <ul className='hidden sm:flex items-center gap-4 ml-6 mt-1'>
            <li className='hidden lg:block'>
              <Link
                title='Trang chủ VTruyen'
                onClick={() =>
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  })
                }
                to={PATH.home}
                className={`hover:text-primary text-lg capitalize ${
                  useMatch(PATH.home) && ' text-primary'
                }`}
              >
                Trang chủ
              </Link>
            </li>
            <li>
              <Link
                title='Tất cả thể loại truyện tranh'
                to={{
                  pathname: PATH.genres,
                  search: createSearchParams({
                    type: 'all',
                    page: '1'
                  }).toString()
                }}
                className={`hover:text-primary text-lg capitalize ${
                  useMatch(PATH.genres) && ' text-primary'
                }`}
              >
                Thể loại
              </Link>
            </li>
            <li>
              <Link
                title='Truyện tranh mới nhất'
                to={{
                  pathname: PATH.new,
                  search: createSearchParams({
                    status: 'all',
                    page: '1'
                  }).toString()
                }}
                className={`hover:text-primary text-lg capitalize ${
                  useMatch(PATH.new) && ' text-primary'
                }`}
              >
                mới
              </Link>
            </li>
            <li>
              <Link
                title='Bảng xếp hạng truyện tranh'
                to={{
                  pathname: PATH.top,
                  search: createSearchParams({
                    status: 'all',
                    page: '1'
                  }).toString()
                }}
                className={`hover:text-primary text-lg capitalize ${isMatchTop && ' text-primary'}`}
              >
                BXH
              </Link>
            </li>
          </ul>
        </div>
        {/* options */}
        <div className='hidden sm:flex items-center'>
          <Link
            title='Lịch sử truyện tranh'
            to={PATH.history}
            className='flex flex-col items-center px-2 py-1 rounded-md hover:text-primary'
          >
            <HistoryIcon />
            <span className='capitalize text-xs mt-[2px]'>lịch sử</span>
          </Link>
          <div
            onMouseEnter={() => setOpenTheme(true)}
            onMouseLeave={() => setOpenTheme(false)}
            className='relative flex flex-col items-center px-2 py-1 hover:text-primary cursor-pointer'
          >
            <DarkOrLightIcon />

            <span className='capitalize text-xs mt-[2px]'>giao diện</span>
            {OpenTheme && (
              <div className='absolute top-10 bg-transparent py-2 z-50'>
                <div className='p-1 lg:p-2 border dark:border-gray-400 shadow-lg rounded-md flex flex-col justify-center items-center bg-white text-black dark:bg-gray-900 dark:text-white'>
                  <button
                    title='Nền sáng'
                    onClick={() => {
                      setOpenTheme(false)
                      handleChangeTheme('light')
                    }}
                    className='active:scale-90 hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.1)] rounded-md py-1 px-2 flex items-center justify-start gap-2 min-w-[80px]'
                  >
                    <DarkOrLightIcon />
                    Sáng
                  </button>
                  <span className='h-[1px] w-[80%] border-b border-dashed my-1' />
                  <button
                    title='Nền tối'
                    onClick={() => {
                      setOpenTheme(false)
                      handleChangeTheme('dark')
                    }}
                    className='active:scale-90 hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.1)] rounded-md py-1 px-2 flex items-center justify-start gap-2 min-w-[80px]'
                  >
                    <DarkIcon />
                    Tối
                  </button>
                </div>
              </div>
            )}
          </div>

          {user ? (
            <div
              className='relative flex flex-col items-center px-2 py-1 rounded-md'
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <img
                src={user.avatar ? user.avatar : avatarUser}
                alt='Avatar'
                className='w-8 h-8 rounded-full object-cover'
              />

              {isDropdownOpen && (
                <div className='absolute right-0 mt-9 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50'>
                  <ul className='py-2'>
                    <li>
                      <Link
                        to={PATH.profile}
                        className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                      >
                        Thông tin cá nhân
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={PATH.favorite}
                        className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                      >
                        Truyện yêu thích
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={PATH.history}
                        className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                      >
                        Lịch sử đọc
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className='w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                      >
                        Đăng xuất
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link
              title='Đăng nhập'
              to='/login'
              className='flex flex-col items-center px-2 py-1 rounded-md hover:text-primary'
            >
              <UserIcon className='w-6 h-6' />
              <span className='capitalize text-xs mt-[2px]'>Đăng nhập</span>
            </Link>
          )}
        </div>
        {/* hamburger button */}
        <div className='flex sm:hidden items-center gap-1'>
          <button
            title='Tìm kiếm truyện tranh'
            onClick={() => setOpenNav((prev) => !prev)}
            className='bg-center bg-no-repeat w-[18px] h-[18px] p-4'
            style={{
              backgroundImage: `url(${iconSearch})`
            }}
          />
          <button
            title='Menu truyện tranh VTruyen'
            onClick={() => setOpenNav((prev) => !prev)}
            className='flex flex-col gap-[5px] p-2'
          >
            <span
              className={classNames(
                'block w-6 h-[3px] rounded-full bg-gray-400 transition-all duration-300',
                {
                  'rotate-45 translate-y-2': OpenNav,
                  'rotate-0': !OpenNav
                }
              )}
            />
            <span
              className={classNames(
                'block w-6 h-[3px] rounded-full bg-gray-400 transition-all duration-300',
                {
                  'opacity-0': OpenNav,
                  'opacity-100': !OpenNav
                }
              )}
            />
            <span
              className={classNames(
                'block w-6 h-[3px] rounded-full bg-gray-400 transition-all duration-300',
                {
                  '-rotate-45 -translate-y-2': OpenNav,
                  'rotate-0': !OpenNav
                }
              )}
            />
          </button>
        </div>
        {/* hamburger open */}
        <div
          className={`${
            OpenNav ? 'translate-x-0' : 'translate-x-full'
          } duration-200 transition-all dark:bg-gray-800 bg-slate-100 h-full block sm:hidden p-4 pt-0 fixed z-50 inset-0 overflow-y-auto top-[74px]`}
        >
          <SearchBar />
          <ul className='flex flex-col gap-4 text-lg'>
            <li>
              <Link
                title='Trang chủ VTruyen'
                to={PATH.home}
                className={`hover:text-primary text-center block capitalize ${
                  useMatch(PATH.home) && ' text-primary'
                }`}
              >
                Trang chủ
              </Link>
            </li>
            <li>
              <Link
                title='Tất cả thể loại truyện tranh'
                to={{
                  pathname: PATH.genres,
                  search: createSearchParams({
                    type: 'all',
                    page: '1'
                  }).toString()
                }}
                className={`hover:text-primary text-center block capitalize ${
                  useMatch(PATH.genres) && ' text-primary'
                }`}
              >
                Thể loại
              </Link>
            </li>
            <li>
              <Link
                title='Truyện tranh mới nhất'
                to={{
                  pathname: PATH.new,
                  search: createSearchParams({
                    status: 'all',
                    page: '1'
                  }).toString()
                }}
                className={`hover:text-primary text-center block capitalize ${
                  useMatch(PATH.new) && ' text-primary'
                }`}
              >
                mới
              </Link>
            </li>
            <li>
              <Link
                title='Bảng xếp hạng truyện tranh'
                to={{
                  pathname: PATH.top,
                  search: createSearchParams({
                    status: 'all',
                    page: '1'
                  }).toString()
                }}
                className={`hover:text-primary text-center block capitalize ${
                  isMatchTop && ' text-primary'
                }`}
              >
                BXH
              </Link>
            </li>
            <li>
              <NavLink
                to={{
                  pathname: PATH.recent,
                  search: createSearchParams({
                    page: '1'
                  }).toString()
                }}
                className={({ isActive }) =>
                  `capitalize block hover:text-primary text-center ${isActive && ' text-primary'}`
                }
              >
                Mới cập nhật
              </NavLink>
            </li>
            <li>
              <NavLink
                to={{
                  pathname: PATH.popular,
                  search: createSearchParams({
                    page: '1'
                  }).toString()
                }}
                className={({ isActive }) =>
                  `capitalize block hover:text-primary text-center ${isActive && ' text-primary'}`
                }
              >
                nổi bật
              </NavLink>
            </li>
            <li>
              <NavLink
                to={{
                  pathname: PATH.completed,
                  search: createSearchParams({
                    page: '1'
                  }).toString()
                }}
                className={({ isActive }) =>
                  `capitalize block hover:text-primary text-center ${isActive && ' text-primary'}`
                }
              >
                đã hoàn thành
              </NavLink>
            </li>
            {/* <li>
              <NavLink
                to={{
                  pathname: PATH.boy,
                  search: createSearchParams({
                    page: '1'
                  }).toString()
                }}
                className={({ isActive }) =>
                  `capitalize block hover:text-primary text-center ${isActive && ' text-primary'}`
                }
              >
                con trai
              </NavLink>
            </li> */}
            {/* <li>
              <NavLink
                to={{
                  pathname: PATH.girl,
                  search: createSearchParams({
                    page: '1'
                  }).toString()
                }}
                className={({ isActive }) =>
                  `capitalize block hover:text-primary text-center ${isActive && ' text-primary'}`
                }
              >
                con gái
              </NavLink>
            </li> */}
          </ul>
          <div className='flex items-center justify-center mt-4 gap-4'>
            <Link
              to={PATH.history}
              className='flex flex-col items-center px-3 py-1 rounded-md hover:text-primary'
            >
              <HistoryIcon />
            </Link>
            {localStorage.theme !== 'light' ? (
              <button
                onClick={() => {
                  handleChangeTheme('light')
                  setOpenNav(false)
                }}
                className='active:scale-90 rounded-md py-1 px-3'
              >
                <DarkOrLightIcon />
              </button>
            ) : (
              <button
                onClick={() => {
                  handleChangeTheme('dark')
                  setOpenNav(false)
                }}
                className='active:scale-90 rounded-md py-1 px-3'
              >
                <DarkIcon />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Header

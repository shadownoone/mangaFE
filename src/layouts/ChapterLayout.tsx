import { Footer, Header, ScrollToTop, SearchBar } from '@/components'
import { useMediaQuery } from 'react-responsive'
import { Outlet } from 'react-router-dom'

const ChapterLayout = () => {
  const isMobileMini = useMediaQuery({ maxWidth: 639 })

  return (
    <>
      <header>
        <Header />
      </header>
      <main>
        {/* Nếu là Mobile thì ấn thanh tìm kiếm */}
        {!isMobileMini && <SearchBar />}
        <Outlet />
        <div className='hidden md:block'>
          {/* Nếu là Mobile thì ko có scroll */}
          <ScrollToTop />
        </div>
      </main>
      <Footer />
    </>
  )
}

export default ChapterLayout

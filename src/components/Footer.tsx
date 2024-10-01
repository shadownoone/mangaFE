import { APIIcon, FacebookIcon, GithubIcon } from './Icon'

const Footer = () => {
  return (
    <footer className='bg-gray-200 dark:bg-gray-800 mt-20'>
      <div className='container space-y-8 overflow-hidden py-12'>
        <div className='flex justify-center mt-8 space-x-4'>
          <a
            href=''
            rel='noopener noreferrer'
            target='_blank'
            className='text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200'
          >
            <span className='sr-only'>Facebook</span>
            <FacebookIcon />
          </a>
          <a
            href=''
            rel='noopener noreferrer'
            target='_blank'
            className='text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200'
          >
            <span className='sr-only'>GitHub</span>
            <GithubIcon />
          </a>
          <a
            href=''
            rel='noopener noreferrer'
            target='_blank'
            className='text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200'
          >
            <span className='sr-only'>API</span>
            <APIIcon />
          </a>
        </div>
        <p className='mt-8 text-base leading-6 text-center text-gray-500 dark:text-gray-300'>
          © 2024 VTruyen™. Do Tien Tai.
        </p>
      </div>
    </footer>
  )
}

export default Footer

import classNames from 'classnames'
import { useState, useRef, useEffect } from 'react'

import imgLoading from '/loading.gif'
import avatarUser from '../../assets/img/avatarUser.webp'

import { getCommentByManga, addComment, deleteComment } from '@/services/commentService/index'
import { getCurrentUser } from '@/services/userService/getUser'
import { CommentIcon, DeleteIcon, LeftArrowIcon, LikeIcon, RightArrowIcon } from './Icon'
import { comicsComment } from '@/types/data'
import { timeAgo } from '@/utils/formatNumber'

const ListComment = ({ manga_id, chapter_id }: { manga_id: any; chapter_id?: any }) => {
  const [comment, setComment] = useState<comicsComment[]>([])
  const el = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState<number>(1)
  const [loading, setLoading] = useState(true) // Track loading state
  const [error, setError] = useState(false) // Track error state
  const [newComment, setNewComment] = useState('')
  const [currentUsers, setCurrentUsers] = useState<any>(null)

  const commentsPerPage = 7

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser()
        setCurrentUsers(user.data)
        console.log(user.data)
      } catch (error) {
        console.error('Error fetching current user:', error)
      }
    }
    fetchCurrentUser()
  }, [])
  // Reset page when manga_id changes
  useEffect(() => {
    setPage(1)
  }, [manga_id, chapter_id])

  // Fetch comments based on manga_id and page
  useEffect(() => {
    const fetchComment = async () => {
      setLoading(true) // Start loading
      setError(false) // Reset error state

      try {
        const response = await getCommentByManga(manga_id)
        setComment(response.data) // Store fetched comments
        console.log(response.data)
      } catch (error) {
        console.error('Lỗi khi lấy bình luận:', error)
        setError(true) // Set error state on failure
      } finally {
        setLoading(false) // Stop loading after API call completes
      }
    }

    if (manga_id) {
      fetchComment()
    }
  }, [manga_id, chapter_id, page]) // Refetch comments if manga_id or page changes

  // Pagination logic
  const indexOfLastComment = page * commentsPerPage
  const indexOfFirstComment = indexOfLastComment - commentsPerPage
  const currentComments = comment.slice(indexOfFirstComment, indexOfLastComment)
  const totalPages = Math.ceil(comment.length / commentsPerPage)

  const PrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1)
    }
    if (el.current) {
      window.scroll({
        behavior: 'smooth',
        top: el.current.offsetTop
      })
    }
  }

  const NextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1)
    }
    if (el.current) {
      window.scroll({
        behavior: 'smooth',
        top: el.current.offsetTop
      })
    }
  }
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent default form submission

    try {
      //       const currentUser = await getCurrentUser()
      //
      //       if (!currentUser) {
      //         console.log('Bạn phải đăng nhập để bình luận')
      //         return
      //       }
      // Add comment API call
      await addComment(manga_id, newComment, chapter_id || undefined)

      setNewComment('') // Clear input after submission
    } catch (error) {
      console.error('Lỗi khi thêm bình luận:', error)
    }
  }

  const handleDeleteComment = async (commentId: any) => {
    try {
      await deleteComment(commentId)
    } catch (error) {
      console.error('Error removing comment:', error)
    }
  }

  return (
    <div className='w-full h-full' ref={el}>
      <div className='border dark:border-gray-500'>
        <div className='flex items-center justify-between p-5'>
          <h3 className='flex items-center gap-3 text-primary capitalize text-lg'>
            Bình luận ({comment.length}) {/* Sum Comments */}
          </h3>
          <div className={classNames('flex items-center gap-2')}>
            <span className='text-gray-400 text-md'>
              {/* <strong className='text-primary'>{page}</strong>/{dataComment?.total_pages} */}
            </span>
            <div className='flex items-center gap-2'>
              <button
                title='Trước'
                onClick={PrevPage}
                className={classNames(
                  'px-[10px] py-2 rounded-md border dark:border-gray-500 flex justify-center active:scale-95',
                  {
                    'opacity-80 cursor-default text-gray-400': page === 1,
                    'hover:border-primary hover:text-primary dark:text-white dark:hover:border-primary dark:hover:text-primary':
                      page !== 1
                  }
                )}
              >
                <LeftArrowIcon className='w-3 h-3' />
              </button>
              <button
                title='Sau'
                onClick={NextPage}
                // Add pagination logic for next page here
                className={classNames(
                  'px-[10px] py-2 rounded-md border dark:border-gray-500 flex justify-center active:scale-95',
                  'opacity-80 cursor-default text-gray-400 hover:border-primary hover:text-primary dark:text-white dark:hover:border-primary dark:hover:text-primary'
                )}
              >
                <RightArrowIcon className='w-3 h-3' />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='p-5 border border-t-0 dark:border-gray-500'>
        {/* Form để người dùng viết bình luận */}
        <form onSubmit={handleSubmitComment} className='mb-5 flex gap-3'>
          <input
            type='text'
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder='Viết bình luận của bạn...'
            className='flex-1 p-2 border dark:border-gray-500 rounded-md'
          />
          <button type='submit' className='px-4 py-2 bg-primary text-white rounded-md'>
            Gửi
          </button>
        </form>

        {loading ? (
          // Loading indicator
          <div className='h-[300px] border-b dark:border-gray-500 mb-5 border-dashed flex items-center justify-center gap-2'>
            <img src={imgLoading} alt='loading' loading='lazy' />
            <span className='text-gray-400'>Loading...</span>
          </div>
        ) : error ? (
          // Error message
          <div className='h-[100px] dark:border-gray-500 border-b mb-5 border-dashed flex items-center justify-center gap-2'>
            <span className='text-gray-400'>Không tìm thấy bình luận</span>
          </div>
        ) : comment.length === 0 ? (
          // No comments available
          <div className='h-[100px] dark:border-gray-500 border-b mb-5 border-dashed flex items-center justify-center gap-2'>
            <span className='text-gray-400'>Không có bình luận</span>
          </div>
        ) : (
          // Render fetched comments

          <ul>
            {currentComments.map((item, i) => (
              <li key={i}>
                <div className='flex gap-[10px] pb-5'>
                  <img
                    src={item.user?.avatar || avatarUser}
                    alt='avatar'
                    className='flex-shrink-0 w-[38px] h-[38px] md:w-[50px] md:h-[50px] object-cover rounded-full'
                    loading='lazy'
                  />
                  <div className='flex-1 border-b border-dashed dark:border-gray-500 pb-6 overflow-hidden'>
                    <span className='mt-1 font-semibold text-black dark:text-white'>
                      {item.user?.username}
                    </span>
                    {item.chapter && (
                      <span className='ml-3 text-sm text-primary'>{item.chapter.title}</span>
                    )}
                    <p className='mt-3 text-black/80 dark:text-gray-300 break-all'>
                      {item.content}
                    </p>
                    <div className='flex items-center justify-between mt-7'>
                      <span className='text-gray-500 text-sm'>{timeAgo(item.createdAt)}</span>
                      <div className='flex items-center gap-4 text-gray-500 text-md'>
                        <div className='flex items-center'>
                          <LikeIcon className='w-[22px] h-[22px]' />
                          {/* Add like count if applicable */}
                        </div>
                        <div className='flex items-center'>
                          <CommentIcon className='w-5 h-5 mr-[2px]' />
                          {/* Add reply count if applicable */}
                        </div>

                        {currentUsers?.user_id === item.user_id && (
                          <div
                            className='flex items-center cursor-pointer'
                            onClick={() => handleDeleteComment(item.comment_id)}
                          >
                            <DeleteIcon className='w-5 h-5 mr-[2px]' />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default ListComment

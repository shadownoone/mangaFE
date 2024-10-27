import classNames from 'classnames'
import { useState, useRef, useEffect } from 'react'

import imgLoading from '/loading.gif'
import avatarUser from '../../assets/img/avatarUser.webp'
import Picker from '@emoji-mart/react'

import { CKEditor } from '@ckeditor/ckeditor5-react'
import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo } from 'ckeditor5'

import parser from 'html-react-parser'

import 'ckeditor5/ckeditor5.css'
import 'ckeditor5-premium-features/ckeditor5-premium-features.css'

import { getCommentByManga, addComment, deleteComment } from '@/services/commentService/index'

import { CommentIcon, DeleteIcon, LeftArrowIcon, LikeIcon, RightArrowIcon } from './Icon'
import { comicsComment } from '@/types/data'
import { timeAgo } from '@/utils/formatNumber'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/store'
import { toast } from 'react-toastify'

const ListComment = ({ manga_id, chapter_id }: { manga_id: any; chapter_id?: any }) => {
  const [comment, setComment] = useState<comicsComment[]>([])
  const el = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState<number>(1)
  const [loading, setLoading] = useState(true) // Track loading state
  const [error, setError] = useState(false) // Track error state
  const [newComment, setNewComment] = useState('')
  const [showStickerPicker, setShowStickerPicker] = useState(false)
  // const [currentUsers, setCurrentUsers] = useState<any>(null)
  const currentUser = useSelector((state: RootState) => state.user.currentUser)

  const commentsPerPage = 7

  // Fetch comments based on manga_id and page
  useEffect(() => {
    const fetchComment = async () => {
      setLoading(true) // Start loading
      setError(false) // Reset error state

      try {
        const response = await getCommentByManga(manga_id)
        setComment(response.data) // Store fetched comments
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
      if (!currentUser) {
        toast.warning('Bạn phải đăng nhập để bình luận')
        return
      }
      // Add comment API call
      await addComment(manga_id, newComment, chapter_id || undefined)

      const newCommentClone = {
        manga_id: manga_id,
        user_id: currentUser?.user_id,

        user: currentUser,
        chapter_id: chapter_id,
        content: newComment
      }
      const newListComment: any[] = [newCommentClone, ...comment]
      console.log('🚀 ~ handleSubmitComment ~ comment:', comment)

      setComment(newListComment)
      setNewComment('') // Clear input after submission
    } catch (error) {
      console.error('Lỗi khi thêm bình luận:', error)
    }
  }

  const handleDeleteComment = async (commentId: any) => {
    try {
      await deleteComment(commentId)
      const newListComment = comment.filter((c) => c.comment_id !== commentId)
      setComment(newListComment)
    } catch (error) {
      console.error('Error removing comment:', error)
    }
  }
  const handleStickerSelect = (sticker: any) => {
    const stickerImg = `<img src="${sticker.url}" alt="${sticker.id}" style="width: 50px; height: 50px;" />`
    setNewComment((prev) => prev + stickerImg) // Chèn sticker vào nội dung CKEditor
    setShowStickerPicker(false) // Ẩn Sticker Picker sau khi chọn
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
        <div className='mb-5'>
          <CKEditor
            editor={ClassicEditor}
            data={newComment} // Dữ liệu khởi tạo
            onChange={(_, editor) => {
              const data = editor.getData() // Lấy dữ liệu từ CKEditor
              setNewComment(data) // Cập nhật state
            }}
            config={{
              toolbar: {
                items: ['undo', 'redo', '|', 'bold', 'italic']
              },
              plugins: [Bold, Essentials, Italic, Mention, Paragraph, Undo]
            }}
          />
          <button
            onClick={() => setShowStickerPicker(!showStickerPicker)}
            className='mt-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-200'
          >
            Chọn Sticker
          </button>

          {/* Hiển thị Sticker Picker */}
          {showStickerPicker && <Picker onSelect={handleStickerSelect} />}

          <button
            onClick={handleSubmitComment} // Gọi hàm gửi khi nhấn nút
            className='mt-3 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition duration-200'
          >
            Gửi
          </button>
        </div>

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
                      {parser(item.content)}
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

                        {currentUser?.user_id === item.user_id && (
                          <div
                            className='flex items-center cursor-pointer'
                            onClick={() => handleDeleteComment(item.comment_id)}
                          >
                            <DeleteIcon className='w-5 h-5 mr-[2px]' />
                          </div>
                        )}
                      </div>
                    </div>
                    {/* {replies?.length > 0 &&
                      replies.map((itemReply: any, i) => (
                        <div
                          key={i}
                          className='mt-4 p-3 lg:p-5 flex gap-[10px] bg-[#f8f8f8] dark:bg-gray-800 rounded-[10px]'
                        >
                          <img
                            src={itemReply.avatar}
                            alt='avatar'
                            className='flex-shrink-0 w-[38px] h-[38px] md:w-[50px] md:h-[50px] object-cover rounded-full'
                            loading='lazy'
                            // onError={({ currentTarget }) => {
                            //   currentTarget.onerror = null
                            //   currentTarget.src = avatarError
                            // }}
                          />
                          <div className='flex-1 overflow-auto'>
                            <span className='mt-1 block text-black dark:text-white'>
                              {itemReply.username}
                            </span>
                            <p className='mt-3 text-black/80 dark:text-gray-300 break-all'>
                              <strong className='text-primary/60 dark:text-primary/80 mr-1'>
                                {itemReply.mention_user}
                              </strong>
                              {itemReply.content}
                            </p>
                            {itemReply.stickers.length > 0 && (
                              <img src={itemReply.stickers[0]} alt='sticker' loading='lazy' />
                            )}
                            <div className='flex items-center justify-between mt-7'>
                              <span className='text-gray-500 text-sm'>{itemReply.created_at}</span>
                              <div className='hidden sm:flex items-center gap-4 text-gray-500 text-md'>
                                <div className='flex items-center'>
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    xmlnsXlink='http://www.w3.org/1999/xlink'
                                    aria-hidden='true'
                                    className='w-[22px] h-[22px]'
                                    viewBox='0 0 24 24'
                                  >
                                    <g fill='none'>
                                      <path
                                        fill='currentColor'
                                        d='m15 10l-.493-.082A.5.5 0 0 0 15 10.5V10ZM4 10v-.5a.5.5 0 0 0-.5.5H4Zm16.522 2.392l.49.098l-.49-.098ZM6 20.5h11.36v-1H6v1Zm12.56-11H15v1h3.56v-1Zm-3.067.582l.806-4.835l-.986-.165l-.806 4.836l.986.164ZM14.82 3.5h-.213v1h.213v-1Zm-3.126 1.559L9.178 8.832l.832.555l2.515-3.774l-.832-.554ZM7.93 9.5H4v1h3.93v-1ZM3.5 10v8h1v-8h-1Zm16.312 8.49l1.2-6l-.98-.196l-1.2 6l.98.196ZM9.178 8.832A1.5 1.5 0 0 1 7.93 9.5v1a2.5 2.5 0 0 0 2.08-1.113l-.832-.555Zm7.121-3.585A1.5 1.5 0 0 0 14.82 3.5v1a.5.5 0 0 1 .494.582l.986.165ZM18.56 10.5a1.5 1.5 0 0 1 1.471 1.794l.98.196a2.5 2.5 0 0 0-2.45-2.99v1Zm-1.2 10a2.5 2.5 0 0 0 2.452-2.01l-.98-.196A1.5 1.5 0 0 1 17.36 19.5v1Zm-2.754-17a3.5 3.5 0 0 0-2.913 1.559l.832.554a2.5 2.5 0 0 1 2.08-1.113v-1ZM6 19.5A1.5 1.5 0 0 1 4.5 18h-1A2.5 2.5 0 0 0 6 20.5v-1Z'
                                      />
                                      <path stroke='currentColor' d='M8 10v10' />
                                    </g>
                                  </svg>
                                  {itemReply.vote_count}
                                </div>
                                <div className='flex items-center'>
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                    className='w-5 h-5 mr-[2px]'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      d='M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z'
                                    />
                                  </svg>
                                  0
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))} */}
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

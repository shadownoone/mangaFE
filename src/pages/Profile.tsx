import { getCurrentUser } from '@/services/userService/getUser'
import {
  updateProfile,
  uploadMultipleImages,
  uploadSingleImage
} from '@/services/userService/updateUser'
import PATH from '@/utils/path'
import avatarUser from '../../assets/img/avatarUser.webp'
import assets from '../../assets/img/assets.gif'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ModalImage from 'react-modal-image'
import { CrownIcon } from '@/components/Icon'

interface UserProfile {
  avatar: string
  username: string
  email: string
  role: number
  bio?: string
  is_vip: any
}

const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [editMode, setEditMode] = useState<boolean>(false)
  const [newUsername, setNewUsername] = useState<string>('')

  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState('')

  const convertBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)

      fileReader.onload = () => {
        resolve(fileReader.result)
      }

      fileReader.onerror = (error) => {
        reject(error)
      }
    })
  }

  const uploadImage = async (event: any) => {
    const files = event.target.files
    console.log(files.length)

    if (files.length === 1) {
      const base64 = await convertBase64(files[0])

      try {
        setLoading(true) // Set loading to true before the upload starts
        const uploadedUrl = await uploadSingleImage(base64) // Call your upload function
        setUrl(uploadedUrl) // Set the returned URL
        alert('Image uploaded successfully')
      } catch (error) {
        console.error('Error uploading image:', error)
      } finally {
        setLoading(false) // Set loading to false after the upload finishes
      }

      return
    }

    const base64s = []
    for (var i = 0; i < files.length; i++) {
      var base = await convertBase64(files[i])
      base64s.push(base)
    }
    try {
      setLoading(true) // Start loading
      const uploadedUrls = await uploadMultipleImages(base64s) // Call the service for multiple images
      setUrl(uploadedUrls) // Set the returned URLs after the upload
      alert('Images uploaded successfully')
    } catch (error) {
      console.error('Error uploading multiple images:', error)
    } finally {
      setLoading(false) // End loading after the request finishes
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      const response = await getCurrentUser()
      if (response.code === 0) {
        setUser(response.data)
        setNewUsername(response.data.username)
      }
    }

    fetchUser()
  }, [])

  const handleEditClick = () => {
    setEditMode(true)
  }

  const handleSave = async () => {
    try {
      const updateData = new FormData() // Use FormData for file handling

      updateData.append('username', newUsername)
      if (url) {
        updateData.append('avatar', url) // Add the uploaded avatar URL to FormData
      }

      const response = await updateProfile(updateData)

      if (response.code === 0) {
        setUser(
          (prev) =>
            prev && {
              ...prev,
              username: newUsername,
              avatar: url
            }
        )
        setEditMode(false)
      } else {
        console.error('Failed to update profile:', response.message)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  if (!user) return <p>Loading...</p>

  return (
    <div className='container mx-auto my-8 p-4'>
      <div className='bg-white shadow-lg rounded-lg overflow-hidden'>
        <div className='flex items-center p-6 bg-gray-800 text-white'>
          {loading ? (
            <img src={assets} alt='Uploading...' className='w-32 h-32' /> // Show loading GIF
          ) : (
            <div className='relative inline-block'>
              <ModalImage
                className='w-32 h-32 rounded-full object-cover border-white p-2 avatar-gradient'
                small={url ? url : user.avatar ? user.avatar : avatarUser} // Small version of the image
                large={url ? url : user.avatar ? user.avatar : avatarUser} // Large version when clicked
                alt='Avatar'
              />
              {user.is_vip === 1 && ( // Kiểm tra nếu người dùng là VIP
                <div
                  className='absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                  style={{ top: '-10px' }} // Đặt vương miện lên cao hơn 10px
                >
                  <CrownIcon className='w-8 h-8' />
                </div>
              )}
            </div>
          )}
          <div className='ml-6'>
            <h2 className='text-3xl font-semibold'>
              {user.username} {''}
              <span className='font-bold text-xl animated-text'>VIP</span>
            </h2>
            <p className='text-gray-300'>{user.email}</p>
            <p className='mt-2'>{user.bio}</p>
          </div>
        </div>

        <div className='border-t flex justify-center space-x-8 p-4 bg-gray-100'>
          <Link
            to={`${PATH.profile}`}
            className='px-4 py-2 text-gray-700 hover:bg-gray-200 rounded'
          >
            Thông tin cá nhân
          </Link>
          <Link
            to={`${PATH.favorite}`}
            className='px-4 py-2 text-gray-700 hover:bg-gray-200 rounded'
          >
            Danh sách truyện
          </Link>
          <Link
            to={`${PATH.history}`}
            className='px-4 py-2 text-gray-700 hover:bg-gray-200 rounded'
          >
            Lịch sử đọc
          </Link>
        </div>
      </div>

      <div className='my-6'>
        <div className='bg-white p-4 shadow rounded-lg'>
          <h3 className='text-xl font-bold mb-4'>Thông tin cá nhân</h3>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Tên đăng nhập:</label>
              {editMode ? (
                <input
                  type='text'
                  className='w-full border-gray-300 rounded-md p-2 mt-1'
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
              ) : (
                <input
                  type='text'
                  className='w-full border-gray-300 rounded-md p-2 mt-1'
                  value={user.username}
                  readOnly
                />
              )}
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Email:</label>
              <input
                type='email'
                className='w-full border-gray-300 rounded-md p-2 mt-1'
                value={user.email}
                readOnly // Email is now always read-only
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Avatar:</label>
              {editMode ? (
                <input
                  type='file'
                  className='w-full border-gray-300 rounded-md p-2 mt-1'
                  onChange={uploadImage}
                />
              ) : (
                <img
                  src={user.avatar ? user.avatar : avatarUser}
                  alt='Avatar'
                  className='w-16 h-16 rounded-full'
                />
              )}
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Tiểu sử:</label>
              <textarea
                className='w-full border-gray-300 rounded-md p-2 mt-1'
                value={user.bio}
                readOnly
              />
            </div>
          </div>

          <div className='mt-4'>
            {editMode ? (
              <>
                <button
                  className='px-4 py-2 bg-blue-500 text-white rounded mr-2'
                  onClick={handleSave}
                >
                  Lưu
                </button>
                <button
                  className='px-4 py-2 bg-gray-300 text-black rounded'
                  onClick={() => setEditMode(false)}
                >
                  Hủy
                </button>
              </>
            ) : (
              <button
                className='px-4 py-2 bg-green-500 text-white rounded'
                onClick={handleEditClick}
              >
                Chỉnh sửa
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

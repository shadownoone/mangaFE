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
import { toast } from 'react-toastify'
import { calculateDaysLeft } from '@/utils/formatNumber'
import { UserProfile } from '@/types/data'

// Component con cho hiển thị thông tin người dùng
const UserInfo = ({ user }: { user: UserProfile }) => (
  <div className='ml-6 text-left'>
    <h2 className='text-3xl font-semibold flex items-center space-x-2'>
      <span>{user.username}</span>
      {user.is_vip === 1 && (
        <>
          <span className='font-bold text-xl animated-text'>VIP</span>
          <span className='text-sm font-medium text-gray-500'>
            (VIP còn {calculateDaysLeft(user.vip_expiration)} ngày)
          </span>
        </>
      )}
    </h2>
    <p className='text-gray-400'>{user.email}</p>
    <p className='mt-2'>{user.bio}</p>
  </div>
)

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
      fileReader.onload = () => resolve(fileReader.result)
      fileReader.onerror = (error) => reject(error)
    })
  }

  const uploadImage = async (event: any) => {
    const files = event.target.files
    const base64 = await convertBase64(files[0])

    try {
      setLoading(true)
      const uploadedUrl = await uploadSingleImage(base64)
      setUrl(uploadedUrl)
      toast.success('Upload ảnh thành công')
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setLoading(false)
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

  const handleSave = async () => {
    try {
      const updateData = new FormData()
      updateData.append('username', newUsername)
      if (url) {
        updateData.append('avatar', url)
      }

      const response = await updateProfile(updateData)

      if (response.code === 0) {
        setUser((prev: any) => (prev ? { ...prev, username: newUsername, avatar: url } : prev))
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
          <div className='relative inline-block'>
            {loading ? (
              <img src={assets} alt='Uploading...' className='w-32 h-32' />
            ) : (
              <ModalImage
                className='w-32 h-32 rounded-full object-cover border-white p-2 avatar-gradient'
                small={url ? url : user.avatar ? user.avatar : avatarUser}
                large={url ? url : user.avatar ? user.avatar : avatarUser}
                alt='Avatar'
              />
            )}
            {user.is_vip === 1 && (
              <div className='absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <CrownIcon className='w-8 h-8' />
              </div>
            )}
          </div>
          <UserInfo user={user} />
        </div>

        {/* Thanh điều hướng */}
        <div className='border-t flex justify-center space-x-8 p-4 bg-gray-100'>
          <Link to={PATH.profile} className='px-4 py-2 text-gray-700 hover:bg-gray-200 rounded'>
            Thông tin cá nhân
          </Link>
          <Link to={PATH.favorite} className='px-4 py-2 text-gray-700 hover:bg-gray-200 rounded'>
            Danh sách truyện
          </Link>
          <Link to={PATH.history} className='px-4 py-2 text-gray-700 hover:bg-gray-200 rounded'>
            Lịch sử đọc
          </Link>
        </div>

        {/* Form chỉnh sửa thông tin */}
        <div className='my-6 bg-white p-4 shadow rounded-lg'>
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
                readOnly
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

          {/* Nút chỉnh sửa */}
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
                onClick={() => setEditMode(true)}
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

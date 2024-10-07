import { getCurrentUser } from '@/services/userService/getUser'
import { updateProfile } from '@/services/userService/updateUser'
import PATH from '@/utils/path'
import avatarUser from '../../assets/img/avatarUser.webp'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface UserProfile {
  avatar: string
  username: string
  email: string
  role: number
  bio?: string
}

const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [editMode, setEditMode] = useState<boolean>(false)
  const [newUsername, setNewUsername] = useState<string>('')
  const [newAvatar, setNewAvatar] = useState<File | null>(null) // New avatar

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
      // Assuming newAvatar is a file or image URL
      const updateData = new FormData() // Use FormData for file handling

      updateData.append('username', newUsername)

      if (newAvatar) {
        // Append avatar only if there's a valid newAvatar
        updateData.append('avatar', newAvatar) // newAvatar should be a file or a valid string (URL)
      } else {
        // You can choose to append the current avatar if no new avatar is selected, or leave it out
        updateData.append('avatar', user?.avatar || '') // Send the current avatar or an empty string
      }

      const response = await updateProfile(updateData)

      if (response.code === 0) {
        setUser(
          (prev) =>
            prev && {
              ...prev,
              username: newUsername,
              avatar: newAvatar ? URL.createObjectURL(newAvatar) : prev?.avatar
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
          <img
            className='w-32 h-32 rounded-full object-cover border-4 border-white'
            src={user.avatar ? user.avatar : avatarUser}
            alt='Avatar'
          />
          <div className='ml-6'>
            <h2 className='text-3xl font-semibold'>{user.username}</h2>
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
                  onChange={(e) => setNewAvatar(e.target.files ? e.target.files[0] : null)}
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

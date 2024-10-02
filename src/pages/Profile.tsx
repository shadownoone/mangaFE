import { getCurrentUser } from '@/services/getUser/getUser'
import { updateProfile } from '@/services/getUser/updateUser'
import PATH from '@/utils/path'

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
  const [newUsername, setNewUsername] = useState<string>('') // Tên người dùng mới
  const [newEmail, setNewEmail] = useState<string>('') // Email mới

  // Lấy thông tin người dùng hiện tại khi component mount
  useEffect(() => {
    const fetchUser = async () => {
      const response = await getCurrentUser()
      if (response.code === 0) {
        setUser(response.data)
        setNewUsername(response.data.username)
        setNewEmail(response.data.email)
      }
    }

    fetchUser()
  }, [])

  const handleEditClick = () => {
    setEditMode(true) // Kích hoạt chế độ chỉnh sửa
  }

  const handleSave = async () => {
    try {
      // Dữ liệu cần cập nhật
      const updateData = {
        username: newUsername,
        email: newEmail
      }

      // Gọi API để cập nhật thông tin
      const response = await updateProfile(updateData)
      if (response.code === 0) {
        // Cập nhật lại thông tin người dùng trong state
        setUser((prev) => prev && { ...prev, username: newUsername, email: newEmail })
        setEditMode(false) // Tắt chế độ chỉnh sửa
      } else {
        console.error('Failed to update profile:', response.message)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  if (!user) return <p>Loading...</p> // Hiển thị loading khi dữ liệu chưa có

  return (
    <div className='container mx-auto my-8 p-4'>
      {/* Phần thông tin tổng quát */}
      <div className='bg-white shadow-lg rounded-lg overflow-hidden'>
        <div className='flex items-center p-6 bg-gray-800 text-white'>
          <img
            className='w-32 h-32 rounded-full object-cover border-4 border-white'
            src={user.avatar}
            alt='Avatar'
          />
          <div className='ml-6'>
            <h2 className='text-3xl font-semibold'>{user.username}</h2>
            <p className='text-gray-300'>{user.email}</p>
            <p className='mt-2'>{user.bio}</p>
          </div>
        </div>

        {/* Điều hướng tab */}
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

      {/* Phần chi tiết */}
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
                  onChange={(e) => setNewUsername(e.target.value)} // Cập nhật tên người dùng mới
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
              {editMode ? (
                <input
                  type='email'
                  className='w-full border-gray-300 rounded-md p-2 mt-1'
                  value={newEmail}
                />
              ) : (
                <input
                  type='email'
                  className='w-full border-gray-300 rounded-md p-2 mt-1'
                  value={user.email}
                  readOnly
                />
              )}
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Quyền:</label>
              <input
                type='text'
                className='w-full border-gray-300 rounded-md p-2 mt-1'
                value={user.role}
                readOnly
              />
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
                  onClick={handleSave} // Gọi hàm lưu thay đổi
                >
                  Lưu
                </button>
                <button
                  className='px-4 py-2 bg-gray-300 text-black rounded'
                  onClick={() => setEditMode(false)} // Hủy bỏ chỉnh sửa
                >
                  Hủy
                </button>
              </>
            ) : (
              <button
                className='px-4 py-2 bg-green-500 text-white rounded'
                onClick={handleEditClick} // Bật chế độ chỉnh sửa
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

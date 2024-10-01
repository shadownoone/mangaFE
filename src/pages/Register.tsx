import React, { useState } from 'react'
import { FaGoogle, FaFacebook } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import PATH from '@/utils/path' // Đảm bảo rằng PATH được cấu hình đúng

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()

    // Kiểm tra mật khẩu và mật khẩu nhập lại có khớp nhau hay không
    if (password !== confirmPassword) {
      setError('Passwords do not match!')
      return
    }
    // Xử lý đăng ký tại đây
    setError('') // Xóa lỗi nếu có
    console.log('Username:', username)
    console.log('Email:', email)
    console.log('Password:', password)
  }

  const handleGoogleRegister = () => {
    // Logic đăng ký bằng Google
    console.log('Google register clicked')
  }

  const handleFacebookRegister = () => {
    // Logic đăng ký bằng Facebook
    console.log('Facebook register clicked')
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
        <h2 className='text-2xl font-bold text-gray-800 text-center mb-6'>Sign Up</h2>
        <form onSubmit={handleRegister}>
          <div className='mb-4'>
            <label htmlFor='username' className='block text-gray-700 font-medium mb-2'>
              Username
            </label>
            <input
              id='username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200'
              placeholder='Enter your username'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='email' className='block text-gray-700 font-medium mb-2'>
              Email
            </label>
            <input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200'
              placeholder='Enter your email'
              required
            />
          </div>
          <div className='mb-6'>
            <label htmlFor='password' className='block text-gray-700 font-medium mb-2'>
              Password
            </label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200'
              placeholder='Enter your password'
              required
            />
          </div>

          <div className='mb-4'>
            <label htmlFor='confirmPassword' className='block text-gray-700 font-medium mb-2'>
              Confirm Password
            </label>
            <input
              id='confirmPassword'
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200'
              placeholder='Re-enter your password'
              required
            />
          </div>

          {/* Hiển thị lỗi nếu mật khẩu không khớp */}
          {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}

          <button
            type='submit'
            className='w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'
          >
            Sign Up
          </button>
        </form>

        <div className='flex items-center my-4'>
          <hr className='w-full border-gray-300' />
          <span className='px-2 text-gray-500'>or</span>
          <hr className='w-full border-gray-300' />
        </div>

        <div className='flex justify-between'>
          <button
            onClick={handleGoogleRegister}
            className='flex items-center justify-center w-1/2 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400'
          >
            <FaGoogle className='mr-2' /> Google
          </button>
          <button
            onClick={handleFacebookRegister}
            className='flex items-center justify-center w-1/2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 ml-2'
          >
            <FaFacebook className='mr-2' /> Facebook
          </button>
        </div>

        <p className='text-sm text-center text-gray-600 mt-4'>
          Already have an account?{' '}
          <Link to={`${PATH.login}`} className='text-indigo-600 hover:underline'>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register

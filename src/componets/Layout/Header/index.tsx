import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { useRouter } from 'next/router'
import { clearUser } from '@/redux/features/user/userSlice'
import { handleSignOut } from '@/lib/firebase'
import React from 'react'

const Header = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.user.user)

  const handleSignOutClick = async () => {
    try {
      await handleSignOut()
      dispatch(clearUser())
      router.push('/auth')
    } catch (error) {
      console.error('Ошибка при выходе:', error)
    }
  }

  if (!user) return null

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Кирюшин кинопоиск
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user.email}
            </span>
            <button
              onClick={handleSignOutClick}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
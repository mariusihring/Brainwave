import { useAuth } from '@/auth'
import { createFileRoute,useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/_authenticated')({
  component: () => {
  const navigate = useNavigate()
  async function checkAuth() {
    let auth = await useAuth()
    console.log(auth)
    if (!auth.session || !auth.user) {
      navigate({to:  "/login"})
    }
  }
  useEffect(() => {
    checkAuth()
  }, [])
  
  return <div>Hello /_authenticated!</div>}
})
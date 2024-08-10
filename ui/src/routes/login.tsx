import Login from '@/components/brainwave/misc/login'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: () => <LoginComponent />
})


function LoginComponent() {
  return (
    <div className='flex w-screen h-screen items-center justify-center '>
        <Login />
    </div>
  )
}
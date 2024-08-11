import { createRootRoute,  Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Session, User } from 'lucia'

interface RouterContext {
  auth: {
    session: Session
    user: User
  }
}


export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})

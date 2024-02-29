import { Outlet } from "@remix-run/react"

function ContactsRoute() {
  return (
    <div>
        <h1>Layout for contacts route</h1>
        <Outlet />
    </div>
  )
}

export default ContactsRoute

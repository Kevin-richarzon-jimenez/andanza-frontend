import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import ServerStatusBanner from './ServerStatusBanner.jsx'

function Layout() {
  return (
    <>
      <Header />
      <ServerStatusBanner />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default Layout

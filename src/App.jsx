import { lazy } from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import AccountLayout from './components/AccountLayout.jsx'
import AuthLayout from './components/AuthLayout.jsx'
import AdminLayout from './components/AdminLayout.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import RouteTitle from './components/RouteTitle.jsx'
import RequireAuth from './auth/RequireAuth.jsx'
import RequireAdmin from './auth/RequireAdmin.jsx'
import Home from './pages/Home.jsx'
import Catalog from './pages/Catalog.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import NotFound from './pages/NotFound.jsx'

import Profile from './pages/account/Profile.jsx'
import Addresses from './pages/account/Addresses.jsx'
import AddressForm from './pages/account/AddressForm.jsx'
import Favorites from './pages/account/Favorites.jsx'
import Comments from './pages/account/Comments.jsx'
import Orders from './pages/account/Orders.jsx'
import ChangePassword from './pages/account/ChangePassword.jsx'

import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import ForgotPassword from './pages/auth/ForgotPassword.jsx'

import About from './pages/info/About.jsx'
import Contact from './pages/info/Contact.jsx'
import Faq from './pages/info/Faq.jsx'
import Returns from './pages/info/Returns.jsx'
import Shipping from './pages/info/Shipping.jsx'
import SizeGuide from './pages/info/SizeGuide.jsx'
import Terms from './pages/info/Terms.jsx'

// Las pantallas del panel se descargan solo cuando alguien entra al panel: el resto de los visitantes no las necesita.
const Dashboard = lazy(() => import('./pages/admin/Dashboard.jsx'))
const AdminProducts = lazy(() => import('./pages/admin/Products.jsx'))
const ProductNew = lazy(() => import('./pages/admin/product/ProductNew.jsx'))
const ProductLayout = lazy(() => import('./pages/admin/product/ProductLayout.jsx'))
const ProductGeneral = lazy(() => import('./pages/admin/product/ProductGeneral.jsx'))
const ProductColors = lazy(() => import('./pages/admin/product/ProductColors.jsx'))
const ProductColor = lazy(() => import('./pages/admin/product/ProductColor.jsx'))
const Categories = lazy(() => import('./pages/admin/Categories.jsx'))
const AdminComments = lazy(() => import('./pages/admin/Comments.jsx'))
const Users = lazy(() => import('./pages/admin/Users.jsx'))
const Messages = lazy(() => import('./pages/admin/Messages.jsx'))
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile.jsx'))

function App() {
  return (
    <>
      <ScrollToTop />
      <RouteTitle />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />

          <Route path="/account" element={<RequireAuth><AccountLayout /></RequireAuth>}>
            <Route path="profile" element={<Profile />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="addresses/new" element={<AddressForm />} />
            <Route path="addresses/:id/edit" element={<AddressForm />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="comments" element={<Comments />} />
            <Route path="orders" element={<Orders />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>

          <Route path="/info/about" element={<About />} />
          <Route path="/info/contact" element={<Contact />} />
          <Route path="/info/faq" element={<Faq />} />
          <Route path="/info/returns" element={<Returns />} />
          <Route path="/info/shipping" element={<Shipping />} />
          <Route path="/info/size-guide" element={<SizeGuide />} />
          <Route path="/info/terms" element={<Terms />} />

          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<ProductNew />} />
          <Route path="products/:id" element={<ProductLayout />}>
            <Route index element={<ProductGeneral />} />
            <Route path="colors" element={<ProductColors />} />
            <Route path="colors/:color" element={<ProductColor />} />
          </Route>
          <Route path="products/:id/edit" element={<Navigate to=".." replace relative="path" />} />
          <Route path="categories" element={<Categories />} />
          <Route path="comments" element={<AdminComments />} />
          <Route path="users" element={<Users />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        </Route>
      </Routes>
    </>
  )
}

export default App

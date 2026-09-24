import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import AccountLayout from './components/AccountLayout.jsx'
import AuthLayout from './components/AuthLayout.jsx'
import AdminLayout from './components/AdminLayout.jsx'
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

import Dashboard from './pages/admin/Dashboard.jsx'
import AdminProducts from './pages/admin/Products.jsx'
import ProductForm from './pages/admin/ProductForm.jsx'
import Categories from './pages/admin/Categories.jsx'
import AdminComments from './pages/admin/Comments.jsx'
import Users from './pages/admin/Users.jsx'
import Messages from './pages/admin/Messages.jsx'

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

function App() {
  return (
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

        <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id/edit" element={<ProductForm />} />
          <Route path="categories" element={<Categories />} />
          <Route path="comments" element={<AdminComments />} />
          <Route path="users" element={<Users />} />
          <Route path="messages" element={<Messages />} />
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

      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      </Route>
    </Routes>
  )
}

export default App

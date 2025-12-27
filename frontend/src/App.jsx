import { Routes, Route } from 'react-router-dom'
import HeroSection from "./components/HeroSection"
import Navbar from "./components/Navbar"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import NotFoundPage from './pages/NotFoundPage'
import ProductList from './components/ProductList'
import { useEffect } from 'react'
import { getAuthState } from './features/auth/authThunk'
import { useDispatch } from 'react-redux'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminPage from './pages/AdminPage'
import ProtectRoute from './components/ProtectRoute'
import Cart from './components/Cart'
import Wishlist from './components/Wishlist'
import OtpPage from './pages/OtpPage'
import ProductDetails from './pages/ProductDetails'
import ProfilePage from './pages/ProfilePage'

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAuthState());
  }, [dispatch]);

  return (
    <div className="flex flex-col h-screen">
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        draggable
        hideProgressBar={true}
        newestOnTop
        limit={3}
      />

      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/otp" element={<OtpPage />} />

        <Route path="/" element={<HeroSection />} />

        <Route element={<ProtectRoute />}>
          <Route path="/products" element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route element={<ProtectRoute role="ADMIN" />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>


    </div>
  )
}

export default App

import { Routes, Route } from 'react-router-dom'
import HeroSection from "./components/HeroSection"
import Navbar from "./components/Navbar"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import NotFoundPage from './components/NotFoundPage'
import ProductList from './components/ProductList'
import { useEffect } from 'react'
import { getAuthState } from './features/auth/authThunk'
import { useDispatch, useSelector } from 'react-redux'
import AdminPage from './pages/AdminPage'
import ProtectRoute from './components/ProtectRoute'

function App() {

  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAuthState());
  }, [dispatch]);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/" element={<HeroSection />} />

        <Route element={<ProtectRoute />}>
          <Route path="/products" element={<ProductList />} />
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

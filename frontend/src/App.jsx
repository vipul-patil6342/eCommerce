import { Routes, Route } from 'react-router-dom'
import HeroSection from "./components/HeroSection"
import Navbar from "./components/Navbar"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import NotFoundPage from './components/NotFoundPage'
import ProductList from './components/ProductList'
import ProtectedRoute from './components/ProtectedRoute'
import { useEffect } from 'react'
import { getAuthState } from './features/auth/authThunk'
import { useDispatch } from 'react-redux'

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAuthState());
  },[dispatch]);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/' element={<HeroSection />} />
        <Route path="*" element={<NotFoundPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path='/products' element={<ProductList />} />
        </Route>
      </Routes>

    </div>
  )
}

export default App

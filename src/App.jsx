import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import BuyerHome from './pages/BuyerHome'
import SellerHome from './pages/SellerHome'
import SellerAddCar from './pages/SellerAddCar'
import SellerEditCar from './pages/SellerEditCar'
import CarDetail from './pages/CarDetail'
import Wishlist from './pages/Wishlist'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'
import AiChatbot from './components/AiChatbot'
import Footer from './components/Footer'

function AppLayout() {
  const location = useLocation()
  const hideFooter = ['/login', '/signup'].includes(location.pathname)

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/buyer-home" element={
          <ProtectedRoute allowedRole="buyer"><BuyerHome /></ProtectedRoute>
        } />
        <Route path="/wishlist" element={
          <ProtectedRoute allowedRole="buyer"><Wishlist /></ProtectedRoute>
        } />

        <Route path="/seller-home" element={
          <ProtectedRoute allowedRole="seller"><SellerHome /></ProtectedRoute>
        } />
        <Route path="/seller-add-car" element={
          <ProtectedRoute allowedRole="seller"><SellerAddCar /></ProtectedRoute>
        } />
        <Route path="/seller-edit-car/:id" element={
          <ProtectedRoute allowedRole="seller"><SellerEditCar /></ProtectedRoute>
        } />

        {/* Car detail — accessible to any logged-in user */}
        <Route path="/car/:id" element={
          <ProtectedRoute><CarDetail /></ProtectedRoute>
        } />

        {/* Profile — accessible to any logged-in user */}
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideFooter && <Footer />}
      <AiChatbot />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

export default App
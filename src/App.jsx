import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}

export default App
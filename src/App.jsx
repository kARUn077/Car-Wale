import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import BuyerHome from './pages/BuyerHome'
import SellerHome from './pages/SellerHome'
import SellerAddCar from './pages/SellerAddCar'
import SellerEditCar from './pages/SellerEditCar'
import CarDetail from './pages/CarDetail'
import Wishlist from './pages/Wishlist'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route -> go to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Buyer routes */}
        <Route path="/buyer-home" element={<BuyerHome />} />
        <Route path="/wishlist" element={<Wishlist />} />

        {/* Seller routes */}
        <Route path="/seller-home" element={<SellerHome />} />
        <Route path="/seller-add-car" element={<SellerAddCar />} />
        <Route path="/seller-edit-car/:id" element={<SellerEditCar />} />

        {/* Car detail page */}
        <Route path="/car/:id" element={<CarDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

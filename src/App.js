import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import Home from "./components/BodyComponents/Home.jsx";
import Search from "./components/BodyComponents/Search.jsx";
import Footer from "./components/Footer.jsx";
import Register from "./components/BodyComponents/Register.jsx";
import Login from "./components/BodyComponents/Login.jsx";
import ShoppingCart from "./components/BodyComponents/ShoppingCart.jsx";
import AdminDashboard from "./components/BodyComponents/AdminPanel.jsx";
import OwnerPanel from "./components/BodyComponents/OwnerPanel.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import OwnerProtectedRoute from "./OwnerProtectedRoute.jsx";
import ProductDetail from "./components/BodyComponents/ProductDetail.jsx";
import MyOrders from "./components/BodyComponents/MyOrders.jsx";



const App = () => {
  return (
    <>
      <div className="wrapper">
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/cart" element={<ShoppingCart />} />
            <Route path="/search" element={<Search />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/ProductDetail/:id" element={<ProductDetail />} />
            <Route path="/MyOrders" element={<MyOrders />} />
            <Route path="/AdminDashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/OwnerPanel" element={<OwnerProtectedRoute><OwnerPanel /></OwnerProtectedRoute>} />
            <Route path="*" element={<h1>صفحه مورد نظر یافت نشد</h1>} />
          </Routes>
        </Router>
        <br/>
        <Footer />
      </div>
    </>
  );
};

export default App;

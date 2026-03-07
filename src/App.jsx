import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Analytics from "./pages/Analytics";
import Wishlist from "./pages/Wishlist";

function App() {
  return (
    // ThemeProvider: useContext for global theme + user profile (Exp 5)
    <ThemeProvider>
      {/* CartProvider: useContext for toast notifications */}
      <CartProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/analytics" element={<Analytics />} />
            {/* NEW — Experiment 5 Page */}
            <Route path="/wishlist" element={<Wishlist />} />
          </Routes>
          <Footer />
          <Toast />
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
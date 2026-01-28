import { HashRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "@/app/pages/HomePage";
import { PropertyDetailPage } from "@/app/pages/PropertyDetailPage";
import { ListingsPage } from "@/app/pages/ListingsPage";
import { LoginPage } from "@/app/pages/LoginPage";
import { HostingPage } from "@/app/pages/HostingPage";
import { HostDashboard } from "@/app/pages/HostDashboard";
import { EventsPage } from "@/app/pages/EventsPage";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";

export default function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <AuthProvider>
          <WishlistProvider>
            <HashRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/property/:id" element={<PropertyDetailPage />} />
                <Route path="/listings" element={<ListingsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/hosting" element={<HostingPage />} />
                <Route path="/host-dashboard" element={<HostDashboard />} />
                <Route path="/events" element={<EventsPage />} />
              </Routes>
            </HashRouter>
          </WishlistProvider>
        </AuthProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}

import { HashRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "@/app/pages/HomePage";
import { CurrencyProvider } from "@/context/CurrencyContext";

export default function App() {
  return (
    <CurrencyProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </HashRouter>
    </CurrencyProvider>
  );
}

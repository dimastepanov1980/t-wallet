import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { PasswordPage } from "./pages/PasswordPage";
import { Layout } from "./components/Layout";
import { HomePage } from './pages/HomePage';
import { TopUpPage } from './pages/TopUpPage';
import { CardTransferPage } from './pages/CardTransferPage';
import { MorePage } from './pages/MorePage';
import { AddAccountPage } from './pages/AddAccountPage';
import { NewAccountPage } from './pages/NewAccountPage';
import { NewCardPage } from './pages/NewCardPage';

// Временные компоненты для табов
const PaymentsPage = () => <div className="p-4">Страница платежей</div>;
const CityPage = () => <div className="p-4">Страница города</div>;
const ChatPage = () => <div className="p-4">Страница чата</div>;

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true }}>
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/password" element={<PasswordPage />} />
        
        {/* Защищенные маршруты */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="top-up" element={<TopUpPage />} />
          <Route path="card-transfer" element={<CardTransferPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="city" element={<CityPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="more" element={<MorePage />} />
          <Route path="add-account" element={<AddAccountPage />} />
          <Route path="add-account/new" element={<NewAccountPage />} />
          <Route path="add-card/:accountId" element={<NewCardPage />} />
        </Route>

        {/* Редирект на логин для неизвестных маршрутов */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
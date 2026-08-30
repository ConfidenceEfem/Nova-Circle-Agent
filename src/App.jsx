import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GlobalStyle } from './GlobalStyle';
import { AgentProvider } from './context/AgentContext';
import Nav from './components/Nav';
import StatusRail from './components/StatusRail';
import Dashboard from './pages/Dashboard';
import Watchlist from './pages/Watchlist';
import SignalDetail from './pages/SignalDetail';
import Positions from './pages/Positions';
import History from './pages/History';
import RiskSettings from './pages/RiskSettings';
import Account from './pages/Account';

export default function App() {
  return (
    <AgentProvider>
      <BrowserRouter>
        <GlobalStyle />
        <Nav />
        <StatusRail />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/signal/:ticker" element={<SignalDetail />} />
          <Route path="/positions" element={<Positions />} />
          <Route path="/history" element={<History />} />
          <Route path="/risk" element={<RiskSettings />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </BrowserRouter>
    </AgentProvider>
  );
}

import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ScenariosPage } from './pages/ScenariosPage';
import { PopulationPage } from './pages/PopulationPage';
import { InfluenceGraphPage } from './pages/InfluenceGraphPage';
import { PolicySandboxPage } from './pages/PolicySandboxPage';
import { PsychohistoryPage } from './pages/PsychohistoryPage';
import { ResultsPage } from './pages/ResultsPage';

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/scenarios" element={<ScenariosPage />} />
        <Route path="/population" element={<PopulationPage />} />
        <Route path="/influence-graph" element={<InfluenceGraphPage />} />
        <Route path="/policy-sandbox" element={<PolicySandboxPage />} />
        <Route path="/psychohistory" element={<PsychohistoryPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </AppLayout>
  );
}

export default App;

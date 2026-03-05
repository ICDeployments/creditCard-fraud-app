
import "./App.css";
import "./amplify-config";
import Layout from './pages/Layout';
import MainDashboard from "./pages/MainDashboard";
import { AppProvider } from './context/AppContext';
import './assets/fonts/fonts.css';

function App() {
  return (
    <AppProvider>
      <Layout>
        <MainDashboard />
      </Layout>
    </AppProvider>
  );
}

export default App;
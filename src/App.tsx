import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import TextScan from './pages/TextScan';
import Docs from './pages/Docs';
import ApiReference from './pages/ApiReference';
import PackagePage from './pages/PackagePage';
import CliPage from './pages/CliPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className='min-h-screen bg-slate-50 flex flex-col'>
        <Header />
        <main className='flex-1'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/search' element={<SearchPage />} />
            <Route path='/scan' element={<TextScan />} />
            <Route path='/docs' element={<Docs />} />
            <Route path='/api' element={<ApiReference />} />
            <Route path='/api-docs' element={<ApiReference />} />
            <Route path='/package' element={<PackagePage />} />
            <Route path='/cli' element={<CliPage />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router';
import './App.css'
import Home from './pages/Home';
import Layout from './components/Layout';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App

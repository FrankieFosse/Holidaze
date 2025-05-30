import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Home from './pages/Home';
import Login from './pages/Login';
import Browse from './pages/Browse';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import Create from './pages/Create';
import SingleVenue from './pages/SingleVenue';
import Edit from './pages/Edit';
import Preview from './pages/Preview';
import Booking from './pages/Booking';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/create" element={<Create />} />
        <Route path="/venues/:id" element={<SingleVenue />} />
        <Route path="/venues/edit/:id" element={<Edit />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/booking/:id" element={<Booking />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App

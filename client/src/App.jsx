import React from 'react'
import { Routes, Route } from 'react-router';
import Home from './pages/Home.jsx';
import Profile from './pages/Profile.jsx';
import AddEvent from './pages/AddEvent.jsx';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/events">
          <Route index path='ongoing' element={<h1>first</h1>} />
          <Route index path='history' element={<h1>third</h1>} />
          <Route path='create' element={<AddEvent />} />
          <Route path=':id' element={<h1>second</h1>} />
        </Route>
      </Routes>
    </>
  )
}

export default App
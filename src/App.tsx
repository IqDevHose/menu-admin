import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/button'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import Restaurant from './pages/restaurant'
import Sidebar from './components/Sidebar'
import Category from './pages/category'
import Item from './pages/item'
import CustomerReview from './pages/CustomerReview'
import Rating from './pages/Rating'
import Questions from './pages/Questions'
import Theme from './pages/Theme'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='flex h-screen'>
      <Sidebar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/restaurant' element={<Restaurant />} />
        <Route path='/category' element={<Category />}></Route>
        <Route path='/item' element={<Item />}></Route>
        <Route path='/customerReview' element={<CustomerReview />}></Route>
        <Route path='/rating' element={<Rating />}></Route>
        <Route path='/questions' element={<Questions />}></Route>
        <Route path='/theme' element={<Theme />}></Route>
      </Routes>
    </div>
  )
}

export default App

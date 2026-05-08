import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from './redux/userSlice'
import InterviewPage from './pages/InterviewPage'
import InterviewHistory from './pages/InterviewHistory'
import InterviewReport from './pages/InterviewReport'
import Pricing from './pages/Pricing'

export const serverURL = 'https://ai-interview-v1db.onrender.com'
const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await axios.get(`${serverURL}/api/user/current-user`, {withCredentials:true})
        dispatch(setUserData(result.data.user))
      } catch (error) {
        console.error('Error fetching user:', error)
        dispatch(setUserData(null))
      }
    }
    getUser()
  }, [dispatch])

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/auth' element={<Auth />} />
      <Route path='/interview' element={<InterviewPage />} />
      <Route path='/history' element={<InterviewHistory />} />
      <Route path='/report/:id' element={<InterviewReport />} />
      <Route path='/pricing' element={<Pricing />} />
    </Routes>
  )
}

export default App

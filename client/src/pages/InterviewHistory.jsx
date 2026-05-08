import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverURL } from '../App'
import { FaArrowLeft } from 'react-icons/fa'
import { motion } from 'motion/react'
const InterviewHistory = () => {
    const [interviews, setInterviews] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        const getMyInterviews = async () => {
            try {
                const result = await axios.get(`${serverURL}/api/interview/get-interview`, {withCredentials:true})
                console.log(result.data)
                setInterviews(result.data)
            } catch (error) {
                console.log(error.message)
            }
        }
        getMyInterviews()
    }, [])
    
  return (
    <div className='min-h-screen bg-linear-to-br from-gray-50 to-cyan-100 py-10'>
        <div className='w-[90vw] lg:w-[70vw] max-w-[90%] mx-auto'>
            <div className='mb-10 w-full flex items-start gap-4 flex-wrap'>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => navigate('/')} className='mt-1 p-3 rounded-full bg-white shadow hover:shadow-md transition hover:cursor-pointer'><FaArrowLeft className='text-gray-600' /></motion.button>
                <div>
                    <h1 className='text-3xl font-bold text-gray-800 mb-3'>Interview History</h1>
                    <p className='text-gray-600 mt-2'>
                      Track your past interviews and performance reports
                    </p>
                </div>
            </div>
            {interviews.length === 0 ? <div className='bg-white p-10 rounded-2xl shadow text-center'>
                <p className='text-gray-500'>No Interview found. Start your first Interview!</p>
            </div> 
            
            : <div className='grid gap-3'>
                {interviews.map((item, index) =>(
                   <div key={index} onClick={() => navigate(`/report/${item._id}`)} className='bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100'>
                    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                        <div>
                            <h3 className='text-lg font-semibold text-gray-800'>{item.role}</h3>
                            <p className='text-gray-500 text-sm mt-1'>{item.experience} • {item.mode}</p>
                            <p className='text-xs text-gray-400 mt-2'>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                            })
                            : "Date not available"}</p>
                        </div>
                        <div className='flex items-center gap-6'>
                            <div className='text-right'>
                                <p className='text-xl font-bold text-cyan-600'>{item.finalScore || 0}/10</p>
                                <p className='text-xs text-gray-400'>Overall Score</p>
                            </div>

                            <span className={`px-4 rounded-full text-xs font-medium ${item.status === 'Completed' ? 'bg-cyan-100 text-cyan-800' : 'bg-red-100 text-red-800'} py-2`}>
                                {item.status}
                            </span>
                        </div>
                    </div>
                   </div>
                ))}
                </div>
                }
            </div>
        </div>
  )
}

export default InterviewHistory

import React from 'react'
import { RiRobot3Line } from "react-icons/ri";
import { HiOutlineSparkles } from "react-icons/hi2";
import { FcGoogle } from "react-icons/fc";
import { motion } from "motion/react"
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import axios from 'axios';
import {serverURL} from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const Auth = ({ isModel = false }) => {
    const dispatch = useDispatch()
    const handleGoogleAuth = async () => {
        try {
            const response = await signInWithPopup(auth, provider)
            let User = response.user
            let name = User.displayName
            let email = User.email
            let result = await axios.post(`${serverURL}/api/auth/google`, { name, email }, {withCredentials:true})
            dispatch(setUserData(result.data.user))
        } catch (error) {
            console.log(error)
            dispatch(setUserData(null))
        }
    }

  return (
    <div className={`w-full 
        ${isModel ? "py-4" : "min-h-screen bg-[#F3F3F3] flex items-center justify-center px-6 py-20"}`}>

        <motion.div className={`w-full ${isModel ? "max-w-md p-8 rounded-3xl" : "max-w-lg p-12 rounded-[32px]"}
        bg-white shadow-2xl border border-gray-300`} initial={{ opacity: 0, y: -50}} animate={{ opacity: 1, y: 0}} transition={{ duration: 0.7, delay: 0.2}}>

            <div className='flex gap-3 items-center justify-center mb-4'>

                <div className='rounded-full p-2 border-2'>
                    <RiRobot3Line size={20} />
                </div>

                <h2 className='font-semibold text-lg'>AI Interview</h2>

            </div>

            <h1 className='text-center text-2xl md:text-3xl font-semibold mb-4'>

                Continue with 
                <span className='inline-flex items-center bg-[#B2EAF0] gap-2 px-4 py-2 rounded-full text-cyan-500'> <HiOutlineSparkles size={30}/>AI Smart Interview</span>

            </h1>

            <p className='text-center text-sm md:text-base text-gray-500 mb-4'> Sign In to start AI powered mock interviews, track you progress, unlock detailed performance insights. </p>

            <div className='w-full flex items-center justify-center'>

                <motion.button 
                onClick={handleGoogleAuth}
                className='bg-gray-600 px-4 py-2 text-white rounded-full flex items-center justify-center w-fit shadow-md gap-3 font-semibold hover:cursor-pointer hover:bg-gray-700' whileHover={{scale : 1.1}} whileTap={{scale : 0.95}} transition={{ease: "easeInOut", duration:0.3}}> <FcGoogle size={30}/> Continue with Google </motion.button>
                
            </div>
            
        </motion.div>

    </div>
  )
}

export default Auth

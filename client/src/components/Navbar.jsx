import {useState} from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'motion/react'
import { RiRobot3Line } from "react-icons/ri";
import { BsCoin } from "react-icons/bs";
import { LiaUser } from "react-icons/lia";
import { useNavigate } from 'react-router-dom';
import { IoLogOutOutline } from "react-icons/io5";
import axios from 'axios';
import {serverURL} from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import AuthModel from './AuthModel';

const Navbar = () => {
    const {userData} = useSelector((state) => state.user)
    const [showCreditPopUp, setShowCreditPopUp] = useState(false)
    const [showUserPopup, setShowUserPopup] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [showAuth, setShowAuth] = useState(false)

    const handleLogout = async () => {
        try {
            await axios.get(`${serverURL}/api/auth/logout`, {withCredentials:true})
            dispatch(setUserData(null))
            setShowUserPopup(false)
            setShowCreditPopUp(false)
            navigate('/')
        } catch (error) {
         console.log(error)   
        }
    }
  return (
    <div className='bg-[#F3F3F3] w-full text-black flex justify-center'>

        <motion.div className='w-full h-18 bg-white shadow-sm flex items-center justify-between px-8 md:px-16 py-4 items-center relative' initial={{ y: -50, opacity: 0}} animate={{ y: 0, opacity: 1}} transition={{ duration: 0.4 }}>

            <div className='flex gap-3 text-2xl font-semibold items-center cursor-pointer'>

                <div className='border-2 border-black p-2 rounded-full'><RiRobot3Line size={30}/></div>

                <h1 className='hidden md:block'>AI interview</h1>

            </div>

            <div className='flex items-center gap-3 md:gap-6 relative'>

                <div className='relative'>

                    <button onClick={() => {
                        if(!userData) {
                            setShowAuth(true) 
                            return;
                        }
                        setShowCreditPopUp(!showCreditPopUp); setShowUserPopup(false)}} className='flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-full text-md hover:bg-gray-300 transition cursor-pointer'><BsCoin size={20}/>{userData?.credits || 0}</button>
                    
                    {showCreditPopUp && (
                        <div className='absolute right-[-50px] mt-3 w-64 bg-white shadow-xl border border-gray-200 rounded p-5 z-50 '>

                            <p className='text-sm text-gray-600 mb-4'>Need more credits to continue to interviews?</p>

                            <button onClick={() => navigate('/pricing')} className='bg-[#3FB5D7] w-full text-white px-4 py-2 hover:bg-[#0D8BCB] rounded-md transition cursor-pointer'>Buy more credits</button>
                        </div>
                    )}

                </div>

                <div className='relative'>

                    <button onClick={() => {
                        if(!userData) {
                            setShowAuth(true) 
                            return;
                        }
                        setShowUserPopup(!showUserPopup); setShowCreditPopUp(false)}} className='flex items-center justify-center font-semibold bg-[#3FB5D7] text-white w-9 h-9 rounded-full cursor-pointer'>{userData ? userData?.name.slice(0, 1).toUpperCase() : <LiaUser size={20}/>}</button>

                    {showUserPopup && (
                        <div className='absolute right-0 mt-3 w-48 bg-white shadow-xl border border-gray-200 rounded-xl p-5 z-50 '>
                            
                            <p className='text-md font-md font-semibold text-[#2FBDCE] capitalize'>{userData?.name}</p>
                            
                            <button onClick={() => navigate('/history')} className='w-full text-left pb-2 hover:text-black text-gray-600 cursor-pointer'>Interview History</button>

                            <button onClick={handleLogout} className='w-fit bg-red-500 text-left text-sm p-2 rounded-md flex items-center gap-2 hover:bg-red-600 text-white cursor-pointer'><IoLogOutOutline size={20}/> Logout</button>

                        </div>
                    )}
                </div>

            </div>

        </motion.div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)}/>}

    </div>
  )
}

export default Navbar

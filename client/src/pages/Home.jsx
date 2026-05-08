import React from 'react'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux';
import { HiOutlineSparkles } from "react-icons/hi2";
import { motion } from 'motion/react';
import AuthModel from '../components/AuthModel';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsMic, BsClock, BsBarChart, BsFileEarmarkText } from 'react-icons/bs';
import { RiRobot3Line } from "react-icons/ri";
import evaluation from '../assets/evaluation.png'
import hr from '../assets/hr.png'
import pdf from '../assets/pdf.png'
import resume from '../assets/resume.png'
import history from '../assets/history.png'
import credit from '../assets/credit.png'
import technical from '../assets/technical.png'
import confidence from '../assets/confidence.png'
import Footer from '../components/Footer';

const Home = () => {
  const {userData} = useSelector((state) => state.user)
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate()
  const features = [
                {
                  icon: <RiRobot3Line size={24}/ >,
                  step: "STEP - 1",
                  title: "Role & Experience Selection",
                  desc: "AI adjusts difficulty based on selected job role."
                },
                {
                  icon: <BsMic size={24}/ >,
                  step: "STEP - 2",
                  title: "Smart Voice Interview",
                  desc: "Dynamic follow-up questions based on your answers."
                },
                {
                  icon: <BsClock size={24}/ >,
                  step: "STEP - 3",
                  title: "Timer based Simulation",
                  desc: "Real Interview Pressure with time tracking."
                }
              ]
    const capabilities = [
                  {
                    image: evaluation,
                    icon: <BsBarChart size={20} />,
                    title: "AI Answer Evaluation",
                    desc: "Score communication, technical accuracy and confidence."
                  },
                  {
                    image: resume,
                    icon : <BsFileEarmarkText size={20}/>,
                    title: "Resume Based Interview",
                    desc: "Project-specific question based on uploaded resume."
                  },
                  {
                    image:pdf,
                    icon: <BsFileEarmarkText size={20}/>,
                    title: "Downloadable PDF Report",
                    desc: "Detailed strengths, weakness and  improvements insights"
                  },
                  {
                    image: history,
                    icon: <BsBarChart size={20}/>,
                    title: "History and Analytics",
                    desc: "Track progress with performance graphs and topic analysis."
                  }
                ]
    const modes = [
      {
        img: hr,
        title: "HR Interview Mode",
        desc: "Behavioral and communication based evaluation."
      },
      {
        img: technical,
        title: "Technical Mode",
        desc: "Deep technical questioning based on selected role."
      },
      {
        img: confidence,
        title: "Cofidence Detection",
        desc: "Basic tone and voice analysis insights."
      },
      {
        img: credit,
        title: "Credits System",
        desc: "Unlock premimum interview sessions easily."
      }
    ]

  return (
    <div className='min-h-screen w-full flex flex-col bg-[#F3F3F3]'>

      <Navbar />

      <div className='flex-1 px-6 py-10'>
        <div className='max-w-6xl mx-auto'>
        <div className='flex justify-center mb-3'>
          <div className='bg-gray-100 text-gray-600 text-sm md:text-lg px-4 py-2 rounded-full flex items-center gap-2'>
            <HiOutlineSparkles size={25} className='text-cyan-500' />
            AI Powered Smart Interview Platform
          </div>
        </div>

         <div className='text-center mb-28'>
            <motion.h1 
            initial={{ opacity: 0, y: -50}}
            animate={{ opacity: 1, y: 0}}
            transition={{ duration: 0.6}}
            className='text-[32px] md:text-6xl font-semibold leading-tight max-w-4xl mx-auto'>
              Practice Interviews with
              <span className='relative inline-block pt-3'>
                <span className='bg-[#B2EAF0] text-cyan-500 px-10 md:pb-4 pb-2 rounded-full'>AI Intelligence</span>
              </span>
            </motion.h1>
            <motion.p 
            initial={{opacity:0}}
            animate={{opacity:1}}
            transition={{duration:0.8}}
            className='text-gray-500 mt-6 max-w-2xl mx-auto text-lg md:py-4'>
              Role-based mock intervies with smart follow-ups, adaptive difficulty and real-time performance evaluation.
            </motion.p>

            <div className='flex flex-wrap justify-center gap-4 mt-6'>
              <motion.button 
              onClick={() => {
                if(!userData) {
                  setShowAuth(true) 
                  return;
                }
                navigate('/interview')
              }}
              whileHover={{opacity:0.9, scale:1.03}}
              whileTap={{scale:0.97, opacity:1}} className='bg-black text-white px-10 py-3 rounded-full shadow-md cursor-pointer font-semibold'>
                Start Interview
              </motion.button>

               <motion.button 
              onClick={() => {
                if(!userData) {
                  setShowAuth(true) 
                  return;
                }
                navigate('/history')
              }}
              whileHover={{opacity:0.9, scale:1.03}}
              whileTap={{scale:0.97, opacity:1}} className='border border-gray-300 px-10 py-3 rounded-full shadow-md cursor-pointer font-semibold'>
                View Interview History
              </motion.button>
            </div>
          </div>

          <div className='flex flex-col md:flex-row justify-center items-center gap-12 mb-28 -mt-5'>
            {
              features.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 + index * 0.2 }}
                  whileHover={{scale: 1.06}}
                  className={`relative bg-white rounded-3xl border-2 border-cyan-100 hover:border-cyan-500 p-10 w-80 shadow-md hover:shadow-2xl transistion-all duration-300 ${index === 0 ? "rotate-[-4deg]" : ""}
                  ${index === 1 ? "rotate-[3deg] md:-mt-6 shadow-xl" : ""} ${index === 2 ? "rotate-[-3deg]" : ""}`}
                >
                  <div className='absolute -top-8 left-1/2 -translate-x-1/2 bg-white border-2 border-cyan-500 text-cyan-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg'>
                    {item.icon}
                  </div>
                  <div className='pt-5 text-center'>
                    <div className='text-md text-cyan-400 font-semibold mb-2 tracking-wider'>{item.step}</div>
                    <h3 className='text-lg font-semibold mb-3'>{item.title}</h3>
                  <p className='text-md leading-relaxed text-gray-500'>{item.desc}</p>
                  </div>
                </motion.div>
              ))
            }
          </div>

          <div className='mb-32'>
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='text-4xl font-semibold text-center mb-16'
            >
              Advance AI {" "}
              <span className='text-cyan-500'>Capabilities</span>
            </motion.h2>

            <div className='grid md:grid-cols-2 gap-10'>
              {
                capabilities.map((item, index) => (
                  <motion.div key={index}
                  initial={{opacity:0, y: 50}}
                  whileInView={{opacity:1, y:0}}
                  transition={{duration: 0.5}}
                  whileHover={{scale:1.02}}
                  className='bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all'>
                    <div className='flex flex-col md:flex-row items-center gap-8'>
                      <div className='w-full md:w-1/2 flex justify-center'>
                      <img src={item.image} alt={item.title} className='w-full h-50 object-contain max-h-64' />
                      </div>
                      <div className='w-full md:w-1/2'>
                      <div className='bg-cyan-100 text-cyan-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6'>
                        {item.icon}
                      </div>
                      <h3 className='font-semibold mb-3 text-xl'>{item.title}</h3>
                      <p className='text-gray-500 text-md leading-relaxed'>{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              }
            </div>

          </div>

           <div className='mb-32'>
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='text-4xl font-semibold text-center mb-16'
            >
              Multiple Interview {" "}
              <span className='text-cyan-500'>Modes</span>
            </motion.h2>

            <div className='grid md:grid-cols-2 gap-10'>
              {
                modes.map((mode, index) => (
                  <motion.div key={index}
                  initial={{opacity:0, y: 50}}
                  whileInView={{opacity:1, y:0}}
                  transition={{duration: 0.5, delay: index * 0.1}}
                  whileHover={{y: -6}}
                  className='bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all'>
                    <div className='flex items-center justify-between gap-6'>
                      <div className="w-1/2">
                      <h3 className="font-semibold text-xl mb-3">{mode.title}</h3>
                      <p className="text-gray-500 text-md leading-relaxed">{mode.desc}</p>
                      </div>
                      <div className='w-1/2 flex justify-end'>
                      <img src={mode.img} alt={mode.title} className="w-28 h-28 object-contain" />
                      </div>
                    </div>
                  </motion.div>
                ))
              }
            </div>

          </div>
      </div>
      </div>
      {showAuth && <AuthModel onClose={() => setShowAuth(false)}/>}
        <Footer />
    </div>

  )
}

export default Home

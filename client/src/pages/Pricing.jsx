import React from 'react'
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import { motion } from 'motion/react'
import axios from 'axios'
import { serverURL } from "../App";
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

const Pricing = () => {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState("free")
  const [loadingPlan, setLoadingPlan] = useState(null)
  const dispatch = useDispatch()
  
  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      credits: 100,
      description: 'Perfect for beginners starting interview prepration.',
      features: [
        "100 AI interview Credits",
        "Basic Performance Reports",
        "Voice Interview Access",
        "Limited History Tracking"
      ],
      default: true,
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "₹100",
      credits: 150,
      description: 'Great for focused practice and skill improvement.',
      features: [
        "150 AI interview Credits",
        "Detailed Feedback",
        "Performance Analytics",
        "Full Interview History"
      ]
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "₹500",
      credits: 650,
      description: 'Best value for serious job preparation.',
      features: [
        "650 AI interview Credits",
        "Advanced AI Feedback",
        "Skill Trend Analysis",
        "Priority AI Processing"
      ],
      badge: "Best Value",
    }
  ]

  const handlePayment = async (plan) => {
    try {
      setLoadingPlan(plan.id)
      const amount = plan.id === "basic" ? 100 : plan.id === "pro" ? 500 : 0
      const result = await axios.post(`${serverURL}/api/payment/order`, { 
        planId: plan.id,
        amount: amount,
        credits: plan.credits
       }, { withCredentials: true })
       console.log(result.data)
       const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.data.amount,
        currency: "INR",
        name: "AI Interview",
        description: `${plan.name} - ${plan.credits} Credits`,
        order_id: result.data.id,
        handler: async function (response) {
          console.log(response)
          const verifyPay = await axios.post(`${serverURL}/api/payment/verify`, response, { withCredentials: true })
          dispatch(setUserData(verifyPay.data.user))
          alert("Payment Successful 🎉 Credits added to your account.")
          navigate('/')
       },
       theme:{
        color: "#57c3e4"
       }
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
      setLoadingPlan(null)
    } catch (error) {
      console.log(error.message)
      setLoadingPlan(null)
    }
  }
  return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-cyan-200 py-16 px-6'>
        <div className='max-w-6xl mx-auto mb-14 flex items-start gap-4'>
          <button onClick={() => navigate("/")} className='mt-2 p-3 rounded-full bg-white shadow hover:shadow-md transition cursor-pointer'><FaArrowLeft className='text-gray-600' /></button>
          <div className='text-center w-full'>
            <h1 className='text-4xl font-bold text-gray-800'>Choose Your Plan</h1>
            <p className='text-gray-500 mt-3 text-lg'>
              Flexible pricing to match your interview preparation goals.
            </p>
          </div>
        </div>

<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>
  {plans.map((plan) => {
    const isSelected = selectedPlan === plan.id
    return (
      <motion.div key={plan.id}
      whileHover={!plan.default && {scale: 1.03}}
      onClick={() => !plan.default && setSelectedPlan(plan.id)}
      className={`relative rounded-3xl p-8 transition-all duration-300 border ${
        isSelected ? "border-cyan-400 shadow-2xl bg-white" : "border-gray-200 bg-white shadow-md"
      }
      ${plan.default ? "cursor-default" : "cursor-pointer"}`}>
       
        {plan.badge && (
          <div className='absolute top-6 right-6 bg-cyan-500 text-white text-xs px-4 py-1 rounded-full shadow'>{plan.badge}</div>
        )}
        {plan.default && (
          <div className='absolute top-6 right-6 bg-gray-200
          text-gray-700 text-xs px-3 py-1 rounded-full'>Default</div>
        )}
        <h3 className='text-xl font-semibold text-gray-800'>{plan.name}</h3>
        <div className='mt-4'>
          <span className='text-3xl font-bold text-cyan-500'>{plan.price}</span>
          <p className='text-gray-500 mt-1'>{plan.credits} Credits</p>
        </div>
        <p className='text-gray-500 mt-4 text-sm leading-relaxed'>{plan.description}</p>
        <div className='mt-6 space-y-3 text-left'>
          {plan.features.map((feature, i) => (
            <div key={i} className='flex item-center gap-3'>
              <FaCheckCircle className='text-cyan-500 text-sm' />
              <span className='text-gray-700 text-sm'>{feature}</span>
            </div>
          ))}
        </div>
        {!plan.default && <button disabled={loadingPlan === plan.id} onClick={e => {e.stopPropagation();
        if(!isSelected){
          setSelectedPlan(plan.id)
        } else {
          handlePayment(plan)
        }
        }} className={`w-full mt-8 py-3 rounded-xl font-semibold transition cursor-pointer ${isSelected ? "bg-cyan-500 text-white hover:opacity-90" : "bg-gray-100 text-gray-700 hover:bg-cyan-50"}`}>
          {loadingPlan === plan.id ? "Processing..." : isSelected ? "Proceed to Pay" : "Select Plan"}
        </button>}
      </motion.div>
    )
  })}
</div>
      </div>
  )
}

export default Pricing

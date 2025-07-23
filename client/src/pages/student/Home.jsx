import React from 'react'
import Hero from '../../components/student/Hero'
import Companies from '../../components/student/Companies'
import CoursesSection from '../../components/student/CoursesSection'
import TestomonialSection from '../../components/student/TestomonialSection'
import CallToAction from '../../components/student/callToAction'
import Footer from '../../components/student/Footer'

const Home = () => {
  return (
    <div className='flex flex-col ietms-center space-y-7 text-center '>
      <Hero />
      <Companies />
      <CoursesSection />
      <TestomonialSection />
      <CallToAction />
      <Footer />
    </div>
  )
}

export default Home
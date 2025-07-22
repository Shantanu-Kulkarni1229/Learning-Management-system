import React from 'react'
import Hero from '../../components/student/Hero'
import Companies from '../../components/student/Companies'
import CoursesSection from '../../components/student/CoursesSection'
import TestomonialSection from '../../components/student/TestomonialSection'

const Home = () => {
  return (
    <div className='flex flex-col ietms-center space-y-7 text-center '>
      <Hero />
      <Companies />
      <CoursesSection />
      <TestomonialSection />
    </div>
  )
}

export default Home
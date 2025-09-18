'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Mail, Phone, MapPin, Calendar, Heart, Code, Coffee } from 'lucide-react'

interface AboutData {
  profileImage: string
  name: string
  title: string
  location: string
  email: string
  phone: string
  bio: {
    introduction: string
    background: string
    interests: string
    goals: string
  }
  stats: {
    label: string
    value: string
  }[]
  personalFacts: string[]
}

const defaultAboutData: AboutData = {
  profileImage: '/placeholder-avatar.jpg',
  name: 'Ali Nawaf',
  title: 'Computer Science Student & Developer',
  location: 'Cleveland, OH',
  email: 'aan90@case.edu',
  phone: '+1 (216) 647-4302',
  bio: {
    introduction: "Hello! I'm Ali, a passionate Computer Science student with a love for creating innovative solutions and building impactful software applications.",
    background: "Currently pursuing my degree in Computer Science, I've developed a strong foundation in programming, algorithms, and software engineering principles. My journey in tech started with curiosity and has evolved into a genuine passion for problem-solving.",
    interests: "When I'm not coding, I enjoy exploring new technologies, contributing to open-source projects, and staying up-to-date with the latest trends in web development and artificial intelligence.",
    goals: "My goal is to leverage technology to create meaningful solutions that make a positive impact on people's lives. I'm always eager to learn new skills and take on challenging projects."
  },
  stats: [
    { label: 'Projects Completed', value: '20+' },
    { label: 'Technologies Used', value: '15+' },
    { label: 'Years of Experience', value: '3+' },
    { label: 'Coffee Cups', value: '∞' }
  ],
  personalFacts: [
    'I started programming when I was 16',
    'I love solving algorithmic challenges',
    'I enjoy mentoring fellow students',
    'I speak three languages fluently'
  ]
}

export default function About() {
  const [aboutData, setAboutData] = useState<AboutData>(defaultAboutData)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch('/api/about')
        if (response.ok) {
          const data = await response.json()
          setAboutData(data)
        }
      } catch (error) {
        console.error('Failed to fetch about data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAboutData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="relative inline-block mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-48 h-48 mx-auto rounded-full overflow-hidden shadow-2xl border-4 border-white"
            >
              <Image
                src={aboutData.profileImage}
                alt={aboutData.name}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="absolute -bottom-4 -right-4 bg-primary-600 text-white p-3 rounded-full shadow-lg"
            >
              <Heart className="w-6 h-6" fill="currentColor" />
            </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            {aboutData.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl text-gray-600 mb-8"
          >
            {aboutData.title}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-6 text-gray-600"
          >
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>{aboutData.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} />
              <span>{aboutData.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} />
              <span>{aboutData.phone}</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {aboutData.stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-2xl md:text-3xl font-bold text-primary-600 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bio Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Code className="text-primary-600" size={24} />
                Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {aboutData.bio.introduction}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Background
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {aboutData.bio.background}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Interests
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {aboutData.bio.interests}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Goals
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {aboutData.bio.goals}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Personal Facts */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
            <Coffee className="text-primary-600" size={24} />
            Fun Facts About Me
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {aboutData.personalFacts.map((fact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
              >
                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                <span className="text-gray-700">{fact}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

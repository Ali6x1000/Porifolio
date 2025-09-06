'use client'

import { useState, useEffect } from 'react'
import { Save, Plus, Trash2 } from 'lucide-react'

interface Experience {
  id: string
  title: string
  company: string
  period: string
  description: string[]
}

interface Education {
  id: string
  degree: string
  school: string
  period: string
  gpa: string
  relevant: string[]
}

interface ResumeData {
  personal: {
    name: string
    email: string
    phone: string
    location: string
  }
  experiences: Experience[]
  education: Education[]
  skills: {
    programming: string
    web: string
    databases: string
    tools: string
  }
}

export default function ResumeEditor() {
  const [resumeData, setResumeData] = useState<ResumeData>({
    personal: {
      name: 'Your Name',
      email: 'your.email@example.com',
      phone: '(555) 123-4567',
      location: 'City, State'
    },
    experiences: [
      {
        id: '1',
        title: 'Software Developer Intern',
        company: 'Tech Company',
        period: '2023 - Present',
        description: [
          'Developed full-stack web applications using React and Node.js',
          'Collaborated with team of 5 developers on multiple projects',
          'Improved application performance by 40% through code optimization'
        ]
      }
    ],
    education: [
      {
        id: '1',
        degree: 'Bachelor of Science in Computer Science',
        school: 'University Name',
        period: '2021 - 2025',
        gpa: '3.8/4.0',
        relevant: ['Data Structures', 'Algorithms', 'Software Engineering', 'Database Systems']
      }
    ],
    skills: {
      programming: 'JavaScript, Python, Java, C++, TypeScript',
      web: 'React, Next.js, Node.js, Express, HTML, CSS',
      databases: 'MongoDB, PostgreSQL, MySQL',
      tools: 'Git, Docker, AWS, Linux, Agile'
    }
  })

  useEffect(() => {
    const savedResume = localStorage.getItem('resume-data')
    if (savedResume) {
      setResumeData(JSON.parse(savedResume))
    }
  }, [])

  const saveResume = () => {
    localStorage.setItem('resume-data', JSON.stringify(resumeData))
    alert('Resume data saved successfully!')
  }

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      period: '',
      description: ['']
    }
    setResumeData(prev => ({
      ...prev,
      experiences: [...prev.experiences, newExp]
    }))
  }

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id)
    }))
  }

  const updateExperience = (id: string, field: string, value: any) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      degree: '',
      school: '',
      period: '',
      gpa: '',
      relevant: []
    }
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }))
  }

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }))
  }

  const updateEducation = (id: string, field: string, value: any) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }))
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resume Editor</h2>
        <button
          onClick={saveResume}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Save size={20} />
          Save Changes
        </button>
      </div>

      {/* Personal Information */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={resumeData.personal.name}
              onChange={(e) => setResumeData(prev => ({
                ...prev,
                personal: { ...prev.personal, name: e.target.value }
              }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={resumeData.personal.email}
              onChange={(e) => setResumeData(prev => ({
                ...prev,
                personal: { ...prev.personal, email: e.target.value }
              }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              value={resumeData.personal.phone}
              onChange={(e) => setResumeData(prev => ({
                ...prev,
                personal: { ...prev.personal, phone: e.target.value }
              }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              value={resumeData.personal.location}
              onChange={(e) => setResumeData(prev => ({
                ...prev,
                personal: { ...prev.personal, location: e.target.value }
              }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Experience */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Experience</h3>
          <button
            onClick={addExperience}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Add Experience
          </button>
        </div>
        
        <div className="space-y-6">
          {resumeData.experiences.map((exp) => (
            <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium">Experience Entry</h4>
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Job Title</label>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Period</label>
                <input
                  type="text"
                  value={exp.period}
                  onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                  placeholder="2023 - Present"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description (one per line)</label>
                <textarea
                  value={exp.description.join('\n')}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value.split('\n'))}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                  placeholder="• Bullet point 1&#10;• Bullet point 2&#10;• Bullet point 3"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Technical Skills</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Programming Languages</label>
            <input
              type="text"
              value={resumeData.skills.programming}
              onChange={(e) => setResumeData(prev => ({
                ...prev,
                skills: { ...prev.skills, programming: e.target.value }
              }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Web Technologies</label>
            <input
              type="text"
              value={resumeData.skills.web}
              onChange={(e) => setResumeData(prev => ({
                ...prev,
                skills: { ...prev.skills, web: e.target.value }
              }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Databases</label>
            <input
              type="text"
              value={resumeData.skills.databases}
              onChange={(e) => setResumeData(prev => ({
                ...prev,
                skills: { ...prev.skills, databases: e.target.value }
              }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tools & Others</label>
            <input
              type="text"
              value={resumeData.skills.tools}
              onChange={(e) => setResumeData(prev => ({
                ...prev,
                skills: { ...prev.skills, tools: e.target.value }
              }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

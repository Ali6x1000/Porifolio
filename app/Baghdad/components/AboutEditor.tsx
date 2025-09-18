'use client'

import { useState, useEffect } from 'react'
import { Save, Upload, User, MapPin, Mail, Phone, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'

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
    introduction: '',
    background: '',
    interests: '',
    goals: ''
  },
  stats: [],
  personalFacts: []
}

export default function AboutEditor() {
  const [aboutData, setAboutData] = useState<AboutData>(defaultAboutData)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchAboutData()
  }, [])

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

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aboutData),
      })

      if (response.ok) {
        setMessage('About data saved successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      setMessage('Failed to save about data')
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const { url } = await response.json()
        setAboutData(prev => ({ ...prev, profileImage: url }))
        setMessage('Image uploaded successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      setMessage('Failed to upload image')
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setIsUploading(false)
    }
  }

  const addStat = () => {
    setAboutData(prev => ({
      ...prev,
      stats: [...prev.stats, { label: '', value: '' }]
    }))
  }

  const updateStat = (index: number, field: 'label' | 'value', value: string) => {
    setAboutData(prev => ({
      ...prev,
      stats: prev.stats.map((stat, i) => 
        i === index ? { ...stat, [field]: value } : stat
      )
    }))
  }

  const removeStat = (index: number) => {
    setAboutData(prev => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index)
    }))
  }

  const addPersonalFact = () => {
    setAboutData(prev => ({
      ...prev,
      personalFacts: [...prev.personalFacts, '']
    }))
  }

  const updatePersonalFact = (index: number, value: string) => {
    setAboutData(prev => ({
      ...prev,
      personalFacts: prev.personalFacts.map((fact, i) => 
        i === index ? value : fact
      )
    }))
  }

  const removePersonalFact = (index: number) => {
    setAboutData(prev => ({
      ...prev,
      personalFacts: prev.personalFacts.filter((_, i) => i !== index)
    }))
  }

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">About Me Editor</h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
        >
          <Save size={20} />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      {/* Profile Image */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">Profile Image</h3>
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
            <Image
              src={aboutData.profileImage}
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="profile-image"
            />
            <label
              htmlFor="profile-image"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-gray-700"
            >
              <Upload size={20} />
              {isUploading ? 'Uploading...' : 'Upload New Image'}
            </label>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={aboutData.name}
              onChange={(e) => setAboutData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={aboutData.title}
              onChange={(e) => setAboutData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              value={aboutData.location}
              onChange={(e) => setAboutData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={aboutData.email}
              onChange={(e) => setAboutData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="text"
              value={aboutData.phone}
              onChange={(e) => setAboutData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Biography */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">Biography</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Introduction</label>
            <textarea
              value={aboutData.bio.introduction}
              onChange={(e) => setAboutData(prev => ({ 
                ...prev, 
                bio: { ...prev.bio, introduction: e.target.value }
              }))}
              rows={3}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Background</label>
            <textarea
              value={aboutData.bio.background}
              onChange={(e) => setAboutData(prev => ({ 
                ...prev, 
                bio: { ...prev.bio, background: e.target.value }
              }))}
              rows={3}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Interests</label>
            <textarea
              value={aboutData.bio.interests}
              onChange={(e) => setAboutData(prev => ({ 
                ...prev, 
                bio: { ...prev.bio, interests: e.target.value }
              }))}
              rows={3}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Goals</label>
            <textarea
              value={aboutData.bio.goals}
              onChange={(e) => setAboutData(prev => ({ 
                ...prev, 
                bio: { ...prev.bio, goals: e.target.value }
              }))}
              rows={3}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-lg p-6 shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Statistics</h3>
          <button
            onClick={addStat}
            className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-green-700"
          >
            <Plus size={16} />
            Add Stat
          </button>
        </div>
        <div className="space-y-3">
          {aboutData.stats.map((stat, index) => (
            <div key={index} className="flex gap-3 items-center">
              <input
                type="text"
                placeholder="Label"
                value={stat.label}
                onChange={(e) => updateStat(index, 'label', e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Value"
                value={stat.value}
                onChange={(e) => updateStat(index, 'value', e.target.value)}
                className="w-24 border rounded-lg px-3 py-2"
              />
              <button
                onClick={() => removeStat(index)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Personal Facts */}
      <div className="bg-white rounded-lg p-6 shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Personal Facts</h3>
          <button
            onClick={addPersonalFact}
            className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-green-700"
          >
            <Plus size={16} />
            Add Fact
          </button>
        </div>
        <div className="space-y-3">
          {aboutData.personalFacts.map((fact, index) => (
            <div key={index} className="flex gap-3 items-center">
              <input
                type="text"
                placeholder="Personal fact"
                value={fact}
                onChange={(e) => updatePersonalFact(index, e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2"
              />
              <button
                onClick={() => removePersonalFact(index)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

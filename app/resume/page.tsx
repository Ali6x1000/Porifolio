'use client'

import { motion } from 'framer-motion'
import { Download, Mail, Phone, MapPin, ExternalLink } from 'lucide-react'

export default function Resume() {
  const experiences = [
    {
      title: 'Software Developer Intern',
      company: 'Tech Company',
      period: '2023 - Present',
      description: [
        'Developed full-stack web applications using React and Node.js',
        'Collaborated with team of 5 developers on multiple projects',
        'Improved application performance by 40% through code optimization'
      ]
    },
    {
      title: 'Teaching Assistant',
      company: 'University Name',
      period: '2022 - 2023',
      description: [
        'Assisted professor in Computer Science courses',
        'Helped 50+ students with programming assignments',
        'Conducted weekly lab sessions and office hours'
      ]
    }
  ]

  const education = [
    {
      degree: 'Bachelor of Science in Computer Science',
      school: 'University Name',
      period: '2021 - 2025',
      gpa: '3.8/4.0',
      relevant: ['Data Structures', 'Algorithms', 'Software Engineering', 'Database Systems']
    }
  ]

  return (
    <div className="pt-16">
      <section className="section-padding">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">Resume</h1>
            <div className="flex flex-wrap justify-center gap-6 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>your.email@example.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>City, State</span>
              </div>
            </div>
            <button className="btn-primary inline-flex items-center">
                 <a 
              href="/Nawaf_resume.pdf" 
              download="Ali.pdf"
              className="btn-primary inline-flex items-center"
            >
              <Download className="mr-2" size={20} />
              Download PDF
              </a>
            </button>
          </motion.div>

          {/* Experience */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6 border-b-2 border-primary-600 pb-2">
              Experience
            </h2>
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <div key={index} className="border-l-4 border-primary-600 pl-6">
                  <h3 className="text-xl font-semibold">{exp.title}</h3>
                  <p className="text-primary-600 font-medium">{exp.company}</p>
                  <p className="text-gray-500 mb-3">{exp.period}</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {exp.description.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Education */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6 border-b-2 border-primary-600 pb-2">
              Education
            </h2>
            {education.map((edu, index) => (
              <div key={index} className="border-l-4 border-primary-600 pl-6">
                <h3 className="text-xl font-semibold">{edu.degree}</h3>
                <p className="text-primary-600 font-medium">{edu.school}</p>
                <p className="text-gray-500">{edu.period} | GPA: {edu.gpa}</p>
                <div className="mt-2">
                  <p className="font-medium">Relevant Coursework:</p>
                  <p className="text-gray-700">{edu.relevant.join(', ')}</p>
                </div>
              </div>
            ))}
          </motion.section>

          {/* Skills */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6 border-b-2 border-primary-600 pb-2">
              Technical Skills
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Programming Languages</h3>
                <p className="text-gray-700">JavaScript, Python, Java, C++, TypeScript</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Web Technologies</h3>
                <p className="text-gray-700">React, Next.js, Node.js, Express, HTML, CSS</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Databases</h3>
                <p className="text-gray-700">MongoDB, PostgreSQL, MySQL</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Tools & Others</h3>
                <p className="text-gray-700">Git, Docker, AWS, Linux, Agile</p>
              </div>
            </div>
          </motion.section>
        </div>
      </section>
    </div>
  )
}

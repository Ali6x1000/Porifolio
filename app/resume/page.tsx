'use client'

import { motion } from 'framer-motion'
import { Download, Mail, Phone, MapPin, ExternalLink } from 'lucide-react'

export default function Resume() {
  const experiences = [
    {
      title: 'Researcher',
      company: 'Houston Methodist Hospital',
      period: 'Aug 2025 – Present',
      description: [
        'Collaborating with Houston Methodist Hospital’s computational team to build AI-powered CT scan analysis models, predicting cardiovascular disease risk in high-risk patients.'
      ]
    },
    {
      title: 'Researcher',
      company: 'UWC Science Collective',
      period: 'July 2025 – Present',
      description: [
        'Implemented and optimized variational autoencoders (VAEs) in Python using PyTorch, contributing to research in a Cornell University PhD-led lab.',
        'Applied advanced mathematical concepts to design and test VAEs and diffusion models, enhancing data generation.'
      ]
    },
    {
      title: 'Research Assistant',
      company: 'Case Western Reserve University',
      period: 'July 2025 – Present',
      description: [
        'Researching privacy-preserving frameworks leveraging PCA, differential privacy, and federated learning for scalable use in agriculture and bioinformatics.'
      ]
    },
    {
      title: 'Software Engineer',
      company: 'Eaton',
      period: 'Jan 2025 – May 2025',
      description: [
        'Built an automated ETL Azure data pipeline to process customer-service data from Salesforce, delivering Business Intelligence insights via Tableau dashboards.',
        'Optimized business analytics throughput with batch jobs, handling thousands of inputs at lower latency and cost.',
        'Implemented role-based access control (RBAC), strengthening access control and reducing security risk.'
      ]
    },
    {
      title: 'Machine Learning Intern',
      company: 'Heads-up Hockey',
      period: 'Dec 2024 – Aug 2025',
      description: [
        'Automated dataset annotation pipeline, reducing training time by ~67% and cutting compute costs significantly.',
        'Trained computer-vision models in PyTorch and TensorFlow; achieved ~3× accuracy gains and ~3× faster inference speed, enabling real-time video analysis.',
        'Built an on-device iOS ML system that detects and extracts high-velocity shots on goal using only the camera.',
        'Built an interactive Swift-based game integrating responsive front-end design with optimized back-end logic.'
      ]
    },
     {
      title: 'IT Intern',
      company: 'EarthLink ISP',
      period: 'May 2024 – Aug 2024',
      description: [
        'Built a Java-based monitoring system for real-time network health tracking, improving fault detection by 50%.',
        'Automated support ticket classification with Python, reducing manual workload and response time by 60%.'
      ]
    }
  ]

  const education = [
    {
      degree: 'BS/MS in Computer Science, Secondary Major: Mathematics',
      school: 'Case Western Reserve University',
      period: 'Expected May 2027',
      relevant: ['Data Structures', 'Calculus III', 'Logic Design', 'Discrete Mathematics']
    }
  ]

  const projects = [
    {
      title: 'Computer Vision SmartLabeler',
      tech: 'Pytorch, Python, Systems Design, API, Git, GitHub, Docker',
      description: [
        'Built an interface on top of the popular open source tool Label-Studio to automate annotations, lowering cost and manpower required for labeling images.',
        'Architected project with modular systems design, containerized via Docker for reproducibility.'
      ]
    },
    {
      title: 'ElectroVector App',
      tech: 'Swift, Python, Git, GitHub, API',
      description: [
        'Developed ElectroVector, a data analytics Swift + Python app converting ECGs into vectorcardiograms, extracting clinically meaningful metrics for medical staff.'
      ]
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
            <h1 className="text-4xl font-bold mb-4">Ali Nawaf</h1>
            <div className="flex flex-wrap justify-center gap-6 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>aan90@case.edu</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>+1 (216) 647-4302</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Cleveland, OH</span>
              </div>
               <a href="https://linkedin.com/in/your-profile-url" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary-600">
                <ExternalLink size={16} />
                <span>LinkedIn</span>
              </a>
            </div>
            <a 
              href="/Nawaf_resume.pdf" 
              download="AliNawaf_Resume.pdf"
              className="btn-primary inline-flex items-center"
            >
              <Download className="mr-2" size={20} />
              Download PDF
            </a>
          </motion.div>

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
                <p className="text-gray-500">{edu.period}</p>
                <div className="mt-2">
                  <p className="font-medium">Relevant Coursework:</p>
                  <p className="text-gray-700">{edu.relevant.join(', ')}</p>
                </div>
              </div>
            ))}
          </motion.section>
          
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

          {/* Projects */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6 border-b-2 border-primary-600 pb-2">
              Projects
            </h2>
            <div className="space-y-8">
              {projects.map((proj, index) => (
                <div key={index} className="border-l-4 border-primary-600 pl-6">
                  <h3 className="text-xl font-semibold">{proj.title}</h3>
                  <p className="text-primary-600 font-medium">{proj.tech}</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 mt-3">
                    {proj.description.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
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
                <p className="text-gray-700">HTML, C++, C, Swift, JavaScript, SQL, R, MySQL</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Frameworks & Tools</h3>
                <p className="text-gray-700">Django, PowerShell, XML, XSLT, Snowflake, Excel, Web Application Development</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Cloud & DevOps</h3>
                <p className="text-gray-700">AWS, Azure, Docker, Linux/Unix, Git, GitHub Actions, CI/CD, REST APIs</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">ML & Data Analytics</h3>
                <p className="text-gray-700">PyTorch, TensorFlow, Scikit-learn, Pandas, NumPy, Power BI, Tableau, MongoDB</p>
              </div>
            </div>
          </motion.section>
        </div>
      </section>
    </div>
  )
}
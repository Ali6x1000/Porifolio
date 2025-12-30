'use client'

import { motion } from 'framer-motion'
import { Download, Mail, Phone, MapPin, ExternalLink } from 'lucide-react'

export default function Resume() {
  const experiences = [
    {
      title: 'Machine Learning Research Assistant',
      company: 'Houston Methodist Hospital',
      period: 'Aug 2023 – Present',
      description: [
        'Achieved >90% accuracy in cardiovascular risk prediction by developing and training a ResNet-based CNN model on medical CT scan images.',
        'Engineered a signal processing pipeline to digitize raw ECG signals from 10,000+ patient records, enhancing signal fidelity for downstream ML analysis.',
        'Conducted a comparative analysis of SOTA deep learning architectures (e.g., ResNet, VGG) for cardiovascular risk, benchmarking accuracy and computational cost.',
        'Ensured 100% compliance with patient data privacy standards (HIPAA) by developing data anonymization scripts during the ECG signal processing pipeline.'
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
        'Engineered and deployed a fully automated data pipeline on Microsoft Azure, processing over 100,000 Salesforce records monthly and cutting data processing latency by 35%.',
        'Led the team to present project results, metrics, and documentation to supervisors and non-technical leadership, resulting in the adoption of new data-driven dashboards.',
        'Implemented role-based access control (RBAC), strengthening access control and reducing security risk.'
      ]
    },
    {
      title: 'Machine Learning Intern',
      company: 'Heads-up Hockey',
      period: 'Dec 2024 – Aug 2025',
      description: [
        'Implemented an interactive Swift-based iOS application, integrating a Core-ML model for efficient on-device inference which improved user retention by 63%.',
        'Optimized the Core-ML model for on-device performance by applying 16-bit float quantization, reducing model size by 50% and improving battery-life efficiency.',
        'Leveraged the Core-ML framework to accelerate the model on Apple\'s SOC hardware (Neural Engine), achieving real-time inference.',
        'Automated a computer vision data annotation pipeline using Kubernetes, reducing manual data preparation time by 70% and accelerating model training cycles.'
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
    },
    {
      title: 'Machine Learning Research Assistant',
      company: 'Houston Methodist Hospital',
      period: 'Aug 2025 – Present',
      description: [
        'Independently researched and developed a novel hypothesis for cardiovascular risk prediction, applying a pioneer ML model to test the theory against a real-world CT scan dataset, culminating in 90% predictive accuracy.',
        'Engineered a signal processing pipeline to digitize raw ECG images, implementing open-source models and post-processing algorithms to extract meaningful signals and enhance fidelity for downstream ML analysis.'
      ]
    },
    {
      title: 'Research Assistant',
      company: 'Case Western Reserve University',
      period: 'Aug 2025 – Present',
      description: [
        'Collaborating with Prof. Erman Ayday on a $1.2M NIH-funded project developing a privacy-preserving sandbox for federated genomic data sharing and ML-based GWAS analysis.',
        'Implemented methods for sample relatedness and population stratification to enhance reliability for genetic association models.'
      ]
    }
  ]

  const education = [
    {
      degree: 'BS in Computer Science, Secondary Major: Mathematics',
      school: 'Case Western Reserve University',
      period: 'May 2027'
    },
    {
      degree: 'MS in Machine Learning and Artificial Intelligence',
      school: 'Case Western Reserve University',
      period: 'May 2027'
    }
  ]

  const projects = [
    {
      title: 'Medical Smart Labeler',
      tech: 'PyTorch, Python, API, Docker, YOLOv10',
      description: [
        'Reduced manual image annotation time by 60% by developing a Python tool that integrated with the Label-Studio API to pre-label images using a fine-tuned YOLOv10 model.',
        'Analyzed and pruned redundant layers from the YOLOv10 model, reducing computational complexity and inference latency by 30% for the real-time pre-labeling tool.'
      ]
    },
    {
      title: 'ElectroVector App',
      tech: 'Swift, Python, API, Signal Processing',
      description: [
        'Empowered medical staff with faster diagnostic insights by developing an iOS app that transforms raw ECG signals into clinical Vectorcardiograms, automatically extracting 5+ key cardiac risk metrics.'
      ]
    },
    {
      title: 'Generative ECG Models',
      tech: 'PyTorch, VAEs, Signal Processing',
      description: [
        'Investigated generative modeling techniques by implementing a Variational Autoencoder (VAE) in PyTorch to learn latent representations of ECG waveforms for synthetic data augmentation.'
      ]
    },
    {
      title: 'Medical Smart Labeler (SAM2 Version)',
      tech: 'PyTorch, Python, API, Git, GitHub, Docker, Networking',
      description: [
        'Reduced manual image annotation time by 60% by developing a Python-based tool that integrated with the Label-Studio API to pre-label images using a SAM2 model.'
      ]
    },
    {
      title: 'Variational Autoencoder (VAE) Implementation',
      tech: 'Python, PyTorch, TensorFlow, NumPy, MNIST, Matplotlib',
      description: [
        'Designed and implemented a generative deep learning model to reconstruct images and generate new synthetic data samples from a learned latent space.',
        'Visualized the learned latent walk in an interactive user interface.'
      ]
    },
    {
      title: 'Network Router Simulator',
      tech: 'C, Binary I/O, Parsing, TCP, UDP, Data Serialization',
      description: [
        'Developed a flow analyzer (hash-based NetFlow, TCP RTT), a router simulator, and an IPv4 binary trace parser in C to quantitatively analyze complex network packet data in short time.'
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
              <a
                href="https://www.linkedin.com/in/alinawaf/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary-600"
              >
                <ExternalLink size={16} />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://alinawaf.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary-600"
              >
                <ExternalLink size={16} />
                <span>alinawaf.com</span>
              </a>
              <a
                href="https://github.com/alinawaf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary-600"
              >
                <ExternalLink size={16} />
                <span>GitHub</span>
              </a>
            </div>
            <a 
              href="/Ali_Nawaf_resume.pdf" 
              download="Ali_Nawaf_resume.pdf"
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
                <h3 className="font-semibold mb-2">Languages</h3>
                <p className="text-gray-700">
                  C, CUDA, Python, Java, Swift, SQL, HTML, CSS, JavaScript (Node.js, Next.js), Rust
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">AI/ML</h3>
                <p className="text-gray-700">
                  PyTorch, TensorFlow, Scikit-learn, NumPy, Pandas, Keras, VAEs, CNN, ResNet, YOLO, LLMs, BERT, Computer Vision, Signal Processing, Model Optimization (Quantization, Pruning)
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Cloud & Tools</h3>
                <p className="text-gray-700">
                  Azure, AWS, Power BI, SLURM, HPC, Kubernetes, Docker, Lambda functions, Linux, Jenkins, REST APIs, Git, GitHub
                </p>
              </div>
            </div>
          </motion.section>
        </div>
      </section>
    </div>
  )
}
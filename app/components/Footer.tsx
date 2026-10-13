import { Github, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold tracking-tight">Ali<span className="text-brand">Nawaf</span></h3>
            <p className="text-muted-foreground text-sm mt-1">Computer Science Student & Developer</p>
          </div>
          
          <div className="flex space-x-6">
            <a
              href="https://github.com/Ali6x1000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <Github size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/alinawaf/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="mailto:aan90@case.edu"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Ali Nawaf. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

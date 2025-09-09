import { motion } from 'motion/react'
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Facebook, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { newsletter } from '../utils/supabase/client'
import { toast } from 'sonner@2.0.3'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleNewsletterSubscription = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsSubscribing(true)
    try {
      await newsletter.subscribe(email)
      toast.success('Successfully subscribed to our newsletter!')
      setEmail('')
    } catch (error: any) {
      toast.error(error.message || 'Subscription failed')
    } finally {
      setIsSubscribing(false)
    }
  }

  const footerLinks = {
    courses: [
      "Web Development",
      "Robotics Training",
      "Cybersecurity",
      "Database Management",
      "Mobile Development",
      "Cloud Computing"
    ],
    company: [
      "About Us",
      "Our Team",
      "Careers",
      "Press",
      "Blog",
      "Contact"
    ],
    support: [
      "Help Center",
      "Student Portal",
      "Documentation",
      "Community",
      "Tutorials",
      "FAQs"
    ]
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl flex items-center justify-center glow-box">
                <span className="text-white font-bold">NSL</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-sky-400 to-sky-600 bg-clip-text text-transparent">
                Next Step Learning
              </span>
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              Empowering the next generation of tech professionals through innovative 
              education, practical skills, and hands-on robotics training.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-4 w-4 text-sky-500" />
                <span className="text-muted-foreground">contact@nsl-education.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="h-4 w-4 text-sky-500" />
                <span className="text-muted-foreground">+250 781 234 567</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="h-4 w-4 text-sky-500" />
                <span className="text-muted-foreground">KN 3 Ave, Kigali, Rwanda</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="hover:text-sky-500 hover:bg-sky-500/10">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-sky-500 hover:bg-sky-500/10">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-sky-500 hover:bg-sky-500/10">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-sky-500 hover:bg-sky-500/10">
                <Facebook className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          {/* Courses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <h3 className="font-bold text-lg">Courses</h3>
            <ul className="space-y-3">
              {footerLinks.courses.map((link) => (
                <li key={link}>
                  <button 
                    className="text-muted-foreground hover:text-sky-500 transition-colors text-left"
                    onClick={() => scrollToSection('courses')}
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="font-bold text-lg">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link}>
                  <button 
                    className="text-muted-foreground hover:text-sky-500 transition-colors text-left"
                    onClick={() => {
                      if (link === 'Our Team') scrollToSection('team')
                      else if (link === 'Contact') scrollToSection('contact')
                      else if (link === 'About Us') scrollToSection('hero')
                    }}
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <h3 className="font-bold text-lg">Stay Updated</h3>
            <p className="text-muted-foreground text-sm">
              Subscribe to our newsletter for the latest courses, tech insights, and learning resources.
            </p>
            
            <form onSubmit={handleNewsletterSubscription} className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 text-white glow-box"
                disabled={isSubscribing}
              >
                {isSubscribing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Subscribing...
                  </>
                ) : (
                  'Subscribe'
                )}
              </Button>
            </form>

            <div className="space-y-3">
              <h4 className="font-medium text-sm">Support</h4>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link}>
                    <button className="text-muted-foreground hover:text-sky-500 transition-colors text-left text-sm">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-border pt-8 mt-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © {currentYear} Next Step Learning (NSL). All rights reserved.
            </div>
            
            <div className="flex space-x-6 text-sm">
              <button className="text-muted-foreground hover:text-sky-500 transition-colors">
                Privacy Policy
              </button>
              <button className="text-muted-foreground hover:text-sky-500 transition-colors">
                Terms of Service
              </button>
              <button className="text-muted-foreground hover:text-sky-500 transition-colors">
                Cookie Policy
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.6 }}
              className="inline-block"
            >
              <span className="text-sm text-muted-foreground">
                Built with ❤️ by the NSL Team • 
              </span>
              <span className="text-sm text-sky-500 ml-1">
                Powered by Innovation
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .glow-box {
          box-shadow: 0 0 15px rgba(14, 165, 233, 0.3);
        }
      `}</style>
    </footer>
  )
}
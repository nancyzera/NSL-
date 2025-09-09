import { motion } from 'motion/react'
import { ArrowRight, Code, Shield, Database } from 'lucide-react'
import { Button } from './ui/button'
import { ImageWithFallback } from './figma/ImageWithFallback'

export function HeroSection() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className="pt-24 pb-16 min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block"
              >
                <span className="bg-gradient-to-r from-sky-400 to-sky-600 text-white px-4 py-2 rounded-full text-sm glow-box">
                  Next Step Learning
                </span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-5xl lg:text-6xl font-bold leading-tight"
              >
                Empowering the Future of
                <span className="block bg-gradient-to-r from-sky-400 to-sky-600 bg-clip-text text-transparent glow-text">
                  Tech Education
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-lg text-muted-foreground max-w-lg"
              >
                We provide cutting-edge technology education, skills development, and robotics training 
                to prepare students for tomorrow's digital world.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                onClick={() => scrollToSection('services')}
                className="bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 text-white glow-box group"
              >
                Explore Services
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                onClick={() => scrollToSection('team')}
                className="border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white"
              >
                Meet Our Team
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex items-center space-x-8 pt-8"
            >
              <div className="flex items-center space-x-2">
                <Code className="h-5 w-5 text-sky-500" />
                <span className="text-sm text-muted-foreground">Full Stack Development</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-sky-500" />
                <span className="text-sm text-muted-foreground">Cybersecurity</span>
              </div>
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-sky-500" />
                <span className="text-sm text-muted-foreground">Database Management</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden glow-box">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1743004873139-5bc0e3d937d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB0ZWNobm9sb2d5JTIwd29ya3NwYWNlfGVufDF8fHx8MTc1NzI2MzU3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Modern tech workspace"
                className="w-full h-auto rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-900/20 to-transparent rounded-2xl"></div>
            </div>
            
            {/* Floating cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="absolute -top-4 -left-4 bg-background/90 backdrop-blur-md rounded-xl p-4 border border-border glow-box"
            >
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm">3 Expert Developers</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="absolute -bottom-4 -right-4 bg-background/90 backdrop-blur-md rounded-xl p-4 border border-border glow-box"
            >
              <div className="text-center">
                <div className="text-xl font-bold text-sky-500">100+</div>
                <div className="text-xs text-muted-foreground">Students Trained</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .glow-box {
          box-shadow: 0 0 20px rgba(14, 165, 233, 0.2);
        }
        .glow-text {
          text-shadow: 0 0 30px rgba(14, 165, 233, 0.3);
        }
      `}</style>
    </section>
  )
}
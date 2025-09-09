import { motion } from 'motion/react'
import { Code, Cpu, Shield, Database, Smartphone, Cloud, BookOpen, Users } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { ImageWithFallback } from './figma/ImageWithFallback'

const services = [
  {
    icon: Code,
    title: "Web Development",
    description: "Full-stack web development using modern frameworks and technologies. Learn React, Node.js, and more.",
    features: ["Frontend Development", "Backend APIs", "Database Integration", "Deployment"],
    color: "from-blue-400 to-blue-600"
  },
  {
    icon: Cpu,
    title: "Robotics Training",
    description: "Hands-on robotics education covering programming, electronics, and mechanical design principles.",
    features: ["Arduino Programming", "Sensor Integration", "Motor Control", "IoT Applications"],
    color: "from-purple-400 to-purple-600"
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    description: "Comprehensive cybersecurity training to protect digital assets and understand threat landscapes.",
    features: ["Network Security", "Ethical Hacking", "Risk Assessment", "Security Protocols"],
    color: "from-red-400 to-red-600"
  },
  {
    icon: Database,
    title: "Database Management",
    description: "Master database design, optimization, and management for modern applications.",
    features: ["SQL & NoSQL", "Database Design", "Performance Tuning", "Data Analytics"],
    color: "from-green-400 to-green-600"
  },
  {
    icon: Smartphone,
    title: "Mobile Development",
    description: "Build native and cross-platform mobile applications for iOS and Android.",
    features: ["React Native", "Flutter", "Native Development", "App Store Deployment"],
    color: "from-pink-400 to-pink-600"
  },
  {
    icon: Cloud,
    title: "Cloud Computing",
    description: "Learn cloud platforms and services to build scalable and reliable applications.",
    features: ["AWS/Azure/GCP", "Microservices", "Containerization", "Serverless"],
    color: "from-indigo-400 to-indigo-600"
  }
]

const stats = [
  { number: "500+", label: "Students Trained" },
  { number: "15+", label: "Courses Available" },
  { number: "95%", label: "Success Rate" },
  { number: "24/7", label: "Support Available" }
]

export function ServicesSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            Our
            <span className="block bg-gradient-to-r from-sky-400 to-sky-600 bg-clip-text text-transparent">
              Learning Services
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We offer comprehensive technology education programs designed to equip students 
            with practical skills for the digital economy. From coding to robotics, 
            we cover all aspects of modern technology.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mb-20">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-background/50 backdrop-blur-sm service-card h-full">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${service.color} text-white mb-4 service-icon-glow`}
                    >
                      <service.icon className="h-7 w-7" />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-sm uppercase tracking-wide text-sky-500">
                      What You'll Learn
                    </h4>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-sky-500 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    variant="ghost"
                    className="w-full mt-6 hover:bg-sky-500/10 hover:text-sky-500 transition-colors group-hover:bg-sky-500/10"
                    onClick={() => scrollToSection('courses')}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-sky-400/10 to-sky-600/10 rounded-2xl p-8 border border-sky-500/20 mb-20"
        >
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-sky-500 mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section with Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-sky-500" />
              <span className="text-sky-500 font-medium">Start Your Journey</span>
            </div>
            
            <h3 className="text-3xl font-bold">
              Ready to Transform Your Career in Technology?
            </h3>
            
            <p className="text-muted-foreground leading-relaxed">
              Join our comprehensive learning programs and gain the skills that top tech companies are looking for. 
              Our hands-on approach ensures you're job-ready from day one.
            </p>

            <div className="flex items-center space-x-4">
              <Users className="h-5 w-5 text-sky-500" />
              <span className="text-sm text-muted-foreground">
                Join 500+ successful graduates working at leading tech companies
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 text-white glow-box"
                onClick={() => scrollToSection('courses')}
              >
                Enroll Now
              </Button>
              <Button 
                variant="outline" 
                className="border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white"
                onClick={() => scrollToSection('courses')}
              >
                View Course Catalog
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden glow-box">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1753613648191-4771cf76f034?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwZWR1Y2F0aW9uJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc1NzMzNzU5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Technology education classroom learning environment"
                className="w-full h-auto rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-900/40 to-transparent rounded-2xl"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        .service-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(14, 165, 233, 0.1);
        }
        .service-icon-glow {
          box-shadow: 0 0 20px rgba(14, 165, 233, 0.2);
        }
        .glow-box {
          box-shadow: 0 0 20px rgba(14, 165, 233, 0.2);
        }
      `}</style>
    </section>
  )
}
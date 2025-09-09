import { motion } from 'motion/react'
import { Mail, Phone, MapPin, Send, MessageSquare, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { contact as contactAPI } from '../utils/supabase/client'
import { toast } from 'sonner@2.0.3'

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await contactAPI.submit(formData.name, formData.email, formData.subject, formData.message)
      toast.success('Message sent successfully! We\'ll get back to you soon.')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            Get In
            <span className="block bg-gradient-to-r from-sky-400 to-sky-600 bg-clip-text text-transparent">
              Touch
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Ready to start your learning journey? Have questions about our courses? 
            We'd love to hear from you and help you achieve your goals.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <p className="text-muted-foreground mb-8">
                Connect with NSL and discover how we can help transform your tech career 
                through our comprehensive education programs.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-sky-500" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Email Address</h4>
                  <p className="text-muted-foreground">contact@nsl-education.com</p>
                  <p className="text-muted-foreground">support@nsl-education.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-sky-500" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Phone Numbers</h4>
                  <p className="text-muted-foreground">+250 781 234 567</p>
                  <p className="text-muted-foreground">+250 788 123 456</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-sky-500" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Office Location</h4>
                  <p className="text-muted-foreground">
                    KN 3 Ave, Kigali<br />
                    Rwanda, East Africa
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-sky-500/10 to-sky-600/10 rounded-2xl p-6 border border-sky-500/20">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Office Hours</h4>
                  <p className="text-muted-foreground text-sm">
                    Monday - Friday: 8:00 AM - 6:00 PM<br />
                    Saturday: 9:00 AM - 4:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border-0 bg-background/50 backdrop-blur-sm shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="What is this about?"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 text-white glow-box"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .glow-box {
          box-shadow: 0 0 20px rgba(14, 165, 233, 0.3);
        }
      `}</style>
    </section>
  )
}
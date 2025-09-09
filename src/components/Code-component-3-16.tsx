import { motion } from 'motion/react'

export function Loading() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <motion.div
          className="w-16 h-16 border-4 border-sky-500/20 border-t-sky-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="text-sky-500 glow"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        >
          <span className="tracking-widest">NSL</span>
        </motion.div>
      </div>
      <style jsx>{`
        .glow {
          text-shadow: 0 0 10px #0ea5e9, 0 0 20px #0ea5e9, 0 0 30px #0ea5e9;
        }
      `}</style>
    </div>
  )
}
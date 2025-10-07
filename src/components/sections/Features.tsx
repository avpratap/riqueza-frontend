'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Zap, Shield, Battery, Smartphone, Leaf, Settings, Users, Award } from 'lucide-react'

const Features = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast Performance",
      description: "Experience incredible acceleration and top speeds with our advanced electric motors.",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: Battery,
      title: "Long Range Battery",
      description: "Go further with our high-capacity batteries that provide extended range on a single charge.",
      color: "from-green-400 to-blue-500"
    },
    {
      icon: Shield,
      title: "Advanced Safety Features",
      description: "Built with cutting-edge safety technology including ABS, traction control, and smart braking.",
      color: "from-red-400 to-pink-500"
    },
    {
      icon: Smartphone,
      title: "Connected Technology",
      description: "Stay connected with your vehicle through our mobile app with real-time monitoring and control.",
      color: "from-blue-400 to-purple-500"
    },
    {
      icon: Leaf,
      title: "Eco-Friendly",
      description: "Zero emissions and sustainable mobility solutions for a greener future.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Settings,
      title: "Smart Maintenance",
      description: "AI-powered diagnostics and predictive maintenance to keep your vehicle running smoothly.",
      color: "from-gray-600 to-blue-600"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Join our growing community of electric vehicle enthusiasts and get support when you need it.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Award,
      title: "Award-Winning Design",
      description: "Recognized for innovative design and engineering excellence in the electric vehicle industry.",
      color: "from-yellow-500 to-orange-600"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <section className="w-full bg-gray-50 pt-8 sm:pt-12 lg:pt-16" ref={ref}>
      <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        {/* Section Header - Responsive */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-6 sm:mb-8 lg:mb-12 px-4 sm:px-6 lg:px-8"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 leading-tight">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-blue-600 via-teal-500 via-green-500 to-yellow-500 bg-clip-text text-transparent">Riqueza Electric</span>?
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover the innovative features and cutting-edge technology that make our electric vehicles 
            the smart choice for modern mobility.
          </p>
        </motion.div>

        {/* Features Grid - Responsive */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 h-full text-center hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                {/* Icon */}
                <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-4 sm:mb-6 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-8 sm:mt-12 lg:mt-16"
        >
        </motion.div>
      </div>
    </section>
  )
}

export default Features

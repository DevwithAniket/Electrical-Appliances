"use client"

import type React from "react"

import Image from "next/image"
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Menu, Youtube, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { sendContactEmail } from "./actions/contact"

// Custom hook for intersection observer
function useIntersectionObserver(options = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true)
          setHasAnimated(true)
        }
      },
      { threshold: 0.1, ...options },
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [hasAnimated])

  return [elementRef, isVisible] as const
}

function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(Math.min(progress, 100))
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="scroll-progress">
      <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />
    </div>
  )
}

function SectionIndicator() {
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "products", "features", "certificates", "vision", "contact"]
      const scrollPosition = window.scrollY + 200

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleDotClick = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerHeight = 80
      const elementPosition = element.offsetTop - headerHeight

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      })
    }
  }

  const sections = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "products", label: "Products" },
    { id: "features", label: "Features" },
    { id: "certificates", label: "Certificates" },
    { id: "vision", label: "Vision" },
    { id: "contact", label: "Contact" },
  ]

  return (
    <div className="section-indicator">
      {sections.map((section) => (
        <div
          key={section.id}
          className={`section-dot ${activeSection === section.id ? "active" : ""}`}
          data-section={section.label}
          onClick={() => handleDotClick(section.id)}
        />
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <ScrollProgress />
      <Header />
      <SectionIndicator />
      <main>
        <HeroSection />
        <AboutSection />
        <ProductsSection />
        <FeaturesSection />
        <CertificatesSection />
        <VisionSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)

      // Update active section based on scroll position
      const sections = ["home", "about", "products", "features", "certificates", "vision", "contact"]
      const scrollPosition = window.scrollY + 100 // Offset for header height

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerHeight = 80 // Approximate header height
      const elementPosition = element.offsetTop - headerHeight

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      })
    }
  }

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "products", label: "Products" },
    { id: "features", label: "Features" },
    { id: "certificates", label: "Certificates" },
    { id: "vision", label: "Vision" },
    { id: "contact", label: "Contact" },
  ]

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg dark:bg-gray-800/95 dark:shadow-gray-700"
          : "bg-white shadow-sm dark:bg-gray-800 dark:shadow-gray-700"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="flex items-center transform hover:scale-105 transition-transform duration-200 cursor-pointer"
            onClick={() => handleNavClick("home")}
          >
            <Image
              src={theme === "dark" ? "/ELICS LOGO PRINT-2.png" : "/ELICS LOGO PRINT-1.png"}
              alt="ELICS Logo"
              width={100}
              height={100}
              className="mr-2 animate-pulse"
            />
          </div>

          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-110"
              aria-label="Toggle dark mode"
            >
              <div className="relative w-6 h-6">
                {theme === "dark" ? (
                  <div className="w-6 h-6 bg-yellow-400 rounded-full shadow-lg animate-pulse">
                    <div className="absolute inset-1 bg-yellow-300 rounded-full"></div>
                    <div className="absolute top-0.5 left-1.5 w-1 h-1 bg-yellow-200 rounded-full"></div>
                  </div>
                ) : (
                  <div className="w-6 h-6 bg-gray-600 rounded-full relative">
                    <div className="absolute inset-1 bg-gray-500 rounded-full"></div>
                    <div className="absolute top-1 left-2 w-0.5 h-0.5 bg-gray-400 rounded-full"></div>
                  </div>
                )}
              </div>
            </button>
          )}
        </div>

        <MobileNav navItems={navItems} activeSection={activeSection} onNavClick={handleNavClick} />

        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`relative group transition-all duration-200 px-2 py-1 rounded-md ${
                activeSection === item.id
                  ? "text-gray-900 font-medium dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              }`}
            >
              {item.label}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-600 to-olive-600 transition-all duration-300 ${
                  activeSection === item.id ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
              {activeSection === item.id && (
                <span className="absolute inset-0 bg-gray-100 rounded-md -z-10 animate-fade-in dark:bg-gray-700"></span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}

function MobileNav({
  navItems,
  activeSection,
  onNavClick,
}: {
  navItems: Array<{ id: string; label: string }>
  activeSection: string
  onNavClick: (id: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  const handleNavClick = (sectionId: string) => {
    onNavClick(sectionId)
    setIsOpen(false)
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isOpen && !target.closest(".mobile-nav-container")) {
        setIsOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [isOpen])

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("click", handleEscape)
  }, [isOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <div className="md:hidden mobile-nav-container">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200 p-2 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700"
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
      >
        <div className="relative w-6 h-6">
          <Menu
            size={24}
            className={`absolute transition-all duration-300 ${
              isOpen ? "opacity-0 rotate-180 scale-75" : "opacity-100 rotate-0 scale-100"
            }`}
          />
          <X
            size={24}
            className={`absolute transition-all duration-300 ${
              isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-180 scale-75"
            }`}
          />
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ top: "80px" }} // Account for header height
      />

      {/* Mobile Menu */}
      <div
        className={`fixed top-20 left-0 right-0 bg-white/95 backdrop-blur-md shadow-xl border-t border-gray-200 transition-all duration-300 transform dark:bg-gray-800/95 dark:border-gray-700 ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col p-4 max-h-[calc(100vh-80px)] overflow-y-auto">
          {navItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-left py-4 px-4 rounded-lg transition-all duration-200 transform hover:translate-x-2 hover:bg-gray-50 relative group mobile-menu-item dark:hover:bg-gray-700 ${
                activeSection === item.id
                  ? "text-gray-900 font-medium bg-gray-50 dark:text-white dark:bg-gray-700"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              }`}
              style={{
                animationDelay: `${index * 50}ms`,
                animation: isOpen ? "slideInRightMobile 0.3s ease-out forwards" : "none",
              }}
            >
              <span className="relative z-10">{item.label}</span>

              {/* Active indicator */}
              {activeSection === item.id && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-600 to-olive-600 rounded-r-full animate-expand-height"></div>
              )}

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg dark:from-gray-700"></div>
            </button>
          ))}

          {/* Contact Info in Mobile Menu */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 py-2">
              <p className="text-sm font-medium text-gray-800 mb-2 dark:text-white">Quick Contact</p>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center">
                  <Phone size={16} className="mr-2" />
                  <span>(+91) 9831061571</span>
                </div>
                <div className="flex items-center">
                  <Mail size={16} className="mr-2" />
                  <span>msroyenterpriseindia@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}

function HeroSection() {
  const [heroRef, isHeroVisible] = useIntersectionObserver()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const heroImages = [
    {
      src: "/hero1.jpg?height=400&width=500",
      alt: "Modern LED Lighting Solutions",
    },
    {
      src: "/hero2.jpg?height=400&width=500",
      alt: "Modern LED Lighting Solutions",
    },
    {
      src: "/hero3.jpg?height=400&width=500",
      alt: "Modern LED Lighting Solutions",
    },
    {
      src: "/hero4.jpg?height=400&width=500",
      alt: "Modern LED Lighting Solutions",
    },
    {
      src: "/hero5.jpg?height=400&width=500",
      alt: "Modern LED Lighting Solutions",
    },
    {
      src: "/hero6.jpg?height=400&width=500",
      alt: "Modern LED Lighting Solutions",
    },
  ]

  // Auto-rotate images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [heroImages.length])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-20 md:py-32 overflow-hidden"
    >
      {/* Enhanced animated background particles */}
      <div className="absolute inset-0">
        {/* Floating geometric shapes */}
        <div
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-xl animate-float"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-green-400/20 to-teal-400/20 rounded-lg blur-lg animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/4 w-12 h-12 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-lg animate-float"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #7c3aed 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, #84cc16 2px, transparent 2px)`,
              backgroundSize: "50px 50px",
              animation: "float 6s ease-in-out infinite",
            }}
          ></div>
        </div>

        {/* Glowing orbs */}
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-float"
          style={{
            left: `${20 + mousePosition.x * 0.02}%`,
            top: `${10 + mousePosition.y * 0.02}%`,
            animationDelay: "0s",
          }}
        />
        <div
          className="absolute w-80 h-80 bg-gradient-to-r from-green-200/30 to-blue-200/30 rounded-full blur-3xl animate-float"
          style={{
            right: `${15 + mousePosition.x * 0.015}%`,
            bottom: `${20 + mousePosition.y * 0.015}%`,
            animationDelay: "1s",
          }}
        />
        <div
          className="absolute w-64 h-64 bg-gradient-to-r from-yellow-200/30 to-orange-200/30 rounded-full blur-3xl animate-float"
          style={{
            left: `${60 + mousePosition.x * 0.01}%`,
            top: `${60 + mousePosition.y * 0.01}%`,
            animationDelay: "2s",
          }}
        />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 border border-purple-200/30 dark:border-purple-700/30 rounded-full"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 border border-blue-200/30 dark:border-blue-700/30 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-green-200/20 dark:border-green-700/20 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div
            className={`md:w-1/2 mb-10 md:mb-0 transform transition-all duration-1000 ${
              isHeroVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
            }`}
          >
            <div className="relative">
              {/* Glowing background for text */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 dark:from-purple-400/20 dark:to-blue-400/20 rounded-2xl blur-2xl"></div>

              <h1 className="relative text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white mb-4 animate-text-reveal">
                <span
                  className="inline-block animate-bounce-in bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent dark:text-yellow-400"
                  style={{ animationDelay: "0.1s" }}
                >
                  ELICS
                </span>{" "}
                <span className="inline-block animate-bounce-in" style={{ animationDelay: "0.2s" }}>
                  Makes Life Easy,
                </span>{" "}
              </h1>

              {/* Enhanced animated underline */}
              <div className="relative">
                <div
                  className="absolute -bottom-5 left-0 h-1 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 animate-expand-width rounded-full"
                  style={{ animationDelay: "0.8s" }}
                ></div>
                <div
                  className="absolute -bottom-3 left-2 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 animate-expand-width rounded-full"
                  style={{ animationDelay: "1s", width: "60%" }}
                ></div>
              </div>
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 animate-fade-in-up animation-delay-200 mt-8">
              Illuminating your world with innovative LED solutions and premium electrical appliances.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-400">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 hover:shadow-lg btn-animate group relative overflow-hidden">
                <span className="relative z-10 group-hover:text-white transition-colors duration-200">
                  <a href="#products">Explore Products</a>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Button>
              <Button
                variant="outline"
                className="border-2 border-green-600 text-green-700 dark:text-green-400 hover:bg-green-500 hover:text-white transform hover:scale-105 transition-all duration-200 hover:shadow-lg btn-animate group relative overflow-hidden bg-transparent"
              >
                <span className="relative z-10 group-hover:text-white transition-colors duration-200">
                  <a href="#contact">Contact Us</a>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Button>
            </div>
          </div>

          <div
            className={`md:w-1/2 flex justify-center transform transition-all duration-1000 delay-300 ${
              isHeroVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            }`}
          >
            <div className="relative group">
              {/* Enhanced image container with multiple effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>

              {/* Image Slider Container */}
              <div className="relative w-[500px] h-[400px] overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 border-4 border-white/20 dark:border-gray-700/20">
                {heroImages.map((image, index) => (
                  <Image
                    key={index}
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    width={500}
                    height={400}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 transform ${
                      index === currentImageIndex ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-110 rotate-1"
                    }`}
                  />
                ))}

                {/* Image indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        currentImageIndex === index ? "bg-white scale-125 shadow-lg" : "bg-white/50 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation arrows */}
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
                >
                  ←
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
                >
                  →
                </button>
              </div>

              {/* Enhanced floating elements */}
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-ping opacity-75 shadow-lg"></div>
              <div className="absolute -bottom-6 -right-6 w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse shadow-lg"></div>
              <div className="absolute top-1/2 -left-10 w-8 h-8 bg-gradient-to-r from-green-400 to-teal-400 rounded-full animate-bounce shadow-lg"></div>
              <div className="absolute top-1/4 -right-8 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-spin shadow-lg"></div>

              {/* Additional decorative elements */}
              <div className="absolute top-0 right-0 w-20 h-20 border-2 border-purple-300/50 dark:border-purple-600/50 rounded-full animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-lg animate-float"></div>

              {/* Enhanced glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function AboutSection() {
  const [aboutRef, isAboutVisible] = useIntersectionObserver()

  return (
    <section ref={aboutRef} id="about" className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">About Us</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-olive-600 mx-auto animate-expand"></div>
        </div>
        <div className="flex flex-col md:flex-row items-center">
          <div
            className={`md:w-1/2 mb-8 md:mb-0 md:pr-8 transform transition-all duration-800 ${
              isAboutVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
            }`}
          >
            <Image
              src="/interior_design_lighting_trends_for_2021.jpg?height=400&width=500"
              alt="About Our Company"
              width={500}
              height={400}
              className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
            />
          </div>
          <div
            className={`md:w-1/2 transform transition-all duration-800 delay-200 ${
              isAboutVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            }`}
          >
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Your Trusted Brand</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 animate-fade-in-up animation-delay-200">
              Welcome to ELICS – Makes Life Easy, Founded in 2024, ELICS is a next-generation Electrical Brand company
              committed to delivering high-performance, energy-efficient lighting solutions and appliances for homes,
              businesses, and industrial applications. Headquartered in Kolkata, West Bengal, our journey began with a
              vision to revolutionize the lighting industry through innovation, sustainability, and uncompromising
              quality.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-6 animate-fade-in-up animation-delay-400">
              We carefully select each product in our lineup to ensure it meets our strict standards for performance,
              energy efficiency, and durability. Our team of experts is always available to help you find the perfect
              electrical solutions for your needs.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { number: "5k+", label: "Happy Customers" },
                { number: "9+", label: "Products" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center animate-fade-in-up"
                  style={{ animationDelay: `${600 + index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-4 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 transform hover:scale-110">
                    <span className="text-gray-800 font-bold dark:text-white">{stat.number}</span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function BrandsSlider() {
  const brands = [
    { name: "Philips", logo: "/ELICS LOGO PRINT-1.svg?height=60&width=120" },
    { name: "Samsung", logo: "/placeholder.svg?height=60&width=120" },
    { name: "LG", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Sony", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Panasonic", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Bosch", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Whirlpool", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Haier", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Godrej", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Bajaj", logo: "/placeholder.svg?height=60&width=120" },
  ]

  // Duplicate brands for seamless infinite scroll
  const duplicatedBrands = [...brands, ...brands]

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Trusted by Leading Brands
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            We've partnered with industry leaders to deliver excellence
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-olive-600 mx-auto mt-4"></div>
        </div>

        <div className="relative">
          {/* Gradient overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-gray-50 dark:from-gray-800 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-gray-50 dark:from-gray-800 to-transparent z-10"></div>

          {/* Sliding container */}
          <div className="flex animate-slide-infinite">
            {duplicatedBrands.map((brand, index) => (
              <div
                key={`${brand.name}-${index}`}
                className="flex-shrink-0 mx-8 flex items-center justify-center"
                style={{ minWidth: "150px" }}
              >
                <div className="group cursor-pointer transform transition-all duration-300 hover:scale-110">
                  <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-4 border border-gray-100 dark:border-gray-600">
                    <Image
                      src={brand.logo || "/placeholder.svg"}
                      alt={`${brand.name} logo`}
                      width={120}
                      height={60}
                      className="h-12 w-auto object-contain mx-auto filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                  <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {brand.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">And many more trusted partners across the industry</p>
        </div>
      </div>
    </section>
  )
}
function CertificatesSection() {
  const [featuresRef, isFeaturesVisible] = useIntersectionObserver()
  const [currentCertificate, setCurrentCertificate] = useState(0)

  const certificates = [
    {
      title: "ISO 9001:2015",
      image: "/9001.jpeg?height=400&width=300",
    },
    {
      title: "ISO 45001:2018",
      image: "/45001.png?height=400&width=300",
    },
    {
      title: "MSME",
      image: "/msme.jpeg?height=400&width=300",
    },
    {
      title: "BIS",
      image: "/rbis.svg?height=400&width=300",
    },
  ]

  // Auto-rotate certificates every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCertificate((prev) => (prev + 1) % certificates.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [certificates.length])

  return (
    <section
      ref={featuresRef}
      id="certificates"
      className="py-16 md:py-24 bg-white dark:bg-gray-900 relative overflow-hidden"
    >
      {/* Animated background waves */}
      <div className="absolute inset-0 opacity-5">
        <svg className="absolute bottom-0 left-0 w-full h-32" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="animate-wave"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.07,7.65V0Z"
            opacity=".5"
            className="animate-wave"
          ></path>
          <path
            d="M0,0V5.63C149.93,59.83,315.09,71.32,475.83,42.57c43.12-8.12,90.06-19.92,133.43-33.74c41.49-13.15,83.22-27.06,125.71-39.77,74.92-22.52,148.72-31.8,222.24-19.63,42.06,6.62,83.32,13.87,124.79,15.63V0Z"
            opacity=".75"
            className="animate-wave"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div
          className={`text-center mb-12 transform transition-all duration-800 ${
            isFeaturesVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4 animate-text-shimmer">
            Our Certifications
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Certified by international standards to ensure quality, safety, and reliability in all our products and
            services.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-olive-600 mx-auto mt-4 animate-expand animation-delay-400"></div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          {certificates.map((certificate, index) => (
            <div
              key={index}
              className={`w-full md:w-1/3 lg:w-1/4 transform transition-all duration-800 ${
                isFeaturesVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              } ${currentCertificate === index ? "scale-110 shadow-2xl z-10" : "scale-95 opacity-75"}`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="relative group">
                  <Image
                    src={certificate.image || "/placeholder.svg"}
                    alt={certificate.title}
                    width={250}
                    height={320}
                    className="w-full h-64 object-contain p-4 transition-all duration-500 group-hover:scale-110"
                  />

                  {/* Certificate badge */}
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 text-center">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{certificate.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rotation indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {certificates.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentCertificate(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentCertificate === index
                  ? "bg-purple-600 scale-125"
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function VisionSection() {
  const [visionRef, isVisionVisible] = useIntersectionObserver()

  return (
    <section ref={visionRef} id="vision" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div
          className={`text-center mb-12 transform transition-all duration-800 ${
            isVisionVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4 animate-text-shimmer">
            Our Vision
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-olive-600 mx-auto mt-4 animate-expand animation-delay-400"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div
            className={`transform transition-all duration-800 delay-200 ${
              isVisionVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 md:p-12 border border-gray-100 dark:border-gray-700">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  At ELICS, we envision a future where innovative lighting and electrical solutions seamlessly integrate
                  into every aspect of modern living. Our commitment extends beyond just manufacturing products – we're
                  dedicated to creating sustainable, energy-efficient solutions that enhance the quality of life for
                  families and businesses across India.
                </p>

                <div className="grid md:grid-cols-2 gap-8 my-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Innovation First</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      We believe in pushing the boundaries of technology to deliver cutting-edge Electrical solutions
                      that are not only efficient but also aesthetically pleasing and user-friendly.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Sustainability Focus</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Our vision includes a commitment to environmental responsibility, developing products that reduce
                      energy consumption and contribute to a greener planet.
                    </p>
                  </div>
                </div>

                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  We see ourselves as pioneers in the electrical industry, constantly evolving to meet the changing
                  needs of our customers. Through continuous research and development, we aim to introduce smart,
                  connected solutions that make homes and workplaces more efficient, comfortable, and secure.
                </p>

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border-l-4 border-purple-600">
                  <p className="text-gray-700 dark:text-gray-300 italic text-center text-lg">
                    "To illuminate every corner of India with innovative, sustainable, and affordable electrical
                    solutions that empower communities and drive progress towards a brighter, more connected future."
                  </p>
                  <p className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                    — ELICS Mission Statement
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductsSection() {
  const [productsRef, isProductsVisible] = useIntersectionObserver()
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)

  const products = [
    {
      name: "LED Flood Light",
      description:
        "Illuminate your outdoor spaces with our powerful,Energy-Efficient LED Flood Light.Built tough for any weather,Delivers long lasting illumination.",
      image: "/product1.jpeg.png?height=200&width=300",
      color: "from-blue-400 to-blue-600",
    },
    {
      name: "LED Ultra-Slim Panel Light",
      description:
        "Focus on Modern Aesthetics & Uniform Light.Enjoy a sleek design, exceptional, energy efficient comfort light that enhances any indoor space.",
      image: "/product2.jpeg?height=200&width=300",
      color: "from-green-400 to-green-600",
    },
    {
      name: "LED Bulb",
      description: "Upgrade to Brilliant, energy-saving LED Bulbs that dramatically cut your electricity bills.",
      image: "/bulbpro.png?height=200&width=300",
      color: "from-orange-200 to-orange-400",
    },
  ]

  return (
    <section
      ref={productsRef}
      id="products"
      className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900 relative overflow-hidden"
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div
          className={`text-center mb-12 transform transition-all duration-800 ${
            isProductsVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4 animate-text-shimmer">
            Our Products
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            Discover our range of high-quality electrical appliances designed to make your life easier and more
            comfortable.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-olive-600 mx-auto mt-4 animate-expand animation-delay-400"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-500 hover:shadow-2xl transform card-hover group relative ${
                isProductsVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
                transform: hoveredProduct === index ? "translateY(-12px) scale(1.03)" : "",
              }}
              onMouseEnter={() => setHoveredProduct(index)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Animated border */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${product.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg`}
              ></div>
              <div className="absolute inset-0.5 bg-white dark:bg-gray-900 rounded-lg z-10"></div>

              <div className="relative z-20">
                <div className="overflow-hidden relative justify-center flex">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-60 h-60 object-cover transition-all duration-500 group-hover:scale-80 group-hover:rotate-1"
                  />

                  {/* Overlay effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${product.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                  ></div>

                  {/* Floating icon */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 dark:bg-gray-700/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span className="text-sm">⚡</span>
                  </div>
                </div>

                <div className="p-6 relative">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-400 transition-colors duration-200">
                    {product.description}
                  </p>

                  {/* Animated progress bar */}
                  <div className="mt-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${product.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const [featuresRef, isFeaturesVisible] = useIntersectionObserver()
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      title: "Energy Efficient",
      description: "Our appliances are designed to minimize energy consumption while maximizing performance.",
      icon: "⚡",
      color: "from-yellow-400 to-orange-500",
    },
    {
      title: "Futuristic Designs",
      description:
        "Pioneering the next era of illumination, merges bold, forward thinking aesthetics with cutting edge technology..",
      icon: "💡",
      color: "from-blue-400 to-purple-500",
    },
    {
      title: "Durable Build",
      description: "Made with high-quality materials to ensure longevity and reliable performance.",
      icon: "🛠️",
      color: "from-green-400 to-teal-500",
    },
    {
      title: "Warranty Coverage",
      description: "All products come with comprehensive warranty and after-sales support.",
      icon: "✅",
      color: "from-emerald-400 to-cyan-500",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section
      ref={featuresRef}
      id="features"
      className="py-16 md:py-24 bg-white dark:bg-gray-900 relative overflow-hidden"
    >
      {/* Animated background waves */}
      <div className="absolute inset-0 opacity-5">
        <svg className="absolute bottom-0 left-0 w-full h-32" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="animate-wave"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.07,7.65V0Z"
            opacity=".5"
            className="animate-wave"
          ></path>
          <path
            d="M0,0V5.63C149.93,59.83,315.09,71.32,475.83,42.57c43.12-8.12,90.06-19.92,133.43-33.74c41.49-13.15,83.22-27.06,125.71-39.77,74.92-22.52,148.72-31.8,222.24-19.63,42.06,6.62,83.32,13.87,124.79,15.63V0Z"
            opacity=".75"
            className="animate-wave"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div
          className={`text-center mb-12 transform transition-all duration-800 ${
            isFeaturesVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4 animate-text-shimmer">
            Smart Features
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experience the future of electrical appliances with our innovative features designed for modern living.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-olive-600 mx-auto mt-4 animate-expand animation-delay-400"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group cursor-pointer transform transition-all duration-800 ${
                isFeaturesVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              } ${
                activeFeature === index ? "scale-105 shadow-2xl" : "hover:scale-105 hover:shadow-xl"
              } bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700`}
              style={{ animationDelay: `${index * 200}ms` }}
              onClick={() => setActiveFeature(index)}
            >
              <div className="relative">
                {/* Animated background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl`}
                ></div>

                {/* Icon container */}
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl transform transition-all duration-300 ${
                    activeFeature === index ? "scale-110 animate-pulse" : "group-hover:scale-110"
                  }`}
                >
                  {feature.icon}
                </div>

                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 text-center group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200">
                  {feature.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 text-center group-hover:text-gray-700 dark:group-hover:text-gray-400 transition-colors duration-200">
                  {feature.description}
                </p>

                {/* Progress indicator */}
                <div className="mt-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${feature.color} transform transition-all duration-500 ${
                      activeFeature === index ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    } origin-left`}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Feature rotation indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveFeature(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeFeature === index
                  ? "bg-purple-600 scale-125"
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  const [contactRef, isContactVisible] = useIntersectionObserver()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus({
        type: "error",
        message: "Please fill in all required fields.",
      })
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus({
        type: "error",
        message: "Please enter a valid email address.",
      })
      return
    }

    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    try {
      const formDataObj = new FormData()
      formDataObj.append("name", formData.name)
      formDataObj.append("email", formData.email)
      formDataObj.append("phone", formData.phone)
      formDataObj.append("message", formData.message)

      const result = await sendContactEmail(null, formDataObj)

      if (result.success) {
        setSubmitStatus({
          type: "success",
          message: result.message,
        })
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        })
      } else {
        setSubmitStatus({
          type: "error",
          message: result.message,
        })
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitStatus({
        type: "error",
        message: "Failed to send message. Please try again or contact us directly.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      ref={contactRef}
      id="contact"
      className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800 relative overflow-hidden"
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fillOpacity='0.1'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20v20h40V20H20z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div
          className={`text-center mb-12 transform transition-all duration-800 ${
            isContactVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4 animate-text-shimmer">
            Get In Touch
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have questions about our products or need assistance? We're here to help you find the perfect electrical
            solutions.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-olive-600 mx-auto mt-4 animate-expand animation-delay-400"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div
            className={`transform transition-all duration-800 delay-200 ${
              isContactVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
            }`}
          >
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Contact Information</h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-4 group">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors duration-200">
                    <MapPin className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Address</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      37/2, Kamini School Lane, Salkia, Howrah - 711106
                      <br />
                      West Bengal, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-colors duration-200">
                    <Phone className="text-green-600 dark:text-green-400" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Phone</h4>
                    <p className="text-gray-600 dark:text-gray-300">(+91) 9831061571</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors duration-200">
                    <Mail className="text-purple-600 dark:text-purple-400" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Email</h4>
                    <p className="text-gray-600 dark:text-gray-300 break-all text-sm sm:text-base">customercare.elics@gmail.com</p>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  {[
                    {
                      icon: Facebook,
                      color: "text-blue-600",
                      bg: "bg-blue-100 dark:bg-blue-900/30",
                      href: "https://www.facebook.com/share/16dYGvdHqi/",
                    },
                    {
                      icon: Instagram,
                      color: "text-pink-600",
                      bg: "bg-pink-100 dark:bg-pink-900/30",
                      href: "https://www.instagram.com/elicsindia?igsh=MTdocjFyajN3MmFkZQ==",
                    },
                    {
                      icon: Twitter,
                      color: "text-blue-400",
                      bg: "bg-blue-100 dark:bg-blue-900/30",
                      href: "https://x.com/Elicsindia?t=Dt7v4DJECcR0mqra8xna3w&s=09",
                    },
                    {
                      icon: Youtube,
                      color: "text-red-600",
                      bg: "bg-red-100 dark:bg-red-900/30",
                      href: "https://youtube.com/@elicsindia?si=o8izwhoacLBspWbm",
                    },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${social.bg} p-3 rounded-full hover:scale-110 transition-all duration-200 group inline-block`}
                    >
                      <social.icon
                        className={`${social.color} group-hover:scale-110 transition-transform duration-200`}
                        size={20}
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div
            className={`transform transition-all duration-800 delay-400 ${
              isContactVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            }`}
          >
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Send us a Message</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 resize-none"
                    placeholder="Tell us about your requirements or questions..."
                  ></textarea>
                </div>

                {/* Status Message */}
                {submitStatus.type && (
                  <div
                    className={`p-4 rounded-lg border ${
                      submitStatus.type === "success"
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                        : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">{submitStatus.type === "success" ? "✅" : "❌"}</span>
                      {submitStatus.message}
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white py-12 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <Image src="/ELICS LOGO PRINT-2.png" alt="ELICS Logo" width={80} height={80} className="mr-3" />
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Leading manufacturer of premium LED lighting solutions and electrical appliances. Committed to innovation,
              quality, and customer satisfaction since 2024.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, color: "hover:text-blue-400", href: "https://www.facebook.com/share/16dYGvdHqi/" },
                { icon: Instagram, color: "hover:text-pink-400", href: "https://www.instagram.com/elicsindia?igsh=MTdocjFyajN3MmFkZQ==" },
                { icon: Twitter, color: "hover:text-blue-300", href: "https://x.com/Elicsindia?t=Dt7v4DJECcR0mqra8xna3w&s=09" },
                { icon: Youtube, color: "hover:text-red-400", href: "https://youtube.com/@elicsindia?si=o8izwhoacLBspWbm" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 ${social.color} transition-all duration-200 transform hover:scale-110 p-2 rounded-full hover:bg-gray-800`}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "About", "Products", "Features", "Certificates", "Vision", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-gray-400 hover:text-white transition-colors duration-200 hover:underline"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center text-gray-400">
                <MapPin size={16} className="mr-2 flex-shrink-0" />
                <span className="text-sm">37/2, Kamini School Lane, Salkia, Howrah - 711106, West Bengal, India</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Phone size={16} className="mr-2 flex-shrink-0" />
                <span className="text-sm">(+91) 9831061571</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Mail size={16} className="mr-2 flex-shrink-0" />
                <span className="text-sm">customercare.elics@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} ELICS. All rights reserved. | Designed with ❤️ for a brighter future.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

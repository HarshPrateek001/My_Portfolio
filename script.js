// Theme Toggle Functionality
class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById("theme-toggle")
    this.sunIcon = document.getElementById("sun-icon")
    this.moonIcon = document.getElementById("moon-icon")
    this.particleAnimation = null // Will be set by ParticleAnimation
    this.init()
  }

  init() {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem("theme")
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    const shouldBeDark = savedTheme === "dark" || (!savedTheme && systemPrefersDark)

    this.setTheme(shouldBeDark)
    this.themeToggle.addEventListener("click", () => this.toggleTheme())
  }

  setTheme(isDark) {
    if (isDark) {
      document.documentElement.classList.add("dark")
      this.sunIcon.style.opacity = "0"
      this.moonIcon.style.opacity = "1"
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      this.sunIcon.style.opacity = "1"
      this.moonIcon.style.opacity = "0"
      localStorage.setItem("theme", "light")
    }
    
    // Update particle colors when theme changes
    this.updateParticleColors()
  }

  toggleTheme() {
    const isDark = document.documentElement.classList.contains("dark")
    this.setTheme(!isDark)
  }

  updateParticleColors() {
    if (this.particleAnimation) {
      this.particleAnimation.updateParticleColors()
    }
  }

  setParticleAnimation(particleAnimation) {
    this.particleAnimation = particleAnimation
  }
}

// Mobile Menu Functionality
class MobileMenu {
  constructor() {
    this.mobileMenuBtn = document.getElementById("mobile-menu-btn")
    this.mobileMenu = document.getElementById("mobile-menu")
    this.mobileMenuClose = document.getElementById("mobile-menu-close")
    this.mobileMenuLinks = document.querySelectorAll(".mobile-menu-link")
    this.init()
  }

  init() {
    this.mobileMenuBtn.addEventListener("click", () => this.openMenu())
    this.mobileMenuClose.addEventListener("click", () => this.closeMenu())

    this.mobileMenuLinks.forEach((link) => {
      link.addEventListener("click", () => this.closeMenu())
    })
  }

  openMenu() {
    this.mobileMenu.classList.add("open")
  }

  closeMenu() {
    this.mobileMenu.classList.remove("open")
  }
}

// Performance monitoring and adaptive quality
class PerformanceMonitor {
  constructor() {
    this.frameCount = 0
    this.lastTime = performance.now()
    this.fps = 60
    this.qualityLevel = 'high'
    this.performanceHistory = []
    this.maxHistoryLength = 10
    
    this.startMonitoring()
  }
  
  startMonitoring() {
    this.monitorFrame()
  }
  
  monitorFrame() {
    this.frameCount++
    const currentTime = performance.now()
    
    if (currentTime - this.lastTime >= 1000) {
      this.fps = this.frameCount
      this.frameCount = 0
      this.lastTime = currentTime
      
      this.performanceHistory.push(this.fps)
      if (this.performanceHistory.length > this.maxHistoryLength) {
        this.performanceHistory.shift()
      }
      
      this.adjustQuality()
    }
    
    requestAnimationFrame(() => this.monitorFrame())
  }
  
  adjustQuality() {
    const avgFps = this.performanceHistory.reduce((a, b) => a + b, 0) / this.performanceHistory.length
    
    if (avgFps < 30 && this.qualityLevel !== 'low') {
      this.qualityLevel = 'low'
      this.applyLowQualitySettings()
    } else if (avgFps < 45 && this.qualityLevel !== 'medium') {
      this.qualityLevel = 'medium'
      this.applyMediumQualitySettings()
    } else if (avgFps > 55 && this.qualityLevel !== 'high') {
      this.qualityLevel = 'high'
      this.applyHighQualitySettings()
    }
  }
  
  applyLowQualitySettings() {
    // Reduce particle count and effects
    if (window.particleAnimation) {
      window.particleAnimation.maxConnections = 30
      window.particleAnimation.maxEffects = 20
      window.particleAnimation.targetFPS = 30
    }
  }
  
  applyMediumQualitySettings() {
    if (window.particleAnimation) {
      window.particleAnimation.maxConnections = 60
      window.particleAnimation.maxEffects = 35
      window.particleAnimation.targetFPS = 45
    }
  }
  
  applyHighQualitySettings() {
    if (window.particleAnimation) {
      window.particleAnimation.maxConnections = 100
      window.particleAnimation.maxEffects = 50
      window.particleAnimation.targetFPS = 60
    }
  }
}

// Initialize performance monitor
const performanceMonitor = new PerformanceMonitor()

// Skill Bar Animation System
class SkillBarAnimation {
  constructor() {
    this.skillItems = document.querySelectorAll('.skill-item')
    this.animatedSkills = new Set()
    this.init()
  }
  
  init() {
    this.setupIntersectionObserver()
    this.setupSkillBars()
  }
  
  setupSkillBars() {
    this.skillItems.forEach(skillItem => {
      const skillBar = skillItem.querySelector('.skill-bar')
      const percentageText = skillItem.querySelector('.text-sm')
      
      if (skillBar && percentageText) {
        const percentage = parseInt(percentageText.textContent.replace('%', ''))
        skillBar.style.setProperty('--skill-percentage', `${percentage}%`)
        
        // Add loading state initially
        skillItem.classList.add('loading')
      }
    })
  }
  
  setupIntersectionObserver() {
    const options = {
      threshold: 0.3,
      rootMargin: '0px 0px -50px 0px'
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animatedSkills.has(entry.target)) {
          this.animateSkillBar(entry.target)
          this.animatedSkills.add(entry.target)
        }
      })
    }, options)
    
    this.skillItems.forEach(skillItem => {
      observer.observe(skillItem)
    })
  }
  
  animateSkillBar(skillItem) {
    const skillBar = skillItem.querySelector('.skill-bar')
    const percentageText = skillItem.querySelector('.text-sm')
    
    if (!skillBar || !percentageText) return
    
    // Remove loading state
    skillItem.classList.remove('loading')
    
    // Add animation class
    skillItem.classList.add('animate')
    
    // Animate the skill bar
    setTimeout(() => {
      skillBar.style.width = skillBar.style.getPropertyValue('--skill-percentage')
      
      // Add completion effect
      setTimeout(() => {
        skillItem.classList.add('completed')
        skillItem.classList.remove('animate')
        
        // Add success state for high percentages
        const percentage = parseInt(percentageText.textContent.replace('%', ''))
        if (percentage >= 90) {
          skillItem.classList.add('success')
        } else if (percentage >= 70) {
          skillItem.classList.add('warning')
        } else if (percentage < 50) {
          skillItem.classList.add('danger')
        }
      }, 2000)
    }, 100)
  }
  
  resetAnimations() {
    this.skillItems.forEach(skillItem => {
      const skillBar = skillItem.querySelector('.skill-bar')
      if (skillBar) {
        skillBar.style.width = '0%'
        skillItem.classList.remove('animate', 'completed', 'success', 'warning', 'danger')
        skillItem.classList.add('loading')
      }
    })
    this.animatedSkills.clear()
  }
}

// Particle Animation
class ParticleAnimation {
  constructor() {
    this.container = document.getElementById("particles-container")
    this.particles = []
    this.mouse = { x: 0, y: 0 }
    this.isMouseMoving = false
    this.mouseTimeout = null
    this.connectionDistance = 150
    this.isAttracting = false
    this.attractionCenter = { x: 0, y: 0 }
    this.attractionForce = 0
    this.explosionActive = false
    this.lastClickTime = 0
    this.doubleClickDelay = 300
    
    // Performance optimizations
    this.animationId = null
    this.lastFrameTime = 0
    this.targetFPS = 60
    this.frameInterval = 1000 / this.targetFPS
    this.connectionPool = []
    this.effectPool = []
    this.maxConnections = 100 // Limit connections for performance
    this.maxEffects = 50 // Limit visual effects
    
    // Adaptive quality settings
    this.adaptiveQuality = true
    this.qualityMultiplier = 1
    
    this.init()
  }

  init() {
    this.createParticles()
    this.animate()
    this.addMouseListeners()
    this.addTouchListeners()
    
    // Store reference for performance monitor
    window.particleAnimation = this
  }

  createParticles() {
    // Adaptive particle count based on device performance
    const baseCount = window.innerWidth > 768 ? 50 : 30
    const particleCount = Math.floor(baseCount * this.qualityMultiplier)

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div")
      particle.className = "particle"

      // Enhanced size range with larger particles
      const size = Math.random() * 12 + 8
      const x = Math.random() * window.innerWidth
      const y = Math.random() * window.innerHeight
      const hue = Math.random() * 60 + 220
      const speed = Math.random() * 0.8 + 0.2

      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.left = `${x}px`
      particle.style.top = `${y}px`
      
      // Enhanced colors with better opacity for both light and dark modes
      const isDark = document.documentElement.classList.contains("dark")
      if (isDark) {
        particle.style.backgroundColor = `hsla(${hue}, 80%, 70%, 0.5)`
        particle.style.boxShadow = `0 0 ${size * 3}px hsla(${hue}, 80%, 70%, 0.4)`
      } else {
        particle.style.backgroundColor = `hsla(${hue}, 70%, 50%, 0.6)`
        particle.style.boxShadow = `0 0 ${size * 3}px hsla(${hue}, 70%, 50%, 0.5)`
      }
      
      particle.style.animationDelay = `${Math.random() * 6}s`

      this.container.appendChild(particle)
      this.particles.push({
        element: particle,
        x: x,
        y: y,
        originalX: x,
        originalY: y,
        speedX: (Math.random() - 0.5) * speed,
        speedY: (Math.random() - 0.5) * speed,
        hue: hue,
        size: size,
        speed: speed,
        pulsePhase: Math.random() * Math.PI * 2,
        originalSpeedX: 0,
        originalSpeedY: 0,
        // Performance optimizations
        lastUpdate: 0,
        updateInterval: 16 // Update every 16ms (60fps)
      })
    }
  }

  addMouseListeners() {
    // Throttled mouse move for better performance
    let mouseMoveThrottle
    document.addEventListener('mousemove', (e) => {
      if (mouseMoveThrottle) return
      
      mouseMoveThrottle = setTimeout(() => {
        this.mouse.x = e.clientX
        this.mouse.y = e.clientY
        this.isMouseMoving = true
        
        if (this.mouseTimeout) {
          clearTimeout(this.mouseTimeout)
        }
        
        this.mouseTimeout = setTimeout(() => {
          this.isMouseMoving = false
        }, 2000)
        
        mouseMoveThrottle = null
      }, 16) // 60fps throttle
    })

    // Enhanced click handling with double-click detection
    document.addEventListener('click', (e) => {
      const currentTime = new Date().getTime()
      const timeDiff = currentTime - this.lastClickTime
      
      if (timeDiff < this.doubleClickDelay) {
        this.startAttraction(e.clientX, e.clientY)
      } else {
        this.createClickEffect(e.clientX, e.clientY)
      }
      
      this.lastClickTime = currentTime
    })
  }

  addTouchListeners() {
    let lastTap = 0
    let touchMoveThrottle
    
    document.addEventListener('touchstart', (e) => {
      const touch = e.touches[0]
      this.mouse.x = touch.clientX
      this.mouse.y = touch.clientY
      this.isMouseMoving = true
      
      if (this.mouseTimeout) {
        clearTimeout(this.mouseTimeout)
      }
      
      this.mouseTimeout = setTimeout(() => {
        this.isMouseMoving = false
      }, 2000)
    })

    document.addEventListener('touchmove', (e) => {
      if (touchMoveThrottle) return
      
      touchMoveThrottle = setTimeout(() => {
        const touch = e.touches[0]
        this.mouse.x = touch.clientX
        this.mouse.y = touch.clientY
        touchMoveThrottle = null
      }, 16)
    })

    document.addEventListener('touchend', (e) => {
      const currentTime = new Date().getTime()
      const tapLength = currentTime - lastTap
      
      if (tapLength < 500 && tapLength > 0) {
        const touch = e.changedTouches[0]
        this.startAttraction(touch.clientX, touch.clientY)
      }
      
      lastTap = currentTime
    })
  }

  startAttraction(x, y) {
    if (this.isAttracting || this.explosionActive) return
    
    this.isAttracting = true
    this.attractionCenter = { x: x, y: y }
    this.attractionForce = 0
    
    // Store original speeds
    this.particles.forEach(particle => {
      particle.originalSpeedX = particle.speedX
      particle.originalSpeedY = particle.speedY
    })
    
    // Create attraction visual effect
    this.createAttractionEffect(x, y)
    
    // Start attraction animation
    this.attractParticles()
    
    // Schedule explosion after 4-5 seconds
    setTimeout(() => {
      this.triggerExplosion(x, y)
    }, 4000 + Math.random() * 1000)
  }

  createAttractionEffect(x, y) {
    // Reuse effect from pool if available
    let attractionPoint = this.effectPool.pop()
    if (!attractionPoint) {
      attractionPoint = document.createElement('div')
      attractionPoint.className = 'attraction-point'
    }
    
    attractionPoint.style.left = `${x}px`
    attractionPoint.style.top = `${y}px`
    this.container.appendChild(attractionPoint)
    
    setTimeout(() => {
      if (attractionPoint.parentNode) {
        attractionPoint.parentNode.removeChild(attractionPoint)
        this.effectPool.push(attractionPoint)
      }
    }, 5000)
  }

  attractParticles() {
    if (!this.isAttracting) return
    
    this.attractionForce += 0.08
    
    this.particles.forEach(particle => {
      const distance = Math.sqrt(
        Math.pow(particle.x - this.attractionCenter.x, 2) + 
        Math.pow(particle.y - this.attractionCenter.y, 2)
      )
      
      if (distance > 3) {
        const angle = Math.atan2(
          this.attractionCenter.y - particle.y, 
          this.attractionCenter.x - particle.x
        )
        
        const force = this.attractionForce * (1 / (distance * 0.005 + 1))
        
        particle.speedX = Math.cos(angle) * force * 8
        particle.speedY = Math.sin(angle) * force * 8
        
        const glowIntensity = Math.max(0, 1 - distance / 150)
        particle.element.style.transform = `scale(${1 + glowIntensity * 1.2})`
        particle.element.style.filter = `brightness(${1 + glowIntensity * 1.5})`
      }
    })
    
    if (this.isAttracting) {
      requestAnimationFrame(() => this.attractParticles())
    }
  }

  triggerExplosion(x, y) {
    this.isAttracting = false
    this.explosionActive = true
    
    this.createEnhancedExplosionEffect(x, y)
    
    this.particles.forEach(particle => {
      const distance = Math.sqrt(
        Math.pow(particle.x - x, 2) + Math.pow(particle.y - y, 2)
      )
      
      const angle = Math.atan2(particle.y - y, particle.x - x)
      const explosionForce = Math.max(15, 35 - distance * 0.2)
      
      particle.speedX = Math.cos(angle) * explosionForce + (Math.random() - 0.5) * 8
      particle.speedY = Math.sin(angle) * explosionForce + (Math.random() - 0.5) * 8
      
      particle.element.style.transform = 'scale(2.5)'
      particle.element.style.filter = 'brightness(3) hue-rotate(180deg) contrast(1.5)'
      particle.element.classList.add('exploding')
      
      setTimeout(() => {
        particle.element.style.transform = 'scale(1)'
        particle.element.style.filter = 'brightness(1) hue-rotate(0deg) contrast(1)'
        particle.element.classList.remove('exploding')
      }, 1500)
    })
    
    setTimeout(() => {
      this.explosionActive = false
      this.resetParticleSpeeds()
    }, 3000)
  }

  createEnhancedExplosionEffect(x, y) {
    // Limit effects for performance
    const maxRings = Math.min(5, this.maxEffects / 10)
    const maxBurstParticles = Math.min(40, this.maxEffects / 2)
    
    for (let i = 0; i < maxRings; i++) {
      const explosionRing = this.getEffectFromPool('explosion-ring') || document.createElement('div')
      explosionRing.className = 'explosion-ring'
      explosionRing.style.left = `${x}px`
      explosionRing.style.top = `${y}px`
      explosionRing.style.animationDelay = `${i * 0.15}s`
      explosionRing.style.borderColor = `rgba(${255 - i * 30}, ${100 + i * 20}, ${50 + i * 30}, 0.8)`
      this.container.appendChild(explosionRing)
      
      setTimeout(() => {
        if (explosionRing.parentNode) {
          explosionRing.parentNode.removeChild(explosionRing)
          this.returnEffectToPool(explosionRing)
        }
      }, 3000)
    }
    
    for (let i = 0; i < maxBurstParticles; i++) {
      const burstParticle = this.getEffectFromPool('burst-particle') || document.createElement('div')
      burstParticle.className = 'burst-particle'
      burstParticle.style.left = `${x}px`
      burstParticle.style.top = `${y}px`
      burstParticle.style.transform = `rotate(${Math.random() * 360}deg)`
      burstParticle.style.animationDelay = `${Math.random() * 0.5}s`
      this.container.appendChild(burstParticle)
      
      setTimeout(() => {
        if (burstParticle.parentNode) {
          burstParticle.parentNode.removeChild(burstParticle)
          this.returnEffectToPool(burstParticle)
        }
      }, 2000)
    }
    
    this.createShockwaveEffect(x, y)
    this.createEnergyFieldEffect(x, y)
  }

  createShockwaveEffect(x, y) {
    for (let i = 0; i < 3; i++) {
      const shockwave = this.getEffectFromPool('shockwave-effect') || document.createElement('div')
      shockwave.className = 'shockwave-effect'
      shockwave.style.left = `${x}px`
      shockwave.style.top = `${y}px`
      shockwave.style.animationDelay = `${i * 0.2}s`
      this.container.appendChild(shockwave)
      
      setTimeout(() => {
        if (shockwave.parentNode) {
          shockwave.parentNode.removeChild(shockwave)
          this.returnEffectToPool(shockwave)
        }
      }, 2500)
    }
  }

  createEnergyFieldEffect(x, y) {
    const energyField = this.getEffectFromPool('energy-field') || document.createElement('div')
    energyField.className = 'energy-field'
    energyField.style.left = `${x}px`
    energyField.style.top = `${y}px`
    this.container.appendChild(energyField)
    
    setTimeout(() => {
      if (energyField.parentNode) {
        energyField.parentNode.removeChild(energyField)
        this.returnEffectToPool(energyField)
      }
    }, 2000)
  }

  getEffectFromPool(type) {
    return this.effectPool.find(effect => effect.className === type)
  }

  returnEffectToPool(effect) {
    if (this.effectPool.length < this.maxEffects) {
      this.effectPool.push(effect)
    }
  }

  resetParticleSpeeds() {
    this.particles.forEach(particle => {
      particle.speedX = particle.originalSpeedX
      particle.speedY = particle.originalSpeedY
    })
  }

  createClickEffect(x, y) {
    const ripple = this.getEffectFromPool('particle-ripple') || document.createElement('div')
    ripple.className = 'particle-ripple'
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`
    this.container.appendChild(ripple)

    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple)
        this.returnEffectToPool(ripple)
      }
    }, 1000)

    this.particles.forEach(particle => {
      const distance = Math.sqrt(
        Math.pow(particle.x - x, 2) + Math.pow(particle.y - y, 2)
      )
      
      if (distance < 100) {
        const force = (100 - distance) / 100
        particle.speedX += (x - particle.x) * force * 0.01
        particle.speedY += (y - particle.y) * force * 0.01
        
        particle.element.style.transform = 'scale(1.5)'
        particle.element.style.filter = 'brightness(1.5)'
        
        setTimeout(() => {
          particle.element.style.transform = 'scale(1)'
          particle.element.style.filter = 'brightness(1)'
        }, 500)
      }
    })
  }

  animate(currentTime = 0) {
    // Frame rate limiting for consistent performance
    if (currentTime - this.lastFrameTime < this.frameInterval) {
      this.animationId = requestAnimationFrame((time) => this.animate(time))
      return
    }
    
    this.lastFrameTime = currentTime

    this.particles.forEach((particle, index) => {
      // Update pulse phase
      particle.pulsePhase += 0.05
      
      // Mouse interaction (only when not attracting or exploding)
      if (this.isMouseMoving && !this.isAttracting && !this.explosionActive) {
        const distance = Math.sqrt(
          Math.pow(particle.x - this.mouse.x, 2) + Math.pow(particle.y - this.mouse.y, 2)
        )
        
        if (distance < 120) {
          const force = (120 - distance) / 120
          const angle = Math.atan2(particle.y - this.mouse.y, particle.x - this.mouse.x)
          
          particle.speedX += Math.cos(angle) * force * 0.5
          particle.speedY += Math.sin(angle) * force * 0.5
          
          particle.element.style.transform = 'scale(1.2)'
          particle.element.style.filter = 'brightness(1.3)'
        } else {
          particle.element.style.transform = 'scale(1)'
          particle.element.style.filter = 'brightness(1)'
        }
      }

      // Apply speed limits
      particle.speedX = Math.max(-8, Math.min(8, particle.speedX))
      particle.speedY = Math.max(-8, Math.min(8, particle.speedY))

      // Update position
      particle.x += particle.speedX
      particle.y += particle.speedY

      // Boundary wrapping with smooth transition
      if (particle.x > window.innerWidth + 50) {
        particle.x = -50
      } else if (particle.x < -50) {
        particle.x = window.innerWidth + 50
      }

      if (particle.y > window.innerHeight + 50) {
        particle.y = -50
      } else if (particle.y < -50) {
        particle.y = window.innerHeight + 50
      }

      // Apply position
      particle.element.style.left = `${particle.x}px`
      particle.element.style.top = `${particle.y}px`

      // Add subtle floating motion (only when not in special states)
      if (!this.isAttracting && !this.explosionActive) {
        const floatOffset = Math.sin(particle.pulsePhase) * 2
        particle.element.style.transform += ` translateY(${floatOffset}px)`
      }
    })

    // Draw connections between nearby particles (only when not exploding)
    if (!this.explosionActive) {
      this.drawConnections()
    }

    this.animationId = requestAnimationFrame((time) => this.animate(time))
  }

  drawConnections() {
    // Remove old connection lines
    const oldLines = this.container.querySelectorAll('.particle-connection')
    oldLines.forEach(line => {
      line.remove()
      this.returnEffectToPool(line)
    })

    // Create new connections with enhanced visibility (limited for performance)
    let connectionCount = 0
    
    for (let i = 0; i < this.particles.length && connectionCount < this.maxConnections; i++) {
      for (let j = i + 1; j < this.particles.length && connectionCount < this.maxConnections; j++) {
        const particle1 = this.particles[i]
        const particle2 = this.particles[j]
        
        const distance = Math.sqrt(
          Math.pow(particle1.x - particle2.x, 2) + Math.pow(particle1.y - particle2.y, 2)
        )
        
        if (distance < this.connectionDistance) {
          const opacity = 1 - (distance / this.connectionDistance)
          const line = this.getEffectFromPool('particle-connection') || document.createElement('div')
          line.className = 'particle-connection'
          
          const angle = Math.atan2(particle2.y - particle1.y, particle2.x - particle1.x)
          const length = distance
          
          line.style.position = 'absolute'
          line.style.left = `${particle1.x}px`
          line.style.top = `${particle1.y}px`
          line.style.width = `${length}px`
          line.style.height = '3px'
          line.style.background = `linear-gradient(90deg, 
            hsla(${particle1.hue}, 80%, 70%, ${opacity * 0.8}), 
            hsla(${particle2.hue}, 80%, 70%, ${opacity * 0.8}))`
          line.style.transform = `rotate(${angle}rad)`
          line.style.transformOrigin = '0 0'
          line.style.pointerEvents = 'none'
          line.style.boxShadow = `0 0 8px hsla(${particle1.hue}, 80%, 70%, ${opacity * 0.5})`
          line.style.borderRadius = '2px'
          
          this.container.appendChild(line)
          connectionCount++
        }
      }
    }
  }

  updateParticleColors() {
    const isDark = document.documentElement.classList.contains("dark")
    
    this.particles.forEach((particle) => {
      if (isDark) {
        particle.element.style.backgroundColor = `hsla(${particle.hue}, 80%, 70%, 0.5)`
        particle.element.style.boxShadow = `0 0 ${particle.size * 3}px hsla(${particle.hue}, 80%, 70%, 0.4)`
      } else {
        particle.element.style.backgroundColor = `hsla(${particle.hue}, 70%, 50%, 0.6)`
        particle.element.style.boxShadow = `0 0 ${particle.size * 3}px hsla(${particle.hue}, 70%, 50%, 0.5)`
      }
    })
  }

  updateForScroll(scrollY) {
    const scrollFactor = scrollY / window.innerHeight
    this.connectionDistance = 150 + scrollFactor * 50
  }

  // Cleanup method for better memory management
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    this.container.innerHTML = ''
    this.particles = []
    this.effectPool = []
    this.connectionPool = []
  }
}

// Scroll Animations
class ScrollAnimations {
  constructor() {
    this.elements = document.querySelectorAll(".fade-in")
    this.counters = document.querySelectorAll(".counter")
    this.skillBars = document.querySelectorAll(".skill-bar")
    this.init()
  }

  init() {
    this.observeElements()
    this.handleScroll()
  }

  observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
          entry.target.classList.add("animate")

          // Animate counters if this is a counter element
          if (entry.target.classList.contains("counter")) {
              this.animateCounters(entry.target)
            }

          // Animate skill bars if this is a skill bar element
          if (entry.target.closest(".skill-item")) {
            this.animateSkillBars(entry.target.closest(".skill-item"))
          }
        }
      })
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    })

    this.elements.forEach((element) => observer.observe(element))
  }

  animateCounters(container) {
    const counter = container
    const target = parseInt(counter.getAttribute("data-target"))
      const duration = 2000
      const step = target / (duration / 16)

      let current = 0
      const updateCounter = () => {
        current += step
        if (current < target) {
          counter.textContent = Math.floor(current)
          requestAnimationFrame(updateCounter)
        } else {
          counter.textContent = target
        }
      }
      updateCounter()
  }

  animateSkillBars(container) {
    const skillBar = container.querySelector(".skill-bar")
    if (skillBar) {
      const percentage = skillBar.style.getPropertyValue("--skill-percentage")
      skillBar.style.width = percentage
    }
  }

  handleScroll() {
    window.addEventListener("scroll", () => {
      // Additional scroll-based animations can be added here
    })
  }
}

// Contact Form
class ContactForm {
  constructor() {
    this.form = document.getElementById("contact-form")
    this.submitBtn = document.getElementById("submit-btn")
    this.submitText = document.getElementById("submit-text")
    this.submitIcon = document.getElementById("submit-icon")
    this.submitLoading = document.getElementById("submit-loading")
    this.formStatus = document.getElementById("form-status")
    this.init()
  }

  init() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e))
  }

  async handleSubmit(e) {
    e.preventDefault()
    
    this.setLoadingState(true)

    const formData = new FormData(this.form)
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message")
    }

    try {
      await this.sendEmail(data)
      this.showStatus("success", "Message sent successfully! I'll get back to you soon.")
      this.form.reset()
    } catch (error) {
      console.error("Error sending email:", error)
      this.showStatus("error", "Failed to send message. Please try again.")
    } finally {
      this.setLoadingState(false)
    }
  }

  async sendEmail(data) {
    // Initialize EmailJS
    emailjs.init("YOUR_USER_ID") // Replace with your EmailJS user ID

    const templateParams = {
            from_name: data.name,
            from_email: data.email,
            subject: data.subject,
            message: data.message
    }

    return emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
  }

  setLoadingState(isLoading) {
    if (isLoading) {
      this.submitText.textContent = "Sending..."
      this.submitIcon.classList.add("hidden")
      this.submitLoading.classList.remove("hidden")
      this.submitBtn.disabled = true
    } else {
      this.submitText.textContent = "Send Message"
      this.submitIcon.classList.remove("hidden")
      this.submitLoading.classList.add("hidden")
      this.submitBtn.disabled = false
    }
  }

  showStatus(type, message) {
    this.formStatus.className = `p-4 rounded-lg mb-6 ${
      type === "success"
        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    }`
    this.formStatus.textContent = message
    this.formStatus.classList.remove("hidden")

    setTimeout(() => {
      this.formStatus.classList.add("hidden")
    }, 5000)
  }
}

// Smooth Scroll
class SmoothScroll {
  constructor() {
    this.links = document.querySelectorAll('a[href^="#"]')
    this.init()
  }

  init() {
    this.links.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const targetId = link.getAttribute("href")
        const targetElement = document.querySelector(targetId)
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start"
          })
        }
      })
    })
  }
}

// View Counter System
class ViewCounter {
    constructor() {
        this.counterElement = document.getElementById('view-counter')
        this.storageKey = 'portfolio_views'
        this.init()
    }
    
    init() {
        this.incrementView()
        this.displayViewCount()
        this.animateCounter()
    }
    
    incrementView() {
        let views = this.getViewCount()
        views++
        this.saveViewCount(views)
    }
    
    getViewCount() {
        const stored = localStorage.getItem(this.storageKey)
        return stored ? parseInt(stored) : 0
    }
    
    saveViewCount(count) {
        localStorage.setItem(this.storageKey, count.toString())
    }
    
    displayViewCount() {
        if (this.counterElement) {
            const views = this.getViewCount()
            this.counterElement.textContent = this.formatNumber(views)
        }
    }
    
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M'
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K'
        }
        return num.toString()
    }
    
    animateCounter() {
        if (this.counterElement) {
            // Add a subtle animation when the page loads
            this.counterElement.style.transform = 'scale(1.2)'
            this.counterElement.style.transition = 'transform 0.3s ease'
            
            setTimeout(() => {
                this.counterElement.style.transform = 'scale(1)'
            }, 300)
        }
    }
}

// Initialize all systems when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particle animation
    const particleAnimation = new ParticleAnimation()
    
    // Initialize skill bar animation
    const skillBarAnimation = new SkillBarAnimation()
    
    // Initialize theme toggle
    const themeToggle = document.getElementById('theme-toggle')
    const sunIcon = document.getElementById('sun-icon')
    const moonIcon = document.getElementById('moon-icon')
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light'
    document.documentElement.classList.toggle('dark', currentTheme === 'dark')
    updateThemeIcons(currentTheme === 'dark')
    
    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark')
        localStorage.setItem('theme', isDark ? 'dark' : 'light')
        updateThemeIcons(isDark)
        
        // Update particle colors for new theme
        particleAnimation.updateParticleColors()
    })
    
    function updateThemeIcons(isDark) {
        if (isDark) {
            sunIcon.style.opacity = '0'
            moonIcon.style.opacity = '1'
        } else {
            sunIcon.style.opacity = '1'
            moonIcon.style.opacity = '0'
        }
    }
    
    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobile-menu-btn')
    const mobileMenu = document.getElementById('mobile-menu')
    const mobileMenuClose = document.getElementById('mobile-menu-close')
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link')
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('active')
    })
    
    mobileMenuClose.addEventListener('click', () => {
        mobileMenu.classList.remove('active')
    })
    
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active')
        })
    })
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault()
            const target = document.querySelector(this.getAttribute('href'))
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                })
            }
        })
    })
    
    // Counter animation for statistics
    const counters = document.querySelectorAll('.counter')
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target
                const target = parseInt(counter.getAttribute('data-target'))
                const duration = 2000 // 2 seconds
                const increment = target / (duration / 16) // 60fps
                let current = 0
                
                const updateCounter = () => {
                    current += increment
                    if (current < target) {
                        counter.textContent = Math.floor(current)
                        requestAnimationFrame(updateCounter)
                    } else {
                        counter.textContent = target
                    }
                }
                
                updateCounter()
                counterObserver.unobserve(counter)
            }
        })
    }, { threshold: 0.5 })
    
    counters.forEach(counter => {
        counterObserver.observe(counter)
    })
    
    // Fade-in animation for sections
    const fadeElements = document.querySelectorAll('.fade-in')
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1'
                entry.target.style.transform = 'translateY(0)'
            }
        })
    }, { threshold: 0.1 })
    
    fadeElements.forEach(element => {
        element.style.opacity = '0'
        element.style.transform = 'translateY(20px)'
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
        fadeObserver.observe(element)
    })
    
    // Project card hover effects
    const projectCards = document.querySelectorAll('.project-card')
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)'
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)'
        })
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)'
            card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
        })
    })
    
    // Contact form functionality
    const contactForm = document.getElementById('contact-form')
    const submitBtn = document.getElementById('submit-btn')
    const submitText = document.getElementById('submit-text')
    const submitIcon = document.getElementById('submit-icon')
    const submitLoading = document.getElementById('submit-loading')
    const formStatus = document.getElementById('form-status')
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault()
            
            // Show loading state
            submitText.textContent = 'Sending...'
            submitIcon.classList.add('hidden')
            submitLoading.classList.remove('hidden')
            submitBtn.disabled = true
            
            // Simulate form submission (replace with actual email service)
            try {
                await new Promise(resolve => setTimeout(resolve, 2000))
                
                // Show success message
                formStatus.innerHTML = `
                    <div class="p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 text-green-700 dark:text-green-400 rounded-lg">
                        <div class="flex items-center">
                            <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                            </svg>
                            Message sent successfully! I'll get back to you soon.
                        </div>
                    </div>
                `
                formStatus.classList.remove('hidden')
                contactForm.reset()
                
            } catch (error) {
                // Show error message
                formStatus.innerHTML = `
                    <div class="p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 rounded-lg">
                        <div class="flex items-center">
                            <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                            </svg>
                            Failed to send message. Please try again.
                        </div>
                    </div>
                `
                formStatus.classList.remove('hidden')
            } finally {
                // Reset button state
                submitText.textContent = 'Send Message'
                submitIcon.classList.remove('hidden')
                submitLoading.classList.add('hidden')
                submitBtn.disabled = false
                
                // Hide status message after 5 seconds
                setTimeout(() => {
                    formStatus.classList.add('hidden')
                }, 5000)
            }
        })
    }
    
    // Update current year in footer
    const currentYearElement = document.getElementById('current-year')
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear()
    }
    
    // Scroll-based particle behavior
    let scrollTimeout
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout)
        particleAnimation.updateForScroll(window.scrollY)
        
        scrollTimeout = setTimeout(() => {
            // Reset particle behavior after scrolling stops
            particleAnimation.connectionDistance = 150
        }, 150)
    })
    
    // Window resize handling
    let resizeTimeout
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout)
        
        resizeTimeout = setTimeout(() => {
            // Recreate particles for new window size
            particleAnimation.destroy()
            const newParticleAnimation = new ParticleAnimation()
            
            // Reset skill bar animations
            skillBarAnimation.resetAnimations()
        }, 250)
    })
    
    // Performance optimization: Pause animations when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause animations to save resources
            if (particleAnimation.animationId) {
                cancelAnimationFrame(particleAnimation.animationId)
            }
        } else {
            // Resume animations
            particleAnimation.animate()
        }
    })
    
    // Keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active')
        }
    })
    
    // Touch gesture support for mobile
    let touchStartY = 0
    let touchEndY = 0
    
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY
    })
    
    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY
        handleSwipe()
    })
    
    function handleSwipe() {
        const swipeThreshold = 50
        const diff = touchStartY - touchEndY
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe up - could trigger special effects
                particleAnimation.createClickEffect(window.innerWidth / 2, window.innerHeight / 2)
            } else {
                // Swipe down - could trigger different effects
                particleAnimation.updateForScroll(window.scrollY + 100)
            }
        }
    }
    
    // Accessibility improvements
    document.addEventListener('keydown', (e) => {
        // Skip to main content
        if (e.key === 'Tab' && e.target === document.body) {
            e.preventDefault()
            document.querySelector('main')?.focus()
        }
    })
    
    // Add focus indicators for keyboard navigation
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select')
    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.style.outline = '2px solid #3b82f6'
            element.style.outlineOffset = '2px'
        })
        
        element.addEventListener('blur', () => {
            element.style.outline = 'none'
        })
    })
    
    // Initialize view counter
    new ViewCounter()
    
    console.log('Portfolio initialized successfully! 🚀')
})

// Reset modal state
function resetModalState() {
    const iframe = document.getElementById('resume-pdf-viewer')
    const fallback = document.getElementById('pdf-fallback')
    const loading = document.getElementById('pdf-loading')
    
    // Reset iframe
    if (iframe) {
        iframe.src = ''
        iframe.classList.remove('hidden')
    }
    
    // Hide fallback
    if (fallback) {
        fallback.classList.add('hidden')
    }
    
    // Show loading
    if (loading) {
        loading.style.display = 'flex'
    }
}

function openResumeModal() {
    const modal = document.getElementById('resume-modal')
    const modalContent = document.getElementById('resume-modal-content')
    const iframe = document.getElementById('resume-pdf-viewer')
    const loading = document.getElementById('pdf-loading')
    
    if (modal && modalContent) {
        // Reset modal state first
        resetModalState()
        
        // Ensure modal is visible
        modal.style.display = 'flex'
        modal.classList.remove('hidden')
        modal.classList.add('flex')
        
        // Trigger animation after a small delay
        setTimeout(() => {
            modalContent.style.transform = 'scale(1)'
            modalContent.style.opacity = '1'
        }, 10)
        
        // Load PDF only when modal opens
        setTimeout(() => {
            if (iframe) {
                // Load PDF with parameters for better readability
                iframe.src = 'Resume__Harsh (1).pdf#toolbar=1&navpanes=1&scrollbar=1&view=FitH&zoom=100'
            }
        }, 300)
        
        // Check PDF viewer support
        setTimeout(() => {
            checkPDFViewerSupport()
        }, 1000)
        
        // Hide loading spinner after 5 seconds as fallback
        setTimeout(() => {
            hidePDFLoading()
        }, 5000)
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden'
    }
}

function closeResumeModal() {
    const modal = document.getElementById('resume-modal')
    const modalContent = document.getElementById('resume-modal-content')
    const iframe = document.getElementById('resume-pdf-viewer')
    const loading = document.getElementById('pdf-loading')
    
    if (modal && modalContent) {
        // Trigger close animation
        modalContent.style.transform = 'scale(0.95)'
        modalContent.style.opacity = '0'
        
        // Reset iframe to prevent PDF from loading
        if (iframe) {
            iframe.src = ''
        }
        
        // Reset loading spinner
        if (loading) {
            loading.style.display = 'flex'
        }
        
        // Hide modal after animation
        setTimeout(() => {
            modal.classList.add('hidden')
            modal.classList.remove('flex')
            modal.style.display = 'none'
        }, 300)
        
        // Restore body scroll
        document.body.style.overflow = 'auto'
    }
}

function downloadResume() {
    // Download the actual PDF file
    const a = document.createElement('a')
    a.href = 'Resume__Harsh (1).pdf'
    a.download = 'Harsh_Prateek_Resume.pdf'
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    
    // Show success message
    showDownloadSuccess()
}

function showDownloadSuccess() {
    // Create success notification
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300'
    notification.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            Resume downloaded successfully!
        </div>
    `
    
    document.body.appendChild(notification)
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)'
    }, 100)
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(full)'
        setTimeout(() => {
            document.body.removeChild(notification)
        }, 300)
    }, 3000)
}

// Hide PDF loading spinner
function hidePDFLoading() {
    const loading = document.getElementById('pdf-loading')
    if (loading) {
        loading.style.display = 'none'
    }
}

// Show PDF loading spinner
function showPDFLoading() {
    const loading = document.getElementById('pdf-loading')
    if (loading) {
        loading.style.display = 'flex'
    }
}

// Check PDF viewer support and show fallback if needed
function checkPDFViewerSupport() {
    const iframe = document.getElementById('resume-pdf-viewer')
    const fallback = document.getElementById('pdf-fallback')
    
    if (iframe && fallback) {
        // Check if iframe loaded successfully
        iframe.onload = function() {
            // If iframe loads successfully, hide fallback and loading
            fallback.classList.add('hidden')
            hidePDFLoading()
        }
        
        iframe.onerror = function() {
            // If iframe fails to load, show fallback
            fallback.classList.remove('hidden')
            iframe.classList.add('hidden')
            hidePDFLoading()
        }
        
        // Additional check for PDF support after a delay
        setTimeout(() => {
            try {
                // Check if iframe has content
                if (iframe.contentWindow && iframe.contentWindow.document) {
                    const iframeDoc = iframe.contentWindow.document
                    if (iframeDoc.body && iframeDoc.body.innerHTML.includes('PDF')) {
                        // PDF viewer not supported
                        fallback.classList.remove('hidden')
                        iframe.classList.add('hidden')
                        hidePDFLoading()
                    }
                }
            } catch (e) {
                // Cross-origin or other error, assume PDF viewer works
                // PDF viewer check completed
            }
        }, 3000)
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('resume-modal')
    const modalContent = document.getElementById('resume-modal-content')
    
    if (modal && e.target === modal) {
        closeResumeModal()
    }
})

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('resume-modal')
        if (modal && !modal.classList.contains('hidden')) {
            closeResumeModal()
        }
    }
})

// Ensure modal is hidden on page load
function ensureModalHidden() {
    const modal = document.getElementById('resume-modal')
    const modalContent = document.getElementById('resume-modal-content')
    const iframe = document.getElementById('resume-pdf-viewer')
    
    if (modal) {
        modal.classList.add('hidden')
        modal.classList.remove('flex')
        modal.style.display = 'none'
    }
    
    if (modalContent) {
        modalContent.style.transform = 'scale(0.95)'
        modalContent.style.opacity = '0'
    }
    
    if (iframe) {
        iframe.src = ''
    }
    
    // Restore body scroll
    document.body.style.overflow = 'auto'
}

// Call this when document is ready
document.addEventListener('DOMContentLoaded', function() {
    ensureModalHidden()
})

// Also call on window load
window.addEventListener('load', function() {
    ensureModalHidden()
})

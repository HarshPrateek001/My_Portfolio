// This script demonstrates how to add more advanced animations to your portfolio
// You can include this script in your project to enhance the user experience

// Example of how to implement scroll-triggered animations
const setupScrollAnimations = () => {
  // Function to check if an element is in viewport
  const isInViewport = (element) => {
    const rect = element.getBoundingClientRect()
    return rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 && rect.bottom >= 0
  }

  // Elements to animate
  const animateElements = () => {
    // Select all elements with data-animate attribute
    const elements = document.querySelectorAll("[data-animate]")

    elements.forEach((element) => {
      if (isInViewport(element) && !element.classList.contains("animated")) {
        // Get animation type from data attribute
        const animationType = element.getAttribute("data-animate")
        element.classList.add("animated", animationType)
      }
    })
  }

  // Listen for scroll events
  window.addEventListener("scroll", animateElements)

  // Initial check
  animateElements()
}

// Example of how to implement parallax scrolling effect
const setupParallaxEffect = () => {
  const parallaxElements = document.querySelectorAll("[data-parallax]")

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY

    parallaxElements.forEach((element) => {
      const speed = element.getAttribute("data-parallax") || 0.2
      element.style.transform = `translateY(${scrollY * speed}px)`
    })
  })
}

// Example of how to implement typing animation
const setupTypingAnimation = () => {
  const typingElements = document.querySelectorAll("[data-typing]")

  typingElements.forEach((element) => {
    const text = element.textContent
    element.textContent = ""

    let i = 0
    const typing = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i)
        i++
      } else {
        clearInterval(typing)
      }
    }, 100)
  })
}

// Instructions for implementation
console.log(`
To add these animations to your portfolio:

1. For scroll animations:
   - Add data-animate="fade-in" (or slide-up, slide-left, etc.) to elements
   - Add the corresponding CSS classes in your stylesheet

2. For parallax effect:
   - Add data-parallax="0.2" to elements (adjust speed as needed)
   - Make sure the parent container has position: relative

3. For typing animation:
   - Add data-typing to text elements you want to animate

Example CSS for animations:
.fade-in {
  opacity: 0;
  transition: opacity 1s ease-in-out;
}
.fade-in.animated {
  opacity: 1;
}

.slide-up {
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.slide-up.animated {
  opacity: 1;
  transform: translateY(0);
}
`)

// Call these functions to initialize animations
// setupScrollAnimations();
// setupParallaxEffect();
// setupTypingAnimation();

// Animation Configuration Script
// This script helps you customize the animations on your portfolio

// Animation configuration
const setupAnimations = () => {
  console.log("Setting up custom animations for your portfolio...")

  // Particle animation configuration
  console.log("\n1. Particle Background Configuration:")
  console.log(`
// To modify particle animation:
// Open script.js and find the ParticleAnimation class
// You can customize:
// - particleCount (default: 50 on desktop, 30 on mobile)
// - particle size (default: random between 2-6px)
// - particle color (default: blue to purple gradient)
// - particle speed (default: random between -0.5 and 0.5)
  `)

  // Scroll animations configuration
  console.log("\n2. Scroll Animation Configuration:")
  console.log(`
// To modify scroll animations:
// Open script.js and find the ScrollAnimations class
// You can customize:
// - Animation threshold (when elements start animating)
// - Counter animation speed
// - Skill bar animation timing
  `)

  // Custom animation examples
  console.log("\n3. Additional Animation Examples:")
  console.log(`
// Add these CSS classes to your styles.css file:

/* Slide Up Animation */
.slide-up {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.slide-up.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Slide In From Left */
.slide-left {
  opacity: 0;
  transform: translateX(-40px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.slide-left.visible {
  opacity: 1;
  transform: translateX(0);
}

/* Slide In From Right */
.slide-right {
  opacity: 0;
  transform: translateX(40px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.slide-right.visible {
  opacity: 1;
  transform: translateX(0);
}

/* Zoom In Animation */
.zoom-in {
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.zoom-in.visible {
  opacity: 1;
  transform: scale(1);
}
  `)

  // Usage instructions
  console.log("\n4. How to use these animations:")
  console.log(`
// Add the animation class to any element:
<div class="slide-up">This will slide up when scrolled into view</div>
<div class="slide-left">This will slide in from left when scrolled into view</div>

// Then make sure to add the element to the observer in script.js:
const elements = document.querySelectorAll(".fade-in, .slide-up, .slide-left, .slide-right, .zoom-in");
  `)

  console.log("\nThese animations will make your portfolio more engaging and interactive!")
}

// Run the setup
setupAnimations()

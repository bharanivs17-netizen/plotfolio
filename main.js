document.addEventListener("DOMContentLoaded", () => {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger, Flip, TextPlugin, MotionPathPlugin);

  // 1. Initialize Lenis for Smooth Scrolling
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Update ScrollTrigger on Lenis scroll
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // 2. Custom Cursor
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth ring follow
  gsap.ticker.add(() => {
    // Dot follows instantly
    gsap.set(cursorDot, { x: mouseX, y: mouseY });
    
    // Ring follows with easing
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    gsap.set(cursorRing, { x: ringX, y: ringY });
  });

  // Hover states for cursor
  const interactables = document.querySelectorAll('a, button, .magnetic, .magnetic-wrap');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
      gsap.to(el, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' }); // Reset magnetic if any
    });
  });

  // Magnetic Button Effect
  const magnetics = document.querySelectorAll('.magnetic');
  magnetics.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.4;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.4;
      gsap.to(btn, { x, y, duration: 0.3, ease: 'power2.out' });
    });
  });

  // (Intro canvas and preloader logic moved to intro.js)

  // 4. Role Switcher
  const roles = [
    "Software Developer", 
    "Frontend Engineer", 
    "Creative Technologist", 
    "Problem Solver", 
    "Entrepreneur", 
    "AI Enthusiast"
  ];
  let roleIndex = 0;
  
  function switchRole() {
    roleIndex = (roleIndex + 1) % roles.length;
    gsap.to('#role-switcher', {
      opacity: 0,
      y: -20,
      duration: 0.4,
      onComplete: () => {
        document.getElementById('role-switcher').innerText = roles[roleIndex];
        gsap.fromTo('#role-switcher', 
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4 }
        );
      }
    });
  }
  setInterval(switchRole, 3000);

  // 5. Floating Navigation
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;
  
  lenis.on('scroll', (e) => {
    const currentScroll = e.animatedScroll;
    
    // Hide nav when scrolling down, show when scrolling up
    if (currentScroll > lastScroll && currentScroll > 100) {
      navbar.classList.add('hidden');
    } else {
      navbar.classList.remove('hidden');
    }
    
    lastScroll = currentScroll;
    
    // Update scroll indicator
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = (currentScroll / maxScroll) * 100;
    gsap.to('.scroll-indicator-line', { height: `${scrollProgress}%`, duration: 0.1 });
  });

  // 6. SplitType Animations
  const splitElements = document.querySelectorAll('.split-text, .split-quote');
  
  splitElements.forEach(el => {
    const text = new SplitType(el, { types: 'lines, words, chars' });
    
    gsap.from(text.chars, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
      },
      opacity: 0,
      y: 50,
      rotateX: -90,
      stagger: 0.02,
      duration: 0.8,
      ease: 'power3.out'
    });
  });

  // 7. Journey Timeline Line Progress
  const timelinePath = document.getElementById('timeline-path');
  
  if (timelinePath) {
    gsap.to(timelinePath, {
      height: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: ".timeline-container",
        start: "top center",
        end: "bottom 80%",
        scrub: 1
      }
    });
    
    // Milestones reveal
    const milestones = document.querySelectorAll('.milestone');
    milestones.forEach((milestone, i) => {
      gsap.to(milestone, {
        opacity: 1,
        duration: 0.5,
        scrollTrigger: {
          trigger: milestone,
          start: "top 60%",
          toggleActions: "play none none reverse",
          onEnter: () => milestone.classList.add('active-path'),
          onLeaveBack: () => milestone.classList.remove('active-path')
        }
      });
    });
  }

  // 8. Generate Skill Spheres dynamically
  const skillsList = ["Python", "JavaScript", "HTML", "CSS", "React", "Node.js", "Express", "MongoDB", "Three.js", "GSAP", "Git", "Figma"];
  const skillsGrid = document.getElementById('skills-grid');
  
  if (skillsGrid) {
    skillsList.forEach(skill => {
      const el = document.createElement('div');
      el.className = 'skill-sphere glass-card tilt-card';
      el.innerHTML = `<span class="skill-name">${skill}</span>`;
      skillsGrid.appendChild(el);
    });
  }

  // 9. 3D Tilt Effect
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xPct = (x / rect.width - 0.5) * 2;
      const yPct = (y / rect.height - 0.5) * 2;
      
      gsap.to(card, {
        rotateY: xPct * 15,
        rotateX: -yPct * 15,
        transformPerspective: 1000,
        ease: "power2.out",
        duration: 0.5
      });
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5, ease: "power2.out" });
    });
  });

  // 10. FLIP Animation & Dynamic Projects Modals
  const projectCards = document.querySelectorAll('.project-card');
  const modal = document.getElementById('project-modal');
  const modalImage = document.getElementById('modal-image');
  const modalClose = document.querySelector('.modal-close');
  
  let activeFlipImage = null;

  const projectData = {
    "1": {
      title: "VSNEXAR — Immersive Spatial Platform",
      problem: "Enterprise dashboards historically separated visual assets from statistical tables, leaving operations managers unable to easily correlate spatial metrics with real-time sensory feeds.",
      solution: "Engineered a spatial WebGL platform combining Three.js scene graphs with real-time operational streams, using custom GSAP tweens to overlay fluid statistical models.",
      tags: ["React", "Three.js", "GSAP", "WebGL"]
    },
    "2": {
      title: "AI-Agent Coding Workspace",
      problem: "Standard development setups require complex CLI configurations and manual environment setups, frustrating rapid prototyping of AI features.",
      solution: "Built a Python-based workspace orchestrating containerized terminal contexts with LLMs. Docker integration executes scripts and handles automated syntax debugging.",
      tags: ["Python", "Gemini API", "Docker", "Node.js"]
    },
    "3": {
      title: "Hyperflow SaaS Analytics",
      problem: "Traditional analytics dashboards frequently choke on heavy WebSocket updates, dropping frame rates and introducing high layouts stutters.",
      solution: "Created a Node.js/MongoDB microservice dashboard. Employs rendering-frame throttling techniques to stabilize stream processing to 60fps on UI layout updates.",
      tags: ["React", "Node.js", "Express", "MongoDB"]
    }
  };

  projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Prevent modal if user clicked links/buttons
      if (e.target.closest('.project-links')) return;

      const img = card.querySelector('.project-image');
      const projectId = card.getAttribute('data-project');
      const data = projectData[projectId];
      if (!data) return;
      
      // Capture state
      const state = Flip.getState(img);
      
      // Setup modal content
      document.getElementById('modal-title').innerText = data.title;
      document.getElementById('modal-problem').innerText = data.problem;
      document.getElementById('modal-solution').innerText = data.solution;
      
      const tagsContainer = document.getElementById('modal-tags');
      tagsContainer.innerHTML = '';
      data.tags.forEach(tag => {
        const span = document.createElement('span');
        span.innerText = tag;
        tagsContainer.appendChild(span);
      });
      
      // Move image to modal
      modalImage.appendChild(img);
      modal.classList.add('active');
      
      // Disable lenis scroll
      lenis.stop();

      // Animate Flip
      Flip.from(state, {
        duration: 0.8,
        ease: 'power4.inOut',
        absolute: true
      });
      
      activeFlipImage = img;
    });
  });

  modalClose.addEventListener('click', () => {
    if (!activeFlipImage) return;
    
    const state = Flip.getState(activeFlipImage);
    const projectId = activeFlipImage.getAttribute('data-flip-id').split('-')[1];
    const originalWrapper = document.querySelector(`.project-card[data-project="${projectId}"] .project-image-wrapper`);
    
    originalWrapper.appendChild(activeFlipImage);
    modal.classList.remove('active');
    
    lenis.start();
    
    Flip.from(state, {
      duration: 0.8,
      ease: 'power4.inOut',
      absolute: true
    });
    
    activeFlipImage = null;
  });

  // 10.5 Recruiter Command Center Logic
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = "bharaniabcd17@gmail.com";
      navigator.clipboard.writeText(email).then(() => {
        const origText = copyEmailBtn.querySelector('.btn-text').innerText;
        copyEmailBtn.querySelector('.btn-text').innerText = "Copied Address! ✓";
        setTimeout(() => {
          copyEmailBtn.querySelector('.btn-text').innerText = origText;
        }, 2000);
      });
    });
  }

  const techTags = document.querySelectorAll('.tech-tag');
  const resetFilterBtn = document.getElementById('reset-filter-btn');

  techTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const activeTech = tag.getAttribute('data-tech');
      
      // Toggle active states on tags
      techTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      if (resetFilterBtn) resetFilterBtn.style.display = 'inline-block';

      // Highlight/dim projects matching this tech
      projectCards.forEach(card => {
        const tags = Array.from(card.querySelectorAll('.project-tags span')).map(s => s.innerText);
        if (tags.includes(activeTech)) {
          card.classList.remove('dimmed');
          card.classList.add('highlighted');
        } else {
          card.classList.remove('highlighted');
          card.classList.add('dimmed');
        }
      });
    });
  });

  if (resetFilterBtn) {
    resetFilterBtn.addEventListener('click', () => {
      techTags.forEach(t => t.classList.remove('active'));
      projectCards.forEach(card => {
        card.classList.remove('dimmed');
        card.classList.remove('highlighted');
      });
      resetFilterBtn.style.display = 'none';
    });
  }

  // 11. Counters
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(counter => {
    ScrollTrigger.create({
      trigger: counter,
      start: "top 80%",
      once: true,
      onEnter: () => {
        const target = parseInt(counter.getAttribute('data-target'));
        gsap.to(counter, {
          innerHTML: target,
          duration: 2,
          snap: { innerHTML: 1 },
          ease: "power2.out"
        });
      }
    });
  });

  // Smooth scroll for nav links & mobile menu logic
  const hamburger = document.getElementById('nav-hamburger');
  const mobileOverlay = document.getElementById('mobile-nav-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

  const closeMobileMenu = () => {
    if (!mobileOverlay) return;
    hamburger.classList.remove('active');
    mobileOverlay.classList.remove('active');
    lenis.start();
  };

  if (hamburger && mobileOverlay) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileOverlay.classList.toggle('active');
      hamburger.classList.toggle('active');
      if (isOpen) {
        lenis.stop();
      } else {
        lenis.start();
      }
    });
  }

  // Smooth scroll logic for ALL anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      // Close mobile menu if open
      closeMobileMenu();

      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        lenis.scrollTo(target, { offset: -100 });
      }
    });
  });

  // Programmatic click handler for all Live Demo links to guarantee navigation
  document.querySelectorAll('.btn-project, .btn-connect-gravity').forEach(btn => {
    if (btn.tagName === 'A') {
      btn.addEventListener('click', (e) => {
        const href = btn.getAttribute('href');
        if (href && href !== '#' && !href.startsWith('#')) {
          e.preventDefault();
          e.stopPropagation();
          window.open(href, '_blank', 'noopener,noreferrer');
        }
      });
    }
  });

});

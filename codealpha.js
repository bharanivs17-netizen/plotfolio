document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const codealphaSection = document.getElementById('codealpha');
  const heroBrowser = document.getElementById('codealpha-hero-browser');
  const particlesContainer = document.getElementById('codealpha-particles-container');
  const codeSnippetsContainer = document.getElementById('codealpha-code-snippets');

  // --- 1. AMBIENT CODE SNIPPETS & PARTICLES ---
  if (particlesContainer && !prefersReducedMotion) {
    for (let i = 0; i < 15; i++) {
      const p = document.createElement('div');
      p.className = 'codealpha-particle';
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      p.style.opacity = Math.random() * 0.4 + 0.1;
      particlesContainer.appendChild(p);

      gsap.to(p, {
        y: () => `+=${Math.random() * 120 - 60}`,
        x: () => `+=${Math.random() * 120 - 60}`,
        duration: () => 8 + Math.random() * 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }

  if (codeSnippetsContainer && !prefersReducedMotion) {
    const snippets = [
      "const app = express();\napp.use(cors());",
      "import React, { useState } from 'react';",
      "git commit -m 'feat: deploy tasks'",
      "fetch('/api/products')\n  .then(res => res.json())",
      "document.querySelector('.app')\n  .addEventListener('click', e => {})",
      "const schema = new mongoose.Schema({\n  title: String\n});"
    ];

    snippets.forEach((snippet) => {
      const el = document.createElement('div');
      el.className = 'floating-code-snippet';
      el.innerText = snippet;
      el.style.left = `${Math.random() * 80 + 5}%`;
      el.style.top = `${Math.random() * 80 + 5}%`;
      el.style.opacity = Math.random() * 0.03 + 0.01;
      codeSnippetsContainer.appendChild(el);

      // Slow drift
      gsap.to(el, {
        y: () => Math.random() * 40 - 20,
        x: () => Math.random() * 40 - 20,
        duration: () => 12 + Math.random() * 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
  }

  // --- 2. 3D HERO BROWSER FLOATING & TILT ---
  if (heroBrowser && !prefersReducedMotion) {
    // Gentle infinite floating
    gsap.to(heroBrowser, {
      y: -15,
      rotateZ: 0.5,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    if (window.innerWidth > 1024) {
      heroBrowser.addEventListener('mousemove', (e) => {
        const rect = heroBrowser.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Spotlight
        heroBrowser.style.setProperty('--mouse-x', `${x}px`);
        heroBrowser.style.setProperty('--mouse-y', `${y}px`);

        const tiltX = (y / rect.height - 0.5) * 2;
        const tiltY = (x / rect.width - 0.5) * 2;

        gsap.to(heroBrowser, {
          rotateX: -tiltX * 10,
          rotateY: tiltY * 10,
          transformPerspective: 1000,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      heroBrowser.addEventListener('mouseleave', () => {
        gsap.to(heroBrowser, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.6)"
        });
      });
    }
  }

  // --- 3. AUTO-SWITCHING INTERACTIVE PREVIEW CONSOLE ---
  const panels = document.querySelectorAll('.task-preview-panel');
  const urlDisplay = document.getElementById('browser-url-display');
  const fillBar = document.getElementById('browser-loading-bar-fill');
  let currentTask = 1;
  const totalTasks = 3;
  const cycleTime = 5000; // 5 seconds per task
  let progressTween = null;
  let timerId = null;

  const startTaskTimer = () => {
    // Reset bar fill width
    gsap.set(fillBar, { width: "0%" });

    // Animate loading bar width to 100%
    progressTween = gsap.to(fillBar, {
      width: "100%",
      duration: cycleTime / 1000,
      ease: "none",
      onComplete: () => {
        // Switch to next task
        currentTask = (currentTask % totalTasks) + 1;
        switchToTask(currentTask);
      }
    });
  };

  const switchToTask = (taskNum) => {
    if (progressTween) progressTween.kill();
    
    // Toggle active classes on DOM preview panels
    panels.forEach(p => {
      p.classList.remove('active');
      if (parseInt(p.getAttribute('data-task')) === taskNum) {
        p.classList.add('active');
        
        // Add subtle content reveal animations inside the active panel
        const title = p.querySelector('h4');
        const visual = p.querySelector('.panel-visual');
        if (title && visual) {
          gsap.fromTo(title, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 });
          gsap.fromTo(visual, { scale: 0.95, opacity: 0.8 }, { scale: 1, opacity: 1, duration: 0.6, ease: "power2.out" });
        }
      }
    });

    // Update browser mock URL address text
    if (urlDisplay) {
      urlDisplay.innerText = `bharanivs17-netizen.github.io/codealpha_task/task-${taskNum}`;
    }

    // Restart timer
    startTaskTimer();
  };

  if (panels.length > 0) {
    // Start cycle
    startTaskTimer();
  }

  // --- 4. TECHNOLOGIES ROTATING ICONS ---
  const techCards = document.querySelectorAll('.tech-icon-card');
  if (techCards.length > 0 && !prefersReducedMotion) {
    techCards.forEach((card, idx) => {
      // Slow independent rotation
      gsap.to(card.querySelector('svg'), {
        rotateY: 360,
        duration: 10 + idx * 2,
        repeat: -1,
        ease: "none"
      });
    });
  }

  // --- 5. ROADMAP TIMELINE SCROLL TRIGGER ANIMATION ---
  const timelineNodes = document.querySelectorAll('.timeline-gravity-node');
  if (timelineNodes.length > 0 && codealphaSection) {
    timelineNodes.forEach((node, idx) => {
      const content = node.querySelector('.node-content');
      const dot = node.querySelector('.node-dot');

      gsap.fromTo(node, {
        opacity: 0,
        y: 40
      }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: node,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });

      if (content && !prefersReducedMotion) {
        gsap.fromTo(content, {
          scale: 0.9,
          filter: "blur(4px)"
        }, {
          scale: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: node,
            start: "top 85%"
          }
        });
      }
    });
  }

  // --- 6. SCROLL REVEALS FOR CARDS & HEADING ---
  if (codealphaSection) {
    // Stagger elements fade up
    gsap.fromTo('#codealpha .codealpha-badge, #codealpha .codealpha-heading, #codealpha .codealpha-description, #codealpha .codealpha-tag-pill', {
      opacity: 0,
      y: 40
    }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.08,
      scrollTrigger: {
        trigger: codealphaSection,
        start: "top 75%"
      }
    });

    // Highlights staggered reveal
    gsap.fromTo('.highlight-item', {
      opacity: 0,
      y: 50,
      scale: 0.95
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      stagger: 0.08,
      ease: "back.out(1.1)",
      scrollTrigger: {
        trigger: '.codealpha-highlights-grid',
        start: "top 80%"
      }
    });

    // Achievements staggered reveal
    gsap.fromTo('.achievement-card', {
      opacity: 0,
      y: 30,
      scale: 0.97
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      stagger: 0.05,
      scrollTrigger: {
        trigger: '.codealpha-achievements-grid',
        start: "top 85%"
      }
    });
  }
});

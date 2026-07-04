document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('intro-canvas');
  const ctx = canvas ? canvas.getContext('2d', { alpha: false }) : null;
  const preloader = document.getElementById('black-preloader');
  const preloaderBar = document.getElementById('preloader-bar-fill');
  const preloaderText = document.getElementById('preloader-percentage');
  
  const frames = [];
  let frameCount = 0;
  
  // Animation to reveal Hero
  const playHeroIntro = () => {
    const hero = document.getElementById('hero');
    const nav = document.getElementById('navbar');
    if (!hero || !nav) return;
    
    hero.classList.remove('hero-hidden');
    nav.classList.remove('nav-hidden');
    
    gsap.fromTo('#hero-greeting .title-line', 
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power4.out' }
    );
    gsap.fromTo('.portrait-container', 
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, ease: 'elastic.out(1, 0.7)' },
      "-=0.8"
    );
    gsap.fromTo('.hero-ctas', 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
      "-=1.2"
    );
  };

  if (prefersReducedMotion) {
    // Accessibility: Skip animation
    if(preloader) preloader.style.display = 'none';
    const canvasSection = document.getElementById('intro-canvas-section');
    if(canvasSection) canvasSection.style.display = 'none';
    playHeroIntro();
    return;
  }

  // Dynamic Preloader Logic
  const extensions = ['jpg', 'jpeg', 'png'];
  
  const loadFrames = async () => {
    let index = 1;
    let hasFailed = false;
    
    while (!hasFailed) {
      const paddedIndex = String(index).padStart(3, '0'); // ezgif-frame-001
      let imgLoaded = false;
      
      for (const ext of extensions) {
        if (imgLoaded) break;
        
        const img = new Image();
        const src = `image%20frame/ezgif-frame-${paddedIndex}.${ext}`;
        
        await new Promise((resolve) => {
          img.onload = () => {
            frames.push(img);
            imgLoaded = true;
            
            // Visual Progress (Estimated total around 30-40 based on directory)
            // Just capping at 99% until fully done.
            const progress = Math.min((frames.length / 30) * 100, 99);
            if(preloaderBar) preloaderBar.style.width = `${progress}%`;
            if(preloaderText) preloaderText.innerText = `${Math.floor(progress)}%`;
            resolve();
          };
          img.onerror = () => {
            resolve();
          };
          img.src = src;
        });
      }
      
      if (imgLoaded) {
        index++;
      } else {
        hasFailed = true; // Failed all extensions, stop loop.
      }
    }
    
    frameCount = frames.length;
    
    if (frameCount === 0) {
      // Fallback
      if(preloader) preloader.style.display = 'none';
      document.getElementById('intro-canvas-section').style.display = 'none';
      playHeroIntro();
      return;
    }

    // Finalize Preloader
    if(preloaderBar) preloaderBar.style.width = '100%';
    if(preloaderText) preloaderText.innerText = `100%`;
    
    // Fade out preloader with blur transition
    setTimeout(() => {
      preloader.classList.add('fade-out');
    }, 500);

    // Initialize Canvas Rendering
    let obj = { frame: 0 };
    
    const setupCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    
    setupCanvas();

    let lastRenderedFrame = -1;
    
    const renderFrame = (idx) => {
      if (!frames[idx]) return;
      if (idx === lastRenderedFrame) return; // Prevent unnecessary redraws
      
      const img = frames[idx];
      const canvasW = window.innerWidth;
      const canvasH = window.innerHeight;
      
      // object-fit: cover math
      const scale = Math.max(canvasW / img.width, canvasH / img.height);
      const x = (canvasW / 2) - (img.width / 2) * scale;
      const y = (canvasH / 2) - (img.height / 2) * scale;
      
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvasW, canvasH);
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      
      lastRenderedFrame = idx;
    };

    // Initial draw
    renderFrame(0);
    
    // Resize handler
    window.addEventListener('resize', () => {
      setupCanvas();
      lastRenderedFrame = -1; // Force redraw
      renderFrame(Math.floor(obj.frame));
    }, { passive: true });

    // GSAP ScrollTrigger Sequence
    // 60px per frame gives a much smoother cinematic experience (450 frames = ~27000px scroll)
    // 30 frames = 1800px scroll
    const scrollDistance = frameCount * 60; 

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#intro-canvas-section',
        pin: true,
        start: 'top top',
        end: `+=${scrollDistance}`,
        scrub: 1, // Smooth scrub to interpolate between frames perfectly
        onLeave: () => {
          // Final cinematic transition: Bloom, Zoom, Fade
          canvas.classList.add('canvas-bloom');
          gsap.to(canvas, { 
            opacity: 0, 
            scale: 1.15, 
            duration: 1.5, 
            ease: "power2.inOut" 
          });
          
          if(document.getElementById('hero').classList.contains('hero-hidden')) {
             playHeroIntro();
          }
        },
        onEnterBack: () => {
          // Reverse the cinematic transition cleanly
          canvas.classList.remove('canvas-bloom');
          gsap.to(canvas, { 
            opacity: 1, 
            scale: 1, 
            duration: 1, 
            ease: "power2.inOut" 
          });
          
          document.getElementById('hero').classList.add('hero-hidden');
          document.getElementById('navbar').classList.add('nav-hidden');
        }
      }
    });

    // Animate through frames
    tl.to(obj, {
      frame: frameCount - 1,
      ease: "none", // Linear easing guarantees 1:1 scroll-to-frame mapping
      onUpdate: () => renderFrame(Math.floor(obj.frame))
    });
  };

  // Start the loading process
  loadFrames();
});

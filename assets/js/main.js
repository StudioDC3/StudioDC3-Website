        // --- 0. PRE-SET ---
        gsap.registerPlugin(ScrollTrigger);
        
        // --- 1. LENIS SMOOTH SCROLL ---
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            touchMultiplier: 2
        });

        // Ticker Sync with GSAP
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time)=>{
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        // --- 2. INITIAL STATES FOR ALL FOLDS ---
        gsap.set(".fold3-elem, .fold9-elem, .fold5-elem", { y: 50, opacity: 0 });
        gsap.set(".fold3-video, #gallery-wrapper, .fold5-tour", { y: 100, opacity: 0, scale: 0.95 });

        // --- 3. INTRO ANIMATIONS ---
        const initIntro = () => {
            const tl = gsap.timeline({ 
                defaults: { ease: "power4.out" },
                onComplete: () => {
                    // Start observing scroll elements only AFTER the intro finishes.
                    
                    // --- GALERIA DE PROJETOS (Segunda Dobra) ---
                    const tlFold9 = gsap.timeline({
                        scrollTrigger: {
                            trigger: "#galeria",
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        }
                    });
                    tlFold9.to(".fold9-elem", { y: 0, opacity: 1, duration: 1, ease: "power3.out" })
                           .to("#gallery-wrapper", { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" }, "-=0.6");

                    // --- TOUR VIRTUAL (Terceira Dobra) ---
                    const tlFold5 = gsap.timeline({
                        scrollTrigger: {
                            trigger: "#tour",
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        }
                    });
                    tlFold5.to(".fold5-elem", { y: 0, opacity: 1, duration: 1, ease: "power3.out" })
                           .to(".fold5-tour", { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" }, "-=0.6");
                }
            });
            
            // Body Fade In
            tl.to("body", { opacity: 1, duration: 0.5 });

            // Nav Elements Entrance
            tl.from(".nav-elem", {
                y: 40,
                opacity: 0,
                filter: "blur(8px)",
                duration: 1.2,
                stagger: 0.1,
            }, "-=0.2");

            // Primeira Dobra (Lançamentos)
            tl.to(".fold3-elem", { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.6")
              .to(".fold3-video", { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" }, "-=0.6");
        };

        // --- 6. QUINTA DOBRA - Tour Virtual ---
        // (Animations delegated to the global ScrollTrigger.batch above to ensure perfect load sequence)

        // --- 7. SEXTA DOBRA - Valor & Processo ---
        
        // 0. Pin background container (pseudo-sticky) via translation to bypass overflow-hidden mask limits
        gsap.to("#fold6-bg-container", {
            y: () => (document.querySelector(".fold6-trigger").offsetHeight - window.innerHeight),
            ease: "none",
            scrollTrigger: {
                trigger: ".fold6-trigger",
                start: "top top",      
                end: "bottom bottom", 
                scrub: true,
                invalidateOnRefresh: true
            }
        });

        // 1. Image fade parallax
        gsap.to("#fold6-bg2", {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
                trigger: ".fold6-trigger",
                start: "top top",      
                end: "bottom bottom", 
                scrub: 1
            }
        });
        
        // Antes fade out when headline approaches
        gsap.to("#fold6-text-antes", {
            opacity: 0,
            ease: "none",
            scrollTrigger: {
                trigger: ".fold6-elem",
                start: "top 100%",      
                end: "top 50%", 
                scrub: 1
            }
        });

        // 2. Timeline Progress Bar
        gsap.to("#fold6-progress", {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
                trigger: ".fold6-trigger",
                start: "top center",
                end: "bottom 80%",
                scrub: 1
            }
        });

        // 3. Header & Cards Reveal
        gsap.set(".fold6-elem", { y: 50, opacity: 0 });
        gsap.set(".fold6-card", { x: 50, opacity: 0 });

        ScrollTrigger.create({
            trigger: ".fold6-elem",
            start: "top 75%",
            onEnter: () => {
                gsap.to(".fold6-elem", { y: 0, opacity: 1, duration: 1, ease: "power3.out" });
            },
            onLeaveBack: () => {
                gsap.to(".fold6-elem", { y: 50, opacity: 0, duration: 1, ease: "power3.out" });
            }
        });

        gsap.utils.toArray('.fold6-card').forEach((card, i) => {
            gsap.to(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                x: 0,
                opacity: 1,
                duration: 1.2,
                ease: "power3.out"
            });
        });

        // 5. Fade out the entire timeline/cards container at the end, leaving just image 2
        gsap.to(".fold6-cards-wrapper", {
            opacity: 0,
            y: -100,
            scrollTrigger: {
                trigger: ".fold6-cards-wrapper",
                start: "bottom 60%",
                end: "bottom top",
                scrub: 1
            }
        });

        // 6. Fade in "Depois" text only when cards are disappearing
        gsap.to("#fold6-text-depois", {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
                trigger: ".fold6-cards-wrapper",
                start: "bottom 40%",
                end: "bottom top",
                scrub: 1
            }
        });

        // 7. Fade in Fold 7 (Logos)
        gsap.set(".fold7-elem", { y: 50, opacity: 0 });
        ScrollTrigger.create({
            trigger: ".fold7-elem",
            start: "top 80%",
            onEnter: () => {
                gsap.to(".fold7-elem", { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.2 });
            }
        });

        // 8. Fade in Fold 8 (Contact)
        gsap.set(".fold8-text", { y: 30, opacity: 0 });
        ScrollTrigger.create({
            trigger: ".fold8-elem",
            start: "top 75%",
            onEnter: () => {
                gsap.to(".fold8-text", { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", stagger: 0.15 });
            }
        });

        // Flashlight Button Effect
        document.querySelectorAll('.flashlight-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });

        // Native Video Logic
        const nativeVideo = document.getElementById('native-video');
        
        window.toggleSound = function() {
            const btnText = document.querySelector('.sound-toggle-button .btn-text');
            const icon = document.getElementById('sound-icon');
            if (!nativeVideo) return;

            if (nativeVideo.muted) {
                nativeVideo.muted = false;
                if(btnText) btnText.textContent = 'Mudo';
                if(icon) icon.setAttribute('icon', 'solar:volume-loud-bold-duotone');
            } else {
                nativeVideo.muted = true;
                if(btnText) btnText.textContent = 'Ligar Som';
                if(icon) icon.setAttribute('icon', 'solar:volume-cross-bold-duotone');
            }
        }
        // --- Gallery Slider Logic ---
        const galleryFiles = ['001.png','002.jpg','003.jpg','004.jpg','005.jpg','006.jpg','007.png','008.png','009.png','010.png','011.png','012.png','013.png','014.png','015.png','016.png','017.png','018.png','019.png','020.png','021.jpg','022.jpg'];
        const sliderContainer = document.getElementById('gallery-slider');
        
        // Populate slider
        galleryFiles.forEach((file, index) => {
            const img = document.createElement('img');
            img.src = `assets/images/Oitava Dobra/${file}`;
            img.alt = `Projeto ${index + 1}`;
            // Base classes: absolute, full size, cover.
            // Transition: dissolve 1s
            img.className = `absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === 0 ? 'opacity-100 z-10' : 'opacity-0 -z-10'}`;
            sliderContainer.appendChild(img);
        });

        const slides = sliderContainer.querySelectorAll('img');
        let currentSlide = 0;
        let slideInterval;

        function goToSlide(index) {
            const nextIndex = (index + slides.length) % slides.length;
            if (currentSlide === nextIndex) return;

            // Mark all slides as hidden (except current and next)
            slides.forEach((slide, i) => {
                if (i !== currentSlide && i !== nextIndex) {
                    slide.className = 'absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out opacity-0 -z-10';
                }
            });

            // The old slide becomes the background (z-0, fully opaque so it doesn't flash black)
            slides[currentSlide].className = 'absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out opacity-100 z-0';
            
            // The new slide fades in on top (z-10)
            slides[nextIndex].className = 'absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out opacity-100 z-10';

            currentSlide = nextIndex;
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        // Auto-play interval: 1.5 seconds (1500ms)
        function startSlideshow() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 1500);
        }

        function stopSlideshow() {
            clearInterval(slideInterval);
        }

        // Start initially
        startSlideshow();

        // Pause on hover
        const gallerySection = document.querySelector('#gallery-slider').parentElement;
        gallerySection.addEventListener('mouseenter', () => {
            if (window.matchMedia('(hover: hover)').matches) stopSlideshow();
        });
        gallerySection.addEventListener('mouseleave', () => {
            if (window.matchMedia('(hover: hover)').matches) startSlideshow();
        });

        // Buttons
        document.getElementById('gallery-prev').addEventListener('click', () => {
            stopSlideshow();
            prevSlide();
        });
        document.getElementById('gallery-next').addEventListener('click', () => {
            stopSlideshow();
            nextSlide();
        });

        // Mobile: resume autoplay when clicking outside the gallery
        document.addEventListener('touchstart', (e) => {
            if (!window.matchMedia('(hover: hover)').matches) {
                if (!gallerySection.contains(e.target)) {
                    startSlideshow();
                }
            }
        });

        // Execute intro
        initIntro();

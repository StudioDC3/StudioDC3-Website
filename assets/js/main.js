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

        // --- 2. INTRO ANIMATIONS ---
        const initIntro = () => {
            const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
            
            // Body Fade In
            tl.to("body", { opacity: 1, duration: 1 });

            // Text Elements Entrance
            tl.from(".hero-elem, .nav-elem", {
                y: 60,
                opacity: 0,
                filter: "blur(12px)",
                duration: 1.6,
                stagger: 0.15,
            }, "-=0.5");
        };

        // --- 3. IMAGE SEQUENCE SCROLL-DRIVEN LOGIC ---
        const canvas = document.getElementById('hero-canvas');
        const context = canvas.getContext('2d');

        const frameCount = 20;
        const currentFrame = index => (
            `assets/video-frames/Frame${(index + 17).toString().padStart(5, '0')}.png`
        );

        const images = [];
        const imageSequence = { frame: 0 };

        // Preload images
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            images.push(img);
        }

        function render() {
            if (images[imageSequence.frame] && images[imageSequence.frame].complete) {
                // Ensure canvas resolution matches image resolution dynamically
                canvas.width = images[imageSequence.frame].naturalWidth || 1920;
                canvas.height = images[imageSequence.frame].naturalHeight || 1080;
                
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(images[imageSequence.frame], 0, 0);
            }
        }

        images[0].onload = render;

        // Master Scroll Scrub for Images
        ScrollTrigger.create({
            trigger: "#hero-track",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
            onUpdate: (self) => {
                const targetFrame = Math.round(self.progress * (frameCount - 1));
                if (imageSequence.frame !== targetFrame) {
                    imageSequence.frame = targetFrame;
                    render();
                }
            }
        });

        // Extra Detail: Parallax/Fade the texts and overlay as we get close to the end of the track
        gsap.to(".hero-elem", {
            y: -60,
            opacity: 0,
            filter: "blur(6px)",
            scrollTrigger: {
                trigger: "#hero-track",
                start: "60% top",
                end: "bottom top", 
                scrub: 2
            }
        });
        
        // Fade out the dark gradient overlay gently
        gsap.to(".video-container > div", {
            opacity: 0,
            scrollTrigger: {
                trigger: "#hero-track",
                start: "60% top",
                end: "bottom top", 
                scrub: 2
            }
        });
        
        // --- 5. TERCEIRA DOBRA - Animações e Youtube API ---
        
        // Setup initial states
        gsap.set(".fold3-elem", { y: 50, opacity: 0 });
        gsap.set(".fold3-video", { y: 100, opacity: 0, scale: 0.95 });

        const tlFold3 = gsap.timeline({
            scrollTrigger: {
                trigger: ".fold3-video",
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
        
        tlFold3.to(".fold3-elem", {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out"
        })
        .to(".fold3-video", {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: "power2.out"
        }, "-=0.6");

        // --- 6. QUINTA DOBRA - Tour Virtual ---
        gsap.set(".fold5-elem", { y: 50, opacity: 0 });
        gsap.set(".fold5-tour", { y: 100, opacity: 0, scale: 0.95 });

        const tlFold5 = gsap.timeline({
            scrollTrigger: {
                trigger: ".fold5-tour",
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
        
        tlFold5.to(".fold5-elem", {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out"
        })
        .to(".fold5-tour", {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: "power2.out"
        }, "-=0.6");

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
                scrub: true
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
                scrub: true
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
                scrub: true
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
                scrub: true
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
                scrub: true
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
            slideInterval = setInterval(nextSlide, 1500);
        }

        function stopSlideshow() {
            clearInterval(slideInterval);
        }

        // Start initially
        startSlideshow();

        // Pause on hover
        const gallerySection = document.querySelector('#gallery-slider').parentElement;
        gallerySection.addEventListener('mouseenter', stopSlideshow);
        gallerySection.addEventListener('mouseleave', startSlideshow);

        // Buttons
        document.getElementById('gallery-prev').addEventListener('click', () => {
            stopSlideshow();
            prevSlide();
        });
        document.getElementById('gallery-next').addEventListener('click', () => {
            stopSlideshow();
            nextSlide();
        });

        // Execute intro
        initIntro();

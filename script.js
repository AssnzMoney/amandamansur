document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Scroll Effects: Progress Bar & Delicate Smart Navbar Auto-Hide
    const navbar = document.querySelector('.navbar');
    const scrollProgressBar = document.getElementById('scroll-progress');
    let lastScrollY = window.pageYOffset;
    let ticking = false;
    const scrollThreshold = 15;

    function handleScroll() {
        const currentScrollY = window.pageYOffset;

        // 1. Update Scroll Progress Bar
        if (scrollProgressBar) {
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = docHeight > 0 ? (currentScrollY / docHeight) * 100 : 0;
            scrollProgressBar.style.width = `${Math.min(100, Math.max(0, scrolled))}%`;
        }

        // 2. Smart Navbar: Hide gently on scroll down, show on scroll up
        if (navbar) {
            if (currentScrollY <= 60) {
                // Near top: always softly visible
                navbar.classList.remove('navbar-hidden');
            } else if (currentScrollY > lastScrollY + scrollThreshold) {
                // Scrolling down -> fade out delicately
                navbar.classList.add('navbar-hidden');
            } else if (currentScrollY < lastScrollY - scrollThreshold) {
                // Scrolling up -> fade in delicately
                navbar.classList.remove('navbar-hidden');
            }
        }

        lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(handleScroll);
            ticking = true;
        }
    }, { passive: true });

    // Intersection Observer for scroll animations
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Trigger reveal for elements already in viewport on load
    setTimeout(() => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('active');
            }
        });
    }, 100);

    // FAQ Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            
            // Close other items
            document.querySelectorAll('.accordion-item').forEach(item => {
                if (item !== accordionItem) {
                    item.classList.remove('active');
                }
            });
            
            // Toggle current item
            accordionItem.classList.toggle('active');
        });
    });

    // Particles Canvas Animation
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 0.5;
                this.speedY = Math.random() * 0.5 + 0.1;
                this.opacity = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.y -= this.speedY;
                if (this.y < 0) {
                    this.y = height;
                    this.x = Math.random() * width;
                }
            }
            draw() {
                ctx.fillStyle = `rgba(217, 164, 65, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const particleCount = Math.floor(width / 15);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }
        
        animate();
    }

    // Testimonials Horizontal Carousel Slider
    const carousel = document.getElementById('testimonials-carousel');
    const carouselArrowPrev = document.getElementById('carousel-arrow-prev');
    const carouselArrowNext = document.getElementById('carousel-arrow-next');
    const carouselBtnPrev = document.getElementById('carousel-btn-prev');
    const carouselBtnNext = document.getElementById('carousel-btn-next');
    const carouselActiveIdx = document.getElementById('carousel-active-idx');

    if (carousel) {
        const cards = Array.from(carousel.querySelectorAll('.testimonial-card'));
        const totalCards = cards.length;
        let currentIdx = 0;

        function scrollToCard(index) {
            if (totalCards === 0) return;
            if (index < 0) index = totalCards - 1;
            if (index >= totalCards) index = 0;
            currentIdx = index;

            const targetCard = cards[currentIdx];
            if (targetCard) {
                const carouselWidth = carousel.clientWidth;
                const cardWidth = targetCard.offsetWidth;
                const cardLeft = targetCard.offsetLeft;
                const targetScroll = cardLeft - (carouselWidth / 2) + (cardWidth / 2);

                carousel.scrollTo({
                    left: Math.max(0, targetScroll),
                    behavior: 'smooth'
                });
            }

            if (carouselActiveIdx) {
                carouselActiveIdx.textContent = currentIdx + 1;
            }
        }

        if (carouselArrowNext) carouselArrowNext.addEventListener('click', () => scrollToCard(currentIdx + 1));
        if (carouselArrowPrev) carouselArrowPrev.addEventListener('click', () => scrollToCard(currentIdx - 1));
        if (carouselBtnNext) carouselBtnNext.addEventListener('click', () => scrollToCard(currentIdx + 1));
        if (carouselBtnPrev) carouselBtnPrev.addEventListener('click', () => scrollToCard(currentIdx - 1));

        // Update active index indicator during touch scroll
        let isScrollingTimeout;
        carousel.addEventListener('scroll', () => {
            clearTimeout(isScrollingTimeout);
            isScrollingTimeout = setTimeout(() => {
                const carouselCenter = carousel.scrollLeft + (carousel.clientWidth / 2);
                let closestIdx = 0;
                let minDistance = Infinity;

                cards.forEach((card, idx) => {
                    const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
                    const dist = Math.abs(carouselCenter - cardCenter);
                    if (dist < minDistance) {
                        minDistance = dist;
                        closestIdx = idx;
                    }
                });

                currentIdx = closestIdx;
                if (carouselActiveIdx) {
                    carouselActiveIdx.textContent = currentIdx + 1;
                }
            }, 60);
        }, { passive: true });
    }

    // Testimonials Lightbox Modal
    const lightbox = document.getElementById('testimonial-lightbox');
    if (lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxClose = document.getElementById('lightbox-close-btn');
        const lightboxOverlay = lightbox.querySelector('.lightbox-overlay');
        const lightboxPrev = document.getElementById('lightbox-prev-btn');
        const lightboxNext = document.getElementById('lightbox-next-btn');
        const lightboxCurrent = document.getElementById('lightbox-current');
        
        const cards = Array.from(document.querySelectorAll('.testimonial-card'));
        let currentIndex = 0;

        function showImage(index) {
            if (cards.length === 0) return;
            if (index < 0) index = cards.length - 1;
            if (index >= cards.length) index = 0;
            currentIndex = index;

            const card = cards[currentIndex];
            const img = card.querySelector('.testimonial-img');
            if (img && lightboxImg) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt || `Depoimento ${currentIndex + 1}`;
            }
            if (lightboxCurrent) {
                lightboxCurrent.textContent = currentIndex + 1;
            }
        }

        function openLightbox(index) {
            showImage(index);
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        cards.forEach((card, idx) => {
            card.addEventListener('click', () => {
                openLightbox(idx);
            });
        });

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);

        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                showImage(currentIndex - 1);
            });
        }

        if (lightboxNext) {
            lightboxNext.addEventListener('click', (e) => {
                e.stopPropagation();
                showImage(currentIndex + 1);
            });
        }

        // Keyboard navigation (ESC, ArrowLeft, ArrowRight)
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
            if (e.key === 'ArrowRight') showImage(currentIndex + 1);
        });

        // Touch swipe support on mobile devices
        let touchStartX = 0;
        let touchEndX = 0;
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) {
                showImage(currentIndex + 1); // Swipe left -> next
            } else if (touchEndX - touchStartX > 50) {
                showImage(currentIndex - 1); // Swipe right -> prev
            }
        }, { passive: true });
    }
});

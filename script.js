// Tab functionality for About Me section
class TabManager {
    constructor() {
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.tabPanes = document.querySelectorAll('.tab-pane');
        this.init();
    }

    init() {
        this.tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabIndex = parseInt(e.target.dataset.tab);
                this.switchTab(tabIndex);
            });
        });
    }

    switchTab(tabIndex) {
        // Remove active class from all buttons and panes
        this.tabButtons.forEach(btn => btn.classList.remove('active'));
        this.tabPanes.forEach(pane => pane.classList.remove('active'));

        // Add active class to selected button and pane
        this.tabButtons[tabIndex].classList.add('active');
        this.tabPanes[tabIndex].classList.add('active');
    }
}

// Smooth scrolling for navigation links
class SmoothScroll {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    this.scrollToSection(targetSection);
                }
            });
        });
    }

    scrollToSection(targetSection) {
        const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Intersection Observer for scroll animations
class ScrollAnimator {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, this.observerOptions);

        // Observe elements that should animate on scroll
        const animateElements = document.querySelectorAll('.animate-in:not(.animate-in.fade-in):not(.animate-in.slide-in-from-bottom):not(.animate-in.slide-in-from-right)');
        animateElements.forEach(element => {
            observer.observe(element);
        });
    }
}

// Project card color application
class ProjectCards {
    constructor() {
        this.cards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            const color = card.dataset.color;
            card.style.backgroundColor = color;
        });
    }
}

// Navbar scroll effect
class NavbarEffect {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });
    }
}

// Hero scroll indicator
class HeroScroll {
    constructor() {
        this.scrollIndicator = document.querySelector('.scroll-indicator');
        this.init();
    }

    init() {
        if (this.scrollIndicator) {
            this.scrollIndicator.addEventListener('click', () => {
                const projectsSection = document.querySelector('#projects');
                if (projectsSection) {
                    projectsSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }
}

// Hero parallax and decor interaction
class HeroParallax {
    constructor() {
        this.hero = document.querySelector('.hero-decor');
        if (!this.hero) return;
        this.cards = this.hero.querySelectorAll('.decor-card');
        this.blob = this.hero.querySelector('.decor-blob');
        this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
        this.isHoveringHero = false;
        this.init();
    }

    init() {
        // Only add the mousemove listener when hovering over the hero section
        this.hero.addEventListener('mouseenter', () => {
            this.isHoveringHero = true;
            window.addEventListener('mousemove', this.mouseMoveHandler);
        });

        this.hero.addEventListener('mouseleave', () => {
            this.isHoveringHero = false;
            window.removeEventListener('mousemove', this.mouseMoveHandler);
            this.reset();
        });

        window.addEventListener('pointerleave', () => this.reset());
    }

    mouseMoveHandler(e) {
        if (!this.isHoveringHero) return;

        const rect = this.hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) - rect.width / 2;
        const y = (e.clientY - rect.top) - rect.height / 2;

        this.cards.forEach(card => {
            const depth = parseFloat(card.dataset.depth) || 8;
            const tx = (x / rect.width) * depth;
            const ty = (y / rect.height) * depth;
            card.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${(tx/8)}deg)`;
        });

        if (this.blob) {
            const bdepth = 6;
            const bx = (x / rect.width) * bdepth;
            const by = (y / rect.height) * bdepth;
            this.blob.style.transform = `translate3d(${bx}px, ${by}px, 0)`;
        }
    }

    reset() {
        this.cards.forEach(card => card.style.transform = '');
        if (this.blob) this.blob.style.transform = '';
    }
}

// Switchable hero cards interaction
class CardSwitcher {
    constructor() {
        this.hero = document.querySelector('.hero-decor');
        if (!this.hero) return;
        this.cards = Array.from(this.hero.querySelectorAll('.decor-card'));
        this.activeIndex = 0;
        this.init();
    }

    init() {
        this.cards.forEach((card, idx) => {
            card.addEventListener('click', () => this.setActive(idx));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.setActive(idx);
                }
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.prev();
                }
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.next();
                }
            });
            // initial aria
            card.setAttribute('aria-pressed', 'false');
        });
        // Set first active
        this.setActive(this.activeIndex, true);
        // Hover behavior: reveal on mouseenter, reset on mouseleave of hero area
        this.resetTimeout = null;
        this.cards.forEach((card, idx) => {
            card.addEventListener('mouseenter', () => {
                if (this.resetTimeout) {
                    clearTimeout(this.resetTimeout);
                    this.resetTimeout = null;
                }
                this.setActive(idx);
            });
            card.addEventListener('mouseleave', () => {
                // when leaving a card, wait briefly before resetting to default
                this.resetTimeout = setTimeout(() => {
                    this.setActive(this.activeIndex, true);
                    this.resetTimeout = null;
                }, 550);
            });
            // support touch: touching the card activates it
            card.addEventListener('touchstart', () => {
                if (this.resetTimeout) {
                    clearTimeout(this.resetTimeout);
                    this.resetTimeout = null;
                }
                this.setActive(idx);
            }, {passive: true});
        });
        // if pointer leaves the whole hero area, reset after short delay
        this.hero.addEventListener('mouseleave', () => {
            if (this.resetTimeout) clearTimeout(this.resetTimeout);
            this.resetTimeout = setTimeout(() => {
                this.setActive(this.activeIndex, true);
                this.resetTimeout = null;
            }, 600);
        });
    }

    setActive(index, instant=false) {
        this.cards.forEach((c, i) => {
            if (i === index) {
                c.classList.add('active');
                c.setAttribute('aria-pressed', 'true');
            } else {
                c.classList.remove('active');
                c.setAttribute('aria-pressed', 'false');
            }
        });
        this.activeIndex = index;
        // announce for screen readers via ARIA live region (create if needed)
        this.announceActive();
        if (!instant) {
            // subtle focus to active card for keyboard users
            const active = this.cards[index];
            active.focus({preventScroll:true});
        }
    }

    prev() {
        const next = (this.activeIndex - 1 + this.cards.length) % this.cards.length;
        this.setActive(next);
    }

    next() {
        const next = (this.activeIndex + 1) % this.cards.length;
        this.setActive(next);
    }

    announceActive() {
        let aria = document.getElementById('hero-card-announcer');
        if (!aria) {
            aria = document.createElement('div');
            aria.id = 'hero-card-announcer';
            aria.setAttribute('aria-live','polite');
            aria.setAttribute('aria-atomic','true');
            aria.style.position = 'absolute';
            aria.style.left = '-9999px';
            document.body.appendChild(aria);
        }
        const card = this.cards[this.activeIndex];
        const title = card.querySelector('.card-title')?.textContent || 'Card';
        const body = card.querySelector('.card-body')?.textContent || '';
        aria.textContent = `${title}: ${body}`;
    }
}

// Travel map gallery with hover effects and auto-rotation
class TravelGallery {
    constructor() {
        this.dots = document.querySelectorAll('.travel-dots .dot');
        this.galleryImages = document.querySelectorAll('.gallery-photo');
        this.galleryCaption = document.querySelector('#gallery-caption');
        // #region agent log (removed)
        // #endregion
        // #region agent log (removed)
        this.galleryImages.forEach((img, index) => {
        });
        // #endregion
        this.currentIndex = 0;
        this.isHovering = false;
        this.autoRotateInterval = null;
        this.clickedLock = false; // when true, auto-advance is paused (set after click)
        this.clickTimeout = null;
        // suppression removed: updateUI will always derive UI from currentIndex
        this.countries = ['china', 'taiwan', 'uk', 'italy', 'usa'];
        this.countryNames = {
            'china': 'China',
            'taiwan': 'Taiwan',
            'uk': 'United Kingdom',
            'italy': 'Italy',
            'usa': 'United States'
        };
        this.init();
    }

    init() {
        // #region agent log (removed)
        // #endregion
        // Set up image load/error listeners
        this.galleryImages.forEach((img, index) => {
            // #region agent log (removed)
            img.addEventListener('load', () => {
            });
            img.addEventListener('error', (e) => {
            });
            // #endregion
        });

        // Set up hover events for dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('mouseenter', () => this.showCountry(index));
            dot.addEventListener('mouseleave', () => this.startAutoRotate());
            dot.addEventListener('focus', () => this.showCountry(index));
            dot.addEventListener('blur', () => this.startAutoRotate());
        });

        // add click handlers to larger hit areas / groups for easier tapping
        const dotGroups = document.querySelectorAll('.travel-dots .dot-group');
        dotGroups.forEach((group) => {
            const idx = parseInt(group.getAttribute('data-index'), 10);
            group.addEventListener('click', (e) => {
                // prevent the group click from triggering unwanted focus/hover behavior
                e.preventDefault();
                this.onDotClick(idx);
            });
            group.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const idxKey = parseInt(group.getAttribute('data-index'), 10);
                    this.onDotClick(idxKey);
                }
            });
        });

        // Start auto-rotation initially
        this.startAutoRotate();
    }

    showCountry(index) {
        this.isHovering = true;
        this.stopAutoRotate();
        this.currentIndex = index;
        this.updateUI();
    }

    onDotClick(index) {
        // Clear any existing click timeout
        if (this.clickTimeout) {
            clearTimeout(this.clickTimeout);
            this.clickTimeout = null;
        }

        // Show the selected country immediately
        this.currentIndex = index;
        // Immediately update UI from the single source of truth (currentIndex)
        this.updateUI();

        // Lock auto-advance for 5 seconds (so user sees the clicked image)
        this.clickedLock = true;
        this.stopAutoRotate();

        this.clickTimeout = setTimeout(() => {
            this.clickedLock = false;
            this.clickTimeout = null;
            // resume auto rotation after lock expires
            this.startAutoRotate();
        }, 5000);
    }

    // Centralized UI update: defensive reset then apply active states based on currentIndex
    updateUI() {
        // Defensive reset: clear active classes from all photos, dots, and labels
        const images = Array.from(this.galleryImages || []);
        const dots = Array.from(document.querySelectorAll('.travel-dots .dot'));
        const labels = Array.from(document.querySelectorAll('.country-labels text'));

        images.forEach(img => img.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active', 'manual-selected'));
        labels.forEach(l => l.classList.remove('active'));

        // Apply active to the current index only (single source of truth)
        if (images[this.currentIndex]) images[this.currentIndex].classList.add('active');
        if (dots[this.currentIndex]) dots[this.currentIndex].classList.add('active');
        if (labels[this.currentIndex]) labels[this.currentIndex].classList.add('active');

        // Update caption (defensive: check bounds)
        const country = this.countries[this.currentIndex] || '';
        if (this.galleryCaption) {
            this.galleryCaption.textContent = this.countryNames[country] || '';
        }
    }

    startAutoRotate() {
        this.isHovering = false;
        this.stopAutoRotate();

        this.autoRotateInterval = setInterval(() => {
            // only advance automatically when not hovered and not locked by a recent click
            if (!this.isHovering && !this.clickedLock) {
                this.currentIndex = (this.currentIndex + 1) % this.countries.length;
                this.updateUI();
            }
        }, 2000); // 2 seconds
    }

    stopAutoRotate() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
            this.autoRotateInterval = null;
        }
    }
}

// Floating navigation highlighter for case studies
class FloatingNavHighlighter {
    constructor() {
        // find all bottom fixed navs that contain nav-item links
        this.navs = Array.from(document.querySelectorAll('nav.fixed'));
        this.linkToNavItem = new Map();
        this.sectionsToObserve = new Set();
        this.observer = null;
        this.init();
    }

    init() {
        // collect links and target sections
        this.navs.forEach(nav => {
            const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (!href || !href.startsWith('#')) return;
                const targetId = href.slice(1);
                const section = document.getElementById(targetId);
                if (!section) return;
                this.linkToNavItem.set(targetId, link);
                this.sectionsToObserve.add(section);
            });
        });

        if (this.sectionsToObserve.size === 0) return;

        const options = { threshold: [0.1, 0.25, 0.5, 0.75, 1], rootMargin: '0px 0px -40% 0px' };
        this.observer = new IntersectionObserver(this.onIntersect.bind(this), options);
        this.sectionsToObserve.forEach(s => this.observer.observe(s));
        // Add click handlers to immediately set active state and suppress observer briefly
        this.linkToNavItem.forEach((link, id) => {
            link.addEventListener('click', (e) => {
                // allow existing click handlers to perform scrolling; immediately mark active
                this.setActive(id);
                // suppress observer updates for a short window to avoid race conditions
                // shortened to 350ms for snappier resume after click
                this.suppressUntil = Date.now() + 350;
            });
        });
    }

    onIntersect(entries) {
        // choose the entry with highest intersection ratio that is intersecting
        // If we recently suppressed observer (due to a click), ignore intersections
        if (this.suppressUntil && Date.now() < this.suppressUntil) return;

        let best = null;
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            if (!best || entry.intersectionRatio > best.intersectionRatio) best = entry;
        });

        if (!best) return;
        const id = best.target.id;
        this.setActive(id);
    }

    setActive(targetId) {
        // clear previous active states
        this.linkToNavItem.forEach((link, id) => {
            const dot = link.querySelector('.dot');
            link.classList.remove('bg-zinc-900', 'text-white', 'shadow-md');
            if (dot) {
                dot.classList.remove('scale-100','opacity-100');
                dot.classList.add('scale-0','opacity-0');
            }
        });

        const activeLink = this.linkToNavItem.get(targetId);
        if (!activeLink) return;
        const dot = activeLink.querySelector('.dot');
        activeLink.classList.add('bg-zinc-900', 'text-white', 'shadow-md');
        if (dot) {
            dot.classList.remove('scale-0','opacity-0');
            dot.classList.add('scale-100','opacity-100');
        }
    }
}

// Case study nav pill hide/show when scrolling to footer
function initCaseNavPill() {
  const pills = Array.from(document.querySelectorAll('.case-nav-pill'));
  if (!pills.length) return;

  const hideTargets = Array.from(document.querySelectorAll('.case-nav-typographic, footer, .site-footer-inner'));
  if (!hideTargets.length) return;

  const observer = new IntersectionObserver((entries) => {
    const isAnyIntersecting = entries.some(e => e.isIntersecting);
    pills.forEach(p => p.classList.toggle('case-nav-hidden', isAnyIntersecting));
  }, { root: null, threshold: 0 });

  hideTargets.forEach(t => observer.observe(t));
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TabManager();
    new SmoothScroll();
    new ScrollAnimator();
    new ProjectCards();
    new NavbarEffect();
    new HeroScroll();
    new HeroParallax();
    new CardSwitcher();
    new TravelGallery();
    // Floating nav highlighter (for case study bottom navs)
    new FloatingNavHighlighter();
    // Case study nav pill hide/show
    initCaseNavPill();
    // Funnel reveal: observe funnel cards and add animate classes when visible
    (function initFunnelReveal(){
        if (!('IntersectionObserver' in window)) return;
        const cards = document.querySelectorAll('.funnel-card');
        if (!cards.length) return;
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    // also ensure reveal-up transition happens
                    entry.target.classList.add('reveal-up');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
        cards.forEach(c => io.observe(c));
    })();
    // Animate percent rings when they enter the viewport
    (function initPercentRings(){
        if (!('IntersectionObserver' in window)) return;
        const circles = document.querySelectorAll('.percent-progress');
        if (!circles.length) return;
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const circle = entry.target;
                    const target = circle.getAttribute('data-target-offset');
                    if (target) {
                        // animate to target
                        circle.setAttribute('stroke-dashoffset', target);
                    }
                    io.unobserve(circle);
                }
            });
        }, { threshold: 0.25, rootMargin: '0px 0px -10% 0px' });
        circles.forEach(c => {
            // ensure starting state (full circumference)
            c.setAttribute('stroke-dashoffset', c.getAttribute('stroke-dasharray') || '283');
            io.observe(c);
        });
    })();
    // #region agent log: layout diagnostics for ReCat case study (hypotheses H1-H3)
    try {
        (function(){
            const rcContext = document.getElementById('rc-context');
            const rcMethods = document.getElementById('rc-methods');
            const floatImg = rcContext ? rcContext.querySelector('img') : null;
            const payload = {
                sessionId: 'debug-session',
                runId: 'pre-fix',
                hypothesisId: 'H1',
                location: 'script.js:DOMLoaded:recat-layout',
                message: 'ReCat layout diagnostics',
                data: {
                    rcContext_exists: !!rcContext,
                    rcMethods_exists: !!rcMethods,
                    floatImg_exists: !!floatImg,
                    rcContext_rect: rcContext ? rcContext.getBoundingClientRect() : null,
                    floatImg_rect: floatImg ? floatImg.getBoundingClientRect() : null,
                    rcMethods_rect: rcMethods ? rcMethods.getBoundingClientRect() : null,
                    rcMethods_offsetTop: rcMethods ? rcMethods.offsetTop : null,
                    rcMethods_marginTop: rcMethods ? window.getComputedStyle(rcMethods).marginTop : null,
                    rcMethods_zIndex: rcMethods ? window.getComputedStyle(rcMethods).zIndex : null,
                    prevSibling_bottom: (function(){ if(!rcContext) return null; const rect=rcContext.getBoundingClientRect(); return rect.top + rect.height; })()
                },
                timestamp: Date.now()
            };
            // Recat layout diagnostics post removed
        })();
    } catch(e){}
    // #endregion
    // Ensure arrow buttons scroll to target with proper offset (accounts for fixed navbar + nav-gap)
    document.querySelectorAll('.arrow-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // handle anchor behavior manually to ensure consistent offset scroll
            const href = btn.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const navbar = document.querySelector('.navbar');
            const navGap = document.querySelector('.nav-gap');
            const navbarHeight = navbar ? navbar.offsetHeight : 80;
            const navGapHeight = navGap ? navGap.offsetHeight : 0;
            const offsetTop = target.offsetTop - navbarHeight - navGapHeight;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        });
    });
    // Fallback delegated handler in case direct listener doesn't fire (covers overlapping elements / browser quirks)
    document.addEventListener('click', (e) => {
        const a = e.target.closest && e.target.closest('a[href="#projects"]');
        if (!a) return;
        const btn = a;
        const target = document.querySelector('#projects');
        if (!target) return;
        e.preventDefault();
        const navbar = document.querySelector('.navbar');
        const navGap = document.querySelector('.nav-gap');
        const navbarHeight = navbar ? navbar.offsetHeight : 80;
        const navGapHeight = navGap ? navGap.offsetHeight : 0;
        const offsetTop = target.offsetTop - navbarHeight - navGapHeight;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }, { passive: false });

    // Hide nav pill when footer is visible
    (function () {
      if (!('IntersectionObserver' in window)) return; // graceful fallback: do nothing

      const nav = document.querySelector('.case-nav-band');
      const footer = document.querySelector('.site-footer');
      if (!nav || !footer) return;

      const io = new IntersectionObserver((entries) => {
        const isFooterVisible = entries.some(e => e.isIntersecting);
        nav.classList.toggle('hidden-by-footer', isFooterVisible);
      }, {root: null, threshold: 0});

      io.observe(footer);
    })();

    // Hide nav pill when its content overflows the viewport width
    const navOverflowHandler = (() => {
        const containers = Array.from(document.querySelectorAll('.pointer-events-auto'));
        const check = () => {
            containers.forEach(container => {
                // small margin so we don't hide prematurely due to tiny paddings
                const margin = 16;
                if (container.scrollWidth > (window.innerWidth - margin)) {
                    container.classList.add('hide-nav-pill');
                } else {
                    container.classList.remove('hide-nav-pill');
                }
            });
        };
        let rafId = null;
        const onResize = () => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                check();
                rafId = null;
            });
        };
        window.addEventListener('resize', onResize);
        window.addEventListener('orientationchange', onResize);
        // expose a manual trigger as well
        return { check, destroy: () => { window.removeEventListener('resize', onResize); window.removeEventListener('orientationchange', onResize); } };
    })();
    // run an initial check after short delay to allow font load/layout stabilization
    setTimeout(() => { try { document.querySelectorAll('.pointer-events-auto').forEach(() => {}); navOverflowHandler.check(); } catch (e) {/* noop */} }, 300);
    // Initialize timeline modal interactions (if present)
    if (typeof initTimeline === 'function') initTimeline();
});

// Add loading animation delay for initial elements
window.addEventListener('load', () => {
    setTimeout(() => {
        // Ensure elements intended to animate are visible if IntersectionObserver missed them
        document.querySelectorAll('.animate-in.fade-in, .animate-in.slide-in-from-bottom, .fade-in').forEach(element => {
            element.classList.add('animate-in');
        });
    }, 100);
});

// Simple carousel initializer for about -> My Background
function initBackgroundCarousels() {
    const wraps = document.querySelectorAll('.carousel-wrap');
    wraps.forEach(wrap => {
        const rail = wrap.querySelector('.carousel-rail');
        const cards = Array.from(rail.querySelectorAll('.carousel-card'));
        const prev = wrap.querySelector('.carousel-prev');
        const next = wrap.querySelector('.carousel-next');
        const dots = Array.from(wrap.querySelectorAll('.carousel-dot'));
        if (!rail || !cards.length) return;

        let index = 0;
        const scrollToIndex = (i) => {
            const card = cards[i];
            if (!card) return;
            const left = card.offsetLeft - (rail.clientWidth - card.clientWidth)/2;
            rail.scrollTo({ left, behavior: 'smooth' });
            index = i;
            // update dots
            dots.forEach(d => d.classList.remove('is-active'));
            const activeDot = wrap.querySelector(`.carousel-dot[data-index="${i}"]`);
            if (activeDot) activeDot.classList.add('is-active');
        };

        prev && prev.addEventListener('click', () => {
            const nextIndex = Math.max(0, index - 1);
            scrollToIndex(nextIndex);
        });
        next && next.addEventListener('click', () => {
            const nextIndex = Math.min(cards.length - 1, index + 1);
            scrollToIndex(nextIndex);
        });

        dots.forEach((d, i) => {
            d.addEventListener('click', () => scrollToIndex(i));
        });

        // Update index on manual scroll - snap to nearest
        let scrollTimeout = null;
        rail.addEventListener('scroll', () => {
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                // find nearest card center
                const center = rail.scrollLeft + rail.clientWidth/2;
                let nearest = 0;
                let minDist = Infinity;
                cards.forEach((c, idx) => {
                    const cCenter = c.offsetLeft + c.clientWidth/2;
                    const dist = Math.abs(center - cCenter);
                    if (dist < minDist) { minDist = dist; nearest = idx; }
                });
                index = nearest;
                dots.forEach(d => d.classList.remove('is-active'));
                const activeDot = wrap.querySelector(`.carousel-dot[data-index="${index}"]`);
                if (activeDot) activeDot.classList.add('is-active');
            }, 120);
        }, { passive: true });
    });
}

// initialize after DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initBackgroundCarousels();
});

// Timeline modal initializer
function initTimeline() {
  const stageData = {
    1: {
      title: 'Stage 1 — Project Kick Off',
      badges: ['Stakeholder meeting', 'Legal approval'],
      items: [
        'Led stakeholder kickoff meeting',
        'Defined research goals & key metrics',
        'Created research plan',
        'Partnered with Data Science on screener',
        'Legal team approval'
      ]
    },
    2: {
      title: 'Stage 2 — Preparation',
      badges: ['Screener', 'Interview plans'],
      items: [
        'Designed screener survey',
        'Created interview plans (TikTok users & competitor tool users)',
        'Set up unmoderated study (Dscout) & moderated guide'
      ]
    },
    3: {
      title: 'Stage 3 — Conduct Research',
      badges: ['Moderated Interviews', 'Unmoderated Studies'],
      items: [
        'Launched unmoderated study with 24 participants',
        'Conducted 11 moderated interviews'
      ]
    },
    4: {
      title: 'Stage 4 — Analysis',
      badges: ['Qualitative Analysis', 'Metrics'],
      items: [
        'Qualitative coding across all interviews',
        'Calculated average UX metric scores',
        'Critique sessions with fellow researchers',
        'Identified high-impact insights'
      ]
    },
    5: {
      title: 'Stage 5 — Delivery',
      badges: ['Report', 'Product Influence'],
      items: [
        'Research report created and shared broadly',
        'Partnered with Product to prioritize feature implementation'
      ]
    }
  };

  const chips = Array.from(document.querySelectorAll('.timeline-chip'));

  // populate per-chip popups
  chips.forEach(chip => {
    const stage = chip.getAttribute('data-stage');
    const data = stageData[stage];
    const popup = chip.querySelector('.timeline-popup');
    if (!popup || !data) return;
    const badgesContainer = popup.querySelector('.timeline-popup-badges');
    const listContainer = popup.querySelector('.timeline-popup-list');
    badgesContainer.innerHTML = '';
    data.badges.forEach(b => {
      const s = document.createElement('span');
      s.className = 'timeline-modal-badge';
      s.textContent = b;
      badgesContainer.appendChild(s);
    });
    listContainer.innerHTML = '';
    data.items.forEach(it => {
      const li = document.createElement('li');
      li.textContent = it;
      listContainer.appendChild(li);
    });
  });

  const hoverable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Keyboard accessibility: open popup on Enter/Space; ESC closes any open popup
  function closeAllPopups() {
    chips.forEach(c => {
      c.classList.remove('active');
      const p = c.querySelector('.timeline-popup');
      if (p) p.setAttribute('aria-hidden', 'true');
    });
  }

  chips.forEach(chip => {
    const popup = chip.querySelector('.timeline-popup');
    // ensure aria-hidden initial
    if (popup) popup.setAttribute('aria-hidden', 'true');

    // For hover-capable devices, CSS handles :hover; ensure focus shows popup too
    chip.addEventListener('focusin', () => {
      if (hoverable) {
        chip.classList.add('active');
        if (popup) popup.setAttribute('aria-hidden', 'false');
      }
    });
    chip.addEventListener('focusout', () => {
      if (hoverable) {
        chip.classList.remove('active');
        if (popup) popup.setAttribute('aria-hidden', 'true');
      }
    });

    // For touch / non-hover devices, toggle popup on click
    chip.addEventListener('click', (e) => {
      if (hoverable) return; // let hover handle on pointer devices
      const isActive = chip.classList.contains('active');
      closeAllPopups();
      if (!isActive) {
        chip.classList.add('active');
        if (popup) popup.setAttribute('aria-hidden', 'false');
        // if stage 2+ then persist disable highlight for this chip
        const stage = parseInt(chip.getAttribute('data-stage'), 10);
        if (stage > 1) {
          const disabledKey = `timelineDisabled_stage_${stage}`;
          try { sessionStorage.setItem(disabledKey, '1'); } catch(e) {}
          chip.classList.remove('chip-highlight');
          chip.classList.add('disabled');
          // log disable (removed)
        }
      }
      e.stopPropagation();
    });

    // keyboard activation for non-hover as well
    chip.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        chip.click();
      }
    });
    // add hover handlers to pause pulse/highlight while hovering
    chip.addEventListener('mouseenter', () => {
      chip.classList.add('hovering');
    });
    chip.addEventListener('mouseleave', () => {
      chip.classList.remove('hovering');
    });
    // disable highlight when popup is hovered (for stage 2+)
    if (popup) {
      popup.addEventListener('mouseenter', () => {
        const stage = parseInt(chip.getAttribute('data-stage'), 10);
        if (stage > 1) {
          const disabledKey = `timelineDisabled_stage_${stage}`;
          try { sessionStorage.setItem(disabledKey, '1'); } catch(e) {}
          chip.classList.remove('chip-highlight');
          chip.classList.add('disabled');
          // log disable by popup hover (removed)
        }
      });
    }
  });

  // close on outside click or Escape
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.timeline-chip')) closeAllPopups();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllPopups();
  });

  // One-time entrance pulse on first chip + rail shimmer
  try {
    const introKey = 'timelineIntroShown_v1';
    // #region agent log (removed)
    // #endregion

    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // #region agent log (removed)
    // #endregion

    // Run intro pulse regardless of previous session to ensure visibility (stronger pulse)
    if (!prefersReduced) {
      const firstChip = document.querySelector('.timeline-chip[data-stage=\"1\"]');
      const rail = document.querySelector('.timeline-inner');
      // #region agent log (removed)
      // #endregion

      if (firstChip) {
        // log bounding rect and visibility before triggering intro (no continuous pulse)
        try {
          const rect = firstChip.getBoundingClientRect();
          const visible = rect.top < window.innerHeight && rect.bottom > 0;
          // firstChip visibility log (removed)
        } catch(e){}
        // no continuous pulse applied; Stage 1 will receive same highlight behavior below
      }
      if (rail) {
        rail.classList.add('timeline-rail-shimmer');
        setTimeout(() => rail.classList.add('shimmering'), 240);
        // #region agent log (removed)
        // #endregion
      }
      // apply highlights to all chips unless disabled
      chips.forEach(c => {
        const stage = parseInt(c.getAttribute('data-stage'), 10);
        const disabledKey = `timelineDisabled_stage_${stage}`;
        const disabled = !!sessionStorage.getItem(disabledKey);
        if (!disabled) c.classList.add('chip-highlight');
        else c.classList.add('disabled');
      });
      try { sessionStorage.setItem(introKey, '1'); 
        // #region agent log (removed)
        // #endregion
      } catch (e) { /* ignore storage errors */ }
      setTimeout(() => {
        if (firstChip) firstChip.classList.remove('timeline-intro-pulse');
        if (rail) rail.classList.remove('shimmering', 'timeline-rail-shimmer');
        // #region agent log (removed)
        // #endregion
      }, 2200);
    } else {
      // #region agent log (removed)
      // #endregion
    }
  } catch (e) {
    // silent fail
  }
}
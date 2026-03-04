import { gsap } from "gsap";

import { Flip } from "gsap/Flip.js";
import { Observer } from "gsap/Observer.js";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
// ScrollSmoother requires ScrollTrigger
import { ScrollSmoother } from "gsap/ScrollSmoother.js";
import { SplitText } from "gsap/SplitText.js";

gsap.registerPlugin(Flip, Observer, ScrollTrigger, ScrollSmoother, SplitText);

$(document).ready(function () {
	// Active Link State
	const currentLocation = window.location.pathname;
	$('.nav-list__link').each(function () {
		if (currentLocation.includes($(this).attr('href'))) {
			$(this).addClass('active');
		} else if (currentLocation === "/" || currentLocation.endsWith("index.html")) {
			// Default to Home if on root
			if ($(this).attr('href') === 'index.html') $(this).addClass('active');
		}
	});

	// GSAP Mobile Menu Timeline Setup
	const menuTl = gsap.timeline({ paused: true, reversed: true });
	
	// Animate the overlay slide down from the top
	menuTl.to('.mobile-menu-overlay', {
		y: '0%', // Animates from its CSS -100% to 0% (in view)
		autoAlpha: 1,
		duration: 0.6,
		ease: "power3.inOut"
	});
	
	// Stagger in the navigation items upwards smoothly
	menuTl.from('.mobile-nav-list .nav-list__item', {
		y: 40,
		opacity: 0,
		stagger: 0.08,
		duration: 0.5,
		ease: "power2.out"
	}, "-=0.3");

	// Mobile Menu & ARIA Expanding
	$('.nav__toggler').click(function () {
		const isExpanded = $(this).attr('aria-expanded') === 'true';
		$(this).attr('aria-expanded', !isExpanded);
		
		// Visual toggles for the hamburger icon to morph into an X
		$('.nav').toggleClass('active');
		$('.nav__icone').toggleClass('active');
		
		if (!isExpanded) {
			menuTl.play();
		} else {
			menuTl.reverse();
		}
	});

	// Close menu automatically if a navigation link is clicked inside the overlay
	$('.mobile-link').click(function () {
		if ($('.nav__toggler').attr('aria-expanded') === 'true') {
			$('.nav__toggler').click();
		}
	});

	// AOS Initialization
	AOS.init({
		offset: 100,
		duration: 1000
	});

	// create the smooth scroller FIRST!
	const smoother = ScrollSmoother.create({
		wrapper: "#wrapper",
		content: "#content",
		smooth: 1,
		normalizeScroll: true, // prevents address bar from showing/hiding on most devices, solves various other browser inconsistencies
		ignoreMobileResize: true, // skips ScrollTrigger.refresh() on mobile resizes from address bar showing/hiding
		effects: true,
		preventDefault: true
	});


	let tl = gsap.timeline();
	let mySplitText = new SplitText("#split-stagger", { type: "words,chars" });
	let chars = mySplitText.chars;

	chars.forEach((char, i) => {
		smoother.effects(char, { speed: 1, lag: (i + 1) * 0.1 });
	});

	// Footer Animation
	gsap.utils.toArray('.footer-box, .your-idea-box').forEach(box => {
		gsap.from(box, {
			scrollTrigger: {
				trigger: box,
				start: "top 90%",
				toggleActions: "play none none reverse"
			},
			y: 50,
			opacity: 0,
			duration: 0.8,
			ease: "power2.out"
		});
	});

	// Preparation for Entrance
	gsap.set(".heading", { y: -50, opacity: 0 });
	const heroTitle = document.querySelector('.title h1');
	const heroText = document.querySelector('.title p');
	const navElements = document.querySelectorAll('.logo, .nav-list__link');
	
	const splitHeroTitle = heroTitle ? new SplitText(heroTitle, { type: "words" }) : null;
	const splitHeroText = heroText ? new SplitText(heroText, { type: "words" }) : null;

	if (splitHeroTitle) gsap.set(splitHeroTitle.words, { opacity: 0, y: 20 });
	if (splitHeroText) gsap.set(splitHeroText.words, { opacity: 0, y: 20 });
	gsap.set(navElements, { opacity: 0, y: -10 });

	// Master Entrance Timeline
	const masterTl = gsap.timeline({ paused: true }); // Pause initially until preloader finishes
	const transitionEl = document.querySelector('.page-transition');
	const preloaderContent = document.querySelector('.preloader-content');
	const percentageTxt = document.querySelector('.preloader-percentage');

	// Preloading Images Logic
	// Only track images that are NOT lazy-loaded to avoid stalling
	const images = Array.from(document.querySelectorAll('img')).filter(img => img.getAttribute('loading') !== 'lazy');
	let loadedCount = 0;
	const totalImages = images.length;

	if (totalImages > 0) {
		images.forEach(img => {
			if (img.complete) {
				updateProgress();
			} else {
				img.addEventListener('load', updateProgress);
				img.addEventListener('error', updateProgress); // Count errors too to avoid hanging
			}
		});
	} else {
		finishLoading();
	}

	function updateProgress() {
		loadedCount++;
		const percent = Math.round((loadedCount / totalImages) * 100);
		if (percentageTxt) {
			percentageTxt.textContent = `${percent}%`;
		}
		if (loadedCount >= totalImages) {
			finishLoading();
		}
	}

	function finishLoading() {
		if (preloaderContent) {
			gsap.to(preloaderContent, {
				opacity: 0,
				y: -20,
				duration: 0.5,
				ease: "power2.inOut",
				delay: 0.5,
				onComplete: () => masterTl.play() // Start the entrance!
			});
		} else {
			masterTl.play();
		}
	}

	if (transitionEl) {
		masterTl.to(transitionEl, {
			scaleY: 0,
			transformOrigin: "top",
			duration: 0.8,
			ease: "power2.inOut"
		});
	}

	// Hero Sequence
	masterTl.to(".heading", {
		y: 0,
		opacity: 1,
		duration: 1.5,
		ease: "power4.out"
	}, "-=0.2");

	masterTl.to(navElements, {
		opacity: 1,
		y: 0,
		stagger: 0.05,
		duration: 0.8,
		ease: "power2.out"
	}, "-=1.0");

	if (splitHeroTitle) {
		masterTl.to(splitHeroTitle.words, {
			opacity: 1,
			y: 0,
			stagger: 0.05,
			duration: 0.8,
			ease: "power2.out"
		}, "-=0.8");
	}

	if (splitHeroText) {
		masterTl.to(splitHeroText.words, {
			opacity: 1,
			y: 0,
			stagger: 0.02,
			duration: 0.8,
			ease: "power2.out",
			onComplete: () => {
				// Enable ScrollTrigger reveals only after hero sequence finishes
				initScrollReveals();
			}
		}, "-=0.6");
	} else {
		masterTl.add(() => initScrollReveals());
	}

	function initScrollReveals() {
		// Global Text Reveal Animation (Excluding Hero)
		const textElements = gsap.utils.toArray('.staggered_text h2, .staggered_text p, .bars-text h2, .bars-text h3, .bars-text p, .main__heading--your-idea, .description--your-idea');
		textElements.forEach(elem => {
			let split = new SplitText(elem, { type: "words" });
			gsap.from(split.words, {
				scrollTrigger: {
					trigger: elem,
					start: "top 90%",
					toggleActions: "play none none reverse"
				},
				y: 20,
				opacity: 0,
				duration: 0.7,
				stagger: 0.05,
				ease: "power2.out"
			});
		});
	}

	// Social & Email Links Hover Animation
	gsap.utils.toArray('.description--footer1, .description--footer-a').forEach(link => {
		let hoverTl = gsap.timeline({ paused: true });

		hoverTl.to(link, {
			y: -5,
			color: "#fff",
			opacity: 0.8,
			duration: 0.3,
			ease: "power2.out"
		});

		link.addEventListener("mouseenter", () => hoverTl.play());
		link.addEventListener("mouseleave", () => hoverTl.reverse());
	});

	// Scroll to Top Button Interaction
	const scrollTopBtn = document.querySelector('.footer-bottom-to-top');
	if (scrollTopBtn) {
		let btnHoverTl = gsap.timeline({ paused: true });
		btnHoverTl.to(scrollTopBtn, {
			scale: 1.1,
			duration: 0.6,
			ease: "back.out(1.7)"
		});

		scrollTopBtn.addEventListener("mouseenter", () => btnHoverTl.play());
		scrollTopBtn.addEventListener("mouseleave", () => btnHoverTl.reverse());

		scrollTopBtn.addEventListener("click", (e) => {
			e.preventDefault();
			gsap.to(scrollTopBtn, {
				y: -150,
				opacity: 0,
				duration: 0.8,
				ease: "power2.in",
				onComplete: () => {
					window.scrollTo({ top: 0, behavior: 'smooth' });
					gsap.set(scrollTopBtn, { clearProps: "all" });
				}
			});
		});
	}

	// Custom Cursor Logic
	const cursor = document.querySelector('.custom-cursor');
	if (cursor && !window.matchMedia("(hover: none)").matches) {
		document.addEventListener('mousemove', (e) => {
			gsap.to(cursor, {
				x: e.clientX,
				y: e.clientY,
				duration: 0.1,
				ease: "power2.out"
			});
		});

		const updateCursorInteractivity = () => {
			const interactiveElements = document.querySelectorAll('a, button, .image_cont, .menu-close');
			interactiveElements.forEach(el => {
				el.addEventListener('mouseenter', () => {
					cursor.classList.add('active');
				});
				el.addEventListener('mouseleave', () => {
					cursor.classList.remove('active');
				});
			});
		};
		updateCursorInteractivity();
	}

	// Intercept Internal Links to Animate Out first
	const internalLinks = document.querySelectorAll('a[href$=".html"]');
	internalLinks.forEach(link => {
		link.addEventListener('click', (e) => {
			e.preventDefault();
			const targetUrl = link.getAttribute('href');

			gsap.fromTo(transitionEl,
				{ scaleY: 0, transformOrigin: "bottom" },
				{
					duration: 0.8,
					scaleY: 1,
					ease: "power2.inOut",
					onComplete: () => {
						window.location.href = targetUrl;
					}
				}
			);
		});
	});

	// Mobile Menu Close Button
	$('.menu-close').on('click touchstart', function (e) {
		e.preventDefault();
		if ($('.nav__toggler').attr('aria-expanded') === 'true') {
			$('.nav__toggler').click();
		}
	});

	// Sticky Nav Polish
	ScrollTrigger.create({
		start: "top -50",
		onUpdate: (self) => {
			if (self.direction === 1) { // Scrolling down
				gsap.to(".nav", { yPercent: -100, duration: 0.4, ease: "power2.inOut" });
			} else { // Scrolling up
				gsap.to(".nav", { yPercent: 0, duration: 0.4, ease: "power2.out", backgroundColor: "rgba(44, 68, 23, 0.9)" });
			}
		}
	});

	// Support for Reduced Motion
	const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	if (prefersReducedMotion) {
		gsap.ticker.fps(30);
	}
});
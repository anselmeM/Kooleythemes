# KooleyThemes Web Development Studio

**Live Website:** (https://anselmem.github.io/Kooleythemes/)

A modern, high-performance, and beautifully animated portfolio website for **KooleyThemes**. 

This project aims to deliver a premium user experience featuring silky-smooth scroll effects, interactive GSAP animations, native page transitions, and a custom PHP backend to securely route customer inquiries.

## ✨ Features

- **Premium GSAP Interactions:** 
  - Dynamic `SplitText` typography reveals mapped to scroll position.
  - Interactive tactile hover states on images causing them to natively scale/illuminate.
  - A responsive custom cursor that intuitively expands over interactive elements.
- **Native Page Transitions:** High-end native application feel using GSAP to slide a solid-color curtain element away on initial load, and draw it back down before navigating to internal links.
- **Smooth Scrolling Engine:** Utilitzes the premium `ScrollSmoother` plugin to hijack native scroll velocity, keeping the page buttery smooth with parallax layers and variable-speed imagery (`data-speed`).
- **Fully Functional PHP Backend:** A lightweight, secure `submit.php` script handles contact form POST data, cleans string inputs, and reliably fires native email alerts directly to `Info@kooleythemes.com`, routing the user to an animated `thankyou.html` completion screen.

## 🛠️ Tech Stack

- **Frontend:** HTML5, modern CSS3 (Variables, Flexbox, CSS Grid), Vanilla JavaScript.
- **Animation Libraries:** GreenSock (GSAP), ScrollTrigger, ScrollSmoother, SplitText by GreenSock, and AOS (Animate on Scroll).
- **Backend:** PHP (Native mail function & input sanitization).
- **Fonts & Typography:** `Space Grotesk` (Body text) and `Syne` (Headings) via Google Fonts. 

## 📂 Project Structure

```text
/
├── Fonts/               # Custom font woff/woff2 files
├── images/              # Optimized site image assets
├── js/
│   ├── jquery.js        # jQuery dependency 
│   └── main.js          # Core application logic & GSAP timelines
├── style.css            # Global CSS variables, responsive logic, and component styling 
├── submit.php           # Secure backend form processing & email pipeline 
├── Index.html           # Homepage & Hero Section
├── studio.html          # About our process & offerings
├── our-work.html        # Gallery of previous client works
├── contact.html         # Interactive consultation form 
└── thankyou.html        # Success screen post message-submission
```

## 🚀 Deployment & Local Development

This website is predominantly a static HTML/JS/CSS stack. It can be opened locally in your browser by double-clicking any `.html` file. 

**However**, to test and utilize the Contact Form functionality (`submit.php`), the project **must be hosted on a live PHP server environment** (e.g. Apache/Nginx with PHP installed). 

If deploying this site to a live server:
1. Ensure your hosting provider has proper `PHP sendmail` configured.
2. If you would ever like to change what email address the contact forms are sent to, simply open `submit.php` and change the `$to` variable on Line `3`.

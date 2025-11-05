document.addEventListener('DOMContentLoaded', () => {

    const observerOptions = {
        root: null, // observes intersections relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // triggers when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing the element once it's visible
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Select all elements you want to animate
    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(el => observer.observe(el));

    // Per-section background images with mouse-driven cycling
    const sectionBackgrounds = {
        home: [
            'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1920&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1920&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1920&auto=format&fit=crop'
        ],
        about: [
            'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1920&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1920&auto=format&fit=crop'
        ],
        skills: [
            'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1920&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?q=80&w=1920&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=1920&auto=format&fit=crop'
        ],
        achievements: [
            'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1920&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1920&auto=format&fit=crop'
        ],
        learning: [
            'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1920&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1920&auto=format&fit=crop'
        ],
        projects: [
            'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=1920&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?q=80&w=1920&auto=format&fit=crop'
        ],
        tools: [
            'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1920&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1920&auto=format&fit=crop'
        ],
        contact: [
            'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1920&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1920&auto=format&fit=crop'
        ]
    };

    const prefetchImages = (urls) => {
        urls.forEach(u => { const img = new Image(); img.src = u; });
    };
    Object.values(sectionBackgrounds).forEach(prefetchImages);

    let currentSectionId = 'home';
    let currentIndexBySection = {};
    const setBackground = (url) => {
        document.body.style.backgroundImage = `linear-gradient(rgba(17,24,39,0.6), rgba(17,24,39,0.6)), url(${url})`;
    };

    // Observe sections to switch background set
    const sectionEls = document.querySelectorAll('main section[id]');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                if (sectionBackgrounds[id]) {
                    currentSectionId = id;
                    const arr = sectionBackgrounds[id];
                    const idx = (currentIndexBySection[id] ?? 0) % arr.length;
                    setBackground(arr[idx]);
                }
            }
        });
    }, { threshold: 0.6 });
    sectionEls.forEach(s => sectionObserver.observe(s));

    // Mouse-driven cycling within the current section
    let rafIdBg;
    let pendingX = null;
    const animateBg = () => {
        if (pendingX == null) { rafIdBg = requestAnimationFrame(animateBg); return; }
        const arr = sectionBackgrounds[currentSectionId] || [];
        if (arr.length) {
            const proportion = Math.max(0, Math.min(1, pendingX / window.innerWidth));
            const idx = Math.min(arr.length - 1, Math.floor(proportion * arr.length));
            if ((currentIndexBySection[currentSectionId] ?? -1) !== idx) {
                currentIndexBySection[currentSectionId] = idx;
                setBackground(arr[idx]);
            }
        }
        pendingX = null;
        rafIdBg = requestAnimationFrame(animateBg);
    };
    window.addEventListener('mousemove', (e) => { pendingX = e.clientX; });
    window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) pendingX = e.touches[0].clientX;
    }, { passive: true });
    animateBg();

    // Add decorative frames to each section content automatically
    document.querySelectorAll('section').forEach(section => {
        const wrapper = document.createElement('div');
        wrapper.className = 'section-frame';
        // move children into wrapper
        while (section.firstChild) {
            wrapper.appendChild(section.firstChild);
        }
        section.appendChild(wrapper);
    });

    // Cursor-driven parallax photo layer
    const parallaxRoot = document.querySelector('.parallax');
    if (parallaxRoot) {
        const photos = [
            // Replace with your provided photos as needed
            'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop'
        ];

        const elements = photos.map((src, index) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = '';
            img.className = 'parallax__img';
            // seed initial positions scattered around viewport
            const x = (index + 1) * 15 + Math.random() * 30; // percentage baseline
            const y = (index + 1) * 10 + Math.random() * 25;
            img.style.left = `${x}%`;
            img.style.top = `${y}%`;
            parallaxRoot.appendChild(img);
            return { el: img, depth: 0.04 + index * 0.02 };
        });

        let mouseX = 0, mouseY = 0;
        const center = () => ({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        });

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        window.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches[0]) {
                mouseX = e.touches[0].clientX;
                mouseY = e.touches[0].clientY;
            }
        }, { passive: true });

        let rafId;
        const animate = () => {
            const c = center();
            const dx = (mouseX - c.x) / c.x; // -1..1
            const dy = (mouseY - c.y) / c.y; // -1..1
            elements.forEach(({ el, depth }, i) => {
                const translateX = -dx * depth * 40; // px
                const translateY = -dy * depth * 30; // px
                el.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
                // subtle fade on movement
                el.style.opacity = String(0.12 + Math.min(0.18, Math.abs(dx) * 0.06 + Math.abs(dy) * 0.06));
            });
            rafId = requestAnimationFrame(animate);
        };
        animate();

        // Clean up on unload
        window.addEventListener('beforeunload', () => cancelAnimationFrame(rafId));
    }
});

// Removed conflicting manual reveal; IntersectionObserver handles visibility


// BEGIN: Enhanced features (dark mode, contact form handler, 14 daily logs)
document.addEventListener("DOMContentLoaded", function(){
    // Dark mode toggle
    const toggle = document.getElementById("theme-toggle");
    const body = document.body;
    const saved = localStorage.getItem("theme");
    if(saved === "dark") body.classList.add("dark");
    if(toggle) {
        toggle.addEventListener("click", ()=>{
            body.classList.toggle("dark");
            localStorage.setItem("theme", body.classList.contains("dark") ? "dark" : "light");
            toggle.textContent = body.classList.contains("dark") ? "☀️" : "🌙";
        });
    }

    // Populate 14 daily logs
    const dailyLogs = ['2025-11-05 • THM: SQL Injection (Room) — enumerated parameters, crafted boolean-based payloads.', '2025-11-06 • THM: Web Fundamentals — analyzed XSS vectors and CSP bypass notes.', '2025-11-07 • THM: Network Fundamentals — Nmap scan + service/version detection.', '2025-11-08 • THM: Packet Analysis — Wireshark PCAP analysis, found plain HTTP creds.', '2025-11-09 • THM: Burp Suite Essentials — automated scan & manual verification.', '2025-11-10 • THM: PrivEsc Basics — Linux SUID enumeration practice.', '2025-11-11 • THM: Enumeration — ffuf content discovery on webhost.', '2025-11-12 • THM: Password Attacks — Hashcat basics (offline wordlist practice).', '2025-11-13 • THM: API Security — tested insecure direct object references.', '2025-11-14 • THM: CVE Research — mapped services to CVEs using VulnDB technique.', '2025-11-15 • THM: Docker Security — scanning containers with Trivy.', '2025-11-16 • THM: SIEM Basics — Splunk simple dashboards & alerts practice.', '2025-11-17 • THM: Forensics — timeline creation from logs & disk image analysis.', '2025-11-18 • THM: Final Review — produced pentest report template & remediation notes.'];
    const logList = document.getElementById("dailyUpdates");
    if(logList){
        logList.innerHTML = "";
        dailyLogs.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            logList.appendChild(li);
        });
    }

    // Contact form handler (prefer Gmail app, with graceful fallbacks)
    const form = document.getElementById("contactForm");
    const status = document.getElementById("contactStatus");
    if(form){
        form.addEventListener("submit", function(e){
            e.preventDefault();
            const toAddress = "smartdevil.in.ac@gmail.com"; // recipient
            const name = (form.name?.value || "").trim();
            const email = (form.email?.value || "").trim();
            const subjectSel = (form.subject?.value || "General").trim();
            const message = (form.message?.value || "").trim();

            const subject = `Portfolio Contact — ${subjectSel} — ${name}`;
            const bodyLines = [
                `Name: ${name}`,
                `Email: ${email}`,
                `Subject: ${subjectSel}`,
                "",
                "Message:",
                message,
                "",
                "— Sent from Himanshu's Cybersecurity Portfolio"
            ];
            const body = bodyLines.join("\n");

            const enc = encodeURIComponent;
            const gmailAppUrl = `googlegmail://co?to=${enc(toAddress)}&subject=${enc(subject)}&body=${enc(body)}&cc=${enc(email)}`;
            const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${enc(toAddress)}&su=${enc(subject)}&body=${enc(body)}&cc=${enc(email)}`;
            const mailtoUrl = `mailto:${enc(toAddress)}?subject=${enc(subject)}&body=${enc(body)}&cc=${enc(email)}`;

            status.textContent = "Opening Gmail...";

            // Try Gmail app deep link first (Android/iOS with Gmail installed)
            let opened = false;
            const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

            const fallbackTo = (url) => {
                if (opened) return;
                opened = true;
                window.location.href = url;
            };

            if (isMobile) {
                // Attempt app link; if it fails, fall back after a brief delay
                const timer = setTimeout(() => fallbackTo(mailtoUrl), 700);
                try {
                    window.location.href = gmailAppUrl;
                } catch (_) {
                    clearTimeout(timer);
                    fallbackTo(mailtoUrl);
                }
            } else {
                // Desktop: prefer Gmail web compose
                window.open(gmailWebUrl, "_blank");
            }
        });
    }

    // Skills section cursor spotlight effect
    const skillCards = document.querySelectorAll('.skills-grid .skill-category');
    if (skillCards.length) {
        const updateCoords = (el, e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
            const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
            el.style.setProperty('--mx', x + 'px');
            el.style.setProperty('--my', y + 'px');
        };
        skillCards.forEach((card) => {
            card.addEventListener('mousemove', (e) => updateCoords(card, e));
            card.addEventListener('touchmove', (e) => updateCoords(card, e), { passive: true });
            card.addEventListener('mouseleave', () => {
                card.style.removeProperty('--mx');
                card.style.removeProperty('--my');
            });
        });
    }

    // Tools chips cursor spotlight effect
    const toolChips = document.querySelectorAll('.tools-grid span');
    if (toolChips.length) {
        const updateChip = (el, e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
            const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
            el.style.setProperty('--mx', x + 'px');
            el.style.setProperty('--my', y + 'px');
        };
        toolChips.forEach((chip) => {
            chip.setAttribute('tabindex', '0');
            chip.addEventListener('mousemove', (e) => updateChip(chip, e));
            chip.addEventListener('touchmove', (e) => updateChip(chip, e), { passive: true });
            chip.addEventListener('mouseleave', () => { chip.style.removeProperty('--mx'); chip.style.removeProperty('--my'); });
            chip.addEventListener('focus', () => { chip.style.setProperty('--mx', '50%'); chip.style.setProperty('--my', '50%'); });
            chip.addEventListener('blur', () => { chip.style.removeProperty('--mx'); chip.style.removeProperty('--my'); });
        });
    }
});
// END

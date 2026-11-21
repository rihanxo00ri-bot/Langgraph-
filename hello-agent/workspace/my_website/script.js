// AURA Studio Interactive Engine & UI Controller

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // Dynamic Copyright Year
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 2. Toast Notification System
    window.showToast = function(title, message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast-enter flex items-center gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-xl text-xs max-w-sm pointer-events-auto bg-slate-900/95 ${
            type === 'success' ? 'border-emerald-500/50 text-emerald-300' :
            type === 'warning' ? 'border-amber-500/50 text-amber-300' :
            'border-brand-500/50 text-brand-300'
        }`;

        const iconName = type === 'success' ? 'check-circle' : type === 'warning' ? 'alert-triangle' : 'sparkles';
        
        toast.innerHTML = `
            <div class="p-2 rounded-xl bg-white/5 shrink-0">
                <i data-lucide="${iconName}" class="w-4 h-4"></i>
            </div>
            <div class="flex-1">
                <h5 class="font-bold text-white text-xs">${title}</h5>
                <p class="text-slate-400 text-[11px] mt-0.5">${message}</p>
            </div>
            <button class="toast-close p-1 hover:text-white text-slate-500">
                <i data-lucide="x" class="w-3.5 h-3.5"></i>
            </button>
        `;

        container.appendChild(toast);
        if (window.lucide) lucide.createIcons({ targets: [toast] });

        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => toast.remove());

        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100%)';
                toast.style.transition = 'all 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);
    };

    // 3. Theme Switcher (Dark / Light Mode)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    const savedTheme = localStorage.getItem('aura-theme') || 'dark';
    if (savedTheme === 'light') {
        htmlEl.classList.remove('dark');
    } else {
        htmlEl.classList.add('dark');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            htmlEl.classList.toggle('dark');
            const isDark = htmlEl.classList.contains('dark');
            localStorage.setItem('aura-theme', isDark ? 'dark' : 'light');
            showToast('Theme Updated', `Switched to ${isDark ? 'Dark' : 'Light'} Mode`, 'info');
        });
    }

    // 4. Header Scroll & Mobile Navigation Menu
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const openIcon = document.getElementById('menu-icon-open');
    const closeIcon = document.getElementById('menu-icon-close');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            openIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
        });
    }

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            openIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        });
    });

    // ScrollSpy for Navigation Active Highlights
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // 5. Background Starry Interactive Canvas (bg-canvas)
    const bgCanvas = document.getElementById('bg-canvas');
    if (bgCanvas) {
        const bgCtx = bgCanvas.getContext('2d');
        let bgWidth = (bgCanvas.width = window.innerWidth);
        let bgHeight = (bgCanvas.height = window.innerHeight);

        window.addEventListener('resize', () => {
            bgWidth = bgCanvas.width = window.innerWidth;
            bgHeight = bgCanvas.height = window.innerHeight;
        });

        const bgParticles = [];
        const particleCount = 45;

        for (let i = 0; i < particleCount; i++) {
            bgParticles.push({
                x: Math.random() * bgWidth,
                y: Math.random() * bgHeight,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 2 + 1,
                color: i % 2 === 0 ? '#6366f1' : '#a855f7'
            });
        }

        function animateBgCanvas() {
            bgCtx.clearRect(0, 0, bgWidth, bgHeight);

            bgParticles.forEach((p, idx) => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > bgWidth) p.vx *= -1;
                if (p.y < 0 || p.y > bgHeight) p.vy *= -1;

                bgCtx.beginPath();
                bgCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                bgCtx.fillStyle = p.color;
                bgCtx.shadowBlur = 8;
                bgCtx.shadowColor = p.color;
                bgCtx.fill();

                for (let j = idx + 1; j < bgParticles.length; j++) {
                    const p2 = bgParticles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        bgCtx.beginPath();
                        bgCtx.moveTo(p.x, p.y);
                        bgCtx.lineTo(p2.x, p2.y);
                        bgCtx.strokeStyle = `rgba(99, 102, 241, ${0.15 - dist / 800})`;
                        bgCtx.lineWidth = 0.6;
                        bgCtx.stroke();
                    }
                }
            });

            requestAnimationFrame(animateBgCanvas);
        }
        animateBgCanvas();
    }

    // 6. INTERACTIVE AI SANDBOX CANVAS ENGINE
    const sandboxCanvas = document.getElementById('sandbox-canvas');
    if (sandboxCanvas) {
        const sCtx = sandboxCanvas.getContext('2d');
        let sWidth = (sandboxCanvas.width = sandboxCanvas.parentElement.clientWidth);
        let sHeight = (sandboxCanvas.height = sandboxCanvas.parentElement.clientHeight);

        window.addEventListener('resize', () => {
            if (sandboxCanvas.parentElement) {
                sWidth = sandboxCanvas.width = sandboxCanvas.parentElement.clientWidth;
                sHeight = sandboxCanvas.height = sandboxCanvas.parentElement.clientHeight;
            }
        });

        // Sandbox State Parameters
        let activePreset = 'neon'; // 'neon', 'minimal', 'abstract', 'matrix'
        let density = 120;
        let flowSpeed = 1.5;
        let glowIntensity = 75;
        let promptText = 'Futuristic neon cybernetic glass node in deep space';

        let particles = [];
        let angleStep = 0;
        let frameCount = 0;
        let lastTime = performance.now();
        let fps = 60;

        // Interactive Mouse Position for Canvas
        let mouseX = sWidth / 2;
        let mouseY = sHeight / 2;

        sandboxCanvas.addEventListener('mousemove', (e) => {
            const rect = sandboxCanvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });

        function initSandboxParticles() {
            particles = [];
            for (let i = 0; i < density; i++) {
                particles.push({
                    x: Math.random() * sWidth,
                    y: Math.random() * sHeight,
                    vx: (Math.random() - 0.5) * flowSpeed * 2,
                    vy: (Math.random() - 0.5) * flowSpeed * 2,
                    size: Math.random() * 3 + 1,
                    hue: (Math.random() * 60 + (activePreset === 'neon' ? 240 : activePreset === 'matrix' ? 120 : activePreset === 'abstract' ? 280 : 180)) % 360,
                    alpha: Math.random() * 0.8 + 0.2,
                    char: String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96))
                });
            }
            updateCodeOutput();
        }

        function updateCodeOutput() {
            const codeEl = document.getElementById('code-output');
            if (codeEl) {
                codeEl.textContent = `aura.render({ style: "${activePreset}", density: ${density}, speed: ${flowSpeed}, glow: ${glowIntensity}% });`;
            }
        }

        // Render Loops for Different Presets
        function renderSandbox() {
            frameCount++;
            const now = performance.now();
            if (now - lastTime >= 1000) {
                fps = frameCount;
                frameCount = 0;
                lastTime = now;
                const fpsEl = document.getElementById('fps-counter');
                if (fpsEl) fpsEl.textContent = `${fps} FPS`;
            }

            sCtx.shadowBlur = (glowIntensity / 100) * 15;

            if (activePreset === 'neon') {
                sCtx.fillStyle = 'rgba(2, 6, 23, 0.25)';
                sCtx.fillRect(0, 0, sWidth, sHeight);

                particles.forEach((p) => {
                    p.x += p.vx * (flowSpeed / 1.5);
                    p.y += p.vy * (flowSpeed / 1.5);

                    if (p.x < 0 || p.x > sWidth) p.vx *= -1;
                    if (p.y < 0 || p.y > sHeight) p.vy *= -1;

                    // Pull toward mouse slightly
                    const dx = mouseX - p.x;
                    const dy = mouseY - p.y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 150) {
                        p.x += (dx / d) * 0.8;
                        p.y += (dy / d) * 0.8;
                    }

                    sCtx.beginPath();
                    sCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    sCtx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.alpha})`;
                    sCtx.shadowColor = `hsl(${p.hue}, 90%, 60%)`;
                    sCtx.fill();
                });

            } else if (activePreset === 'minimal') {
                sCtx.fillStyle = 'rgba(2, 6, 23, 0.3)';
                sCtx.fillRect(0, 0, sWidth, sHeight);

                angleStep += 0.01 * flowSpeed;

                const cx = sWidth / 2;
                const cy = sHeight / 2;
                const radius = Math.min(sWidth, sHeight) * 0.25;

                sCtx.strokeStyle = '#06b6d4';
                sCtx.shadowColor = '#06b6d4';
                sCtx.lineWidth = 1.5;

                for (let i = 0; i < 8; i++) {
                    const a = angleStep + (i * Math.PI) / 4;
                    const x1 = cx + Math.cos(a) * radius;
                    const y1 = cy + Math.sin(a) * radius;
                    const x2 = cx + Math.cos(a + Math.PI / 2) * (radius * 0.6);
                    const y2 = cy + Math.sin(a + Math.PI / 2) * (radius * 0.6);

                    sCtx.beginPath();
                    sCtx.moveTo(x1, y1);
                    sCtx.lineTo(x2, y2);
                    sCtx.stroke();
                }

                particles.forEach(p => {
                    sCtx.fillStyle = '#67e8f9';
                    sCtx.fillRect(p.x, p.y, p.size, p.size);
                });

            } else if (activePreset === 'abstract') {
                sCtx.fillStyle = 'rgba(2, 6, 23, 0.15)';
                sCtx.fillRect(0, 0, sWidth, sHeight);

                angleStep += 0.02 * flowSpeed;

                sCtx.lineWidth = 2;
                for (let i = 0; i < 5; i++) {
                    sCtx.beginPath();
                    sCtx.strokeStyle = i % 2 === 0 ? '#a855f7' : '#6366f1';
                    sCtx.shadowColor = '#a855f7';
                    for (let x = 0; x < sWidth; x += 20) {
                        const y = sHeight / 2 + Math.sin((x * 0.01) + angleStep + i) * 60 * Math.cos(angleStep * 0.5);
                        if (x === 0) sCtx.moveTo(x, y);
                        else sCtx.lineTo(x, y);
                    }
                    sCtx.stroke();
                }

            } else if (activePreset === 'matrix') {
                sCtx.fillStyle = 'rgba(2, 6, 23, 0.2)';
                sCtx.fillRect(0, 0, sWidth, sHeight);

                sCtx.font = '12px JetBrains Mono';
                particles.forEach(p => {
                    p.y += (flowSpeed * 2) + p.size;
                    if (p.y > sHeight) {
                        p.y = 0;
                        p.x = Math.random() * sWidth;
                    }

                    sCtx.fillStyle = '#10b981';
                    sCtx.shadowColor = '#10b981';
                    sCtx.fillText(p.char, p.x, p.y);
                });
            }

            requestAnimationFrame(renderSandbox);
        }

        initSandboxParticles();
        renderSandbox();

        // Control Event Listeners
        const presetBtns = document.querySelectorAll('.preset-btn');
        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                presetBtns.forEach(b => {
                    b.classList.remove('active', 'border-brand-500', 'bg-brand-500/20', 'text-white');
                    b.classList.add('border-white/10', 'bg-white/5', 'text-slate-300');
                });
                btn.classList.add('active', 'border-brand-500', 'bg-brand-500/20', 'text-white');
                btn.classList.remove('border-white/10', 'bg-white/5', 'text-slate-300');

                activePreset = btn.getAttribute('data-preset');
                initSandboxParticles();
                showToast('Preset Changed', `Active preset mode set to ${activePreset.toUpperCase()}`, 'info');
            });
        });

        const sliderDensity = document.getElementById('slider-density');
        const densityVal = document.getElementById('density-val');
        if (sliderDensity) {
            sliderDensity.addEventListener('input', (e) => {
                density = parseInt(e.target.value);
                if (densityVal) densityVal.textContent = density;
                initSandboxParticles();
            });
        }

        const sliderSpeed = document.getElementById('slider-speed');
        const speedVal = document.getElementById('speed-val');
        if (sliderSpeed) {
            sliderSpeed.addEventListener('input', (e) => {
                flowSpeed = parseFloat(e.target.value);
                if (speedVal) speedVal.textContent = `${flowSpeed.toFixed(1)}x`;
                updateCodeOutput();
            });
        }

        const sliderGlow = document.getElementById('slider-glow');
        const glowVal = document.getElementById('glow-val');
        if (sliderGlow) {
            sliderGlow.addEventListener('input', (e) => {
                glowIntensity = parseInt(e.target.value);
                if (glowVal) glowVal.textContent = `${glowIntensity}%`;
                updateCodeOutput();
            });
        }

        // Random Prompt Generator
        const samplePrompts = [
            'Hyper-realistic cybernetic neural lattice with bioluminescent energy',
            'Floating isometric WebGL geometric nodes with glass refraction',
            'Quantum fluid wave vector matrix with neon spectrum glow',
            'Minimalist wireframe architectural mesh in zero gravity space',
            'Dynamic audio-reactive visualizer grid with dark luminescence'
        ];

        const btnRandomPrompt = document.getElementById('btn-random-prompt');
        const promptInput = document.getElementById('prompt-input');

        if (btnRandomPrompt && promptInput) {
            btnRandomPrompt.addEventListener('click', () => {
                const randomP = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
                promptInput.value = randomP;
                initSandboxParticles();
                showToast('Prompt Seeded', 'Generated random neural prompt directive', 'success');
            });
        }

        const btnGenerate = document.getElementById('btn-generate');
        const generateIcon = document.getElementById('generate-icon');
        if (btnGenerate) {
            btnGenerate.addEventListener('click', () => {
                if (generateIcon) generateIcon.classList.add('animate-spin');
                initSandboxParticles();
                setTimeout(() => {
                    if (generateIcon) generateIcon.classList.remove('animate-spin');
                    showToast('Re-Synthesized', 'Canvas parameters regenerated successfully!', 'success');
                }, 600);
            });
        }

        // Copy Code Button
        const btnCopyCode = document.getElementById('btn-copy-code');
        if (btnCopyCode) {
            btnCopyCode.addEventListener('click', () => {
                const codeText = document.getElementById('code-output')?.textContent || '';
                navigator.clipboard.writeText(codeText);
                showToast('Code Copied', 'Engine code snippet copied to clipboard!', 'success');
            });
        }

        // Fullscreen Canvas Button
        const btnFullscreen = document.getElementById('btn-fullscreen');
        if (btnFullscreen) {
            btnFullscreen.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    sandboxCanvas.parentElement.requestFullscreen().catch(err => {
                        showToast('Notice', 'Fullscreen API not permitted in iframe', 'warning');
                    });
                } else {
                    document.exitFullscreen();
                }
            });
        }
    }

    // 7. Feature Category Filter & Modal System
    const featureTabs = document.querySelectorAll('.feature-tab');
    const featureCards = document.querySelectorAll('.feature-card');

    featureTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            featureTabs.forEach(t => {
                t.classList.remove('active', 'border-brand-500', 'bg-brand-500/20', 'text-white');
                t.classList.add('border-white/10', 'bg-white/5', 'text-slate-300');
            });
            tab.classList.add('active', 'border-brand-500', 'bg-brand-500/20', 'text-white');
            tab.classList.remove('border-white/10', 'bg-white/5', 'text-slate-300');

            const cat = tab.getAttribute('data-cat');
            featureCards.forEach(card => {
                if (cat === 'all' || card.getAttribute('data-category') === cat) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Feature Modal Details Content Map
    const modalDetails = {
        neural: {
            title: 'Neural Prompt Parser Architecture',
            badge: 'AI Intelligence',
            desc: 'Our fine-tuned Transformer model converts complex design descriptions into semantically structured HTML layout trees, CSS variables, and clean component React code.',
            stats: [{ label: 'Inference Speed', val: '40ms' }, { label: 'Token Accuracy', val: '99.4%' }, { label: 'Supported Frameworks', val: 'React, Vue, HTML' }],
            code: `// Neural Prompt Pipeline\nconst uiNode = await aura.parsePrompt("Dark mode SaaS pricing table with neon accents");\nconsole.log(uiNode.toTailwindJSX());`
        },
        tokens: {
            title: 'Adaptive Design Token Engine',
            badge: 'Generative Design',
            desc: 'Automatically maintain single sources of truth for spacing, dynamic color contrast ratios, font scales, and shadow depths across mobile, tablet, and desktop.',
            stats: [{ label: 'WCAG Compliance', val: 'AAA Tier' }, { label: 'Figma Sync', val: '< 1s' }, { label: 'Palette Range', val: '16M Colors' }],
            code: `:root {\n  --aura-primary: #6366f1;\n  --aura-surface: #020617;\n  --aura-radius: 1.5rem;\n}`
        },
        export: {
            title: 'Zero-Config Code Generator',
            badge: 'Developer Tools',
            desc: 'Export production code without bloated JS runtimes or dependencies. Get clean Semantic HTML5, Tailwind CSS, or Web Components instantly.',
            stats: [{ label: 'Bundle Bloat', val: '0 KB' }, { label: 'Light-house Score', val: '100/100' }, { label: 'Export Time', val: 'Instant' }],
            code: `<div class="bg-slate-900 border border-white/10 rounded-2xl p-6">\n  <h3 class="text-xl font-bold">Clean Tailwind</h3>\n</div>`
        },
        physics: {
            title: 'Live Physics & Shader Visualizer',
            badge: 'Generative Design',
            desc: 'Hardware-accelerated particle systems, vector force fields, and dynamic GLSL canvas shaders rendered directly in your WebGL viewport.',
            stats: [{ label: 'Target FPS', val: '120 FPS' }, { label: 'GPU Utilization', val: '< 4%' }, { label: 'Shader Presets', val: '35+' }],
            code: `precision highp float;\nuniform vec2 u_resolution;\nvoid main() {\n  gl_FragColor = vec4(0.38, 0.40, 0.94, 1.0);\n}`
        },
        agent: {
            title: 'Autonomous Responsive Agent Loop',
            badge: 'AI Intelligence',
            desc: 'Self-monitoring responsive layout agent that continuously stress tests CSS breakpoints, flex container collisions, and typography legibility.',
            stats: [{ label: 'Breakpoint Tests', val: '32 Configs' }, { label: 'Auto-Fix Rate', val: '98.2%' }, { label: 'Overlaps Prevented', val: '100%' }],
            code: `aura.agent.on('collision', (elm) => {\n  elm.applyFlexWrap();\n  elm.adjustFontSize();\n});`
        },
        multiplayer: {
            title: 'Multiplayer Canvas API',
            badge: 'Developer Tools',
            desc: 'Real-time WebSocket multiplayer room sync allows teams to inspect nodes, change color themes, and export components together live.',
            stats: [{ label: 'Latency', val: '< 12ms' }, { label: 'Max Active Users', val: '500 / room' }, { label: 'Conflict Resolution', val: 'CRDT' }],
            code: `const room = aura.connectRoom("team-alpha");\nroom.on('cursorMove', renderTeammateCursor);`
        }
    };

    const modalOverlay = document.getElementById('modal-overlay');
    const modalCard = document.getElementById('modal-card');
    const modalContent = document.getElementById('modal-content');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    function openModal(key) {
        const data = modalDetails[key];
        if (!data) return;

        modalContent.innerHTML = `
            <span class="text-xs font-mono font-bold uppercase tracking-widest text-brand-400 bg-brand-500/10 border border-brand-500/20 px-3 py-1 rounded-full">${data.badge}</span>
            <h3 class="text-2xl font-bold text-white mt-4 mb-3">${data.title}</h3>
            <p class="text-slate-300 text-sm leading-relaxed mb-6">${data.desc}</p>

            <div class="grid grid-cols-3 gap-3 mb-6">
                ${data.stats.map(s => `
                    <div class="bg-slate-950 p-3 rounded-2xl border border-white/10 text-center">
                        <span class="text-xs text-slate-400 block font-mono">${s.label}</span>
                        <span class="text-base font-extrabold text-brand-400 font-mono mt-1 block">${s.val}</span>
                    </div>
                `).join('')}
            </div>

            <div class="bg-slate-950 border border-white/10 rounded-xl p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
                <pre>${data.code}</pre>
            </div>
        `;

        modalOverlay.classList.remove('hidden');
        modalOverlay.classList.add('flex');
        document.body.classList.add('modal-open');

        setTimeout(() => {
            modalCard.classList.remove('scale-95', 'opacity-0');
            modalCard.classList.add('scale-100', 'opacity-100');
        }, 10);
    }

    function closeModal() {
        modalCard.classList.remove('scale-100', 'opacity-100');
        modalCard.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            modalOverlay.classList.add('hidden');
            modalOverlay.classList.remove('flex');
            document.body.classList.remove('modal-open');
        }, 200);
    }

    document.querySelectorAll('.open-modal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalKey = btn.getAttribute('data-modal');
            openModal(modalKey);
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    // 8. Showcase Portfolio Gallery Filter & Lightbox
    const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            galleryFilterBtns.forEach(b => {
                b.classList.remove('active', 'border-white/20', 'bg-white/10', 'text-white');
                b.classList.add('border-white/10', 'bg-white/5', 'text-slate-400');
            });
            btn.classList.add('active', 'border-white/20', 'bg-white/10', 'text-white');
            btn.classList.remove('border-white/10', 'bg-white/5', 'text-slate-400');

            const filter = btn.getAttribute('data-filter');
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const title = item.getAttribute('data-title');
            const desc = item.getAttribute('data-desc');
            const tags = item.getAttribute('data-tags');

            modalContent.innerHTML = `
                <span class="text-xs font-mono font-bold uppercase tracking-widest text-brand-cyan bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">Project Spotlight</span>
                <h3 class="text-2xl font-bold text-white mt-4 mb-2">${title}</h3>
                <p class="text-slate-300 text-sm leading-relaxed mb-4">${desc}</p>
                <div class="flex items-center gap-2 mb-6">
                    <span class="text-xs text-slate-400 font-mono">Stack:</span>
                    <span class="text-xs font-mono bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-brand-400">${tags}</span>
                </div>
                <div class="bg-slate-950 border border-white/10 rounded-2xl p-6 text-center">
                    <i data-lucide="sparkles" class="w-8 h-8 text-brand-500 mx-auto mb-2 animate-bounce"></i>
                    <p class="text-xs text-slate-400">Live interactive preview environment compiled and rendered on Aura Studio node cluster.</p>
                </div>
            `;

            modalOverlay.classList.remove('hidden');
            modalOverlay.classList.add('flex');
            document.body.classList.add('modal-open');
            if (window.lucide) lucide.createIcons({ targets: [modalContent] });

            setTimeout(() => {
                modalCard.classList.remove('scale-95', 'opacity-0');
                modalCard.classList.add('scale-100', 'opacity-100');
            }, 10);
        });
    });

    // 9. Pricing Billing Toggle & Dynamic ROI Calculator
    const billingToggle = document.getElementById('billing-toggle');
    const billingDot = document.getElementById('billing-dot');
    let isYearly = true;

    if (billingToggle) {
        billingToggle.addEventListener('click', () => {
            isYearly = !isYearly;
            if (isYearly) {
                billingDot.classList.add('translate-x-6');
                billingDot.classList.remove('translate-x-0');
            } else {
                billingDot.classList.remove('translate-x-6');
                billingDot.classList.add('translate-x-0');
            }

            document.querySelectorAll('.price-pro').forEach(el => {
                const price = isYearly ? el.getAttribute('data-yearly') : el.getAttribute('data-monthly');
                el.textContent = `$${price}`;
            });

            document.querySelectorAll('.price-enterprise').forEach(el => {
                const price = isYearly ? el.getAttribute('data-yearly') : el.getAttribute('data-monthly');
                el.textContent = `$${price}`;
            });

            showToast('Billing Cycle Updated', `Switched to ${isYearly ? 'Yearly (20% Discount)' : 'Monthly'} pricing`, 'info');
        });
    }

    // ROI Calculator Slider
    const teamSlider = document.getElementById('team-slider');
    const teamSizeVal = document.getElementById('team-size-val');
    const savedHoursText = document.getElementById('saved-hours-text');
    const savedMoneyText = document.getElementById('saved-money-text');

    if (teamSlider) {
        teamSlider.addEventListener('input', (e) => {
            const seats = parseInt(e.target.value);
            if (teamSizeVal) teamSizeVal.textContent = `${seats} ${seats === 1 ? 'Engineer/Designer' : 'Engineers/Designers'}`;

            const hoursSaved = seats * 12;
            const moneySaved = hoursSaved * 75;

            if (savedHoursText) savedHoursText.textContent = `${hoursSaved.toLocaleString()} Hours Saved`;
            if (savedMoneyText) savedMoneyText.textContent = `≈ $${moneySaved.toLocaleString()} Saved per month in workflow overhead`;
        });
    }

    // 10. FAQ Search Filter & Accordion
    const faqSearch = document.getElementById('faq-search');
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqSearch) {
        faqSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            faqItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(query)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    document.querySelectorAll('.faq-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const faqItem = btn.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            const icon = btn.querySelector('i');

            const isOpen = !answer.classList.contains('hidden');

            // Close other FAQs
            document.querySelectorAll('.faq-answer').forEach(a => a.classList.add('hidden'));
            document.querySelectorAll('.faq-toggle i').forEach(i => i.style.transform = 'rotate(0deg)');

            if (!isOpen) {
                answer.classList.remove('hidden');
                if (icon) icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // 11. Contact Form Validation & Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('contact-name');
            const emailInput = document.getElementById('contact-email');
            const messageInput = document.getElementById('contact-message');
            const submitBtn = document.getElementById('contact-submit-btn');

            let isValid = true;

            // Simple validation
            if (!nameInput.value.trim()) {
                nameInput.nextElementSibling.classList.remove('hidden');
                isValid = false;
            } else {
                nameInput.nextElementSibling.classList.add('hidden');
            }

            if (!emailInput.value.includes('@') || !emailInput.value.includes('.')) {
                emailInput.nextElementSibling.classList.remove('hidden');
                isValid = false;
            } else {
                emailInput.nextElementSibling.classList.add('hidden');
            }

            if (!messageInput.value.trim()) {
                messageInput.nextElementSibling.classList.remove('hidden');
                isValid = false;
            } else {
                messageInput.nextElementSibling.classList.add('hidden');
            }

            if (isValid) {
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>Sending Direct Message...</span>`;
                if (window.lucide) lucide.createIcons({ targets: [submitBtn] });

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                    if (window.lucide) lucide.createIcons({ targets: [submitBtn] });

                    contactForm.reset();
                    showToast('Message Received!', 'Thank you! Our AI architecture team will reach out within 2 hours.', 'success');
                }, 1200);
            }
        });
    }

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletter-email');
            if (emailInput && emailInput.value) {
                showToast('Subscribed!', `Added ${emailInput.value} to Aura Studio release notes`, 'success');
                newsletterForm.reset();
            }
        });
    }

    // 12. Live AI Assistant Chat Floating Widget
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatBox = document.getElementById('chat-box');
    const chatCloseBtn = document.getElementById('chat-close-btn');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    if (chatToggleBtn && chatBox) {
        chatToggleBtn.addEventListener('click', () => {
            chatBox.classList.toggle('hidden');
        });
    }

    if (chatCloseBtn && chatBox) {
        chatCloseBtn.addEventListener('click', () => {
            chatBox.classList.add('hidden');
        });
    }

    if (chatForm && chatInput && chatMessages) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;

            // User Message
            const userMsg = document.createElement('div');
            userMsg.className = 'bg-brand-600 text-white rounded-2xl p-3 max-w-[85%] ml-auto text-xs';
            userMsg.textContent = text;
            chatMessages.appendChild(userMsg);
            chatInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Bot Response Simulation
            setTimeout(() => {
                const botMsg = document.createElement('div');
                botMsg.className = 'bg-white/5 border border-white/10 rounded-2xl p-3 text-slate-200 max-w-[85%] text-xs';

                const lower = text.toLowerCase();
                if (lower.includes('price') || lower.includes('cost') || lower.includes('pricing')) {
                    botMsg.textContent = 'Our Pro Studio plan starts at $23/month. We also have a Free Developer tier and custom Enterprise solutions!';
                } else if (lower.includes('demo') || lower.includes('canvas') || lower.includes('sandbox')) {
                    botMsg.textContent = 'You can test the real-time canvas sandbox right on this page in the "Interactive Demo" section!';
                } else if (lower.includes('export') || lower.includes('code') || lower.includes('figma')) {
                    botMsg.textContent = 'Aura exports clean HTML, Tailwind CSS, React JSX, and Vue components with bi-directional Figma sync!';
                } else {
                    botMsg.textContent = 'Thanks for reaching out! You can test our interactive engine above or submit a message via the Contact section for dedicated support.';
                }

                chatMessages.appendChild(botMsg);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 600);
        });
    }

    // Additional Quick Links
    ['btn-api-docs', 'btn-figma-plugin', 'btn-changelog'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                showToast('Coming Soon', 'Documentation & Plugin portal is being updated for Aura v3.4!', 'info');
            });
        }
    });

    // Initial Welcome Toast
    setTimeout(() => {
        showToast('Welcome to AURA Studio', 'Try out the interactive live engine in the sandbox section below!', 'info');
    }, 1000);
});

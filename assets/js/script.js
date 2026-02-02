// Project Data with Tech Stacks
const projects = [
    {
        name: "Eco-Track Web",
        folder: "eco-track",
        description: "Zero-emission tracking system built with lightning efficiency and native code optimization.",
        tech: ["html5", "tailwindcss", "javascript"],
        status: "STABLE",
        icon: "🌱"
    },
    {
        name: "HIMA TI Pro",
        folder: "hima-dashboard",
        description: "Next-gen dashboard for organization management and member lifecycle automation.",
        tech: ["react", "tailwindcss", "javascript"],
        status: "BETA",
        icon: "⚡"
    },
    {
        name: "Spinotek Hack",
        folder: "example-project",
        description: "The official high-performance boilerplate for the Spinotek x HIMA TI challenge.",
        tech: ["html5", "css3", "javascript"],
        status: "LIVE",
        icon: "🚀"
    }
];

// Typing Animation Phrases
const typingPhrases = [
    "Spinotek x HIMA TI Politeknik Hasnur.",
    "Bridging Academia to Industry.",
    "Upgrading Skills for the Future.",
    "Collaborating for Digital Excellence.",
    "Empowering the Next Gen Developers."
];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Typing Animation
    initTypingAnimation();

    // 2. Render Projects
    renderProjects(projects);

    // 3. Interactions
    setupParallax();
});

function initTypingAnimation() {
    const target = document.getElementById('typing-text');
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function type() {
        const currentPhrase = typingPhrases[phraseIndex];
        
        if (isDeleting) {
            charIndex--;
            typeSpeed = 40;
        } else {
            charIndex++;
            typeSpeed = 80;
        }

        target.textContent = currentPhrase.substring(0, charIndex);

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2500; // Stay at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % typingPhrases.length;
            typeSpeed = 400;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

function renderProjects(data) {
    const grid = document.getElementById('project-grid');
    if (!grid) return;
    
    grid.innerHTML = '';

    data.forEach(project => {
        const card = document.createElement('div');
        card.className = 'group relative bg-white border border-slate-200 p-8 rounded-[32px] transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 cursor-pointer flex flex-col justify-between';
        card.onclick = () => window.location.href = `./${project.folder}/index.html`;

        card.innerHTML = `
            <div>
                <div class="flex justify-between items-start mb-8">
                    <div class="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-primary/5 transition-colors duration-500">
                        ${project.icon}
                    </div>
                    <span class="px-4 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-[10px] font-black text-slate-500 tracking-[0.1em] font-mono group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all">
                        ${project.status}
                    </span>
                </div>

                <h3 class="text-2xl font-black text-slate-900 mb-4 group-hover:text-primary transition-colors">${project.name}</h3>
                <p class="text-slate-500 text-[15px] leading-relaxed mb-8 font-medium">${project.description}</p>
            </div>

            <div class="flex items-center justify-between pt-6 border-t border-slate-50">
                <div class="flex -space-x-2">
                    ${project.tech.map(t => `<i class="devicon-${t}-plain text-xl p-2 bg-slate-50 rounded-full border border-slate-100 text-slate-400 group-hover:text-slate-900 group-hover:border-slate-200 transition-all"></i>`).join('')}
                </div>
                <div class="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

function setupParallax() {
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 15;
        const y = (e.clientY / window.innerHeight - 0.5) * 15;
        
        const blobs = document.querySelectorAll('.animate-pulse-slow');
        blobs.forEach((blob, index) => {
            const factor = (index + 1) * 3;
            blob.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
        });
    });
}

// Data Dummy
const allData = [
    {
        id: 1,
        type: 'lomba',
        title: 'Lomba Web Design Nasional 2026',
        category: 'Teknologi',
        deadline: '20 Feb 2026',
        level: 'Mahasiswa',
        image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        badgeColor: 'bg-blue-100 text-blue-700',
        description: 'Tunjukkan kreativitasmu dalam merancang antarmuka web yang modern, responsif, dan user-friendly. Kompetisi ini terbuka untuk seluruh mahasiswa aktif di Indonesia dengan total hadiah puluhan juta rupiah.'
    },
    {
        id: 2,
        type: 'lomba',
        title: 'Business Plan Competition Vol. 5',
        category: 'Bisnis',
        deadline: '15 Mar 2026',
        level: 'Umum',
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        badgeColor: 'bg-green-100 text-green-700',
        description: 'Tantang dirimu untuk menciptakan ide bisnis inovatif yang solutif. Buat proposal bisnis yang komprehensif mulai dari analisis pasar, strategi pemasaran, hingga proyeksi keuangan.'
    },
    {
        id: 3,
        type: 'beasiswa',
        title: 'Beasiswa Prestasi Akademik 2026',
        category: 'Internal',
        deadline: '30 Apr 2026',
        level: 'Min. IPK 3.50',
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        badgeColor: 'bg-yellow-100 text-yellow-700',
        description: 'Program beasiswa penuh untuk mahasiswa Politeknik Hasnur yang memiliki prestasi akademik gemilang. Pertahankan IPK tinggimu dan dapatkan dukungan biaya pendidikan.'
    },
    {
        id: 4,
        type: 'lomba',
        title: 'UI/UX Design Challenge',
        category: 'Desain',
        deadline: '10 Mar 2026',
        level: 'Mahasiswa',
        image: 'https://images.unsplash.com/photo-1586717791821-3f44a5638d48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        badgeColor: 'bg-purple-100 text-purple-700',
        description: 'Redesign aplikasi populer atau ciptakan solusi digital baru. Fokus pada pengalaman pengguna (UX) yang intuitif dan antarmuka (UI) yang memukau.'
    },
    {
        id: 5,
        type: 'beasiswa',
        title: 'Beasiswa KIP Kuliah 2026',
        category: 'Pemerintah',
        deadline: '01 Jun 2026',
        level: 'Mahasiswa Baru',
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        badgeColor: 'bg-red-100 text-red-700',
        description: 'Bantuan biaya pendidikan dari pemerintah bagi lulusan SMA/SMK yang memiliki potensi akademik baik tetapi memiliki keterbatasan ekonomi.'
    },
    {
        id: 6,
        type: 'lomba',
        title: 'Hackathon Cyber Security',
        category: 'IT Security',
        deadline: '25 Feb 2026',
        level: 'Umum',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        badgeColor: 'bg-gray-100 text-gray-700',
        description: 'Uji kemampuanmu dalam menemukan celah keamanan dan mempertahankan sistem. Kompetisi Capture The Flag (CTF) dengan berbagai tantangan menantang.'
    },
    {
        id: 7,
        type: 'beasiswa',
        title: 'Beasiswa Mitra Industri Hasnur',
        category: 'Eksternal',
        deadline: '15 Mei 2026',
        level: 'Semester 4+',
        image: 'https://images.unsplash.com/photo-1621640786029-22ad83d73b5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        badgeColor: 'bg-indigo-100 text-indigo-700',
        description: 'Kesempatan magang bersertifikat dan beasiswa dari mitra industri Hasnur Group. Siapkan dirimu untuk terjun langsung ke dunia kerja profesional.'
    },
    {
        id: 8,
        type: 'lomba',
        title: 'Lomba Fotografi Human Interest',
        category: 'Seni',
        deadline: '05 Mar 2026',
        level: 'Umum',
        image: 'https://images.unsplash.com/photo-1552168324-d612d77725e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        badgeColor: 'bg-pink-100 text-pink-700',
        description: 'Abadikan momen-momen kemanusiaan yang menyentuh hati. Kompetisi fotografi dengan tema "Kehidupan Pasca Pandemi" untuk fotografer amatir dan profesional.'
    },
    {
        id: 9,
        type: 'lomba',
        title: 'Esai Nasional Mahasiswa',
        category: 'Sastra',
        deadline: '28 Feb 2026',
        level: 'Mahasiswa',
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        badgeColor: 'bg-orange-100 text-orange-700',
        description: 'Tuangkan gagasan kritismu dalam bentuk tulisan. Lomba esai tingkat nasional dengan tema "Peran Generasi Z dalam Pembangunan Berkelanjutan".'
    }
];

// Content Variables
const grid = document.getElementById('content-grid');
const searchInput = document.getElementById('main-search');
const paginationContainer = document.getElementById('pagination-container');

// Pagination State
let currentPage = 1;
const itemsPerPage = 6;
let currentFilteredData = [];

// Bookmark State
let bookmarks = JSON.parse(localStorage.getItem('hasnurPrestasiBookmarks')) || [];

// Modal Variables
const authModal = document.getElementById('auth-modal');
const authModalContent = document.getElementById('auth-modal-content');
const detailModal = document.getElementById('detail-modal');
const detailModalContent = document.getElementById('detail-modal-content');

// Render Functions
function renderCards(filterType = 'all', searchQuery = '') {
    if (!grid) return;
    grid.innerHTML = '';

    let data = allData;

    // Filter by Type
    if (filterType === 'bookmarked') {
        data = data.filter(item => bookmarks.includes(item.id));
    } else if (filterType !== 'all') {
        data = data.filter(item => item.type === filterType);
    }

    // Filter by Search
    if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        data = data.filter(item =>
            item.title.toLowerCase().includes(lowerQuery) ||
            item.category.toLowerCase().includes(lowerQuery)
        );
    }

    currentFilteredData = data;
    const totalPages = Math.ceil(data.length / itemsPerPage);

    // Ensure currentPage is valid
    if (currentPage > totalPages) currentPage = 1;
    if (currentPage < 1) currentPage = 1;

    // Slice Data for Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);

    if (data.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-20 fade-in-section">
                <div class="inline-block p-6 rounded-full bg-gray-50 mb-4">
                    <i class="fa-solid ${filterType === 'bookmarked' ? 'fa-heart-crack' : 'fa-search'} text-4xl text-gray-300"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-700 mb-2">${filterType === 'bookmarked' ? 'Belum ada yang disimpan' : 'Tidak ditemukan'}</h3>
                <p class="text-gray-500">${filterType === 'bookmarked' ? 'Yuk cari lomba menarik dan simpan disini!' : 'Coba kata kunci lain atau ubah filter kategori.'}</p>
            </div>
        `;
        if (paginationContainer) paginationContainer.innerHTML = ''; // Clear pagination if no data
        observeElements();
        return;
    }

    paginatedData.forEach((item, index) => {
        const isBookmarked = bookmarks.includes(item.id);
        const card = document.createElement('div');
        // New Premium Card Design
        card.className = 'group bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full fade-in-section relative transition-all duration-500 hover:-translate-y-2';
        card.style.animationDelay = `${index * 100}ms`;

        // Content HTML
        card.innerHTML = `
            <div class="relative h-64 overflow-hidden cursor-pointer" onclick="openDetailModal(${item.id})">
                <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
                
                <div class="absolute top-4 left-4 flex gap-2 z-10">
                    <span class="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-lg border border-white/20 ${item.type === 'beasiswa' ? 'bg-polihasnur-yellow text-polihasnur-navy' : 'bg-white text-polihasnur-navy'}">
                        ${item.type === 'beasiswa' ? 'Beasiswa' : 'Lomba'}
                    </span>
                 </div>

                 <!-- Floating Category Badge -->
                 <div class="absolute bottom-4 left-4 z-10">
                    <span class="px-3 py-1 rounded-lg text-xs font-bold text-white bg-white/20 backdrop-blur-md border border-white/20 shadow-sm">
                        ${item.category}
                    </span>
                 </div>

                <!-- Hover Button -->
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 bg-black/20 backdrop-blur-[2px]">
                     <button class="px-6 py-2 bg-white text-polihasnur-navy rounded-full text-sm font-bold shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        View Details
                    </button>
                </div>
            </div>
            
            <!-- Bookmark Button -->
            <button onclick="toggleBookmark(event, ${item.id})" 
                class="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/30 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition-all hover:bg-white hover:text-red-500 hover:scale-110 active:scale-95 shadow-lg group-btn">
                <i class="${isBookmarked ? 'fa-solid text-red-500' : 'fa-regular'} fa-heart text-lg transition-colors"></i>
            </button>

            <div class="p-6 flex-1 flex flex-col relative">
                <div class="flex items-center gap-3 text-xs text-gray-400 mb-3 font-medium">
                     <span class="flex items-center gap-1.5">
                        <i class="fa-regular fa-calendar-check text-polihasnur-blue"></i> ${item.deadline}
                     </span>
                </div>

                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-polihasnur-navy dark:group-hover:text-blue-400 transition-colors cursor-pointer" onclick="openDetailModal(${item.id})">
                    ${item.title}
                </h3>
                
                <p class="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-6 leading-relaxed">
                    ${item.description}
                </p>
                
                <div class="mt-auto pt-5 border-t border-gray-50 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                         <div class="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                             <i class="fa-solid fa-user-graduate text-xs"></i>
                        </div>
                        <span class="text-xs font-bold text-gray-600 uppercase tracking-wide">${item.level}</span>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    renderPagination(totalPages);
    observeElements();
}

function toggleBookmark(event, id) {
    if (event) event.stopPropagation();

    const index = bookmarks.indexOf(id);
    if (index === -1) {
        bookmarks.push(id);
    } else {
        bookmarks.splice(index, 1);
    }

    // Save to Local Storage
    localStorage.setItem('hasnurPrestasiBookmarks', JSON.stringify(bookmarks));

    // Refresh Grid to update icons
    const activeBtn = document.querySelector('.filter-btn.bg-polihasnur-navy');
    let type = 'all';
    if (activeBtn) {
        const onClick = activeBtn.getAttribute('onclick');
        if (onClick) {
            if (onClick.includes('lomba')) type = 'lomba';
            else if (onClick.includes('beasiswa')) type = 'beasiswa';
            else if (onClick.includes('bookmarked')) type = 'bookmarked';
        }
    }
    const query = searchInput ? searchInput.value : '';
    renderCards(type, query);
}

function renderPagination(totalPages) {
    if (!paginationContainer) return;
    paginationContainer.innerHTML = '';

    if (totalPages <= 1) return; // Don't show if only 1 page

    // Prev Button
    const prevBtn = document.createElement('button');
    prevBtn.className = `w-10 h-10 flex items-center justify-center rounded-full transition ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-polihasnur-navy hover:bg-blue-50'}`;
    prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    prevBtn.onclick = () => changePage(currentPage - 1);
    prevBtn.disabled = currentPage === 1;
    paginationContainer.appendChild(prevBtn);

    // Page Numbers
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        if (i === currentPage) {
            btn.className = 'w-10 h-10 flex items-center justify-center rounded-full bg-polihasnur-navy text-white font-bold shadow-md transform scale-110';
        } else {
            btn.className = 'w-10 h-10 flex items-center justify-center rounded-full text-gray-600 hover:text-polihasnur-navy hover:bg-blue-50 transition font-medium';
            btn.onclick = () => changePage(i);
        }
        btn.textContent = i;
        paginationContainer.appendChild(btn);
    }

    // Next Button
    const nextBtn = document.createElement('button');
    nextBtn.className = `w-10 h-10 flex items-center justify-center rounded-full transition ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-polihasnur-navy hover:bg-blue-50'}`;
    nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    nextBtn.onclick = () => changePage(currentPage + 1);
    nextBtn.disabled = currentPage === totalPages;
    paginationContainer.appendChild(nextBtn);
}

function changePage(newPage) {
    currentPage = newPage;

    // Get current filter and search state to maintain context
    const activeBtn = document.querySelector('.filter-btn.bg-polihasnur-navy');
    let type = 'all';
    if (activeBtn) {
        const onClick = activeBtn.getAttribute('onclick');
        if (onClick) {
            if (onClick.includes('lomba')) type = 'lomba';
            else if (onClick.includes('beasiswa')) type = 'beasiswa';
            else if (onClick.includes('bookmarked')) type = 'bookmarked';
        }
    }
    const query = searchInput ? searchInput.value : '';

    renderCards(type, query);

    // Scroll to top of grid
    const gridTop = document.getElementById('content-grid').offsetTop - 120;
    window.scrollTo({ top: gridTop, behavior: 'smooth' });
}

// --- Detail Modal Functions ---
function openDetailModal(id) {
    const item = allData.find(d => d.id === id);
    if (!item || !detailModal) return;

    // Populate Data
    document.getElementById('modal-image').src = item.image;

    const badge = document.getElementById('modal-badge');
    badge.textContent = item.category;
    // Reset classes
    badge.className = `px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-white mb-3 inline-block ${item.type === 'beasiswa' ? 'bg-orange-500' : 'bg-blue-600'}`;

    document.getElementById('modal-title').textContent = item.title;
    document.getElementById('modal-deadline').textContent = item.deadline;
    document.getElementById('modal-level').textContent = item.level;
    document.getElementById('modal-category').textContent = item.category;
    document.getElementById('modal-description').textContent = item.description || "Deskripsi lengkap belum tersedia untuk item ini.";

    // Show Modal
    detailModal.classList.remove('hidden');
    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        detailModal.classList.remove('opacity-0');
        if (detailModalContent) detailModalContent.classList.remove('scale-95', 'opacity-0');
    }, 10);
}

function closeDetailModal() {
    if (!detailModal) return;

    if (detailModalContent) detailModalContent.classList.add('scale-95', 'opacity-0');
    detailModal.classList.add('opacity-0');

    setTimeout(() => {
        detailModal.classList.add('hidden');
        // Restore body scroll
        document.body.style.overflow = '';
    }, 300);
}

// --- Auth Modal Functions ---
function openAuthModal() {
    if (authModal && authModalContent) {
        authModal.classList.remove('hidden');
        setTimeout(() => {
            authModal.classList.remove('opacity-0');
            authModalContent.classList.remove('scale-95', 'opacity-0');
        }, 10);
    }
}

function closeAuthModal() {
    if (authModal && authModalContent) {
        authModalContent.classList.add('scale-95', 'opacity-0');
        authModal.classList.add('opacity-0');
        setTimeout(() => {
            authModal.classList.add('hidden');
        }, 300);
    }
}

// Filter Button Logic
function filterContent(type) {
    currentPage = 1; // Reset to page 1 on filter
    document.querySelectorAll('.filter-btn').forEach(btn => {
        const onClickAttr = btn.getAttribute('onclick');
        if (onClickAttr && onClickAttr.includes(`'${type}'`)) {
            btn.classList.add('bg-polihasnur-navy', 'text-white', 'shadow-md');
            btn.classList.remove('text-gray-500', 'hover:bg-gray-50');
        } else {
            btn.classList.remove('bg-polihasnur-navy', 'text-white', 'shadow-md');
            btn.classList.add('text-gray-500');
        }
    });

    const query = searchInput ? searchInput.value : '';
    renderCards(type, query);
}

// Intersection Observer for Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, observerOptions);

function observeElements() {
    document.querySelectorAll('.fade-in-section').forEach((section) => {
        observer.observe(section);
    });
}

// Initialize Stats Observer
const statsSection = document.querySelector('.counter')?.closest('section');
if (statsSection) {
    // statsObserver logic removed
}

// Initialize & Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initial Render
    renderCards();
    observeElements();

    // Navbar Scroll Effect & Scrollspy
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section, div[id], footer'); // include div[id] for content sections
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    window.addEventListener('scroll', () => {
        let current = '';

        // Navbar Shadow
        if (window.scrollY > 20) {
            navbar.classList.add('shadow-md');
        } else {
            navbar.classList.remove('shadow-md');
        }

        // Scrollspy Logic
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-polihasnur-blue', 'font-bold'); // Active state style removal
            link.classList.add('text-gray-600');

            // Default check or strict check
            if (current && link.getAttribute('href').includes(current)) {
                link.classList.add('text-polihasnur-blue', 'font-bold');
                link.classList.remove('text-gray-600');
            }
        });
    });

    // Smooth Scrolling for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }

                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for sticky header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Search Listener
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const activeBtn = document.querySelector('.filter-btn.bg-polihasnur-navy');
            let type = 'all';
            if (activeBtn) {
                const onClick = activeBtn.getAttribute('onclick');
                if (onClick) {
                    if (onClick.includes('lomba')) type = 'lomba';
                    else if (onClick.includes('beasiswa')) type = 'beasiswa';
                    else if (onClick.includes('bookmarked')) type = 'bookmarked';
                }
            }
            renderCards(type, e.target.value);
        });
    }

    // Close Modals on Click Outside
    [authModal, detailModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    if (modal === authModal) closeAuthModal();
                    if (modal === detailModal) closeDetailModal();
                }
            });
        }
    });

    // Escape Key to Close Modals
    // Initialize Stats Observer if not already active
    // Removed per user request
    // Hero Slider Logic
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('#hero-dots button');
    let currentSlide = 0;
    const totalSlides = slides.length;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Update Dots
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.remove('bg-white/50');
                dot.classList.add('bg-white', 'scale-125');
            } else {
                dot.classList.add('bg-white/50');
                dot.classList.remove('bg-white', 'scale-125');
            }
        });
        currentSlide = index;
    }

    function nextSlide() {
        let next = (currentSlide + 1) % totalSlides;
        showSlide(next);
    }

    function prevSlide() {
        let prev = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(prev);
    }

    // Auto Play
    let slideInterval = setInterval(nextSlide, 5000);

    // Controls
    const heroNext = document.getElementById('hero-next');
    const heroPrev = document.getElementById('hero-prev');

    if (heroNext && heroPrev) {
        heroNext.addEventListener('click', () => {
            clearInterval(slideInterval);
            nextSlide();
            slideInterval = setInterval(nextSlide, 5000);
        });

        heroPrev.addEventListener('click', () => {
            clearInterval(slideInterval);
            prevSlide();
            slideInterval = setInterval(nextSlide, 5000);
        });
    }

    // Global Dots Function (Attached to window for inline onclick)
    window.goToSlide = function (index) {
        clearInterval(slideInterval);
        showSlide(index);
        slideInterval = setInterval(nextSlide, 5000);
    }

    // Stats Counter Logic (Re-added for overlap section)
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000;
                    const step = Math.ceil(target / (duration / 16));
                    let current = 0;

                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            counter.textContent = target + (counter.textContent.includes('%') ? '%' : (counter.textContent.includes('h') ? 'h' : '+'));
                            clearInterval(timer);
                        } else {
                            counter.textContent = current;
                        }
                    }, 16);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.counter')?.closest('.container');
    if (statsSection) statsObserver.observe(statsSection);

    // Scroll Progress Bar & Parallax
    const progressBar = document.getElementById('scroll-progress');

    window.addEventListener('scroll', () => {
        // Progress Bar
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        if (progressBar) progressBar.style.width = scrollPercentage + '%';

        // Parallax Effect
        const activeSlideImg = document.querySelector('.slide.active img');
        if (activeSlideImg && window.scrollY < window.innerHeight) {
            const speed = 0.5;
            activeSlideImg.style.transform = `translateY(${window.scrollY * speed}px)`;
        }
    });

    // Dark Mode Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');
    const html = document.documentElement;

    // Check Local Storage or System Preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
        updateIcons(true);
    } else {
        html.classList.remove('dark');
        updateIcons(false);
    }

    function toggleTheme() {
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            localStorage.theme = 'light';
            updateIcons(false);
        } else {
            html.classList.add('dark');
            localStorage.theme = 'dark';
            updateIcons(true);
        }
    }

    function updateIcons(isDark) {
        const iconClass = isDark ? 'fa-sun' : 'fa-moon';
        const btns = [themeToggleBtn, themeToggleMobileBtn];

        btns.forEach(btn => {
            if (btn) {
                const icon = btn.querySelector('i');
                icon.className = `fa-solid ${iconClass}`;
                if (isDark) {
                    btn.classList.add('text-yellow-400');
                    btn.classList.remove('text-gray-400');
                } else {
                    btn.classList.remove('text-yellow-400');
                    btn.classList.add('text-gray-400');
                }
            }
        });
    }

    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (themeToggleMobileBtn) themeToggleMobileBtn.addEventListener('click', toggleTheme);

});

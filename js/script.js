// Global variables
let personalData = {};
let publicationsData = [];
let coursesData = [];
let projectsData = [];

// Initialize the website
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadAllData();
        populateContent();
        initializeNavigation();
        initializeAnimations();
        hideLoadingScreen();
    } catch (error) {
        console.error('Error loading website data:', error);
        showErrorMessage('Failed to load website content. Please try again later.');
    }
});

// Load all JSON data files
async function loadAllData() {
    try {
        const [personal, publications, courses, projects] = await Promise.all([
            fetch('data/personal.json?v=' + new Date().getTime()).then(response => {
                if (!response.ok) throw new Error(`Failed to load personal data: ${response.status}`);
                return response.json();
            }),
            fetch('data/publications.json?v=' + new Date().getTime()).then(response => {
                if (!response.ok) throw new Error(`Failed to load publications data: ${response.status}`);
                return response.json();
            }),
            fetch('data/courses.json?v=' + new Date().getTime()).then(response => {
                if (!response.ok) throw new Error(`Failed to load courses data: ${response.status}`);
                return response.json();
            }),
            fetch('data/projects.json?v=' + new Date().getTime()).then(response => {
                if (!response.ok) throw new Error(`Failed to load projects data: ${response.status}`);
                return response.json();
            })
        ]);

        personalData = personal;
        publicationsData = publications;
        coursesData = courses;
        projectsData = projects;
    } catch (error) {
        throw new Error(`Data loading failed: ${error.message}`);
    }
}

// Populate all content on the page
function populateContent() {
    populatePersonalInfo();
    populateAboutSection();
    populateResearchSection();
    populateTeachingSection();
    populateProjectsSection();
    populateContactSection();
    populateFooter();
}

// Populate personal information in header and hero
function populatePersonalInfo() {
    // Page title and meta
    document.title = `${personalData.name} - ${personalData.title}`;
    const pageDesc = document.getElementById('page-description');
    if (pageDesc) pageDesc.content = `${personalData.name} - ${personalData.title}. ${personalData.heroSubtitle}`;

    // Navigation
    const navName = document.getElementById('nav-name');
    if (navName) navName.textContent = personalData.name;
    const navTitle = document.getElementById('nav-title');
    if (navTitle) navTitle.textContent = personalData.title;

    // Hero section
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) heroTitle.textContent = personalData.heroTitle;
    const heroSubtitle = document.getElementById('hero-subtitle');
    if (heroSubtitle) heroSubtitle.textContent = personalData.heroSubtitle;
}

// Populate about section
function populateAboutSection() {
    // Profile image
    const profileImg = document.getElementById('profile-image');
    if (profileImg) profileImg.alt = personalData.name;

    // Bio paragraphs
    const bioContainer = document.getElementById('bio-paragraphs');
    if (bioContainer) {
        personalData.bio.forEach(paragraph => {
            const p = document.createElement('p');
            p.textContent = paragraph;
            bioContainer.appendChild(p);
        });
    }

    // Education
    const educationList = document.getElementById('education-list');
    if (educationList) {
        personalData.education.forEach(edu => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${edu.degree}</strong>, ${edu.institution} (${edu.year})`;
            educationList.appendChild(li);
        });
    }

    // Quick facts
    const quickFacts = document.getElementById('quick-facts');
    if (quickFacts) {
        personalData.quickFacts.forEach(fact => {
            const factElement = document.createElement('div');
            factElement.className = 'quick-fact';
            factElement.innerHTML = `
                <span class="quick-fact-label">${fact.label}:</span>
                <span class="quick-fact-value">${fact.value}</span>
            `;
            quickFacts.appendChild(factElement);
        });
    }
}

// Populate research section
function populateResearchSection() {
    // Research interests
    const interestsGrid = document.getElementById('research-interests-grid');
    if (interestsGrid) {
        personalData.researchInterests.forEach(interest => {
            const card = document.createElement('div');
            card.className = 'interest-card';
            card.innerHTML = `
                <i class="${interest.icon}"></i>
                <h4>${interest.title}</h4>
                <p>${interest.description}</p>
            `;
            interestsGrid.appendChild(card);
        });
    }

    // Publications
    const publicationsList = document.getElementById('publications-list');
    if (publicationsList) {
        // Sort publications by year (newest first)
        const sortedPublications = [...publicationsData].sort((a, b) => b.year - a.year);

        sortedPublications.forEach(publication => {
            const pubElement = document.createElement('div');
            pubElement.className = `publication-item ${publication.featured ? 'featured' : ''}`;

            // Format authors (highlight current author)
            const formattedAuthors = publication.authors.map(author => {
                if (author.includes('Smith')) { // Replace with logic to detect your name
                    return `<strong>${author}</strong>`;
                }
                return author;
            }).join(', ');

            // Create links
            const linksHTML = publication.links.map(link =>
                `<a href="${link.url}" class="pub-link" target="_blank">${link.type}</a>`
            ).join('');

            pubElement.innerHTML = `
                <div class="publication-content">
                    <span class="pub-title"><strong>${publication.title}</strong></span>.
                    <span class="authors">${formattedAuthors}</span>.
                    <span class="venue"><em>${publication.venue}</em>, ${publication.year}</span>.
                    <span class="publication-links-inline">${linksHTML}</span>
                </div>
            `;
            publicationsList.appendChild(pubElement);
        });
    }
}

// Populate teaching section
function populateTeachingSection() {
    const coursesGrid = document.getElementById('courses-grid');
    const supervisionStats = document.getElementById('supervision-stats');

    // Current courses
    if (coursesGrid) {
        const currentCourses = coursesData.filter(course => course.status === 'current');
        currentCourses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = `course-card ${course.status}`;

            courseCard.innerHTML = `
                <div class="course-header">
                    <div>
                        <h4>${course.courseCode}: ${course.title}</h4>
                        <div class="course-level">${course.level}</div>
                    </div>
                </div>
                <p class="semester">${course.semester}</p>
                <p>${course.description}</p>
                <div class="course-info">
                    <span><i class="fas fa-users"></i> ${course.students} students</span>
                    <span><i class="fas fa-clock"></i> ${course.schedule}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${course.room}</span>
                </div>
            `;
            coursesGrid.appendChild(courseCard);
        });
    }

    // Supervision statistics
    if (supervisionStats) {
        personalData.supervision.forEach(stat => {
            const statCard = document.createElement('div');
            statCard.className = 'stat-card';
            statCard.innerHTML = `
                <div class="stat-number">${stat.count}</div>
                <div class="stat-label">${stat.type}</div>
            `;
            supervisionStats.appendChild(statCard);
        });
    }
}

// Populate projects section
function populateProjectsSection() {
    const projectsGrid = document.getElementById('projects-grid');

    if (projectsGrid) {
        // Sort projects: featured first, then by status (active first)
        const sortedProjects = [...projectsData].sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            if (a.status === 'active' && b.status !== 'active') return -1;
            if (a.status !== 'active' && b.status === 'active') return 1;
            return 0;
        });

        sortedProjects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = `project-card ${project.featured ? 'featured' : ''}`;

            // Create technology tags
            const techTags = project.technologies.map(tech =>
                `<span class="tech-tag">${tech}</span>`
            ).join('');

            // Create project links
            const projectLinks = project.links.map(link =>
                `<a href="${link.url}" class="project-link" target="_blank">
                    <i class="${link.icon}"></i> ${link.type}
                </a>`
            ).join('');

            // Funding information
            const fundingHTML = project.funding ?
                `<div class="project-funding">Funding: ${project.funding}</div>` : '';

            projectCard.innerHTML = `
                <div class="project-header">
                    <h3>${project.title}</h3>
                    <div class="project-status ${project.status}">${project.status}</div>
                </div>
                <p>${project.description}</p>
                <div class="project-tech">${techTags}</div>
                ${fundingHTML}
                <div class="project-links">${projectLinks}</div>
            `;
            projectsGrid.appendChild(projectCard);
        });
    }
}

// Populate contact section
function populateContactSection() {
    const contactInfo = document.getElementById('contact-info');
    const socialLinksGrid = document.getElementById('social-links-grid');

    // Contact information
    if (contactInfo) {
        contactInfo.innerHTML = `
            <h3>Contact Information</h3>
            <div class="contact-item">
                <i class="fas fa-envelope"></i>
                <div>
                    <h4>Email</h4>
                    <p><a href="mailto:${personalData.contact.email}" style="color: inherit; text-decoration: none;">${personalData.contact.email}</a></p>
                </div>
            </div>
        `;
    }

    // Social links
    if (socialLinksGrid) {
        personalData.socialLinks.forEach(link => {
            const socialLink = document.createElement('a');
            socialLink.href = link.url;
            socialLink.className = 'social-link';
            socialLink.target = '_blank';
            socialLink.rel = 'noopener noreferrer';
            socialLink.setAttribute('data-tooltip', link.platform);
            socialLink.innerHTML = `
                <i class="${link.icon}"></i>
                <span>${link.platform}</span>
            `;
            socialLinksGrid.appendChild(socialLink);
        });
    }
}

// Populate footer
function populateFooter() {
    document.getElementById('footer-copyright').textContent =
        `© 2023 ${personalData.footer.copyright}. All rights reserved.`;
    document.getElementById('footer-updated').textContent =
        `Last updated: ${personalData.footer.lastUpdated}`;
}

// Initialize navigation functionality
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // Mobile navigation toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Navbar background opacity on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            }
        }
    });
}

// Initialize animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Apply animation to cards and items
    setTimeout(() => {
        const animatedElements = document.querySelectorAll(
            '.interest-card, .publication-item, .course-card, .project-card, .contact-item, .social-link'
        );

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }, 100);

    // Add loading animation for images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('load', function () {
            this.style.opacity = '1';
        });

        // If image is already cached
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
        }
    });
}

// Hide loading screen
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 500);
}

// Show error message
function showErrorMessage(message) {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.innerHTML = `
        <div style="text-align: center; color: var(--accent-color);">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
            <h2>Error Loading Website</h2>
            <p>${message}</p>
            <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.8rem 2rem; background: var(--secondary-color); color: white; border: none; border-radius: 5px; cursor: pointer;">
                Try Again
            </button>
        </div>
    `;
}

// Add click handlers for publication links
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('pub-link') && e.target.textContent === 'BibTeX') {
        e.preventDefault();
        showBibTeXModal(e.target);
    }
});

// Show BibTeX modal (you can expand this)
function showBibTeXModal(linkElement) {
    // This is a basic implementation - you can enhance with a proper modal
    const publicationTitle = linkElement.closest('.publication-item').querySelector('h4').textContent;
    alert(`BibTeX citation for "${publicationTitle}" would be shown here.\n\nIn a real implementation, you would:\n1. Store BibTeX data in publications.json\n2. Create a modal to display it\n3. Add copy-to-clipboard functionality`);
}

// Add search functionality
function initializeSearch() {
    const searchContainer = document.createElement('div');
    searchContainer.innerHTML = `
        <div style="position: fixed; top: 80px; right: 20px; z-index: 999; background: white; padding: 15px; border-radius: 8px; box-shadow: var(--shadow); display: none; width: 300px;" id="search-container">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <input type="text" id="search-input" placeholder="Search content..." style="flex: 1; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 5px; font-size: 14px;">
                <button onclick="closeSearch()" style="padding: 8px 12px; background: var(--accent-color); color: white; border: none; border-radius: 5px; cursor: pointer;">×</button>
            </div>
            <div id="search-results" style="max-height: 300px; overflow-y: auto;"></div>
        </div>
    `;
    document.body.appendChild(searchContainer);

    // Search input handler
    document.getElementById('search-input').addEventListener('input', performSearch);
}

// Perform search
function performSearch() {
    const query = document.getElementById('search-input').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('search-results');

    if (query.length < 2) {
        resultsContainer.innerHTML = '';
        return;
    }

    const results = [];

    // Search publications
    publicationsData.forEach((pub, index) => {
        if (pub.title.toLowerCase().includes(query) ||
            pub.authors.some(author => author.toLowerCase().includes(query)) ||
            pub.venue.toLowerCase().includes(query)) {
            results.push({
                type: 'Publication',
                title: pub.title,
                section: 'research',
                description: `${pub.venue}, ${pub.year}`
            });
        }
    });

    // Search projects
    projectsData.forEach((project, index) => {
        if (project.title.toLowerCase().includes(query) ||
            project.description.toLowerCase().includes(query) ||
            project.technologies.some(tech => tech.toLowerCase().includes(query))) {
            results.push({
                type: 'Project',
                title: project.title,
                section: 'projects',
                description: project.description.substring(0, 100) + '...'
            });
        }
    });

    // Search courses
    coursesData.forEach((course, index) => {
        if (course.title.toLowerCase().includes(query) ||
            course.courseCode.toLowerCase().includes(query) ||
            course.description.toLowerCase().includes(query)) {
            results.push({
                type: 'Course',
                title: `${course.courseCode}: ${course.title}`,
                section: 'teaching',
                description: course.description.substring(0, 100) + '...'
            });
        }
    });

    // Display results
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div style="padding: 10px; color: var(--text-light); text-align: center;">No results found</div>';
    } else {
        resultsContainer.innerHTML = results.map(result => `
            <div style="padding: 10px; border-bottom: 1px solid var(--border-color); cursor: pointer;" onclick="navigateToSection('${result.section}')">
                <div style="font-weight: 600; color: var(--primary-color);">${result.type}: ${result.title}</div>
                <div style="font-size: 0.9rem; color: var(--text-light); margin-top: 5px;">${result.description}</div>
            </div>
        `).join('');
    }
}

// Navigate to section
function navigateToSection(sectionId) {
    closeSearch();
    // Map section IDs to pages
    const pageMap = {
        'about': 'index.html',
        'research': 'research.html',
        'teaching': 'teaching.html',
        'projects': 'projects.html',
        'contact': 'contact.html'
    };

    if (pageMap[sectionId]) {
        window.location.href = pageMap[sectionId];
    }
}

// Close search
function closeSearch() {
    const searchContainer = document.getElementById('search-container');
    if (searchContainer) {
        searchContainer.style.display = 'none';
        document.getElementById('search-input').value = '';
        document.getElementById('search-results').innerHTML = '';
    }
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to open search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchContainer = document.getElementById('search-container');
        if (searchContainer) {
            searchContainer.style.display = searchContainer.style.display === 'none' ? 'block' : 'none';
            if (searchContainer.style.display === 'block') {
                document.getElementById('search-input').focus();
            }
        }
    }

    // Escape to close search
    if (e.key === 'Escape') {
        closeSearch();
    }
});

// Initialize search functionality
setTimeout(() => {
    initializeSearch();
}, 1000);

// Add theme toggle functionality (optional)
function addThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '🌙';
    themeToggle.id = 'theme-toggle';
    themeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: none;
        background: var(--secondary-color);
        color: white;
        font-size: 20px;
        cursor: pointer;
        box-shadow: var(--shadow);
        z-index: 1000;
        transition: var(--transition);
    `;

    themeToggle.addEventListener('click', toggleTheme);
    document.body.appendChild(themeToggle);
}

// Toggle theme
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.innerHTML = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';

    // Save theme preference
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Load saved theme
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) themeToggle.innerHTML = '☀️';
    }
}

// Add performance monitoring
window.addEventListener('load', () => {
    // Log page load time for optimization
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        console.log(`Website loaded in ${loadTime}ms`);
    }

    // Initialize optional features
    addThemeToggle(); // Uncomment to add theme toggle
    loadSavedTheme(); // Uncomment to enable theme persistence
});

// Log errors during loading
window.addEventListener('error', (event) => {
    console.error('Error loading the website:', event.message);
});

// Export functions for global access
window.closeSearch = closeSearch;
window.navigateToSection = navigateToSection;
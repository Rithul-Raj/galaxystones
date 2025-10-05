// Global variables
let currentSlideIndex = {
    'stoneCarousel': 0,
    'equipmentCarousel': 0
};

let carouselIntervals = {};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupMobileMenu();
    setupSmoothScrolling();
    setupScrollAnimations();
    setupActiveMenuHighlighting();
    setupCarousels();
    setupFormSubmission();
    startAutoCarousels();
}

// Mobile Menu Setup
function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
}

// Smooth Scrolling Setup
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll to specific section (used by buttons)
function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Scroll Animations Setup
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Active Menu Highlighting
function setupActiveMenuHighlighting() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        let current = '';
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Initial call
}

// Carousel Setup
function setupCarousels() {
    // Initialize indicators for both carousels
    const stoneSlides = document.querySelectorAll('#stoneCarousel .carousel-slide');
    const equipmentSlides = document.querySelectorAll('#equipmentCarousel .carousel-slide');
    
    updateCarouselIndicators('stoneCarousel', stoneSlides.length);
    updateCarouselIndicators('equipmentCarousel', equipmentSlides.length);
    
    // Set initial positions
    updateCarouselPosition('stoneCarousel');
    updateCarouselPosition('equipmentCarousel');
}

// Change slide function (global)
function changeSlide(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;
    
    if (totalSlides === 0) return;

    // Stop auto-sliding temporarily
    if (carouselIntervals[carouselId]) {
        clearInterval(carouselIntervals[carouselId]);
    }

    currentSlideIndex[carouselId] += direction;

    if (currentSlideIndex[carouselId] >= totalSlides) {
        currentSlideIndex[carouselId] = 0;
    } else if (currentSlideIndex[carouselId] < 0) {
        currentSlideIndex[carouselId] = totalSlides - 1;
    }

    updateCarouselPosition(carouselId);
    updateCarouselIndicators(carouselId, totalSlides);

    // Restart auto-sliding after a delay
    setTimeout(() => {
        startAutoCarousel(carouselId);
    }, 2000);
}

// Go to specific slide
function goToSlide(carouselId, slideIndex) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;
    
    if (slideIndex >= 0 && slideIndex < totalSlides) {
        // Stop auto-sliding temporarily
        if (carouselIntervals[carouselId]) {
            clearInterval(carouselIntervals[carouselId]);
        }

        currentSlideIndex[carouselId] = slideIndex;
        updateCarouselPosition(carouselId);
        updateCarouselIndicators(carouselId, totalSlides);

        // Restart auto-sliding after a delay
        setTimeout(() => {
            startAutoCarousel(carouselId);
        }, 5000);
    }
}

// Update carousel position
function updateCarouselPosition(carouselId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const translateX = -currentSlideIndex[carouselId] * 100;
    carousel.style.transform = `translateX(${translateX}%)`;
}

// Update carousel indicators
function updateCarouselIndicators(carouselId, totalSlides) {
    const indicatorsContainer = document.getElementById(carouselId.replace('Carousel', 'Indicators'));
    if (!indicatorsContainer) return;

    indicatorsContainer.innerHTML = '';
    
    for (let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        indicator.addEventListener('click', () => goToSlide(carouselId, i));
        
        if (i === currentSlideIndex[carouselId]) {
            indicator.classList.add('active');
        }
        
        indicatorsContainer.appendChild(indicator);
    }
}

// Start auto-carousel for all carousels
function startAutoCarousels() {
    startAutoCarousel('stoneCarousel');
    startAutoCarousel('equipmentCarousel');
}

// Start auto-carousel for specific carousel
function startAutoCarousel(carouselId) {
    // Clear any existing interval
    if (carouselIntervals[carouselId]) {
        clearInterval(carouselIntervals[carouselId]);
    }

    // Start new interval
    carouselIntervals[carouselId] = setInterval(() => {
        changeSlide(carouselId, 1);
    }, 2000); // Change slide every 2 seconds
}

// Form Submission Setup
// Form Submission Setup with Google Sheets
function setupFormSubmission() {
    const form = document.getElementById('registrationForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Client-side validation
        const requiredFields = ['customerName', 'customerPhone', 'customerLocation', 'quantity'];
        const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');
        
        if (missingFields.length > 0) {
            showMessage('Please fill in all required fields. / ദയവായി എല്ലാ ആവശ്യമായ ഫീൽഡുകളും പൂരിപ്പിക്കുക.', 'error');
            return;
        }
        
        // Show processing message
        showMessage('Processing registration... / രജിസ്ട്രേഷൻ പ്രോസസ് ചെയ്യുന്നു...', 'info');
        
        // REPLACE THIS URL with your Google Apps Script Web App URL
        const scriptURL = 'https://script.google.com/macros/s/AKfycbz8wQ8YMpHIKxtSKXfDixU6b-2bFqDHwUjAPNt8-MmiCEnpiILMiXb4CkLuGxpk3LvVxw/exec';
        
        // Submit to Google Sheets
        fetch(scriptURL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors' // Required for Google Apps Script
        })
        .then(() => {
            // Success
            form.style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';
            showMessage('Registration submitted successfully! / രജിസ്ട്രേഷൻ വിജയകരമായി സമർപ്പിച്ചു!', 'success');
            document.getElementById('successMessage').scrollIntoView({ behavior: 'smooth', block: 'center' });
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('Submission failed. Please try again. / സമർപ്പിക്കുന്നതിൽ പരാജയപ്പെട്ടു. വീണ്ടും ശ്രമിക്കുക.', 'error');
        });
    });
}


// Show message to user
function showMessage(message, type = 'info') {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message message--${type}`;
    messageEl.textContent = message;
    
    // Style the message
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        animation: slideIn 0.3s ease-out;
        font-size: 0.875rem;
        line-height: 1.4;
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            messageEl.style.backgroundColor = '#10B981';
            break;
        case 'error':
            messageEl.style.backgroundColor = '#EF4444';
            break;
        case 'warning':
            messageEl.style.backgroundColor = '#F59E0B';
            break;
        default:
            messageEl.style.backgroundColor = '#3B82F6';
    }
    
    // Add animation keyframes if not already added
    if (!document.querySelector('#messageAnimations')) {
        const style = document.createElement('style');
        style.id = 'messageAnimations';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(messageEl);
    
    // Remove after 5 seconds
    setTimeout(() => {
        messageEl.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 300);
    }, 5000);
}

// Stone Price Calculator
function calculatePrice() {
    const quantityInput = document.getElementById('quantityCalc');
    const priceResult = document.getElementById('priceResult');
    
    const pricePerStone = 30; // Fixed price
    const quantity = parseInt(quantityInput.value);
    
    // Validation
    if (!quantity || quantity <= 0) {
        showMessage('സാധുവായ അളവ് നൽകുക / Please enter valid quantity', 'error');
        return;
    }
    
    // Calculate total price
    const totalPrice = pricePerStone * quantity;
    
    // Display results
    document.getElementById('resultQuantity').textContent = `${quantity} pieces`;
    document.getElementById('resultTotalPrice').textContent = `₹${totalPrice.toLocaleString()}`;
    
    // Show result
    priceResult.style.display = 'block';
    
    // Scroll to result
    priceResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    showMessage('വില കണക്കാക്കി / Price calculated successfully!', 'success');
}

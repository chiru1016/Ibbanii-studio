const products = [
    {
        id: 1,
        category: 'rose',
        title: 'Simple Rose',
        image: 'assets/roses.png',
        description: 'Single stems of elegant handmade roses.',
        variants: [
            { label: 'Single', price: '₹69' },
            { label: 'Double', price: '₹129' },
            { label: 'Triple', price: '₹189' }
        ]
    },
    {
        id: 2,
        category: 'rose',
        title: 'Rose Bouquet',
        image: 'assets/roses.png',
        description: 'A lush bouquet of roses wrapped with love.',
        variants: [
            { label: 'Single', price: '₹149' },
            { label: 'Double', price: '₹349' },
            { label: 'Triple', price: '₹549' }
        ]
    },
    {
        id: 3,
        category: 'sunflower',
        title: 'Simple Sunflower',
        image: 'assets/sunflower.png',
        description: 'Bright and cheerful handmade sunflowers.',
        variants: [
            { label: 'Single', price: '₹69' },
            { label: 'Double', price: '₹119' },
            { label: 'Triple', price: '₹179' }
        ]
    },
    {
        id: 4,
        category: 'sunflower',
        title: 'Sunflower Bouquet',
        image: 'assets/sunflower.png',
        description: 'A sunny collection of sunflowers to light up any room.',
        variants: [
            { label: 'Single', price: '₹149' },
            { label: 'Double', price: '₹249' },
            { label: 'Triple', price: '₹349' }
        ]
    },
    {
        id: 5,
        category: 'tulip',
        title: 'Simple Tulip',
        image: 'assets/tulips.png',
        description: 'Delicate handmade tulips in vibrant colors.',
        variants: [
            { label: 'Single', price: '₹69' },
            { label: 'Double', price: '₹119' },
            { label: 'Triple', price: '₹179' }
        ]
    },
    {
        id: 6,
        category: 'tulip',
        title: 'Tulip Bouquet',
        image: 'assets/tulips.png',
        description: 'A whimisical bouquet of assorted handmade tulips.',
        variants: [
            { label: 'Single', price: '₹149' },
            { label: 'Double', price: '₹299' },
            { label: 'Triple', price: '₹399' }
        ]
    },
    {
        id: 7,
        category: 'lily',
        title: 'Simple Lily',
        image: 'assets/lily.png',
        description: 'Exquisite handmade lilies with refined details.',
        variants: [
            { label: 'Single', price: '₹79' },
            { label: 'Double', price: '₹139' },
            { label: 'Triple', price: '₹199' }
        ]
    },
    {
        id: 8,
        category: 'lily',
        title: 'Lily Bouquet',
        image: 'assets/lily.png',
        description: 'A premium bouquet of lilies for sophisticated gifting.',
        variants: [
            { label: 'Single', price: '₹249' },
            { label: 'Double', price: '₹399' },
            { label: 'Triple', price: '₹549' }
        ]
    }
];

const productGrid = document.getElementById('productGrid');
const tabBtns = document.querySelectorAll('.tab-btn');
const header = document.getElementById('main-header');

// Initialize Product Grid
function renderProducts(filter = 'all') {
    productGrid.innerHTML = '';
    
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(p => p.category === filter);

    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card animate-fade-in';
        
        const variantsHtml = product.variants.map(v => `
            <div class="price-item">
                <span>${v.label}</span>
                <span>${v.price}</span>
            </div>
        `).join('');

        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-img">
            <div class="product-info">
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <div class="price-list">
                    ${variantsHtml}
                </div>
            </div>
        `;
        
        productGrid.appendChild(card);
    });
}

// Tab Filtering Logic
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all
        tabBtns.forEach(b => b.classList.remove('active'));
        // Add to clicked
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        renderProducts(filter);
    });
});

// Scroll Effects
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Reveal animations on scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 1s ease';
});

// Simple reveal logic
const revealOnScroll = () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (sectionTop < windowHeight * 0.85) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', () => {
    revealOnScroll();
    renderProducts();
});

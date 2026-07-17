// OceanAura Single Page Application Render Engine

// Global State
let activeCabinSelections = {}; // Store selections for each schedule: { scheduleId: { cabinType: 'Suite', passengers: 1, basePrice: 1200 } }

// Confetti Particle System
const triggerConfetti = () => {
  const container = document.getElementById('confetti-container');
  if (!container) return;
  
  const colors = ['#FFC857', '#FF914D', '#FF7A59', '#FFFFFF', '#1F4E79'];
  for (let i = 0; i < 150; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.transform = `scale(${Math.random() * 0.8 + 0.4})`;
    
    // Randomize path
    const duration = Math.random() * 2 + 1.5;
    confetti.style.animationDuration = duration + 's';
    
    container.appendChild(confetti);
    
    // Clean up
    setTimeout(() => {
      confetti.remove();
    }, duration * 1000);
  }
};

// Auth Helpers
const getLoggedInUser = () => {
  return JSON.parse(localStorage.getItem('oa_user')) || null;
};

const setLoggedInUser = (user) => {
  localStorage.setItem('oa_user', JSON.stringify(user));
  updateNavbarAuth();
};

const logoutUser = () => {
  localStorage.removeItem('oa_user');
  updateNavbarAuth();
  window.location.hash = '#home';
};

const updateNavbarAuth = () => {
  const authItem = document.getElementById('nav-auth-item');
  if (!authItem) return;

  const user = getLoggedInUser();
  if (user) {
    authItem.innerHTML = `
      <div style="display: flex; align-items: center; gap: 15px;">
        <a href="#dashboard" style="color: var(--accent-gold); font-weight: 600; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-circle-user" style="font-size: 18px;"></i> ${user.name.split(' ')[0]}
        </a>
        <a href="#" id="logout-btn" style="font-size: 12px; color: var(--neutral-silver); opacity: 0.8; padding: 4px 8px; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; background: rgba(255,255,255,0.02);">Logout</a>
      </div>
    `;
    document.getElementById('logout-btn').addEventListener('click', (e) => {
      e.preventDefault();
      logoutUser();
    });
  } else {
    authItem.innerHTML = `<a href="#login" class="nav-btn" style="padding: 6px 18px; display: inline-block;">Login</a>`;
  }
};

// Modal helpers
const openModal = (htmlContent) => {
  const modal = document.getElementById('global-modal');
  const body = document.getElementById('modal-body');
  if (modal && body) {
    body.innerHTML = htmlContent;
    modal.classList.add('active');
  }
};

const closeModal = () => {
  const modal = document.getElementById('global-modal');
  if (modal) modal.classList.remove('active');
};

document.getElementById('modal-close-btn').addEventListener('click', closeModal);
document.getElementById('modal-backdrop').addEventListener('click', closeModal);

// Dynamic status banner
const updateStatusBadge = (demoMode) => {
  let badge = document.getElementById('api-status-banner');
  if (!badge) {
    badge = document.createElement('div');
    badge.id = 'api-status-banner';
    badge.style.cssText = 'position: fixed; bottom: 20px; right: 20px; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; z-index: 1000; box-shadow: 0 4px 15px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 6px;';
    document.body.appendChild(badge);
  }
  
  if (demoMode) {
    badge.style.background = 'rgba(255, 200, 87, 0.15)';
    badge.style.border = '1px solid rgba(255, 200, 87, 0.3)';
    badge.style.color = 'var(--accent-gold)';
    badge.innerHTML = '<span style="display:inline-block; width: 6px; height: 6px; border-radius: 50%; background: #FFC857; box-shadow: 0 0 8px #FFC857;"></span> Demo Mode (Offline)';
  } else {
    badge.style.background = 'rgba(16, 185, 129, 0.15)';
    badge.style.border = '1px solid rgba(16, 185, 129, 0.3)';
    badge.style.color = '#10B981';
    badge.innerHTML = '<span style="display:inline-block; width: 6px; height: 6px; border-radius: 50%; background: #10B981; box-shadow: 0 0 8px #10B981;"></span> Live (Connected)';
  }
};

document.addEventListener('api-status-changed', (e) => {
  updateStatusBadge(e.detail.demoMode);
});

// Render Page Modules

// 1. Home View
const renderHome = async () => {
  const app = document.getElementById('app');
  
  // Fetch lists for search panel dropdowns
  const routes = await OceanAuraAPI.getRoutes();
  const sourcePorts = [...new Set(routes.map(r => r.source_port))].sort();
  const destPorts = [...new Set(routes.map(r => r.destination_port))].sort();

  app.innerHTML = `
    <!-- Hero Section -->
    <section class="hero" style="background: url('assets/hero.png') no-repeat center center/cover;">
      <div class="hero-overlay-sunset"></div>
      <div class="hero-content">
        <p class="hero-tagline">OceanAura Private Journeys</p>
        <h1>Discover <span>Extraordinary</span> Voyages</h1>
        <p>Book unforgettable cruise experiences across breathtaking destinations with absolute comfort, elegance, and world-class service.</p>
        <div class="hero-cta">
          <a href="#cruises" class="btn-primary">Explore Cruises <i class="fa-solid fa-compass"></i></a>
          <a href="#cruises" class="btn-secondary">Book Your Journey</a>
        </div>
      </div>
    </section>

    <!-- Floating Search Journey Panel -->
    <div class="search-panel-container">
      <form class="search-panel glass-panel" id="home-search-form">
        <div class="search-field">
          <label>Source Port</label>
          <select id="search-source" required>
            <option value="">Select departure</option>
            ${sourcePorts.map(p => `<option value="${p}">${p}</option>`).join('')}
          </select>
        </div>
        <div class="search-field">
          <label>Destination Port</label>
          <select id="search-destination" required>
            <option value="">Select destination</option>
            ${destPorts.map(p => `<option value="${p}">${p}</option>`).join('')}
          </select>
        </div>
        <div class="search-field">
          <label>Departure Date</label>
          <input type="date" id="search-departure" min="2026-01-01" max="2026-12-31" value="2026-08-01">
        </div>
        <div class="search-field">
          <label>Passengers</label>
          <select id="search-passengers">
            <option value="1">1 Guest</option>
            <option value="2" selected>2 Guests</option>
            <option value="3">3 Guests</option>
            <option value="4">4 Guests</option>
            <option value="5">5+ Guests</option>
          </select>
        </div>
        <div class="search-field">
          <label>Cabin Class</label>
          <select id="search-cabin">
            <option value="Suite">Ocean View Suite</option>
            <option value="VIP Cabin">VIP Collection</option>
            <option value="Deluxe">Deluxe Cabin</option>
            <option value="Economy">Economy</option>
          </select>
        </div>
        <button type="submit" class="search-submit" title="Search Voyages">
          <i class="fa-solid fa-magnifying-glass" style="font-size: 16px;"></i>
        </button>
      </form>
    </div>

    <!-- Popular Destinations Section -->
    <section id="destinations" style="padding-top: 130px;">
      <div class="section-header">
        <p style="color: var(--accent-gold); font-size: 12px; text-transform: uppercase; font-weight:600; letter-spacing:0.2em; margin-bottom: 10px;">Curated Journeys</p>
        <h2>Popular <span>Destinations</span></h2>
        <p>Sail to pristine archipelagos, exotic tropical harbors, and historical marine hubs across the globe.</p>
      </div>
      <div class="destination-grid">
        <!-- Parallax style cards -->
        ${[
          { name: "Maldives", img: "assets/hero.png", price: "1,200", filter: "Maldives" },
          { name: "Goa", img: "assets/sovereign.png", price: "750", filter: "Goa" },
          { name: "Port Blair", img: "assets/suite.png", price: "950", filter: "Port Blair" },
          { name: "Lakshadweep", img: "assets/hero.png", price: "800", filter: "Lakshadweep" },
          { name: "Singapore", img: "assets/sovereign.png", price: "1,450", filter: "Singapore" },
          { name: "Dubai", img: "assets/suite.png", price: "1,850", filter: "Dubai" }
        ].map(d => `
          <div class="destination-card" data-filter="${d.filter}">
            <div class="dest-img-container">
              <img src="${d.img}" alt="${d.name}">
            </div>
            <div class="dest-overlay">
              <h3 class="dest-name">${d.name}</h3>
              <div class="dest-meta">
                <div class="dest-price">From <span>$${d.price}</span></div>
                <div class="dest-btn">Explore <i class="fa-solid fa-arrow-right"></i></div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Exclusive Offers -->
    <section id="offers">
      <div class="section-header">
        <p style="color: var(--accent-gold); font-size: 12px; text-transform: uppercase; font-weight:600; letter-spacing:0.2em; margin-bottom: 10px;">Limited Collection</p>
        <h2>Exclusive <span>Offers</span></h2>
        <p>Indulge in seasonal upgrades and private rewards tailored for elite travelers.</p>
      </div>
      <div class="offer-grid">
        <div class="offer-card glass-panel">
          <span class="offer-badge">Save 30%</span>
          <h3 class="offer-title">Summer Solstice</h3>
          <p class="offer-desc">Book any cabin on Maldives voyages between August and October and receive an automatic 30% discount, plus complimentary spa access.</p>
          <div class="offer-terms">* Valid until July 31st, 2026. Terms apply.</div>
          <a href="#cruises?destination=Maldives" class="btn-primary btn-small" style="margin-top: 15px; width: fit-content;">Book Offer</a>
        </div>
        <div class="offer-card glass-panel">
          <span class="offer-badge" style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); color:white; box-shadow:0 0 15px rgba(16,185,129,0.3);">Early Bird</span>
          <h3 class="offer-title">Horizon 2027</h3>
          <p class="offer-desc">Plan ahead and reserve your 2027 voyages today. Enjoy locked-in base rates, priority suite selections, and free return flights.</p>
          <div class="offer-terms">* Deposit fully refundable up to 90 days before sail.</div>
          <a href="#cruises" class="btn-primary btn-small" style="margin-top: 15px; width: fit-content;">Explore Fleet</a>
        </div>
        <div class="offer-card glass-panel">
          <span class="offer-badge" style="background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%); color:white; box-shadow:0 0 15px rgba(59,130,246,0.3);">Family VIP</span>
          <h3 class="offer-title">Suite Retreats</h3>
          <p class="offer-desc">Bring your loved ones. Families of 4+ booking VIP Cabins receive complimentary stateroom interconnecting options and kids sail free.</p>
          <div class="offer-terms">* Applies to designated luxury liners.</div>
          <a href="#cruises" class="btn-primary btn-small" style="margin-top: 15px; width: fit-content;">Reserve Now</a>
        </div>
      </div>
    </section>

    <!-- Why Choose OceanAura -->
    <section id="why-us">
      <div class="section-header">
        <p style="color: var(--accent-gold); font-size: 12px; text-transform: uppercase; font-weight:600; letter-spacing:0.2em; margin-bottom: 10px;">The OceanAura Standard</p>
        <h2>Luxurious <span>Details</span></h2>
        <p>Every aspect of our fleet is engineered to surpass five-star expectations.</p>
      </div>
      <div class="features-grid">
        ${[
          { title: "Luxury Cabins", desc: "Crafted with premium Italian linens, customized mini-bars, and 24h cabin service.", icon: "fa-bed" },
          { title: "Ocean View Suites", desc: "Private wrap-around teak decks featuring personal hot tubs and sunbeds.", icon: "fa-water" },
          { title: "Secure Booking", desc: "Military-grade data protection encryption and zero booking-fee transactions.", icon: "fa-shield-halved" },
          { title: "Instant Confirmation", desc: "Boarding pass generated instantly upon reservation, syncs with Apple Wallet.", icon: "fa-bolt" },
          { title: "24×7 Concierge", desc: "A dedicated personal butler on hand to curate shore trips and fulfill requests.", icon: "fa-bell" },
          { title: "Premium Dining", desc: "Menus created by Michelin-starred chefs utilizing freshly caught seafood.", icon: "fa-utensils" },
          { title: "Live Show Theatres", desc: "Bespoke theatrical performances, classical concerts, and private lounges.", icon: "fa-masks-theater" },
          { title: "Global Destinations", desc: "Unmatched schedules sailing to exclusive bays unreachable by standard ships.", icon: "fa-globe" }
        ].map(f => `
          <div class="feature-card glass-panel">
            <div class="feature-icon-wrapper">
              <i class="fa-solid ${f.icon}"></i>
            </div>
            <h3>${f.title}</h3>
            <p>${f.desc}</p>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Luxury Contact Section -->
    <section id="contact" style="padding-bottom: 100px;">
      <div class="glass-panel" style="max-width: 800px; margin: 0 auto; padding: 50px; text-align: center;">
        <h2 style="font-size: 36px; margin-bottom: 15px;">Connect with our <span>Concierge</span></h2>
        <p style="color: var(--neutral-silver); max-width: 500px; margin: 0 auto 30px;">Speak with an expert today to plan your bespoke ocean experience. We are ready to execute your customized itinerary details.</p>
        <form id="home-contact-form" style="display: flex; flex-direction: column; gap: 15px; max-width: 500px; margin: 0 auto;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <input type="text" placeholder="Full Name" class="form-control" required>
            <input type="email" placeholder="Email Address" class="form-control" required>
          </div>
          <input type="tel" placeholder="Phone Number" class="form-control">
          <textarea placeholder="Tell us about your dream itinerary..." class="form-control" rows="4" style="resize: none;" required></textarea>
          <button type="submit" class="btn-primary" style="justify-content: center; margin-top: 10px;">Inquire Details</button>
        </form>
      </div>
    </section>
  `;

  // Bind search form submit
  document.getElementById('home-search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const source = document.getElementById('search-source').value;
    const dest = document.getElementById('search-destination').value;
    const dep = document.getElementById('search-departure').value;
    const passengers = document.getElementById('search-passengers').value;
    const cabin = document.getElementById('search-cabin').value;
    
    window.location.hash = `#cruises?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(dest)}&departure=${encodeURIComponent(dep)}&passengers=${passengers}&cabin=${cabin}`;
  });

  // Bind popular destination clicks
  document.querySelectorAll('.destination-card').forEach(el => {
    el.addEventListener('click', () => {
      const filterVal = el.getAttribute('data-filter');
      window.location.hash = `#cruises?destination=${encodeURIComponent(filterVal)}`;
    });
  });

  // Bind luxury contact submission
  document.getElementById('home-contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for contacting OceanAura. A personal concierge officer will call your email and phone line shortly to align on your details.');
    e.target.reset();
  });
};

// 2. Cruises Listings View
const renderCruises = async (params, queryParams) => {
  const app = document.getElementById('app');
  const schedules = await OceanAuraAPI.getSchedules();
  
  // Extract filters
  const fSource = queryParams.source || '';
  const fDest = queryParams.destination || '';
  const fDep = queryParams.departure || '';

  // Filter list
  const filtered = schedules.filter(s => {
    let match = true;
    if (fSource && s.route.source_port.toLowerCase() !== fSource.toLowerCase()) match = false;
    if (fDest && s.route.destination_port.toLowerCase() !== fDest.toLowerCase()) match = false;
    // Check departure date matching roughly
    if (fDep && s.departure_date < fDep) match = false;
    return match;
  });

  // Load ports for filter panel
  const routes = await OceanAuraAPI.getRoutes();
  const sourcePorts = [...new Set(routes.map(r => r.source_port))].sort();
  const destPorts = [...new Set(routes.map(r => r.destination_port))].sort();

  app.innerHTML = `
    <section style="min-height: 100vh; padding-top: 130px;">
      <div class="section-header">
        <h2>Extraordinary <span>Voyages</span></h2>
        <p>Select your sailing schedule and step aboard our award-winning yachts.</p>
      </div>

      <!-- Filter Panel -->
      <div class="glass-panel" style="margin-bottom: 40px; padding: 20px;">
        <form id="filter-search-form" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)) 120px; gap: 15px; align-items: flex-end;">
          <div class="search-field">
            <label>Departure Port</label>
            <select id="filter-source">
              <option value="">All Ports</option>
              ${sourcePorts.map(p => `<option value="${p}" ${p === fSource ? 'selected' : ''}>${p}</option>`).join('')}
            </select>
          </div>
          <div class="search-field">
            <label>Arrival Port</label>
            <select id="filter-destination">
              <option value="">All Ports</option>
              ${destPorts.map(p => `<option value="${p}" ${p === fDest ? 'selected' : ''}>${p}</option>`).join('')}
            </select>
          </div>
          <div class="search-field">
            <label>Min Date</label>
            <input type="date" id="filter-departure" value="${fDep}">
          </div>
          <button type="submit" class="btn-primary" style="height: 46px; justify-content: center; width: 100%;">Filter <i class="fa-solid fa-sliders"></i></button>
        </form>
      </div>

      <!-- Results Grid -->
      ${filtered.length === 0 ? `
        <div class="glass-panel" style="text-align: center; padding: 60px; max-width: 600px; margin: 0 auto;">
          <i class="fa-solid fa-anchor-lock" style="font-size: 40px; color: var(--accent-orange); margin-bottom: 20px;"></i>
          <h3>No Cruises Match Your Query</h3>
          <p style="color: var(--neutral-silver); margin-top: 10px;">Our vessels do not have active voyages matching these specific ports. Try adjusting the search parameters.</p>
          <a href="#cruises" class="btn-primary" style="margin-top: 20px;">View All Voyages</a>
        </div>
      ` : `
        <div class="ship-grid">
          ${filtered.map(s => {
            const shipImg = s.ship.image ? `assets/${s.ship.image}.png` : 'assets/sovereign.png';
            return `
              <div class="ship-card glass-panel">
                <div class="ship-image-wrapper">
                  <img src="${shipImg}" alt="${s.ship.name}">
                  <span class="ship-tag">${s.ship.ship_type}</span>
                  <span class="ship-rating"><i class="fa-solid fa-star"></i> ${s.ship.rating}</span>
                </div>
                <div class="ship-info">
                  <span class="ship-operator">${s.ship.operator}</span>
                  <h3 class="ship-title">${s.ship.name}</h3>
                  <p style="font-size: 13px; color: var(--accent-gold); font-weight:600; margin-bottom:15px; display:flex; align-items:center; gap: 8px;">
                    <i class="fa-solid fa-route"></i> ${s.route.source_port} to ${s.route.destination_port}
                  </p>
                  
                  <div class="ship-specs">
                    <div class="spec-item"><i class="fa-solid fa-calendar"></i> ${s.departure_date}</div>
                    <div class="spec-item"><i class="fa-solid fa-hourglass-half"></i> ${s.duration_days} Days</div>
                    <div class="spec-item"><i class="fa-solid fa-users"></i> Cap: ${s.ship.capacity}</div>
                    <div class="spec-item"><i class="fa-solid fa-anchor"></i> ${s.route.distance} nmi</div>
                  </div>

                  <div class="ship-footer">
                    <div class="ship-price">
                      <span class="price-label">Per Guest</span>
                      <span class="price-amount">$${parseFloat(s.ship.base_fare).toLocaleString()}</span>
                    </div>
                    <a href="#/ship/${s.id}" class="btn-primary btn-small">View Details <i class="fa-solid fa-chevron-right"></i></a>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    </section>
  `;

  // Bind filter submit
  document.getElementById('filter-search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const src = document.getElementById('filter-source').value;
    const dst = document.getElementById('filter-destination').value;
    const dep = document.getElementById('filter-departure').value;
    window.location.hash = `#cruises?source=${encodeURIComponent(src)}&destination=${encodeURIComponent(dst)}&departure=${encodeURIComponent(dep)}`;
  });
};

// 3. Ship Detail View
const renderShipDetail = async (params) => {
  const app = document.getElementById('app');
  const scheduleId = params.id;
  const schedule = await OceanAuraAPI.getSchedule(scheduleId);
  
  if (!schedule) {
    app.innerHTML = `<div class="glass-panel" style="margin: 100px auto; max-width: 500px; text-align: center;">
      <h2 style="color: var(--accent-orange);">Voyage Not Found</h2>
      <p style="color: var(--neutral-silver); margin: 15px 0;">This voyage schedule ID does not exist or has expired.</p>
      <a href="#cruises" class="btn-primary">View Cruises</a>
    </div>`;
    return;
  }

  // Pre-fill selection state if not already selected
  if (!activeCabinSelections[scheduleId]) {
    activeCabinSelections[scheduleId] = {
      cabinType: 'Suite',
      passengers: 2,
      baseFare: parseFloat(schedule.ship.base_fare)
    };
  }

  const selection = activeCabinSelections[scheduleId];

  // Cabin options multipliers and images
  const CABIN_OPTIONS = [
    { type: 'Suite', name: 'Ocean View Suite', priceMult: 1.5, image: 'assets/suite.png', features: ['Private balcony', 'King Bed', 'Complimentary Champagne', 'Priority embarkation'] },
    { type: 'VIP Cabin', name: 'VIP Owner Suite', priceMult: 2.5, image: 'assets/hero.png', features: ['Wrap-around private deck', 'Outdoor hot tub', 'Private butler service', 'Michelin in-suite dining'] },
    { type: 'Deluxe', name: 'Deluxe Stateroom', priceMult: 1.0, image: 'assets/sovereign.png', features: ['Floor-to-ceiling glass', 'Queen Bed', 'Daily minibar refresh', 'Lounge seating area'] },
    { type: 'Economy', name: 'Interior Cabin', priceMult: 0.7, image: 'assets/horizon.png', features: ['Compact living space', 'Twin beds optional', 'Smart TV entertainment', 'Ensuite bath'] }
  ];

  const updateBookingSummaryWidget = () => {
    const selectedCabinData = CABIN_OPTIONS.find(c => c.type === selection.cabinType);
    const guestCount = selection.passengers;
    const baseFarePerGuest = selection.baseFare * selectedCabinData.priceMult;
    const subtotal = baseFarePerGuest * guestCount;
    const taxes = subtotal * 0.12; // 12% luxury tax
    const total = subtotal + taxes;

    const widget = document.getElementById('booking-summary-widget-content');
    if (widget) {
      widget.innerHTML = `
        <div class="summary-row">
          <span>Selected Cabin:</span>
          <strong style="color: var(--accent-gold);">${selectedCabinData.name}</strong>
        </div>
        <div class="summary-row">
          <span>Base Rate:</span>
          <span>$${baseFarePerGuest.toFixed(2)} / guest</span>
        </div>
        <div class="summary-row">
          <span>Guests:</span>
          <span>${guestCount}</span>
        </div>
        <div class="summary-row">
          <span>Sailing Duration:</span>
          <span>${schedule.duration_days} Days</span>
        </div>
        <div class="summary-row">
          <span>Cabin Subtotal:</span>
          <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
          <span>Luxury Port Tax (12%):</span>
          <span>$${taxes.toFixed(2)}</span>
        </div>
        <div class="summary-row summary-total">
          <span>Grand Total:</span>
          <span>$${total.toFixed(2)}</span>
        </div>
        <button id="summary-booking-cta" class="btn-primary" style="width: 100%; margin-top: 20px; justify-content: center;">
          Book Cabin Now <i class="fa-solid fa-ticket"></i>
        </button>
      `;

      // Bind CTA inside widget
      document.getElementById('summary-booking-cta').addEventListener('click', () => {
        window.location.hash = `#/booking?schedule_id=${scheduleId}&cabin=${encodeURIComponent(selection.cabinType)}&passengers=${guestCount}`;
      });
    }
  };

  const bannerImg = schedule.ship.image ? `assets/${schedule.ship.image}.png` : 'assets/sovereign.png';

  app.innerHTML = `
    <section style="min-height: 100vh; padding-top: 130px;">
      <a href="#cruises" style="color: var(--neutral-silver); font-size: 14px; display: inline-flex; align-items: center; gap: 8px; margin-bottom: 25px;">
        <i class="fa-solid fa-arrow-left"></i> Back to listings
      </a>

      <!-- Large Cinematic Banner -->
      <div class="details-banner">
        <img src="${bannerImg}" alt="${schedule.ship.name}">
        <div class="details-banner-overlay">
          <div class="details-banner-info">
            <span style="font-size:12px; text-transform:uppercase; color: var(--accent-gold); font-weight:700; letter-spacing:0.15em;">${schedule.ship.operator}</span>
            <h1 style="color:var(--neutral-white); margin-top: 5px;">${schedule.ship.name}</h1>
            <p style="color: var(--neutral-silver); font-size: 15px; margin-top: 5px; display:flex; align-items:center; gap: 10px;">
              <span><i class="fa-solid fa-route"></i> ${schedule.route.source_port} to ${schedule.route.destination_port}</span>
              <span>•</span>
              <span><i class="fa-solid fa-star" style="color:var(--accent-gold);"></i> ${schedule.ship.rating} Star Service</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Main Columns -->
      <div class="ship-details-container">
        
        <!-- Left Side Details -->
        <div class="details-main">
          
          <!-- Image Gallery -->
          <div class="glass-panel">
            <h3 style="margin-bottom: 15px;">Cinematic Vessel Gallery</h3>
            <div class="gallery-grid">
              <div class="gallery-item"><img src="assets/suite.png" alt="luxury suite interior" onclick="openModal('<img src=\\'assets/suite.png\\' style=\\'width:100%; border-radius:12px;\\'>')"></div>
              <div class="gallery-item"><img src="assets/sovereign.png" alt="yacht sailing" onclick="openModal('<img src=\\'assets/sovereign.png\\' style=\\'width:100%; border-radius:12px;\\'>')"></div>
              <div class="gallery-item"><img src="assets/hero.png" alt="ocean deck" onclick="openModal('<img src=\\'assets/hero.png\\' style=\\'width:100%; border-radius:12px;\\'>')"></div>
            </div>
          </div>

          <!-- Cabin Selection Grid -->
          <div>
            <h2 style="font-size: 28px; margin-bottom: 20px;">Select Your <span>Cabin Experience</span></h2>
            <div class="cabin-grid">
              ${CABIN_OPTIONS.map(cab => {
                const cabPrice = parseFloat(schedule.ship.base_fare) * cab.priceMult;
                const isSelected = selection.cabinType === cab.type;
                return `
                  <div class="cabin-card glass-panel" style="${isSelected ? 'border-color: var(--accent-gold); box-shadow: var(--glow-gold);' : ''}">
                    <img class="cabin-img" src="${cab.image}" alt="${cab.name}">
                    <div class="cabin-info">
                      <h4>${cab.name}</h4>
                      <ul class="cabin-features" style="margin-top: 10px;">
                        ${cab.features.map(f => `<li>${f}</li>`).join('')}
                      </ul>
                      <div class="cabin-price-select">
                        <div class="cabin-price">$${cabPrice.toFixed(0)} <span style="font-size: 11px; color: var(--neutral-silver); font-weight: normal;">/ night</span></div>
                        <button class="btn-primary btn-small select-cabin-btn" data-type="${cab.type}" style="${isSelected ? 'background: var(--neutral-white); color: var(--bg-deep-navy);' : ''}">
                          ${isSelected ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Schedule and Journey Info -->
          <div class="glass-panel">
            <h3 style="margin-bottom: 20px; font-size:22px;">Voyage Itinerary</h3>
            <div class="timeline">
              <div class="timeline-item">
                <span class="timeline-dot"></span>
                <div class="timeline-content" style="background: rgba(255,255,255,0.02);">
                  <span class="timeline-date">Day 1 | Departure</span>
                  <h4>Boarding at ${schedule.route.source_port}</h4>
                  <p style="color:var(--neutral-silver); font-size:13px; margin-top:5px;">Embarkation commences at 12:00 PM. Welcoming drinks on the Sunset Deck, followed by luxury orientation briefings and departure.</p>
                </div>
              </div>
              <div class="timeline-item">
                <span class="timeline-dot"></span>
                <div class="timeline-content" style="background: rgba(255,255,255,0.02);">
                  <span class="timeline-date">Days 2 - ${schedule.duration_days - 1} | Sailing</span>
                  <h4>Voyaging Across the High Seas</h4>
                  <p style="color:var(--neutral-silver); font-size:13px; margin-top:5px;">Sailing the deep navy currents. Indulge in Michelin fine dining, spa therapy, ocean view lounges, and exclusive onboard concerts.</p>
                </div>
              </div>
              <div class="timeline-item">
                <span class="timeline-dot" class="completed"></span>
                <div class="timeline-content" style="background: rgba(255,255,255,0.02);">
                  <span class="timeline-date">Day ${schedule.duration_days} | Arrival</span>
                  <h4>Port Entry at ${schedule.route.destination_port}</h4>
                  <p style="color:var(--neutral-silver); font-size:13px; margin-top:5px;">Anchor at the destination harbor at 07:00 AM. Breakfast served till 10:00 AM prior to disembarkation.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Amenities Checklist -->
          <div class="glass-panel">
            <h3 style="margin-bottom: 15px;">Five-Star Amenities</h3>
            <div class="amenities-icons">
              <div class="amenity-tag"><i class="fa-solid fa-wifi"></i><span>Satellite Wi-Fi</span></div>
              <div class="amenity-tag"><i class="fa-solid fa-spa"></i><span>Aura Ocean Spa</span></div>
              <div class="amenity-tag"><i class="fa-solid fa-person-swimming"></i><span>Infinity Pools</span></div>
              <div class="amenity-tag"><i class="fa-solid fa-martini-glass"></i><span>Skyline Bar</span></div>
              <div class="amenity-tag"><i class="fa-solid fa-dumbbell"></i><span>Fitness Center</span></div>
              <div class="amenity-tag"><i class="fa-solid fa-clapperboard"></i><span>Open Cinema</span></div>
            </div>
          </div>

        </div>

        <!-- Sticky Right Side Booking Widget -->
        <div class="booking-summary-widget glass-panel">
          <h3>Your Journey</h3>
          
          <div style="margin-bottom: 25px;">
            <label style="font-size:11px; font-weight:600; text-transform:uppercase; color: var(--accent-gold); display:block; margin-bottom:8px;">Passenger Count</label>
            <select id="widget-passengers" class="form-control" style="background: rgba(8,26,46,0.6);">
              <option value="1" ${guestCount(1)}>1 Guest</option>
              <option value="2" ${guestCount(2)}>2 Guests</option>
              <option value="3" ${guestCount(3)}>3 Guests</option>
              <option value="4" ${guestCount(4)}>4 Guests</option>
            </select>
          </div>

          <div id="booking-summary-widget-content">
            <!-- Rendered by updateBookingSummaryWidget -->
          </div>
        </div>

      </div>
    </section>
  `;

  function guestCount(n) {
    return selection.passengers === n ? 'selected' : '';
  }

  // Bind cabin card selection clicks
  document.querySelectorAll('.select-cabin-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      selection.cabinType = type;
      renderShipDetail(params); // Re-render to show updated borders
    });
  });

  // Bind passenger count change in widget
  document.getElementById('widget-passengers').addEventListener('change', (e) => {
    selection.passengers = parseInt(e.target.value);
    updateBookingSummaryWidget();
  });

  // Init summary calculations
  updateBookingSummaryWidget();
};

// 4. Booking View (Checkout)
const renderBooking = async (params, queryParams) => {
  const app = document.getElementById('app');
  
  // Guard auth status
  const user = getLoggedInUser();
  if (!user) {
    alert("Please sign in or register to secure your luxury booking stateroom reservation.");
    window.location.hash = `#login?redirect=booking&schedule_id=${queryParams.schedule_id}&cabin=${encodeURIComponent(queryParams.cabin)}&passengers=${queryParams.passengers}`;
    return;
  }

  const scheduleId = queryParams.schedule_id;
  const schedule = await OceanAuraAPI.getSchedule(scheduleId);
  const cabinType = queryParams.cabin || 'Suite';
  const passengerCount = parseInt(queryParams.passengers || '1');

  if (!schedule) {
    app.innerHTML = `<div class="glass-panel" style="margin: 100px auto; max-width: 500px; text-align: center;">
      <h2 style="color: var(--accent-orange);">Booking Missing Itinerary Details</h2>
      <a href="#cruises" class="btn-primary">View Cruises</a>
    </div>`;
    return;
  }

  // Multiplier mapping
  const cabinNameMap = {
    'Suite': { name: 'Ocean View Suite', mult: 1.5 },
    'VIP Cabin': { name: 'VIP Owner Suite', mult: 2.5 },
    'Deluxe': { name: 'Deluxe Stateroom', mult: 1.0 },
    'Economy': { name: 'Interior Cabin', mult: 0.7 }
  };
  const cabMeta = cabinNameMap[cabinType] || { name: 'Standard Suite', mult: 1.0 };
  const costPerGuest = parseFloat(schedule.ship.base_fare) * cabMeta.mult;
  const subtotal = costPerGuest * passengerCount;
  const taxes = subtotal * 0.12;
  const grandTotal = subtotal + taxes;

  app.innerHTML = `
    <section style="min-height: 100vh; padding-top: 130px;">
      <div class="section-header">
        <h2>Secure <span>Reservation</span></h2>
        <p>Enter guest passport and itinerary information to initialize boarding pass credentials.</p>
      </div>

      <div class="checkout-container">
        
        <!-- Left Side: Guest Info Form -->
        <div class="glass-panel">
          <h3 style="margin-bottom: 20px; font-size: 22px;">Guest Manifest</h3>
          
          <form id="booking-manifest-form">
            <!-- Lead Guest (Primary User) -->
            <div style="border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 20px; margin-bottom: 20px;">
              <h4 style="color: var(--accent-gold); margin-bottom: 15px; font-size:16px;">Lead Passenger (Guest 1)</h4>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div class="form-group">
                  <label>Full Name</label>
                  <input type="text" id="lead-name" class="form-control" value="${user.name}" required>
                </div>
                <div class="form-group">
                  <label>Email Address</label>
                  <input type="email" id="lead-email" class="form-control" value="${user.email}" readonly>
                </div>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="form-group">
                  <label>Phone Number</label>
                  <input type="tel" id="lead-phone" class="form-control" placeholder="+1 555-0199" required>
                </div>
                <div class="form-group">
                  <label>Passport Number</label>
                  <input type="text" id="lead-passport" class="form-control" placeholder="A12345678" required>
                </div>
              </div>
            </div>

            <!-- Additional Guests -->
            ${Array.from({ length: passengerCount - 1 }).map((_, i) => `
              <div style="border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 20px; margin-bottom: 20px;">
                <h4 style="color: var(--accent-orange); margin-bottom: 15px; font-size:16px;">Passenger ${i + 2} Details</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                  <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" class="form-control extra-name" placeholder="Guest Full Name" required>
                  </div>
                  <div class="form-group">
                    <label>Passport Number</label>
                    <input type="text" class="form-control extra-passport" placeholder="Passport Number" required>
                  </div>
                </div>
              </div>
            `).join('')}

            <button type="submit" class="btn-primary" style="margin-top: 10px; width: 100%; justify-content: center;">
              Confirm Manifest & Proceed to Payment <i class="fa-solid fa-lock"></i>
            </button>
          </form>
        </div>

        <!-- Right Side: Booking Summary & Price Breakdown -->
        <div class="glass-panel" style="height: fit-content;">
          <h3 style="margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom:10px;">Manifest Summary</h3>
          
          <div style="display: flex; gap: 15px; margin-bottom: 20px;">
            <img src="${schedule.ship.image ? `assets/${schedule.ship.image}.png` : 'assets/sovereign.png'}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: var(--glass-border);">
            <div>
              <h4 style="font-size:16px;">${schedule.ship.name}</h4>
              <p style="font-size:12px; color: var(--accent-gold);">${schedule.route.source_port} → ${schedule.route.destination_port}</p>
              <p style="font-size:12px; color: var(--neutral-silver);">${schedule.departure_date} (${schedule.duration_days} days)</p>
            </div>
          </div>

          <div class="summary-row">
            <span>Stateroom:</span>
            <strong>${cabMeta.name}</strong>
          </div>
          <div class="summary-row">
            <span>Passengers:</span>
            <span>${passengerCount} Guest(s)</span>
          </div>
          <div class="summary-row">
            <span>Cabin Rate:</span>
            <span>$${costPerGuest.toFixed(2)} per guest</span>
          </div>
          
          <div style="border-top:1px solid rgba(255,255,255,0.06); margin: 15px 0;"></div>
          
          <div class="summary-row">
            <span>Room Subtotal:</span>
            <span>$${subtotal.toFixed(2)}</span>
          </div>
          <div class="summary-row">
            <span>Luxury Port Tax:</span>
            <span>$${taxes.toFixed(2)}</span>
          </div>
          <div class="summary-row summary-total">
            <span>Grand Total:</span>
            <span>$${grandTotal.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </section>
  `;

  // Bind Form Submission
  document.getElementById('booking-manifest-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Create/Update Passenger record in database
    const passengerObj = {
      name: document.getElementById('lead-name').value,
      email: user.email,
      phone: document.getElementById('lead-phone').value,
      passport_number: document.getElementById('lead-passport').value
    };

    const passengerResult = await OceanAuraAPI.createPassenger(passengerObj);

    // Grab extra passengers details if any
    const extraNames = Array.from(document.querySelectorAll('.extra-name')).map(el => el.value);
    const extraPassports = Array.from(document.querySelectorAll('.extra-passport')).map(el => el.value);
    const extraGuestsManifest = extraNames.map((n, idx) => ({ name: n, passport: extraPassports[idx] }));

    // 2. Create Booking record
    const bookingObj = {
      passenger_id: passengerResult.id,
      schedule_id: parseInt(scheduleId),
      cabin_type: cabinType,
      passenger_count: passengerCount,
      total_fare: grandTotal.toFixed(2)
    };

    const bookingResult = await OceanAuraAPI.createBooking(bookingObj);
    
    // Redirect to payments page
    window.location.hash = `#/payment?booking_id=${bookingResult.id}`;
  });
};

// 5. Payment View
const renderPayment = async (params, queryParams) => {
  const app = document.getElementById('app');
  const bookingId = queryParams.booking_id;
  const bookings = await OceanAuraAPI.getBookings();
  const booking = bookings.find(b => b.id == bookingId);

  if (!booking) {
    app.innerHTML = `<div class="glass-panel" style="margin: 100px auto; max-width: 500px; text-align: center;">
      <h2 style="color: var(--accent-orange);">Booking ID Missing</h2>
      <a href="#home" class="btn-primary">Return Home</a>
    </div>`;
    return;
  }

  app.innerHTML = `
    <section style="min-height: 100vh; padding-top: 130px;">
      <div class="section-header">
        <h2>Secure <span>Payment Gateway</span></h2>
        <p>Complete payment authorization to validate your boarding pass credentials.</p>
      </div>

      <div class="checkout-container" style="max-width: 900px; margin: 0 auto;">
        
        <!-- Left Column: Payment Form -->
        <div class="glass-panel" id="payment-box-panel">
          <h3 style="margin-bottom: 20px; font-size:22px;">Payment Methods</h3>
          
          <!-- Payment Tabs -->
          <div style="display: flex; gap: 10px; margin-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 15px; overflow-x:auto;">
            <button class="btn-primary btn-small pay-tab-btn" data-method="card" style="background: var(--gold-gradient); color: var(--bg-deep-navy);"><i class="fa-solid fa-credit-card"></i> Card</button>
            <button class="btn-secondary btn-small pay-tab-btn" data-method="upi"><i class="fa-solid fa-mobile-screen"></i> UPI / QR</button>
            <button class="btn-secondary btn-small pay-tab-btn" data-method="wallet"><i class="fa-solid fa-wallet"></i> Net Wallet</button>
            <button class="btn-secondary btn-small pay-tab-btn" data-method="netbanking"><i class="fa-solid fa-building-columns"></i> Net Banking</button>
          </div>

          <form id="payment-gateway-form">
            <div id="payment-method-fields">
              <!-- Default Card Fields -->
              <div class="form-group">
                <label>Cardholder Name</label>
                <input type="text" class="form-control" placeholder="E.g., VIP Traveller" required>
              </div>
              <div class="form-group">
                <label>Card Number</label>
                <input type="text" class="form-control" placeholder="4111 2222 3333 4444" minlength="16" maxlength="19" required>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="form-group">
                  <label>Expiry Date</label>
                  <input type="text" class="form-control" placeholder="MM/YY" maxlength="5" required>
                </div>
                <div class="form-group">
                  <label>CVV Code</label>
                  <input type="password" class="form-control" placeholder="•••" maxlength="4" required>
                </div>
              </div>
            </div>

            <button type="submit" id="payment-submit-btn" class="btn-primary" style="width: 100%; margin-top: 20px; justify-content: center;">
              Pay $${parseFloat(booking.total_fare).toLocaleString(undefined, {minimumFractionDigits: 2})} Now <i class="fa-solid fa-shield-halved"></i>
            </button>
          </form>
        </div>

        <!-- Right Column: Quick Summary -->
        <div class="glass-panel" style="height: fit-content;">
          <h3 style="margin-bottom: 15px; font-size:18px;">Reservation Details</h3>
          <div style="display: flex; flex-direction:column; gap: 12px; font-size: 14px;">
            <div class="summary-row">
              <span>Vessel:</span>
              <strong>${booking.schedule.ship.name}</strong>
            </div>
            <div class="summary-row">
              <span>Route:</span>
              <span>${booking.schedule.route.source_port} to ${booking.schedule.route.destination_port}</span>
            </div>
            <div class="summary-row">
              <span>Departure:</span>
              <span>${booking.schedule.departure_date}</span>
            </div>
            <div class="summary-row">
              <span>Stateroom Type:</span>
              <span>${booking.cabin_type}</span>
            </div>
            <div class="summary-row">
              <span>Guests:</span>
              <span>${booking.passenger_count} Guest(s)</span>
            </div>
            <div class="summary-row summary-total" style="border-top:1px solid rgba(255,255,255,0.06); padding-top:12px;">
              <span>Amount Due:</span>
              <strong style="color: var(--accent-gold); font-size:18px;">$${parseFloat(booking.total_fare).toLocaleString()}</strong>
            </div>
          </div>
        </div>

      </div>
    </section>
  `;

  // Bind tab toggles
  let selectedMethod = 'Credit Card';
  const fieldsContainer = document.getElementById('payment-method-fields');
  
  document.querySelectorAll('.pay-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.pay-tab-btn').forEach(b => {
        b.className = 'btn-secondary btn-small pay-tab-btn';
      });
      btn.className = 'btn-primary btn-small pay-tab-btn';
      
      const method = btn.getAttribute('data-method');
      if (method === 'card') {
        selectedMethod = 'Credit Card';
        fieldsContainer.innerHTML = `
          <div class="form-group">
            <label>Cardholder Name</label>
            <input type="text" class="form-control" placeholder="E.g., VIP Traveller" required>
          </div>
          <div class="form-group">
            <label>Card Number</label>
            <input type="text" class="form-control" placeholder="4111 2222 3333 4444" required>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div class="form-group">
              <label>Expiry Date</label>
              <input type="text" class="form-control" placeholder="MM/YY" required>
            </div>
            <div class="form-group">
              <label>CVV Code</label>
              <input type="password" class="form-control" placeholder="•••" required>
            </div>
          </div>
        `;
      } else if (method === 'upi') {
        selectedMethod = 'UPI';
        fieldsContainer.innerHTML = `
          <div class="form-group" style="text-align:center; padding: 15px 0;">
            <i class="fa-solid fa-qrcode" style="font-size: 80px; color: var(--accent-gold); margin-bottom: 15px; display:block;"></i>
            <p style="font-size: 13px; color: var(--neutral-silver); margin-bottom: 20px;">Scan QR with UPI Application or enter Virtual Payment Address.</p>
          </div>
          <div class="form-group">
            <label>UPI ID (VPA)</label>
            <input type="text" class="form-control" placeholder="username@bank" required>
          </div>
        `;
      } else if (method === 'wallet') {
        selectedMethod = 'Wallet';
        fieldsContainer.innerHTML = `
          <div class="form-group">
            <label>Choose Wallet Provider</label>
            <select class="form-control" style="background: rgba(8,26,46,0.6);" required>
              <option value="apple">Apple Pay</option>
              <option value="paypal">PayPal</option>
              <option value="gpay">Google Pay</option>
              <option value="amazon">Amazon Pay</option>
            </select>
          </div>
        `;
      } else if (method === 'netbanking') {
        selectedMethod = 'Net Banking';
        fieldsContainer.innerHTML = `
          <div class="form-group">
            <label>Select Financial Institution</label>
            <select class="form-control" style="background: rgba(8,26,46,0.6);" required>
              <option value="chase">Chase Bank</option>
              <option value="hsb">HSBC Premium</option>
              <option value="barclays">Barclays Wealth</option>
              <option value="icici">ICICI Private Banking</option>
            </select>
          </div>
        `;
      }
    });
  });

  // Bind Form Submit (Process Transaction)
  document.getElementById('payment-gateway-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('payment-submit-btn');
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Processing Secure Escrow...`;

    // Wait 2 seconds to simulate high-end transaction
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Submit payment API
    const paymentObj = {
      booking_id: booking.id,
      amount: booking.total_fare,
      payment_method: selectedMethod,
      transaction_id: 'TXN_' + Math.floor(Math.random() * 89999999 + 10000000),
      status: 'success'
    };

    await OceanAuraAPI.createPayment(paymentObj);

    // Trigger Success Screen inside panel
    triggerConfetti();
    const pBox = document.getElementById('payment-box-panel');
    pBox.innerHTML = `
      <div style="text-align: center; padding: 40px 10px;">
        <div style="width: 70px; height:70px; border-radius:50%; background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); display:flex; justify-content:center; align-items:center; margin: 0 auto 20px; font-size:32px; color: #10B981; animation: scaleUp 0.5s ease;">
          <i class="fa-solid fa-check"></i>
        </div>
        <h2 style="font-size:30px; margin-bottom: 10px;">Voyage Confirmed</h2>
        <p style="color: var(--neutral-silver); font-size:14px; max-width:400px; margin: 0 auto 30px;">Your stateroom reservation is fully funded. A receipt and confirmation has been dispatched to your email manifest.</p>
        
        <div style="display:flex; justify-content:center; gap: 15px; margin-top:20px;">
          <button id="download-tix-btn" class="btn-primary"><i class="fa-solid fa-download"></i> Boarding Pass</button>
          <a href="#dashboard" class="btn-secondary">Go to Dashboard</a>
        </div>
      </div>
    `;

    // Bind Boarding Pass Modal trigger
    document.getElementById('download-tix-btn').addEventListener('click', () => {
      openBoardingPassModal(booking, paymentObj.transaction_id);
    });
  });
};

// Boarding Pass Modal Maker
const openBoardingPassModal = (booking, txId) => {
  const content = `
    <div style="text-align: center; padding: 10px 0;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px dashed rgba(255,255,255,0.15); padding-bottom: 20px; margin-bottom: 20px;">
        <h2 style="font-size: 26px; text-align: left;"><span>Ocean</span>Aura</h2>
        <span style="font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:var(--accent-gold); border: 1px solid var(--accent-gold); padding: 4px 10px; border-radius:4px; font-weight:700;">BOARDING PASS</span>
      </div>
      
      <div style="display:grid; grid-template-columns: 2fr 1fr; text-align:left; gap: 20px; margin-bottom:20px;">
        <div>
          <label style="font-size:9px; font-weight:600; text-transform:uppercase; color:var(--accent-gold); display:block; margin-bottom:4px;">Passenger Manifest Name</label>
          <h4 style="font-size:18px; margin-bottom:12px;">${booking.passenger.name}</h4>
          
          <div style="display:grid; grid-template-columns:1fr 1fr; gap: 10px;">
            <div>
              <label style="font-size:9px; text-transform:uppercase; color:var(--neutral-silver);">Departure Date</label>
              <div style="font-size:13px; font-weight:600;">${booking.schedule.departure_date}</div>
            </div>
            <div>
              <label style="font-size:9px; text-transform:uppercase; color:var(--neutral-silver);">Stateroom Class</label>
              <div style="font-size:13px; font-weight:600; color:var(--accent-orange);">${booking.cabin_type}</div>
            </div>
          </div>
        </div>
        
        <div style="text-align:right;">
          <label style="font-size:9px; text-transform:uppercase; color:var(--neutral-silver); display:block; margin-bottom:4px;">Stateroom Code</label>
          <div style="font-size:24px; font-family:'Playfair Display', serif; font-weight:700; color:var(--neutral-white);">A-${Math.floor(Math.random() * 80 + 10)}</div>
          
          <label style="font-size:9px; text-transform:uppercase; color:var(--neutral-silver); display:block; margin-top:12px; margin-bottom:4px;">Booking ID</label>
          <div style="font-size:12px; font-weight:600; color:var(--accent-gold);">#OA-${booking.id}</div>
        </div>
      </div>

      <div style="text-align:left; border-top:1px solid rgba(255,255,255,0.06); padding-top:15px; margin-bottom: 20px;">
        <div class="summary-row">
          <span>Vessel:</span>
          <strong>${booking.schedule.ship.name}</strong>
        </div>
        <div class="summary-row">
          <span>Voyage Ports:</span>
          <span>${booking.schedule.route.source_port} to ${booking.schedule.route.destination_port}</span>
        </div>
        <div class="summary-row">
          <span>Escrow Transaction:</span>
          <span style="font-family:monospace; font-size:11px;">${txId || 'TXN_47823942'}</span>
        </div>
      </div>

      <div style="background: rgba(255,255,255,0.03); border: var(--glass-border); padding: 15px; border-radius: 8px; display:flex; align-items:center; justify-content:space-between;">
        <div style="text-align:left;">
          <h5 style="color:var(--accent-gold); font-size:13px; margin-bottom:4px;">QR Gate Entry</h5>
          <p style="font-size:11px; color:var(--neutral-silver);">Present this QR stateroom badge at check-in.</p>
        </div>
        <i class="fa-solid fa-qrcode" style="font-size: 50px; color: var(--neutral-white);"></i>
      </div>
      
      <button onclick="window.print()" class="btn-primary btn-small" style="margin-top:20px; width: 100%; justify-content:center;"><i class="fa-solid fa-print"></i> Print Boarding Pass</button>
    </div>
  `;
  openModal(content);
};

// 6. Passenger Dashboard View
const renderDashboard = async () => {
  const app = document.getElementById('app');
  const user = getLoggedInUser();

  if (!user) {
    window.location.hash = '#login?redirect=dashboard';
    return;
  }

  // Fetch bookings for this specific user
  const allBookings = await OceanAuraAPI.getBookings();
  const userBookings = allBookings.filter(b => b.passenger && b.passenger.email.toLowerCase() === user.email.toLowerCase());

  // Aggregate Stats
  const totalBookings = userBookings.length;
  const upcomingJourneys = userBookings.filter(b => b.status === 'confirmed' && new Date(b.schedule.departure_date) > new Date()).length;
  const completedTrips = userBookings.filter(b => b.status === 'confirmed' && new Date(b.schedule.return_date) < new Date()).length;
  const totalAmountPaid = userBookings.reduce((sum, b) => b.status === 'confirmed' ? sum + parseFloat(b.total_fare) : sum, 0);

  // Favorite destination calculations
  let favoriteDest = 'Maldives';
  if (totalBookings > 0) {
    const destCounts = {};
    userBookings.forEach(b => {
      const dest = b.schedule.route.destination_port;
      destCounts[dest] = (destCounts[dest] || 0) + 1;
    });
    favoriteDest = Object.keys(destCounts).reduce((a, b) => destCounts[a] > destCounts[b] ? a : b);
  }

  app.innerHTML = `
    <section style="min-height: 100vh; padding-top: 130px;">
      <div class="section-header" style="text-align: left; margin-bottom: 40px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap: 15px;">
        <div>
          <span style="font-size:12px; text-transform:uppercase; color: var(--accent-gold); font-weight:700; letter-spacing:0.15em;">Welcome back</span>
          <h2 style="font-size:36px; margin-top:5px;">${user.name}</h2>
        </div>
        <a href="#cruises" class="btn-primary">Book New Voyage <i class="fa-solid fa-compass"></i></a>
      </div>

      <!-- Stat Cards -->
      <div class="dashboard-grid">
        <div class="stat-card glass-panel">
          <div class="stat-value">${totalBookings}</div>
          <div class="stat-label">Total Bookings</div>
        </div>
        <div class="stat-card glass-panel">
          <div class="stat-value">${upcomingJourneys}</div>
          <div class="stat-label">Upcoming Journeys</div>
        </div>
        <div class="stat-card glass-panel">
          <div class="stat-value">${completedTrips}</div>
          <div class="stat-label">Completed Voyages</div>
        </div>
        <div class="stat-card glass-panel">
          <div class="stat-value">$${totalAmountPaid.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
          <div class="stat-label">Total Paid</div>
        </div>
        <div class="stat-card glass-panel">
          <div class="stat-value" style="font-size: 24px; line-height: 1.35; padding: 5px 0;">${favoriteDest}</div>
          <div class="stat-label">Preferred Port</div>
        </div>
      </div>

      <!-- Charts & Timeline Grid -->
      <div class="charts-row">
        <!-- Spending Graph -->
        <div class="glass-panel">
          <h3 style="margin-bottom: 20px; font-size:20px;">Expense Analytics</h3>
          <p style="font-size:12px; color:var(--neutral-silver);">Your ocean voyage investments catalogued by cabin type ($ USD).</p>
          
          <div class="chart-bar-container">
            ${[
              { label: 'Owner VIP Suite', amt: userBookings.filter(b => b.cabin_type === 'VIP Cabin' && b.status === 'confirmed').reduce((sum, b) => sum + parseFloat(b.total_fare), 0) },
              { label: 'Ocean View Suite', amt: userBookings.filter(b => b.cabin_type === 'Suite' && b.status === 'confirmed').reduce((sum, b) => sum + parseFloat(b.total_fare), 0) },
              { label: 'Deluxe Stateroom', amt: userBookings.filter(b => b.cabin_type === 'Deluxe' && b.status === 'confirmed').reduce((sum, b) => sum + parseFloat(b.total_fare), 0) },
              { label: 'Interior Cabin', amt: userBookings.filter(b => b.cabin_type === 'Economy' && b.status === 'confirmed').reduce((sum, b) => sum + parseFloat(b.total_fare), 0) }
            ].map(item => {
              const maxAmt = totalAmountPaid > 0 ? totalAmountPaid : 1;
              const fillPct = Math.round((item.amt / maxAmt) * 100);
              return `
                <div class="chart-bar-item">
                  <div class="chart-label">${item.label}</div>
                  <div class="chart-track">
                    <div class="chart-fill animate-chart-fill" data-width="${fillPct}%"></div>
                  </div>
                  <div class="chart-value">$${item.amt.toLocaleString(undefined, {maximumFractionDigits:0})}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Destination Rankings -->
        <div class="glass-panel">
          <h3 style="margin-bottom: 15px; font-size:20px;">Favorite Harbors</h3>
          <ul style="list-style:none; display:flex; flex-direction:column; gap:12px; font-size:14px; margin-top:20px;">
            <li style="display:flex; justify-content:space-between; align-items:center; padding: 10px; border-bottom:1px solid rgba(255,255,255,0.04);">
              <span>1. Maldives</span>
              <strong style="color:var(--accent-gold);">5-Star Rated</strong>
            </li>
            <li style="display:flex; justify-content:space-between; align-items:center; padding: 10px; border-bottom:1px solid rgba(255,255,255,0.04);">
              <span>2. Lakshadweep</span>
              <strong style="color:var(--accent-orange);">Exquisite</strong>
            </li>
            <li style="display:flex; justify-content:space-between; align-items:center; padding: 10px;">
              <span>3. Port Blair</span>
              <strong style="color:var(--accent-amber);">Pristine</strong>
            </li>
          </ul>
        </div>
      </div>

      <!-- Booking History List -->
      <div class="glass-panel">
        <h3 style="margin-bottom: 25px; font-size:22px;">My Sailing Timeline</h3>
        
        ${userBookings.length === 0 ? `
          <div style="text-align: center; padding: 30px 0;">
            <p style="color: var(--neutral-silver);">No stateroom manifests found. Initialize your first cruise to log details here.</p>
            <a href="#cruises" class="btn-primary" style="margin-top: 15px;">Discover Cruises</a>
          </div>
        ` : `
          <div class="timeline" style="margin-left: 10px;">
            ${userBookings.map(b => {
              let dotClass = '';
              if (b.status === 'confirmed') dotClass = 'completed';
              if (b.status === 'cancelled') dotClass = 'cancelled';
              
              return `
                <div class="timeline-item">
                  <span class="timeline-dot ${dotClass}"></span>
                  <div class="timeline-content glass-panel" style="margin-left: 15px; padding: 20px;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap: 10px;">
                      <div>
                        <span class="timeline-date">${b.schedule.departure_date} (${b.schedule.duration_days} Days)</span>
                        <h4 style="font-size:18px; margin-top:5px;">${b.schedule.ship.name}</h4>
                        <p style="font-size:13px; color:var(--accent-gold); font-weight:600; margin-top:4px;">
                          ${b.schedule.route.source_port} to ${b.schedule.route.destination_port}
                        </p>
                        <p style="font-size:12px; color:var(--neutral-silver); margin-top:5px;">
                          Stateroom: ${b.cabin_type} Class • ${b.passenger_count} Passenger(s)
                        </p>
                      </div>
                      
                      <div style="text-align:right; display:flex; flex-direction:column; align-items:flex-end; gap: 10px;">
                        <span class="status-badge ${b.status}">${b.status}</span>
                        <strong style="color:var(--neutral-white); font-size:16px;">$${parseFloat(b.total_fare).toLocaleString()}</strong>
                        ${b.status === 'confirmed' ? `
                          <button class="btn-primary btn-small download-pass-btn" data-id="${b.id}" style="padding: 5px 12px; font-size:11px;">
                            <i class="fa-solid fa-qrcode"></i> Boarding Pass
                          </button>
                        ` : b.status === 'pending' ? `
                          <a href="#/payment?booking_id=${b.id}" class="btn-primary btn-small" style="padding: 5px 12px; font-size:11px; background:var(--accent-orange);">
                            Pay Invoice
                          </a>
                        ` : ''}
                      </div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    </section>
  `;

  // Bind boarding pass triggers
  document.querySelectorAll('.download-pass-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const bId = btn.getAttribute('data-id');
      const targetB = userBookings.find(bk => bk.id == bId);
      if (targetB) {
        openBoardingPassModal(targetB, 'TXN_' + Math.floor(Math.random() * 89999999 + 10000000));
      }
    });
  });

  // Animate dashboard charts
  setTimeout(() => {
    document.querySelectorAll('.animate-chart-fill').forEach(el => {
      const finalW = el.getAttribute('data-width');
      el.style.width = finalW;
    });
  }, 100);
};

// 7. Booking Timeline View (Direct link to manifest lists)
const renderBookings = async () => {
  await renderDashboard(); // Map timeline direct to dashboard dashboard manifest module
};

// 8. Admin Dashboard View
const renderAdmin = async () => {
  const app = document.getElementById('app');
  
  // Renders the admin container
  app.innerHTML = `
    <section style="min-height: 100vh; padding-top: 130px;">
      <div class="section-header" style="text-align:left; margin-bottom:40px;">
        <h2>Fleet & Booking <span>Control Center</span></h2>
        <p>Manage passenger rosters, vessel assets, voyage schedules, and financial transactions.</p>
      </div>

      <!-- Tab Buttons -->
      <div style="display:flex; gap:10px; margin-bottom:30px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:15px; overflow-x:auto;">
        <button class="btn-primary btn-small admin-tab-btn" data-tab="bookings"><i class="fa-solid fa-ticket"></i> Bookings</button>
        <button class="btn-secondary btn-small admin-tab-btn" data-tab="ships"><i class="fa-solid fa-ship"></i> Ships</button>
        <button class="btn-secondary btn-small admin-tab-btn" data-tab="passengers"><i class="fa-solid fa-users"></i> Passengers</button>
        <button class="btn-secondary btn-small admin-tab-btn" data-tab="routes"><i class="fa-solid fa-route"></i> Routes</button>
        <button class="btn-secondary btn-small admin-tab-btn" data-tab="schedules"><i class="fa-solid fa-calendar"></i> Schedules</button>
        <button class="btn-secondary btn-small admin-tab-btn" data-tab="payments"><i class="fa-solid fa-credit-card"></i> Payments</button>
      </div>

      <div id="admin-table-content">
        <!-- Rendered dynamically by loadAdminTab() -->
      </div>
    </section>
  `;

  // Bind tabs
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.admin-tab-btn').forEach(b => {
        b.className = 'btn-secondary btn-small admin-tab-btn';
      });
      btn.className = 'btn-primary btn-small admin-tab-btn';
      const tab = btn.getAttribute('data-tab');
      loadAdminTab(tab);
    });
  });

  // Default tab load
  loadAdminTab('bookings');
};

const loadAdminTab = async (tab) => {
  const container = document.getElementById('admin-table-content');
  if (!container) return;

  container.innerHTML = `<div style="text-align:center; padding: 40px;"><i class="fa-solid fa-circle-notch fa-spin" style="font-size:30px; color:var(--accent-gold);"></i> Loading Ledger Data...</div>`;

  if (tab === 'bookings') {
    const list = await OceanAuraAPI.getBookings();
    container.innerHTML = `
      <div class="admin-section">
        <div class="admin-header-actions">
          <h3 style="font-size:22px;">Booking Records</h3>
          <button id="admin-add-booking" class="btn-primary btn-small"><i class="fa-solid fa-plus"></i> Manual Booking</button>
        </div>
        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Passenger</th>
                <th>Vessel</th>
                <th>Ports</th>
                <th>Cabin</th>
                <th>Fare</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(b => `
                <tr>
                  <td><strong>#OA-${b.id}</strong></td>
                  <td>${b.passenger ? b.passenger.name : 'Unknown'}<br><span style="font-size:11px; opacity:0.6;">${b.passenger ? b.passenger.email : ''}</span></td>
                  <td>${b.schedule ? b.schedule.ship.name : 'N/A'}</td>
                  <td>${b.schedule ? `${b.schedule.route.source_port} to ${b.schedule.route.destination_port}` : 'N/A'}</td>
                  <td>${b.cabin_type}</td>
                  <td><strong>$${parseFloat(b.total_fare).toLocaleString()}</strong></td>
                  <td><span class="status-badge ${b.status}">${b.status}</span></td>
                  <td class="admin-actions">
                    <button class="admin-btn edit-booking-btn" data-id="${b.id}" title="Edit Booking"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="admin-btn delete delete-booking-btn" data-id="${b.id}" title="Delete Booking"><i class="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Bind manually adding booking mock
    document.getElementById('admin-add-booking').addEventListener('click', () => {
      alert("Manual Booking creation is supported. Create bookings on behalf of passengers using the client checkout route by logging in as the passenger.");
    });

    // Bind Edit Action (Toggle status cancelled/confirmed)
    document.querySelectorAll('.edit-booking-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const bId = btn.getAttribute('data-id');
        const b = list.find(bk => bk.id == bId);
        if (b) {
          const nextStatus = b.status === 'confirmed' ? 'cancelled' : 'confirmed';
          if (confirm(`Alter status of Booking #OA-${b.id} to '${nextStatus.toUpperCase()}'?`)) {
            await OceanAuraAPI.updateBooking(bId, { status: nextStatus });
            loadAdminTab('bookings');
          }
        }
      });
    });

    // Bind Delete Action
    document.querySelectorAll('.delete-booking-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const bId = btn.getAttribute('data-id');
        if (confirm(`Permanently purge Booking #OA-${bId} from the database?`)) {
          await OceanAuraAPI.deleteBooking(bId);
          loadAdminTab('bookings');
        }
      });
    });

  } else if (tab === 'ships') {
    const list = await OceanAuraAPI.getShips();
    container.innerHTML = `
      <div class="admin-section">
        <div class="admin-header-actions">
          <h3 style="font-size:22px;">Vessel Fleet</h3>
          <button id="admin-add-ship" class="btn-primary btn-small"><i class="fa-solid fa-plus"></i> Launch Yacht</button>
        </div>
        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ship Name</th>
                <th>Type</th>
                <th>Operator</th>
                <th>Capacity</th>
                <th>Base Fare</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(s => `
                <tr>
                  <td><strong>#SH-${s.id}</strong></td>
                  <td><strong>${s.name}</strong></td>
                  <td>${s.ship_type}</td>
                  <td>${s.operator}</td>
                  <td>${s.capacity} Guests</td>
                  <td><strong>$${parseFloat(s.base_fare).toLocaleString()}</strong></td>
                  <td><i class="fa-solid fa-star" style="color:var(--accent-gold);"></i> ${s.rating}</td>
                  <td class="admin-actions">
                    <button class="admin-btn edit-ship-btn" data-id="${s.id}"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="admin-btn delete delete-ship-btn" data-id="${s.id}"><i class="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Add Ship
    document.getElementById('admin-add-ship').addEventListener('click', () => {
      const modalHtml = `
        <h3 style="margin-bottom: 20px; font-size: 22px;">Launch Luxury Yacht</h3>
        <form id="add-ship-form" style="display: flex; flex-direction: column; gap: 15px;">
          <div class="form-group">
            <label>Yacht Name</label>
            <input type="text" id="add-ship-name" class="form-control" placeholder="E.g., Starlight Crest" required>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div class="form-group">
              <label>Class/Type</label>
              <input type="text" id="add-ship-type" class="form-control" placeholder="E.g., Superyacht" required>
            </div>
            <div class="form-group">
              <label>Operator</label>
              <input type="text" id="add-ship-op" class="form-control" placeholder="OceanAura Elite" required>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div class="form-group">
              <label>Capacity</label>
              <input type="number" id="add-ship-capacity" class="form-control" value="800" required>
            </div>
            <div class="form-group">
              <label>Base Fare ($)</label>
              <input type="number" id="add-ship-fare" class="form-control" value="1000" required>
            </div>
          </div>
          <button type="submit" class="btn-primary" style="justify-content:center; margin-top:10px;">Commission Vessel</button>
        </form>
      `;
      openModal(modalHtml);
      
      document.getElementById('add-ship-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
          name: document.getElementById('add-ship-name').value,
          ship_type: document.getElementById('add-ship-type').value,
          operator: document.getElementById('add-ship-op').value,
          capacity: parseInt(document.getElementById('add-ship-capacity').value),
          base_fare: parseFloat(document.getElementById('add-ship-fare').value).toFixed(2),
          rating: 5.0,
          image: 'sovereign'
        };
        await OceanAuraAPI.createShip(payload);
        closeModal();
        loadAdminTab('ships');
      });
    });

    // Delete Ship
    document.querySelectorAll('.delete-ship-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const sId = btn.getAttribute('data-id');
        if (confirm("Decommission this vessel from service?")) {
          await OceanAuraAPI.deleteShip(sId);
          loadAdminTab('ships');
        }
      });
    });

  } else if (tab === 'passengers') {
    const list = await OceanAuraAPI.getPassengers();
    container.innerHTML = `
      <div class="admin-section">
        <div class="admin-header-actions">
          <h3 style="font-size:22px;">Passenger Roster</h3>
          <button id="admin-add-passenger" class="btn-primary btn-small"><i class="fa-solid fa-plus"></i> Add Guest</button>
        </div>
        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email Address</th>
                <th>Phone</th>
                <th>Passport</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(p => `
                <tr>
                  <td><strong>#PA-${p.id}</strong></td>
                  <td><strong>${p.name}</strong></td>
                  <td>${p.email}</td>
                  <td>${p.phone}</td>
                  <td><span style="font-family:monospace;">${p.passport_number}</span></td>
                  <td class="admin-actions">
                    <button class="admin-btn edit-passenger-btn" data-id="${p.id}"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="admin-btn delete delete-passenger-btn" data-id="${p.id}"><i class="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Add Passenger Form
    document.getElementById('admin-add-passenger').addEventListener('click', () => {
      const modalHtml = `
        <h3 style="margin-bottom: 20px; font-size: 22px;">Add Passenger Account</h3>
        <form id="add-passenger-form" style="display: flex; flex-direction: column; gap: 15px;">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" id="add-p-name" class="form-control" placeholder="Guest Name" required>
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" id="add-p-email" class="form-control" placeholder="guest@mail.com" required>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div class="form-group">
              <label>Phone Number</label>
              <input type="text" id="add-p-phone" class="form-control" placeholder="+1 555-0000" required>
            </div>
            <div class="form-group">
              <label>Passport Number</label>
              <input type="text" id="add-p-passport" class="form-control" placeholder="US123456" required>
            </div>
          </div>
          <button type="submit" class="btn-primary" style="justify-content:center; margin-top:10px;">Insert Guest Profile</button>
        </form>
      `;
      openModal(modalHtml);

      document.getElementById('add-passenger-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
          name: document.getElementById('add-p-name').value,
          email: document.getElementById('add-p-email').value,
          phone: document.getElementById('add-p-phone').value,
          passport_number: document.getElementById('add-p-passport').value
        };
        await OceanAuraAPI.createPassenger(payload);
        closeModal();
        loadAdminTab('passengers');
      });
    });

    // Delete Passenger
    document.querySelectorAll('.delete-passenger-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const pId = btn.getAttribute('data-id');
        if (confirm("Remove this passenger manifest file?")) {
          await OceanAuraAPI.deletePassenger(pId);
          loadAdminTab('passengers');
        }
      });
    });

  } else if (tab === 'routes') {
    const list = await OceanAuraAPI.getRoutes();
    container.innerHTML = `
      <div class="admin-section">
        <div class="admin-header-actions">
          <h3 style="font-size:22px;">Sailing Routes</h3>
          <button id="admin-add-route" class="btn-primary btn-small"><i class="fa-solid fa-plus"></i> Map Route</button>
        </div>
        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Departure Port</th>
                <th>Arrival Port</th>
                <th>Distance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(r => `
                <tr>
                  <td><strong>#RT-${r.id}</strong></td>
                  <td><strong>${r.source_port}</strong></td>
                  <td><strong>${r.destination_port}</strong></td>
                  <td>${r.distance} nmi (Nautical Miles)</td>
                  <td class="admin-actions">
                    <button class="admin-btn edit-route-btn" data-id="${r.id}"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="admin-btn delete delete-route-btn" data-id="${r.id}"><i class="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Map Route
    document.getElementById('admin-add-route').addEventListener('click', () => {
      const modalHtml = `
        <h3 style="margin-bottom: 20px; font-size: 22px;">Map Navigation Route</h3>
        <form id="add-route-form" style="display: flex; flex-direction: column; gap: 15px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div class="form-group">
              <label>Source Port</label>
              <input type="text" id="add-rt-src" class="form-control" placeholder="Maldives" required>
            </div>
            <div class="form-group">
              <label>Destination Port</label>
              <input type="text" id="add-rt-dst" class="form-control" placeholder="Goa" required>
            </div>
          </div>
          <div class="form-group">
            <label>Distance (nautical miles)</label>
            <input type="number" id="add-rt-dist" class="form-control" value="500" required>
          </div>
          <button type="submit" class="btn-primary" style="justify-content:center; margin-top:10px;">Route Verified</button>
        </form>
      `;
      openModal(modalHtml);

      document.getElementById('add-route-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
          source_port: document.getElementById('add-rt-src').value,
          destination_port: document.getElementById('add-rt-dst').value,
          distance: parseInt(document.getElementById('add-rt-dist').value)
        };
        await OceanAuraAPI.createRoute(payload);
        closeModal();
        loadAdminTab('routes');
      });
    });

    // Delete Route
    document.querySelectorAll('.delete-route-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const rId = btn.getAttribute('data-id');
        if (confirm("Delete route mapping? This might break existing schedule listings.")) {
          await OceanAuraAPI.deleteRoute(rId);
          loadAdminTab('routes');
        }
      });
    });

  } else if (tab === 'schedules') {
    const list = await OceanAuraAPI.getSchedules();
    const ships = await OceanAuraAPI.getShips();
    const routes = await OceanAuraAPI.getRoutes();
    
    container.innerHTML = `
      <div class="admin-section">
        <div class="admin-header-actions">
          <h3 style="font-size:22px;">Voyage Schedules</h3>
          <button id="admin-add-sched" class="btn-primary btn-small"><i class="fa-solid fa-plus"></i> Schedule Voyage</button>
        </div>
        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Vessel</th>
                <th>Route</th>
                <th>Departure Date</th>
                <th>Disembarkation</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(s => `
                <tr>
                  <td><strong>#SC-${s.id}</strong></td>
                  <td><strong>${s.ship ? s.ship.name : 'Unknown Ship'}</strong></td>
                  <td>${s.route ? `${s.route.source_port} to ${s.route.destination_port}` : 'Unknown Route'}</td>
                  <td>${s.departure_date}</td>
                  <td>${s.return_date}</td>
                  <td>${s.duration_days} Days</td>
                  <td class="admin-actions">
                    <button class="admin-btn edit-sched-btn" data-id="${s.id}"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="admin-btn delete delete-sched-btn" data-id="${s.id}"><i class="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Schedule Voyage
    document.getElementById('admin-add-sched').addEventListener('click', () => {
      const modalHtml = `
        <h3 style="margin-bottom: 20px; font-size: 22px;">Schedule Voyage</h3>
        <form id="add-sched-form" style="display: flex; flex-direction: column; gap: 15px;">
          <div class="form-group">
            <label>Assigned Yacht</label>
            <select id="add-sc-ship" class="form-control" style="background: rgba(8,26,46,0.6);" required>
              ${ships.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Mapped Navigation Route</label>
            <select id="add-sc-route" class="form-control" style="background: rgba(8,26,46,0.6);" required>
              ${routes.map(r => `<option value="${r.id}">${r.source_port} to ${r.destination_port}</option>`).join('')}
            </select>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div class="form-group">
              <label>Departure Date</label>
              <input type="date" id="add-sc-dep" class="form-control" value="2026-08-01" required>
            </div>
            <div class="form-group">
              <label>Disembarkation Date</label>
              <input type="date" id="add-sc-ret" class="form-control" value="2026-08-08" required>
            </div>
          </div>
          <button type="submit" class="btn-primary" style="justify-content:center; margin-top:10px;">Schedule Logged</button>
        </form>
      `;
      openModal(modalHtml);

      document.getElementById('add-sched-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
          ship_id: parseInt(document.getElementById('add-sc-ship').value),
          route_id: parseInt(document.getElementById('add-sc-route').value),
          departure_date: document.getElementById('add-sc-dep').value,
          return_date: document.getElementById('add-sc-ret').value
        };
        await OceanAuraAPI.createSchedule(payload);
        closeModal();
        loadAdminTab('schedules');
      });
    });

    // Delete Schedule
    document.querySelectorAll('.delete-sched-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const sId = btn.getAttribute('data-id');
        if (confirm("De-authorize schedule? Booked tickets for this schedule will need to be manual refund issues.")) {
          await OceanAuraAPI.deleteSchedule(sId);
          loadAdminTab('schedules');
        }
      });
    });

  } else if (tab === 'payments') {
    const list = await OceanAuraAPI.getPayments();
    container.innerHTML = `
      <div class="admin-section">
        <h3 style="font-size:22px; margin-bottom:10px;">Payment Ledgers</h3>
        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Booking Ref</th>
                <th>Method</th>
                <th>Amount Paid</th>
                <th>Status</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(p => `
                <tr>
                  <td><span style="font-family:monospace; font-weight:600;">${p.transaction_id}</span></td>
                  <td><strong>#OA-${p.booking_id}</strong></td>
                  <td>${p.payment_method}</td>
                  <td><strong style="color:var(--accent-gold);">$${parseFloat(p.amount).toLocaleString()}</strong></td>
                  <td><span class="status-badge confirmed">${p.status}</span></td>
                  <td>${new Date(p.created_at).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
};

// 9. Login & Register Views
const renderLogin = async (params, queryParams) => {
  const app = document.getElementById('app');
  const redirect = queryParams.redirect || 'dashboard';
  
  app.innerHTML = `
    <div class="auth-container">
      <div class="auth-card glass-panel">
        <div class="auth-header">
          <h2>Sign In</h2>
          <p>Access staterooms, boarding passes, and booking timeline.</p>
        </div>
        <form id="auth-login-form">
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" id="login-email" class="form-control" placeholder="name@domain.com" required>
          </div>
          <div class="form-group">
            <label>Security Password</label>
            <input type="password" id="login-pass" class="form-control" placeholder="••••••••" required>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; margin-top: 15px;">Authenticate</button>
        </form>
        <div class="auth-footer">
          New guest? <a href="#register?redirect=${redirect}">Create Luxury Profile</a>
        </div>
      </div>
    </div>
  `;

  document.getElementById('auth-login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    
    // Mock login profile
    const name = email.split('@')[0];
    const uppercaseName = name.charAt(0).toUpperCase() + name.slice(1);
    
    setLoggedInUser({
      name: uppercaseName + " Traveler",
      email: email
    });

    if (redirect === 'booking') {
      window.location.hash = `#/booking?schedule_id=${queryParams.schedule_id || 1}&cabin=${encodeURIComponent(queryParams.cabin || 'Suite')}&passengers=${queryParams.passengers || 2}`;
    } else {
      window.location.hash = '#dashboard';
    }
  });
};

const renderRegister = async (params, queryParams) => {
  const app = document.getElementById('app');
  const redirect = queryParams.redirect || 'dashboard';

  app.innerHTML = `
    <div class="auth-container">
      <div class="auth-card glass-panel">
        <div class="auth-header">
          <h2>Create Profile</h2>
          <p>Register guest manifest files in OceanAura directories.</p>
        </div>
        <form id="auth-register-form">
          <div class="form-group">
            <label>Full Guest Name</label>
            <input type="text" id="reg-name" class="form-control" placeholder="E.g., Lord Sterling" required>
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" id="reg-email" class="form-control" placeholder="sterling@auramail.com" required>
          </div>
          <div class="form-group">
            <label>Master Passphrase</label>
            <input type="password" id="reg-pass" class="form-control" placeholder="••••••••" required>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; margin-top: 15px;">Securize Profile</button>
        </form>
        <div class="auth-footer">
          Already registered? <a href="#login?redirect=${redirect}">Sign In</a>
        </div>
      </div>
    </div>
  `;

  document.getElementById('auth-register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;

    setLoggedInUser({ name, email });

    if (redirect === 'booking') {
      window.location.hash = `#/booking?schedule_id=${queryParams.schedule_id || 1}&cabin=${encodeURIComponent(queryParams.cabin || 'Suite')}&passengers=${queryParams.passengers || 2}`;
    } else {
      window.location.hash = '#dashboard';
    }
  });
};

// Route Registrations in Router
window.Router.addRoute('/home', renderHome);
window.Router.addRoute('/cruises', renderCruises);
window.Router.addRoute('/ship/:id', renderShipDetail);
window.Router.addRoute('/booking', renderBooking);
window.Router.addRoute('/payment', renderPayment);
window.Router.addRoute('/dashboard', renderDashboard);
window.Router.addRoute('/bookings', renderBookings);
window.Router.addRoute('/admin', renderAdmin);
window.Router.addRoute('/login', renderLogin);
window.Router.addRoute('/register', renderRegister);

// Initialize navbar links login status
updateNavbarAuth();

// If the page is already loaded, handle the route immediately
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  window.Router.handleRoute();
}

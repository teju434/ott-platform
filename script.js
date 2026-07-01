// CineStream - Interactive Streaming Client Logic

// 1. Mock Movie Database
const movieDatabase = [
  {
    id: "hero-wednesday",
    title: "Wednesday",
    description: "Smart, sarcastic and a little dead inside, Wednesday Addams investigates a murder spree while making new friends — and foes — at Nevermore Academy.",
    match: 99,
    year: 2022,
    maturity: "TV-14",
    duration: "1 Season",
    genres: ["Comedy", "Mystery", "Sci-Fi"],
    moods: ["Darkly Comic", "Sarcastic", "Quirky"],
    cast: ["Jenna Ortega", "Gwendoline Christie", "Riki Lindhome"],
    thumbnail: "https://image.tmdb.org/t/p/w500/36xXlhEpQqVVPuiZhfoQuaY4OlA.jpg",
    categories: ["tvshows", "comedy"]
  },
  {
    id: "stranger-things",
    title: "Stranger Things",
    description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
    match: 98,
    year: 2022,
    maturity: "16+",
    duration: "4 Seasons",
    genres: ["Sci-Fi", "Drama", "Mystery"],
    moods: ["Ominous", "Nostalgic", "Suspenseful"],
    cast: ["Winona Ryder", "David Harbour", "Millie Bobby Brown"],
    thumbnail: "https://image.tmdb.org/t/p/w500/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg",
    categories: ["tvshows", "horror", "scifi"]
  },
  {
    id: "squid-game",
    title: "Squid Game",
    description: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits — with deadly high stakes.",
    match: 96,
    year: 2021,
    maturity: "18+",
    duration: "2 Seasons",
    genres: ["Action", "Thriller", "Drama"],
    moods: ["Intense", "Violent", "Suspenseful"],
    cast: ["Lee Jung-jae", "Park Hae-soo", "Wi Ha-jun"],
    thumbnail: "https://image.tmdb.org/t/p/w500/2meX1nMdScFOoV4370rqHWKmXhY.jpg",
    categories: ["trending", "tvshows", "horror"]
  },
  {
    id: "money-heist",
    title: "Money Heist",
    description: "Eight thieves take hostages and lock themselves in the Royal Mint of Spain as a criminal mastermind manipulates the police to carry out his plan.",
    match: 95,
    year: 2021,
    maturity: "18+",
    duration: "5 Parts",
    genres: ["Action", "Crime", "Thriller"],
    moods: ["Suspenseful", "Exciting", "Adrenaline-fueled"],
    cast: ["Úrsula Corberó", "Álvaro Morte", "Itziar Ituño"],
    thumbnail: "https://image.tmdb.org/t/p/w500/gFZriCkpJYsApPZEF3jhxL4yLzG.jpg",
    categories: ["popular", "action", "tvshows"]
  },
  {
    id: "game-of-thrones",
    title: "Game of Thrones",
    description: "Seven noble families fight for control of the mythical land of Westeros, while an ancient enemy returns after being dormant for thousands of years.",
    match: 97,
    year: 2019,
    maturity: "18+",
    duration: "8 Seasons",
    genres: ["Fantasy", "Action", "Drama"],
    moods: ["Epic", "Violent", "Grim"],
    cast: ["Emilia Clarke", "Kit Harington", "Peter Dinklage"],
    thumbnail: "https://image.tmdb.org/t/p/w500/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg",
    categories: ["tvshows", "scifi", "toprated", "action"]
  },
  {
    id: "breaking-bad",
    title: "Breaking Bad",
    description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family's future.",
    match: 98,
    year: 2013,
    maturity: "18+",
    duration: "5 Seasons",
    genres: ["Crime", "Drama", "Thriller"],
    moods: ["Gritty", "Suspenseful", "Intense"],
    cast: ["Bryan Cranston", "Aaron Paul", "Anna Gunn"],
    thumbnail: "https://image.tmdb.org/t/p/w500/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
    categories: ["tvshows", "toprated", "popular"]
  },
  {
    id: "inception",
    title: "Inception",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    match: 96,
    year: 2010,
    maturity: "PG-13",
    duration: "2h 28m",
    genres: ["Sci-Fi", "Action", "Thriller"],
    moods: ["Mind-bending", "Suspenseful", "Visual Masterpiece"],
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
    thumbnail: "https://image.tmdb.org/t/p/w500/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    categories: ["scifi", "action", "popular"]
  },
  {
    id: "interstellar",
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    match: 98,
    year: 2014,
    maturity: "PG-13",
    duration: "2h 49m",
    genres: ["Sci-Fi", "Drama", "Adventure"],
    moods: ["Mind-bending", "Epic", "Inspiring"],
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    thumbnail: "https://image.tmdb.org/t/p/w500/pbrkL804c8yAv3zBZR4QPEafpAR.jpg",
    categories: ["scifi", "toprated"]
  },
  {
    id: "the-dark-knight",
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    match: 99,
    year: 2008,
    maturity: "PG-13",
    duration: "2h 32m",
    genres: ["Action", "Crime", "Drama"],
    moods: ["Dark", "Intense", "Gritty"],
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    thumbnail: "https://image.tmdb.org/t/p/w500/dqK9Hag1054tghRQSqLSfrkvQnA.jpg",
    categories: ["action", "toprated", "popular"]
  },
  {
    id: "avatar-water",
    title: "Avatar: The Way of Water",
    description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
    match: 94,
    year: 2022,
    maturity: "PG-13",
    duration: "3h 12m",
    genres: ["Sci-Fi", "Action", "Adventure"],
    moods: ["Visual Masterpiece", "Epic", "Exciting"],
    cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
    thumbnail: "https://image.tmdb.org/t/p/w500/58D6Z5VqT5sLw4hKkR7Wq3Qy1uY.jpg",
    categories: ["scifi", "action"]
  },
  {
    id: "peaky-blinders",
    title: "Peaky Blinders",
    description: "A gangster family epic set in 1919 Birmingham, England; centered on a gang who sew razor blades in the peaks of their caps, and their fierce boss Tommy Shelby.",
    match: 97,
    year: 2022,
    maturity: "18+",
    duration: "6 Seasons",
    genres: ["Drama", "Crime"],
    moods: ["Gritty", "Dark", "Violent"],
    cast: ["Cillian Murphy", "Paul Anderson", "Helen McCrory"],
    thumbnail: "https://image.tmdb.org/t/p/w500/7sqFEDDmK1hG5m92upolcfQxy7R.jpg",
    categories: ["trending", "tvshows"]
  },
  {
    id: "lucifer",
    title: "Lucifer",
    description: "Bored and unhappy as the Lord of Hell, Lucifer Morningstar abandons his throne and retires to Los Angeles, where he has helped the LAPD punish criminals.",
    match: 93,
    year: 2021,
    maturity: "16+",
    duration: "6 Seasons",
    genres: ["Drama", "Crime", "Fantasy"],
    moods: ["Sarcastic", "Quirky", "Charming"],
    cast: ["Tom Ellis", "Lauren German", "Kevin Alejandro"],
    thumbnail: "https://image.tmdb.org/t/p/w500/aDBRtunw49UF4XmqfyNuD9nlYIu.jpg",
    categories: ["tvshows", "comedy"]
  },
  {
    id: "black-mirror",
    title: "Black Mirror",
    description: "A sci-fi anthology series exploring a twisted, high-tech near-future where humanity's greatest innovations and darkest instincts collide.",
    match: 95,
    year: 2023,
    maturity: "18+",
    duration: "6 Seasons",
    genres: ["Sci-Fi", "Drama", "Thriller"],
    moods: ["Mind-bending", "Cynical", "Ominous"],
    cast: ["Aaron Paul", "Josh Hartnett", "Zazie Beetz"],
    thumbnail: "https://image.tmdb.org/t/p/w500/rMCew7St2vy9iV3QOPzx15sAkFJ.jpg",
    categories: ["scifi", "horror", "trending"]
  },
  {
    id: "the-witcher",
    title: "The Witcher",
    description: "Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.",
    match: 92,
    year: 2023,
    maturity: "18+",
    duration: "3 Seasons",
    genres: ["Fantasy", "Action", "Adventure"],
    moods: ["Dark", "Exciting", "Violent"],
    cast: ["Henry Cavill", "Anya Chalotra", "Freya Allan"],
    thumbnail: "https://image.tmdb.org/t/p/w500/9fwJ5ZOF14XjxDsIPDvEvnIo9r0.jpg",
    categories: ["popular", "action", "horror"]
  },
  {
    id: "glass-onion",
    title: "Glass Onion: A Knives Out Mystery",
    description: "World-famous detective Benoit Blanc heads to Greece to peel back the layers of a mystery involving a tech billionaire and his eclectic crew of friends.",
    match: 94,
    year: 2022,
    maturity: "PG-13",
    duration: "2h 19m",
    genres: ["Comedy", "Mystery", "Drama"],
    moods: ["Witty", "Quirky", "Charming"],
    cast: ["Daniel Craig", "Edward Norton", "Janelle Monáe"],
    thumbnail: "https://image.tmdb.org/t/p/w500/dKqa850uvbNSCaQCV4Im1XlzEtQ.jpg",
    categories: ["comedy", "popular"]
  },
  {
    id: "spider-verse",
    title: "Spider-Man: Into the Spider-Verse",
    description: "Teen Miles Morales becomes the Spider-Man of his universe, and must join with five spider-powered individuals from other dimensions to stop a threat for all realities.",
    match: 98,
    year: 2018,
    maturity: "PG",
    duration: "1h 57m",
    genres: ["Action", "Comedy", "Sci-Fi"],
    moods: ["Stylized", "Exciting", "Inspiring"],
    cast: ["Shameik Moore", "Jake Johnson", "Hailee Steinfeld"],
    thumbnail: "https://image.tmdb.org/t/p/w500/8mnXR9rey5uQ08rZAvzojKWbDQS.jpg",
    categories: ["action", "comedy", "toprated", "scifi"]
  },
  {
    id: "titanic",
    title: "Titanic",
    description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
    match: 95,
    year: 1997,
    maturity: "PG-13",
    duration: "3h 14m",
    genres: ["Romance", "Drama"],
    moods: ["Tragic", "Sentimental", "Romantic"],
    cast: ["Leonardo DiCaprio", "Kate Winslet", "Billy Zane"],
    thumbnail: "https://image.tmdb.org/t/p/w500/rzdPqYx7Um4FUZeD8wpXqjAUcEm.jpg",
    categories: ["romance", "toprated"]
  },
  {
    id: "la-la-land",
    title: "La La Land",
    description: "Sebastian and Mia are drawn together by their common desire to do what they love. But as success mounts they are faced with decisions that begin to fray their fragile love affair.",
    match: 96,
    year: 2016,
    maturity: "PG-13",
    duration: "2h 08m",
    genres: ["Romance", "Comedy", "Music"],
    moods: ["Bittersweet", "Charming", "Romantic"],
    cast: ["Ryan Gosling", "Emma Stone", "John Legend"],
    thumbnail: "https://image.tmdb.org/t/p/w500/9FBwqcd9IRruEDUrTdcaafOMKUq.jpg",
    categories: ["romance", "comedy", "toprated"]
  },
  {
    id: "bridgerton",
    title: "Bridgerton",
    description: "Wealth, lust, and betrayal set against the backdrop of Regency-era England, seen through the eyes of the powerful Bridgerton family.",
    match: 94,
    year: 2020,
    maturity: "18+",
    duration: "3 Seasons",
    genres: ["Romance", "Drama"],
    moods: ["Charming", "Sensual", "Scandalous"],
    cast: ["Adjoa Andoh", "Julie Andrews", "Phoebe Dynevor"],
    thumbnail: "https://image.tmdb.org/t/p/w500/m7FqiUOvsSk7Ulg2oRMfFGcLeT9.jpg",
    categories: ["tvshows", "romance"]
  },
  {
    id: "quiet-place-2",
    title: "A Quiet Place Part II",
    description: "Following the events at home, the Abbott family must now face the terrors of the outside world as they continue their fight for survival in silence.",
    match: 93,
    year: 2021,
    maturity: "PG-13",
    duration: "1h 37m",
    genres: ["Horror", "Sci-Fi", "Thriller"],
    moods: ["Tense", "Suspenseful", "Terrifying"],
    cast: ["Emily Blunt", "Cillian Murphy", "Millicent Simmonds"],
    thumbnail: "https://image.tmdb.org/t/p/w500/z2UtGA1WggESspi6KOXeo66lvLx.jpg",
    categories: ["horror", "trending"]
  },
  {
    id: "extraction-2",
    title: "Extraction 2",
    description: "Back from the brink of death, highly skilled commando Tyler Rake takes on another dangerous mission: extracting the battered family of a ruthless Georgian gangster.",
    match: 94,
    year: 2023,
    maturity: "18+",
    duration: "2h 02m",
    genres: ["Action", "Thriller"],
    moods: ["High-octane", "Violent", "Exciting"],
    cast: ["Chris Hemsworth", "Golshifteh Farahani", "Tornike Gogrichiani"],
    thumbnail: "https://image.tmdb.org/t/p/w500/61t3JtqU7lGgS6pE2stAOiGWP77.jpg",
    categories: ["action", "trending"]
  },
  {
    id: "red-notice",
    title: "Red Notice",
    description: "An FBI profiler pursuing the world's most wanted art thief becomes his reluctant partner in crime to catch an elusive crook who's always one step ahead.",
    match: 92,
    year: 2021,
    maturity: "PG-13",
    duration: "1h 57m",
    genres: ["Action", "Comedy", "Crime"],
    moods: ["Exciting", "Adrenaline-fueled", "Sarcastic"],
    cast: ["Dwayne Johnson", "Ryan Reynolds", "Gal Gadot"],
    thumbnail: "https://image.tmdb.org/t/p/w500/cinER0ESG0eJ49kXlExM0MEWGxW.jpg",
    categories: ["action", "comedy", "popular"]
  },
  {
    id: "get-out",
    title: "Get Out",
    description: "Chris and his girlfriend Rose go upstate to visit her parents for the weekend. At first, Chris reads the family's overly accommodating behavior as nervous attempts to deal with their daughter's interracial relationship, but as the weekend progresses, a series of increasingly disturbing discoveries lead him to a truth that he could never have imagined.",
    match: 97,
    year: 2017,
    maturity: "18+",
    duration: "1h 44m",
    genres: ["Horror", "Mystery", "Thriller"],
    moods: ["Intense", "Suspenseful", "Terrifying"],
    cast: ["Daniel Kaluuya", "Allison Williams", "Bradley Whitford"],
    thumbnail: "https://image.tmdb.org/t/p/w500/uWaANGQeoSs5vSP1CWtlkDrkqei.jpg",
    categories: ["horror", "trending", "toprated"]
  },
  {
    id: "the-notebook",
    title: "The Notebook",
    description: "An epic love story centered around an older man who reads aloud to a woman with Alzheimer's from a faded notebook containing the journals of their youth.",
    match: 94,
    year: 2004,
    maturity: "PG-13",
    duration: "2h 03m",
    genres: ["Romance", "Drama"],
    moods: ["Sentimental", "Romantic", "Emotional"],
    cast: ["Ryan Gosling", "Rachel McAdams", "James Garner"],
    thumbnail: "https://image.tmdb.org/t/p/w500/8SqBiesvo1rh9P1hbJTmnVum6jv.jpg",
    categories: ["romance"]
  },
  {
    id: "call-me-name",
    title: "Call Me by Your Name",
    description: "In 1980s Italy, a romance blossoms between a seventeen-year-old student and the older man hired as his father's research assistant.",
    match: 95,
    year: 2017,
    maturity: "18+",
    duration: "2h 12m",
    genres: ["Romance", "Drama"],
    moods: ["Poetic", "Bittersweet", "Romantic"],
    cast: ["Timothée Chalamet", "Armie Hammer", "Michael Stuhlbarg"],
    thumbnail: "https://image.tmdb.org/t/p/w500/e1yY59V2N9m3k7W5P71H8g6OQ2e.jpg",
    categories: ["romance"]
  },
  {
    id: "fault-stars",
    title: "The Fault in Our Stars",
    description: "Two teenage cancer patients begin a life-affirming journey to visit a reclusive author in Amsterdam, falling deeply in love along the way.",
    match: 96,
    year: 2014,
    maturity: "PG-13",
    duration: "2h 06m",
    genres: ["Romance", "Drama"],
    moods: ["Emotional", "Sentimental", "Romantic"],
    cast: ["Shailene Woodley", "Ansel Elgort", "Nat Wolff"],
    thumbnail: "https://image.tmdb.org/t/p/w500/bS4t9gYm20807b5u7256V9n02q8.jpg",
    categories: ["romance"]
  }
];

// Row mapping config
const categoriesConfig = [
  { id: "trending", title: "Trending Now" },
  { id: "popular", title: "Popular on CineStream" },
  { id: "tvshows", title: "TV Shows" },
  { id: "action", title: "Action & Adventure" },
  { id: "scifi", title: "Sci-Fi & Fantasy" },
  { id: "comedy", title: "Comedies" },
  { id: "horror", title: "Horror Thrillers" },
  { id: "romance", title: "Romances" },
  { id: "toprated", title: "Top Rated" }
];

// 2. DOM Elements
const mainHeader = document.getElementById("main-header");
const searchContainer = document.getElementById("search-container");
const searchToggleBtn = document.getElementById("search-toggle-btn");
const searchInput = document.getElementById("search-input");
const notificationsBtn = document.getElementById("notifications-btn");
const notificationsDropdown = document.getElementById("notifications-dropdown");
const profileTrigger = document.getElementById("profile-trigger");
const profileDropdown = document.getElementById("profile-dropdown");
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileNavOverlay = document.getElementById("mobile-nav-overlay");
const rowsContainer = document.getElementById("rows-container");
const heroPlayBtn = document.getElementById("hero-play-btn");
const heroInfoBtn = document.getElementById("hero-info-btn");

// Modal Elements
const detailsModal = document.getElementById("details-modal");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalBackdrop = document.getElementById("modal-backdrop");
const modalBannerImg = document.getElementById("modal-banner-img");
const modalTitle = document.getElementById("modal-title");
const modalMatch = document.getElementById("modal-match");
const modalYear = document.getElementById("modal-year");
const modalMaturity = document.getElementById("modal-maturity");
const modalDuration = document.getElementById("modal-duration");
const modalDescription = document.getElementById("modal-description");
const modalCast = document.getElementById("modal-cast");
const modalGenres = document.getElementById("modal-genres");
const modalMoods = document.getElementById("modal-moods");
const similarGrid = document.getElementById("similar-grid");

// Media Player Elements
const mediaPlayerOverlay = document.getElementById("media-player-overlay");
const playerCloseBtn = document.getElementById("player-close-btn");
const playerLoader = document.getElementById("player-loader");
const simulatedVideo = document.getElementById("simulated-video");
const playerTitle = document.getElementById("player-title");
const playerPlayToggle = document.getElementById("player-play-toggle");
const playerTimelineProgress = document.querySelector(".player-timeline-progress");

// Timeline state
let timelineInterval = null;
let playerProgressPercent = 2;
let isPlayerPlaying = true;

// 3. Navigation Scrolling
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    mainHeader.classList.add("scrolled");
  } else {
    mainHeader.classList.remove("scrolled");
  }
});

// 4. Expandable Search Bar
searchToggleBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  searchContainer.classList.add("active");
  searchInput.focus();
});

searchInput.addEventListener("click", (e) => {
  e.stopPropagation(); // Avoid collapsing search when clicking inside input
});

document.addEventListener("click", (e) => {
  // If user clicks anywhere outside search input, collapse it if empty
  if (!searchContainer.contains(e.target) && searchInput.value.trim() === "") {
    searchContainer.classList.remove("active");
  }
  
  // Close dropdowns when clicking outside
  if (!notificationsBtn.contains(e.target) && !notificationsDropdown.contains(e.target)) {
    notificationsDropdown.classList.remove("active");
  }
  if (!profileTrigger.contains(e.target) && !profileDropdown.contains(e.target)) {
    profileDropdown.classList.remove("active");
  }
});

// Notifications toggle
notificationsBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  profileDropdown.classList.remove("active");
  notificationsDropdown.classList.toggle("active");
});

// Profile avatar toggle
profileTrigger.addEventListener("click", (e) => {
  e.stopPropagation();
  notificationsDropdown.classList.remove("active");
  profileDropdown.classList.toggle("active");
});

// Mobile Hamburger toggle
mobileMenuBtn.addEventListener("click", () => {
  mobileMenuBtn.classList.toggle("active");
  mobileNavOverlay.classList.toggle("active");
  // Toggle scroll lock on body
  document.body.style.overflow = mobileNavOverlay.classList.contains("active") ? "hidden" : "";
});

// Close mobile overlay on link click
document.querySelectorAll(".mobile-nav-link").forEach(link => {
  link.addEventListener("click", () => {
    mobileMenuBtn.classList.remove("active");
    mobileNavOverlay.classList.remove("active");
    document.body.style.overflow = "";
  });
});

// Search Filtering Logic
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase().trim();
  const mainContent = document.querySelector(".main-content");
  
  // Remove existing search container if it exists
  const existingSearchOverlay = document.getElementById("search-results-overlay");
  if (existingSearchOverlay) {
    existingSearchOverlay.remove();
  }

  if (query.length > 0) {
    // Hide regular layout
    document.getElementById("hero-banner").style.display = "none";
    rowsContainer.style.display = "none";

    // Perform filter
    const matches = movieDatabase.filter(movie => 
      movie.title.toLowerCase().includes(query) ||
      movie.genres.some(genre => genre.toLowerCase().includes(query)) ||
      movie.cast.some(actor => actor.toLowerCase().includes(query)) ||
      movie.description.toLowerCase().includes(query)
    );

    // Create results overlay grid
    const searchOverlay = document.createElement("div");
    searchOverlay.id = "search-results-overlay";
    searchOverlay.className = "search-results-overlay";
    
    // Style overlay dynamically to ensure it respects styling guidelines
    searchOverlay.style.padding = "100px 4% 60px 4%";
    searchOverlay.style.minHeight = "90vh";

    let resultsHtml = `<h2 class="search-results-header" style="font-family: var(--font-logo); font-size: 1.5rem; margin-bottom: 30px; font-weight: 700;">Explore titles related to: <span style="color: var(--accent-color);">${searchInput.value}</span></h2>`;
    
    if (matches.length === 0) {
      resultsHtml += `
        <div class="search-no-results" style="text-align: center; padding: 100px 20px;">
          <i class="far fa-circle-question" style="font-size: 3.5rem; color: var(--text-muted); margin-bottom: 20px;"></i>
          <p style="font-size: 1.1rem; color: var(--text-muted);">Your search for "${searchInput.value}" did not yield any results.</p>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 10px;">Suggestions: Try another genre, actor, or movie title.</p>
        </div>
      `;
    } else {
      resultsHtml += `<div class="search-results-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 30px 15px;">`;
      matches.forEach(movie => {
        resultsHtml += `
          <div class="movie-card-container search-card-item" data-id="${movie.id}" style="width: 100%; aspect-ratio: 16/9;">
            <div class="movie-card" style="width: 100%; height: 100%; position: relative;">
              <div class="card-img-wrapper">
                <img src="${movie.thumbnail}" class="card-thumbnail" alt="${movie.title}">
              </div>
              <div class="card-hover-info">
                <div class="hover-actions">
                  <button class="hover-action-btn play-btn" aria-label="Play"><i class="fas fa-play"></i></button>
                  <button class="hover-action-btn" aria-label="Add to List"><i class="fas fa-plus"></i></button>
                  <button class="hover-action-btn" aria-label="Like"><i class="far fa-thumbs-up"></i></button>
                  <button class="hover-action-btn info-btn" aria-label="More Info"><i class="fas fa-chevron-down"></i></button>
                </div>
                <div class="hover-meta">
                  <span class="hover-match">${movie.match}% Match</span>
                  <span class="hover-maturity">${movie.maturity}</span>
                  <span class="hover-duration">${movie.duration}</span>
                </div>
                <div class="hover-genres">
                  ${movie.genres.map(g => `<span>${g}</span>`).join('')}
                </div>
              </div>
            </div>
          </div>
        `;
      });
      resultsHtml += `</div>`;
    }

    searchOverlay.innerHTML = resultsHtml;
    mainContent.appendChild(searchOverlay);

    // Bind event clicks to search result items
    searchOverlay.querySelectorAll(".movie-card-container").forEach(card => {
      card.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = card.getAttribute("data-id");
        const movie = movieDatabase.find(m => m.id === id);
        
        // Check if play button was clicked in hover state
        if (e.target.closest(".play-btn")) {
          launchPlayer(movie.title);
        } else {
          openDetailsModal(movie);
        }
      });
    });

  } else {
    // Restore normal view
    document.getElementById("hero-banner").style.display = "flex";
    rowsContainer.style.display = "block";
  }
});

// 5. Dynamic Row Rendering
function renderMovieRows() {
  let containerHtml = "";
  
  categoriesConfig.forEach(cat => {
    // Filter database for titles matching the category
    const catMovies = movieDatabase.filter(movie => movie.categories.includes(cat.id));
    if (catMovies.length === 0) return;

    let cardsHtml = "";
    catMovies.forEach(movie => {
      cardsHtml += `
        <div class="movie-card-container" data-id="${movie.id}">
          <div class="movie-card">
            <div class="card-img-wrapper">
              <img src="${movie.thumbnail}" class="card-thumbnail" alt="${movie.title}" loading="lazy">
            </div>
            <div class="card-hover-info">
              <div class="hover-actions">
                <button class="hover-action-btn play-btn" aria-label="Play"><i class="fas fa-play"></i></button>
                <button class="hover-action-btn" aria-label="Add to List"><i class="fas fa-plus"></i></button>
                <button class="hover-action-btn" aria-label="Like"><i class="far fa-thumbs-up"></i></button>
                <button class="hover-action-btn info-btn" aria-label="More Info"><i class="fas fa-chevron-down"></i></button>
              </div>
              <div class="hover-meta">
                <span class="hover-match">${movie.match}% Match</span>
                <span class="hover-maturity">${movie.maturity}</span>
                <span class="hover-duration">${movie.duration}</span>
              </div>
              <div class="hover-genres">
                ${movie.genres.map(g => `<span>${g}</span>`).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
    });

    containerHtml += `
      <section class="movie-row-container" id="row-${cat.id}">
        <h2 class="row-title">${cat.title}</h2>
        <div class="row-wrapper">
          <button class="slider-arrow slider-arrow-left" aria-label="Scroll Left">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="movie-cards-row">
            ${cardsHtml}
          </div>
          <button class="slider-arrow slider-arrow-right" aria-label="Scroll Right">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </section>
    `;
  });

  rowsContainer.innerHTML = containerHtml;

  // Bind Slider Events
  const rowContainers = document.querySelectorAll(".movie-row-container");
  rowContainers.forEach(container => {
    const leftArrow = container.querySelector(".slider-arrow-left");
    const rightArrow = container.querySelector(".slider-arrow-right");
    const row = container.querySelector(".movie-cards-row");

    // Hide left arrow initially
    leftArrow.style.opacity = "0";
    leftArrow.style.pointerEvents = "none";

    leftArrow.addEventListener("click", () => {
      row.scrollBy({ left: -row.offsetWidth * 0.75, behavior: "smooth" });
    });

    rightArrow.addEventListener("click", () => {
      row.scrollBy({ left: row.offsetWidth * 0.75, behavior: "smooth" });
    });

    row.addEventListener("scroll", () => {
      // Manage left arrow visibility
      if (row.scrollLeft <= 10) {
        leftArrow.style.opacity = "0";
        leftArrow.style.pointerEvents = "none";
      } else {
        leftArrow.style.opacity = "1";
        leftArrow.style.pointerEvents = "all";
      }

      // Manage right arrow visibility at end of scroll
      const maxScroll = row.scrollWidth - row.clientWidth;
      if (row.scrollLeft >= maxScroll - 10) {
        rightArrow.style.opacity = "0";
        rightArrow.style.pointerEvents = "none";
      } else {
        rightArrow.style.opacity = "1";
        rightArrow.style.pointerEvents = "all";
      }
    });
  });

  // Bind Card Click Events (using Event Delegation on Rows Container)
  rowsContainer.addEventListener("click", (e) => {
    const card = e.target.closest(".movie-card-container");
    if (!card) return;

    e.stopPropagation();
    const id = card.getAttribute("data-id");
    const movie = movieDatabase.find(m => m.id === id);

    // If play button clicked, launch simulated player directly
    if (e.target.closest(".play-btn")) {
      launchPlayer(movie.title);
    } else {
      openDetailsModal(movie);
    }
  });
}

// 6. Modal Details Pop-Up
function openDetailsModal(movie) {
  modalBannerImg.src = movie.thumbnail;
  modalBannerImg.alt = movie.title;
  modalTitle.textContent = movie.title;
  modalMatch.textContent = `${movie.match}% Match`;
  modalYear.textContent = movie.year;
  modalMaturity.textContent = movie.maturity;
  modalDuration.textContent = movie.duration;
  modalDescription.textContent = movie.description;
  
  modalCast.textContent = movie.cast.join(", ");
  modalGenres.textContent = movie.genres.join(", ");
  modalMoods.textContent = movie.moods ? movie.moods.join(", ") : "Exciting";

  // Re-bind modal Play action
  const modalPlayBtn = detailsModal.querySelector(".btn-play-accent");
  // Clone button to remove previous event listeners
  const newPlayBtn = modalPlayBtn.cloneNode(true);
  modalPlayBtn.parentNode.replaceChild(newPlayBtn, modalPlayBtn);
  newPlayBtn.addEventListener("click", () => {
    closeDetailsModal();
    launchPlayer(movie.title);
  });

  // Populate "More Like This" Recommendations Grid
  const similarMovies = movieDatabase
    .filter(m => m.id !== movie.id && m.genres.some(g => movie.genres.includes(g)))
    .slice(0, 6); // Max 6 recommendations

  // Fallback to top-rated if not enough genres matches
  if (similarMovies.length < 3) {
    const topRatedFallback = movieDatabase
      .filter(m => m.id !== movie.id && !similarMovies.some(sm => sm.id === m.id))
      .slice(0, 6 - similarMovies.length);
    similarMovies.push(...topRatedFallback);
  }

  let similarHtml = "";
  similarMovies.forEach(sm => {
    similarHtml += `
      <div class="similar-card" data-id="${sm.id}">
        <div class="similar-thumbnail-wrapper">
          <img src="${sm.thumbnail}" alt="${sm.title}" class="similar-thumbnail">
          <span class="similar-duration-tag">${sm.duration}</span>
        </div>
        <div class="similar-card-info">
          <div class="similar-meta-row">
            <span class="similar-match">${sm.match}% Match</span>
            <div class="similar-rating-row">
              <span class="similar-maturity">${sm.maturity}</span>
              <span class="similar-year">${sm.year}</span>
            </div>
          </div>
          <p class="similar-description">${sm.description}</p>
        </div>
      </div>
    `;
  });

  similarGrid.innerHTML = similarHtml;

  // Add click events to similar cards
  similarGrid.querySelectorAll(".similar-card").forEach(card => {
    card.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = card.getAttribute("data-id");
      const matchedMovie = movieDatabase.find(m => m.id === id);
      // Smoothly transition modal content to new movie
      openDetailsModal(matchedMovie);
      detailsModal.querySelector(".modal-content").scrollTop = 0;
    });
  });

  detailsModal.classList.add("active");
  document.body.style.overflow = "hidden"; // Prevent scrolling main page behind modal
}

function closeDetailsModal() {
  detailsModal.classList.remove("active");
  document.body.style.overflow = "";
}

modalCloseBtn.addEventListener("click", closeDetailsModal);
modalBackdrop.addEventListener("click", closeDetailsModal);

// Hero Actions
heroPlayBtn.addEventListener("click", () => {
  launchPlayer("Wednesday");
});

heroInfoBtn.addEventListener("click", () => {
  const heroMovie = movieDatabase.find(m => m.id === "hero-wednesday");
  if (heroMovie) {
    openDetailsModal(heroMovie);
  }
});

// 7. Simulated Media Player
function launchPlayer(title) {
  playerTitle.textContent = title;
  mediaPlayerOverlay.classList.add("active");
  document.body.style.overflow = "hidden";

  // Reset timeline
  playerProgressPercent = 2;
  playerTimelineProgress.style.width = `${playerProgressPercent}%`;
  isPlayerPlaying = true;
  playerPlayToggle.innerHTML = '<i class="fas fa-pause"></i>';

  // Show loader and hide video controls initially
  playerLoader.style.display = "flex";
  simulatedVideo.style.display = "none";

  // Simulate streaming delay
  setTimeout(() => {
    playerLoader.style.display = "none";
    simulatedVideo.style.display = "flex";

    // Start timeline simulation
    startTimelineProgress();
  }, 1800);
}

function closePlayer() {
  mediaPlayerOverlay.classList.remove("active");
  document.body.style.overflow = "";
  stopTimelineProgress();
}

function startTimelineProgress() {
  stopTimelineProgress();
  timelineInterval = setInterval(() => {
    if (isPlayerPlaying) {
      playerProgressPercent += 0.05;
      if (playerProgressPercent >= 100) {
        playerProgressPercent = 100;
        stopTimelineProgress();
        isPlayerPlaying = false;
        playerPlayToggle.innerHTML = '<i class="fas fa-play"></i>';
      }
      playerTimelineProgress.style.width = `${playerProgressPercent}%`;
    }
  }, 1000);
}

function stopTimelineProgress() {
  if (timelineInterval) {
    clearInterval(timelineInterval);
    timelineInterval = null;
  }
}

playerPlayToggle.addEventListener("click", () => {
  isPlayerPlaying = !isPlayerPlaying;
  if (isPlayerPlaying) {
    playerPlayToggle.innerHTML = '<i class="fas fa-pause"></i>';
    startTimelineProgress();
  } else {
    playerPlayToggle.innerHTML = '<i class="fas fa-play"></i>';
    stopTimelineProgress();
  }
});

playerCloseBtn.addEventListener("click", closePlayer);

// Initialize row rendering on load
window.addEventListener("DOMContentLoaded", () => {
  renderMovieRows();
});

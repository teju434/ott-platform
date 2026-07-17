// OceanAura Client-Side Hash Router

class OceanAuraRouter {
  constructor() {
    this.routes = {};
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  // Register a route with its render function
  addRoute(path, renderFunc) {
    this.routes[path] = renderFunc;
  }

  // Handle routing based on hash changes
  async handleRoute() {
    const hash = window.location.hash || '#home';
    const mainApp = document.getElementById('app');
    
    // Smooth transition: fade-out first
    if (mainApp) {
      mainApp.style.opacity = '0';
      mainApp.style.transform = 'translateY(15px)';
      mainApp.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    }

    // Small delay to allow fade-out animation
    await new Promise(resolve => setTimeout(resolve, 250));

    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Parse path and query parameters
    const parsed = this.parseHash(hash);
    let routeMatch = null;
    let params = {};

    // Match exact or parameterized routes (e.g. ship/:id)
    for (const routePath in this.routes) {
      const match = this.matchRoute(routePath, parsed.path);
      if (match) {
        routeMatch = this.routes[routePath];
        params = match;
        break;
      }
    }

    if (routeMatch) {
      // Set active nav class
      this.updateNavbarActiveLink(parsed.path);
      
      // Execute the render view
      try {
        await routeMatch(params, parsed.queryParams);
      } catch (err) {
        console.error("Routing render error:", err);
        mainApp.innerHTML = `<div class="glass-panel" style="margin: 100px auto; max-width: 500px; text-align: center;">
          <h2 style="color: var(--accent-orange); margin-bottom: 15px;">Voyage Disrupted</h2>
          <p style="color: var(--neutral-silver);">We encountered an error navigating to this destination. Please try again.</p>
          <a href="#home" class="btn-primary" style="margin-top: 20px;">Return Home</a>
        </div>`;
      }
    } else {
      // 404 Route Not Found
      mainApp.innerHTML = `<div class="glass-panel" style="margin: 100px auto; max-width: 500px; text-align: center;">
        <h2 style="color: var(--accent-orange); margin-bottom: 15px;">Lost at Sea (404)</h2>
        <p style="color: var(--neutral-silver);">The page you are looking for has drifted away. Navigate back to known waters.</p>
        <a href="#home" class="btn-primary" style="margin-top: 20px;">Navigate Home</a>
      </div>`;
    }

    // Trigger Fade-In
    if (mainApp) {
      // Trigger browser reflow
      void mainApp.offsetWidth;
      mainApp.style.opacity = '1';
      mainApp.style.transform = 'translateY(0)';
      mainApp.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    }
  }

  // Parse path and query parameters from hash
  // e.g. "#/cruises?destination=Maldives&passengers=2" -> path: "/cruises", queryParams: {destination: "Maldives", passengers: "2"}
  parseHash(hash) {
    const rawPath = hash.replace(/^#/, '');
    const [pathPart, queryPart] = rawPath.split('?');
    
    // Ensure path starts with /
    let path = pathPart.startsWith('/') ? pathPart : '/' + pathPart;
    if (path.length > 1 && path.endsWith('/')) {
      path = path.slice(0, -1);
    }

    const queryParams = {};
    if (queryPart) {
      const pairs = queryPart.split('&');
      for (const pair of pairs) {
        const [key, val] = pair.split('=');
        if (key) {
          queryParams[decodeURIComponent(key)] = decodeURIComponent(val || '');
        }
      }
    }

    return { path, queryParams };
  }

  // Match routes with parameters (e.g. "/ship/:id")
  matchRoute(routePath, currentPath) {
    const routeParts = routePath.split('/');
    const currentParts = currentPath.split('/');

    if (routeParts.length !== currentParts.length) return null;

    const params = {};
    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        const paramName = routeParts[i].slice(1);
        params[paramName] = currentParts[i];
      } else if (routeParts[i] !== currentParts[i]) {
        return null;
      }
    }
    return params;
  }

  // Set the "active" class on navbar items matching the current path
  updateNavbarActiveLink(path) {
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.remove('active');
      const link = el.querySelector('a');
      if (link) {
        const href = link.getAttribute('href');
        if (href) {
          const linkPath = href.replace(/^#\/?/, '/');
          const shortPath = path.startsWith('/ship/') ? '/cruises' : path;
          const shortLinkPath = linkPath.startsWith('/ship/') ? '/cruises' : linkPath;

          if (shortPath === shortLinkPath || (path === '/' && shortLinkPath === '/home')) {
            el.classList.add('active');
          }
        }
      }
    });
  }
}

window.Router = new OceanAuraRouter();

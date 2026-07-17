// OceanAura API Client Configuration & Database fallback

const API_BASE_URL = 'http://127.0.0.1:8000/api';
let demoMode = true; // Set to true by default, will auto-detect backend

// Initial mock data that mirrors the seed command
const INITIAL_SHIPS = [
  { id: 1, name: "OceanAura Sovereign", image: "sovereign", rating: 4.9, capacity: 1400, ship_type: "Super Liner", operator: "OceanAura Elite", base_fare: "950.00" },
  { id: 2, name: "Aura Majestic", image: "majestic", rating: 4.8, capacity: 950, ship_type: "Luxury Mega-Yacht", operator: "OceanAura Elite", base_fare: "1450.00" },
  { id: 3, name: "Solace Horizon", image: "horizon", rating: 5.0, capacity: 120, ship_type: "Exclusive Superyacht", operator: "OceanAura Private Collection", base_fare: "3200.00" },
  { id: 4, name: "Serenade of the Sea", image: "serenade", rating: 4.7, capacity: 1800, ship_type: "Liner Class", operator: "Ritz-Carlton Yacht Collection", base_fare: "800.00" },
  { id: 5, name: "Starlight Odyssey", image: "odyssey", rating: 4.9, capacity: 450, ship_type: "Boutique Cruiser", operator: "OceanAura Explorer", base_fare: "1850.00" },
  { id: 6, name: "Amber Wave", image: "wave", rating: 4.9, capacity: 80, ship_type: "Sailing Yacht", operator: "OceanAura Private Collection", base_fare: "2200.00" }
];

const INITIAL_ROUTES = [
  { id: 1, source_port: "Maldives", destination_port: "Goa", distance: 780 },
  { id: 2, source_port: "Goa", destination_port: "Lakshadweep", distance: 320 },
  { id: 3, source_port: "Lakshadweep", destination_port: "Port Blair", distance: 1200 },
  { id: 4, source_port: "Port Blair", destination_port: "Singapore", distance: 900 },
  { id: 5, source_port: "Dubai", destination_port: "Mumbai", distance: 1100 },
  { id: 6, source_port: "Singapore", destination_port: "Dubai", distance: 3400 },
  { id: 7, source_port: "Goa", destination_port: "Maldives", distance: 780 },
  { id: 8, source_port: "Lakshadweep", destination_port: "Dubai", distance: 1600 }
];

const INITIAL_SCHEDULES = [
  { id: 1, ship_id: 1, route_id: 1, departure_date: "2026-08-01", return_date: "2026-08-08" },
  { id: 2, ship_id: 2, route_id: 2, departure_date: "2026-08-12", return_date: "2026-08-17" },
  { id: 3, ship_id: 3, route_id: 4, departure_date: "2026-08-20", return_date: "2026-08-27" },
  { id: 4, ship_id: 4, route_id: 5, departure_date: "2026-09-01", return_date: "2026-09-08" },
  { id: 5, ship_id: 5, route_id: 6, departure_date: "2026-09-15", return_date: "2026-09-25" },
  { id: 6, ship_id: 6, route_id: 7, departure_date: "2026-08-05", return_date: "2026-08-10" },
  { id: 7, ship_id: 1, route_id: 3, departure_date: "2026-08-15", return_date: "2026-08-24" },
  { id: 8, ship_id: 3, route_id: 8, departure_date: "2026-09-10", return_date: "2026-09-18" }
];

// Initialize LocalStorage Database for Fallback
const initializeLocalDB = () => {
  if (!localStorage.getItem('oa_ships')) localStorage.setItem('oa_ships', JSON.stringify(INITIAL_SHIPS));
  if (!localStorage.getItem('oa_routes')) localStorage.setItem('oa_routes', JSON.stringify(INITIAL_ROUTES));
  if (!localStorage.getItem('oa_schedules')) localStorage.setItem('oa_schedules', JSON.stringify(INITIAL_SCHEDULES));
  if (!localStorage.getItem('oa_passengers')) {
    localStorage.setItem('oa_passengers', JSON.stringify([
      { id: 1, name: "VIP Traveler", email: "vip@oceanaura.com", phone: "+1 555-0199", passport_number: "US9876543" }
    ]));
  }
  if (!localStorage.getItem('oa_bookings')) {
    localStorage.setItem('oa_bookings', JSON.stringify([
      { id: 1, passenger_id: 1, schedule_id: 2, cabin_type: "Suite", passenger_count: 2, total_fare: "3900.00", status: "confirmed", created_at: new Date(Date.now() - 86400000 * 5).toISOString() }
    ]));
  }
  if (!localStorage.getItem('oa_payments')) {
    localStorage.setItem('oa_payments', JSON.stringify([
      { id: 1, booking_id: 1, amount: "3900.00", payment_method: "Credit Card", transaction_id: "TXN_78326478", status: "success", created_at: new Date(Date.now() - 86400000 * 5).toISOString() }
    ]));
  }
};

initializeLocalDB();

// Dynamic Backend Detection
const checkBackendStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ships/`, { method: 'GET', signal: AbortSignal.timeout(1500) });
    if (response.ok) {
      demoMode = false;
      console.log('OceanAura API Client: Connected to Django REST Backend');
    } else {
      demoMode = true;
      console.warn('OceanAura API Client: Backend returned status error. Using Mock DB.');
    }
  } catch (err) {
    demoMode = true;
    console.log('OceanAura API Client: Backend server offline. Operating in Demo Mode (Local Storage).');
  }
  document.dispatchEvent(new CustomEvent('api-status-changed', { detail: { demoMode } }));
};

// Auto-ping backend on load
checkBackendStatus();
setInterval(checkBackendStatus, 15000); // Check every 15s

// Helper for local database operations
const getLocalData = (key) => JSON.parse(localStorage.getItem(key));
const saveLocalData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Unified API Caller with Fallback
const apiCall = async (endpoint, options = {}, localKey, mockFunc) => {
  if (demoMode) {
    // Return mock data immediately
    return mockFunc();
  }
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    if (!response.ok) throw new Error('API server returned error');
    return await response.json();
  } catch (error) {
    console.error(`Fetch API error on /${endpoint}. Falling back to Mock DB.`, error);
    return mockFunc();
  }
};

// API Client Library Interface
const OceanAuraAPI = {
  getDemoMode: () => demoMode,
  setDemoMode: (val) => { demoMode = val; },

  // --- Ships API ---
  getShips: async () => {
    return apiCall('ships/', {}, 'oa_ships', () => getLocalData('oa_ships'));
  },
  getShip: async (id) => {
    return apiCall(`ships/${id}/`, {}, 'oa_ships', () => {
      return getLocalData('oa_ships').find(s => s.id == id);
    });
  },
  createShip: async (shipData) => {
    return apiCall('ships/', { method: 'POST', body: JSON.stringify(shipData) }, 'oa_ships', () => {
      const data = getLocalData('oa_ships');
      const newShip = { ...shipData, id: Date.now() };
      data.push(newShip);
      saveLocalData('oa_ships', data);
      return newShip;
    });
  },
  updateShip: async (id, shipData) => {
    return apiCall(`ships/${id}/`, { method: 'PUT', body: JSON.stringify(shipData) }, 'oa_ships', () => {
      const data = getLocalData('oa_ships');
      const idx = data.findIndex(s => s.id == id);
      if (idx !== -1) {
        data[idx] = { ...data[idx], ...shipData };
        saveLocalData('oa_ships', data);
        return data[idx];
      }
      return null;
    });
  },
  deleteShip: async (id) => {
    return apiCall(`ships/${id}/`, { method: 'DELETE' }, 'oa_ships', () => {
      const data = getLocalData('oa_ships');
      const filtered = data.filter(s => s.id != id);
      saveLocalData('oa_ships', filtered);
      return true;
    });
  },

  // --- Routes API ---
  getRoutes: async () => {
    return apiCall('routes/', {}, 'oa_routes', () => getLocalData('oa_routes'));
  },
  createRoute: async (routeData) => {
    return apiCall('routes/', { method: 'POST', body: JSON.stringify(routeData) }, 'oa_routes', () => {
      const data = getLocalData('oa_routes');
      const newRoute = { ...routeData, id: Date.now() };
      data.push(newRoute);
      saveLocalData('oa_routes', data);
      return newRoute;
    });
  },
  updateRoute: async (id, routeData) => {
    return apiCall(`routes/${id}/`, { method: 'PUT', body: JSON.stringify(routeData) }, 'oa_routes', () => {
      const data = getLocalData('oa_routes');
      const idx = data.findIndex(r => r.id == id);
      if (idx !== -1) {
        data[idx] = { ...data[idx], ...routeData };
        saveLocalData('oa_routes', data);
        return data[idx];
      }
      return null;
    });
  },
  deleteRoute: async (id) => {
    return apiCall(`routes/${id}/`, { method: 'DELETE' }, 'oa_routes', () => {
      const data = getLocalData('oa_routes');
      const filtered = data.filter(r => r.id != id);
      saveLocalData('oa_routes', filtered);
      return true;
    });
  },

  // --- Schedules API ---
  getSchedules: async () => {
    // If Django, it returns detail serializer.
    // For mock mode, we need to manually embed ship and route details.
    return apiCall('schedules/', {}, 'oa_schedules', () => {
      const schedules = getLocalData('oa_schedules');
      const ships = getLocalData('oa_ships');
      const routes = getLocalData('oa_routes');
      return schedules.map(s => ({
        ...s,
        duration_days: Math.round((new Date(s.return_date) - new Date(s.departure_date)) / 86400000),
        ship: ships.find(shp => shp.id == s.ship_id),
        route: routes.find(rt => rt.id == s.route_id)
      }));
    });
  },
  getSchedule: async (id) => {
    return apiCall(`schedules/${id}/`, {}, 'oa_schedules', () => {
      const s = getLocalData('oa_schedules').find(sc => sc.id == id);
      if (!s) return null;
      const ships = getLocalData('oa_ships');
      const routes = getLocalData('oa_routes');
      return {
        ...s,
        duration_days: Math.round((new Date(s.return_date) - new Date(s.departure_date)) / 86400000),
        ship: ships.find(shp => shp.id == s.ship_id),
        route: routes.find(rt => rt.id == s.route_id)
      };
    });
  },
  createSchedule: async (schedData) => {
    return apiCall('schedules/', { method: 'POST', body: JSON.stringify(schedData) }, 'oa_schedules', () => {
      const data = getLocalData('oa_schedules');
      const newSched = { ...schedData, id: Date.now() };
      data.push(newSched);
      saveLocalData('oa_schedules', data);
      return newSched;
    });
  },
  updateSchedule: async (id, schedData) => {
    return apiCall(`schedules/${id}/`, { method: 'PUT', body: JSON.stringify(schedData) }, 'oa_schedules', () => {
      const data = getLocalData('oa_schedules');
      const idx = data.findIndex(s => s.id == id);
      if (idx !== -1) {
        data[idx] = { ...data[idx], ...schedData };
        saveLocalData('oa_schedules', data);
        return data[idx];
      }
      return null;
    });
  },
  deleteSchedule: async (id) => {
    return apiCall(`schedules/${id}/`, { method: 'DELETE' }, 'oa_schedules', () => {
      const data = getLocalData('oa_schedules');
      const filtered = data.filter(s => s.id != id);
      saveLocalData('oa_schedules', filtered);
      return true;
    });
  },

  // --- Passengers API ---
  getPassengers: async () => {
    return apiCall('passengers/', {}, 'oa_passengers', () => getLocalData('oa_passengers'));
  },
  createPassenger: async (passengerData) => {
    return apiCall('passengers/', { method: 'POST', body: JSON.stringify(passengerData) }, 'oa_passengers', () => {
      const data = getLocalData('oa_passengers');
      const exists = data.find(p => p.email.toLowerCase() === passengerData.email.toLowerCase());
      if (exists) return exists;
      const newPassenger = { ...passengerData, id: Date.now() };
      data.push(newPassenger);
      saveLocalData('oa_passengers', data);
      return newPassenger;
    });
  },
  updatePassenger: async (id, passengerData) => {
    return apiCall(`passengers/${id}/`, { method: 'PUT', body: JSON.stringify(passengerData) }, 'oa_passengers', () => {
      const data = getLocalData('oa_passengers');
      const idx = data.findIndex(p => p.id == id);
      if (idx !== -1) {
        data[idx] = { ...data[idx], ...passengerData };
        saveLocalData('oa_passengers', data);
        return data[idx];
      }
      return null;
    });
  },
  deletePassenger: async (id) => {
    return apiCall(`passengers/${id}/`, { method: 'DELETE' }, 'oa_passengers', () => {
      const data = getLocalData('oa_passengers');
      const filtered = data.filter(p => p.id != id);
      saveLocalData('oa_passengers', filtered);
      return true;
    });
  },

  // --- Bookings API ---
  getBookings: async () => {
    return apiCall('bookings/', {}, 'oa_bookings', () => {
      const bookings = getLocalData('oa_bookings');
      const passengers = getLocalData('oa_passengers');
      const schedules = getLocalData('oa_schedules');
      const ships = getLocalData('oa_ships');
      const routes = getLocalData('oa_routes');

      return bookings.map(b => {
        const sched = schedules.find(s => s.id == b.schedule_id);
        const schedDetail = sched ? {
          ...sched,
          ship: ships.find(s => s.id == sched.ship_id),
          route: routes.find(r => r.id == sched.route_id)
        } : null;

        return {
          ...b,
          passenger: passengers.find(p => p.id == b.passenger_id),
          schedule: schedDetail
        };
      });
    });
  },
  createBooking: async (bookingData) => {
    return apiCall('bookings/', { method: 'POST', body: JSON.stringify(bookingData) }, 'oa_bookings', () => {
      const data = getLocalData('oa_bookings');
      const newBooking = {
        ...bookingData,
        id: Date.now(),
        status: 'pending',
        created_at: new Date().toISOString()
      };
      data.push(newBooking);
      saveLocalData('oa_bookings', data);
      return newBooking;
    });
  },
  updateBooking: async (id, bookingData) => {
    return apiCall(`bookings/${id}/`, { method: 'PATCH', body: JSON.stringify(bookingData) }, 'oa_bookings', () => {
      const data = getLocalData('oa_bookings');
      const idx = data.findIndex(b => b.id == id);
      if (idx !== -1) {
        data[idx] = { ...data[idx], ...bookingData };
        saveLocalData('oa_bookings', data);
        return data[idx];
      }
      return null;
    });
  },
  deleteBooking: async (id) => {
    return apiCall(`bookings/${id}/`, { method: 'DELETE' }, 'oa_bookings', () => {
      const data = getLocalData('oa_bookings');
      const filtered = data.filter(b => b.id != id);
      saveLocalData('oa_bookings', filtered);
      return true;
    });
  },

  // --- Payments API ---
  getPayments: async () => {
    return apiCall('payments/', {}, 'oa_payments', () => {
      const payments = getLocalData('oa_payments');
      const bookings = getLocalData('oa_bookings');
      return payments.map(p => ({
        ...p,
        booking: bookings.find(b => b.id == p.booking_id)
      }));
    });
  },
  createPayment: async (paymentData) => {
    return apiCall('payments/', { method: 'POST', body: JSON.stringify(paymentData) }, 'oa_payments', () => {
      const payments = getLocalData('oa_payments');
      const newPayment = {
        ...paymentData,
        id: Date.now(),
        created_at: new Date().toISOString()
      };
      payments.push(newPayment);
      saveLocalData('oa_payments', payments);

      // Automatically update the booking status to confirmed upon payment success
      if (newPayment.status === 'success') {
        const bookings = getLocalData('oa_bookings');
        const bIdx = bookings.findIndex(b => b.id == paymentData.booking_id);
        if (bIdx !== -1) {
          bookings[bIdx].status = 'confirmed';
          saveLocalData('oa_bookings', bookings);
        }
      }

      return newPayment;
    });
  }
};

window.OceanAuraAPI = OceanAuraAPI;

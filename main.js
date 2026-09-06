/* ============================================================
   CrimeVision AI — Enhanced Javascript & Data Analytics
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // Coordinates Database for the 19 Indian Metropolitan Cities
  const CITY_COORDS = {
    "0": { name: "Ahmedabad", coords: [23.0225, 72.5714] },
    "1": { name: "Bengaluru", coords: [12.9716, 77.5946] },
    "2": { name: "Chennai", coords: [13.0827, 80.2707] },
    "3": { name: "Coimbatore", coords: [11.0168, 76.9558] },
    "4": { name: "Delhi", coords: [28.7041, 77.1025] },
    "5": { name: "Ghaziabad", coords: [28.6692, 77.4538] },
    "6": { name: "Hyderabad", coords: [17.3850, 78.4867] },
    "7": { name: "Indore", coords: [22.7196, 75.8577] },
    "8": { name: "Jaipur", coords: [26.9124, 75.7873] },
    "9": { name: "Kanpur", coords: [26.4499, 80.3319] },
    "10": { name: "Kochi", coords: [9.9312, 76.2673] },
    "11": { name: "Kolkata", coords: [22.5726, 88.3639] },
    "12": { name: "Kozhikode", coords: [11.2588, 75.7804] },
    "13": { name: "Lucknow", coords: [26.8467, 80.9462] },
    "14": { name: "Mumbai", coords: [19.0760, 72.8777] },
    "15": { name: "Nagpur", coords: [21.1458, 79.0882] },
    "16": { name: "Patna", coords: [25.5941, 85.1376] },
    "17": { name: "Pune", coords: [18.5204, 73.8567] },
    "18": { name: "Surat", coords: [21.1702, 72.8311] }
  };

  /* ----------------------------------------------------------
     1. Populate Year Dropdown (2000–2050, default = 2026)
     ---------------------------------------------------------- */
  const yearSelect = document.getElementById('year');
  if (yearSelect) {
    const currentYear = 2026;
    const startYear = 2000;
    const endYear = 2050;

    for (let y = startYear; y <= endYear; y++) {
      const option = document.createElement('option');
      option.value = y;
      option.textContent = y;
      if (y === currentYear) {
        option.selected = true;
      }
      yearSelect.appendChild(option);
    }
  }

  /* ----------------------------------------------------------
     2. Animated Particle Background (Hero Section)
     ---------------------------------------------------------- */
  const hero = document.getElementById('hero-particles');
  if (hero) {
    const PARTICLE_COUNT = 50;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = document.createElement('span');
      particle.classList.add('particle');

      // Random position
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top  = Math.random() * 100 + '%';

      // Random size (2–5px)
      const size = 2 + Math.random() * 3;
      particle.style.width  = size + 'px';
      particle.style.height = size + 'px';

      // Random opacity
      particle.style.opacity = 0.15 + Math.random() * 0.35;

      // Random animation duration (10–25s)
      const duration = 10 + Math.random() * 15;
      particle.style.animationDuration = duration + 's';

      // Random delay so they don't all start together
      const delay = Math.random() * duration;
      particle.style.animationDelay = '-' + delay + 's';

      hero.appendChild(particle);
    }
  }

  /* ----------------------------------------------------------
     3. Leaflet Map — Landing Page (Multiple Markers)
     ---------------------------------------------------------- */
  const indexMapContainer = document.getElementById('map');
  const cityDropdown = document.getElementById('city-dropdown');

  if (indexMapContainer) {
    // Initial center on central India
    const map = L.map('map', {
      zoomControl: true,
      scrollWheelZoom: false
    }).setView([21.7679, 78.8718], 5);

    // Dark styled tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Custom glowing marker icon
    const customIcon = L.divIcon({
      className: 'custom-map-marker',
      html: '<div class="marker-dot"></div><div class="marker-pulse"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    const markers = [];

    // Place markers for all cities
    Object.keys(CITY_COORDS).forEach(key => {
      const city = CITY_COORDS[key];
      const marker = L.marker(city.coords, { icon: customIcon }).addTo(map);
      marker.bindTooltip(`<b>${city.name}</b><br>Click to select`, { direction: 'top', offset: [0, -10] });

      marker.on('click', () => {
        if (cityDropdown) {
          cityDropdown.value = key;
          // Trigger a change event so the dropdown updates visually
          cityDropdown.dispatchEvent(new Event('change'));
          
          // Smooth scroll to the form card
          document.getElementById('predict').scrollIntoView({ behavior: 'smooth' });

          // Visual indicator on selected option
          cityDropdown.classList.add('pulse-highlight');
          setTimeout(() => cityDropdown.classList.remove('pulse-highlight'), 1000);
        }
      });

      markers.push(marker);
    });

    // Auto-fit bounds on mobile
    if (window.innerWidth < 768) {
      map.setZoom(4);
    }
  }

  /* ----------------------------------------------------------
     4. Leaflet Map — Results Page (Single Focused Marker)
     ---------------------------------------------------------- */
  const resultMapContainer = document.getElementById('result-map');
  if (resultMapContainer) {
    const cityCode = resultMapContainer.dataset.cityCode;
    const cityName = resultMapContainer.dataset.cityName;
    const crimeStatus = resultMapContainer.dataset.status;
    const cityInfo = CITY_COORDS[cityCode];

    if (cityInfo) {
      const map = L.map('result-map', {
        zoomControl: false,
        scrollWheelZoom: false
      }).setView(cityInfo.coords, 11);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO'
      }).addTo(map);

      // Color coding marker dot based on crime status
      let markerColor = '#10b981'; // Green
      if (crimeStatus === 'Low Crime Area') markerColor = '#00d4ff'; // Cyan
      else if (crimeStatus === 'High Crime Area') markerColor = '#f59e0b'; // Amber
      else if (crimeStatus === 'Very High Crime Area') markerColor = '#ef4444'; // Red

      const statusIcon = L.divIcon({
        className: 'result-map-marker',
        html: `<div class="marker-dot" style="background: ${markerColor}; box-shadow: 0 0 10px ${markerColor}"></div><div class="marker-pulse" style="border-color: ${markerColor}"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      L.marker(cityInfo.coords, { icon: statusIcon }).addTo(map)
        .bindPopup(`<b>${cityName}</b><br>Prediction: ${crimeStatus}`)
        .openPopup();
    }
  }

  /* ----------------------------------------------------------
     5. Chart.js — Trend Graph Rendering (Historical vs. Predicted)
     ---------------------------------------------------------- */
  const canvasElement = document.getElementById('trendsChart');
  if (canvasElement) {
    const rawTrends = JSON.parse(canvasElement.dataset.trends || '[]');
    const selectedYear = parseInt(canvasElement.dataset.year || '2026');

    const years = rawTrends.map(item => item.year);
    const rates = rawTrends.map(item => item.rate);

    // Split datasets for dashed lines projection
    const historicalRates = [];
    const predictedRates = [];

    rawTrends.forEach(item => {
      if (item.year <= 2021) {
        historicalRates.push(item.rate);
        // Forecast line links to the final historical point
        if (item.year === 2021) {
          predictedRates.push(item.rate);
        } else {
          predictedRates.push(null);
        }
      } else {
        historicalRates.push(null);
        predictedRates.push(item.rate);
      }
    });

    const ctx = canvasElement.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: 'NCRB Historical Data (2014-2021)',
            data: historicalRates,
            borderColor: '#00d4ff',
            backgroundColor: 'rgba(0, 212, 255, 0.1)',
            borderWidth: 3,
            tension: 0.3,
            fill: true,
            spanGaps: true,
            pointBackgroundColor: '#00d4ff',
            pointRadius: 4
          },
          {
            label: 'AI Forecasted Trend (2022-2030)',
            data: predictedRates,
            borderColor: '#f59e0b',
            borderDash: [6, 4],
            backgroundColor: 'transparent',
            borderWidth: 3,
            tension: 0.3,
            pointBackgroundColor: '#f59e0b',
            pointRadius: 4,
            spanGaps: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#94a3b8',
              font: { family: 'Inter', size: 12 }
            }
          },
          tooltip: {
            backgroundColor: '#1a1f35',
            titleColor: '#f8fafc',
            bodyColor: '#94a3b8',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            displayColors: true,
            callbacks: {
              label: function(context) {
                return ` Crime Rate: ${context.raw}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8', font: { family: 'Inter' } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8', font: { family: 'Inter' } },
            title: {
              display: true,
              text: 'Crime Rate (per Lakh Population)',
              color: '#94a3b8',
              font: { family: 'Inter', size: 12 }
            }
          }
        }
      }
    });
  }

  /* ----------------------------------------------------------
     6. Smooth Scroll for Navigation Anchor Links
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  /* ----------------------------------------------------------
     7. Form Submission Loading State
     ---------------------------------------------------------- */
  const predictionForm = document.getElementById('prediction-form');
  const submitBtn = document.querySelector('.btn-predict');

  if (predictionForm && submitBtn) {
    predictionForm.addEventListener('submit', function () {
      if (submitBtn.classList.contains('loading')) return;

      submitBtn.classList.add('loading');
      const originalText = submitBtn.textContent;
      submitBtn.innerHTML = '<span class="spinner"></span> Analyzing Trends...';

      // Fallback timeout in case page fails to reload/navigate
      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.textContent = originalText;
      }, 10000);
    });
  }

  /* ----------------------------------------------------------
     8. Stat Number Count-Up Animation
     ---------------------------------------------------------- */
  function animateCountUp(element) {
    const text = element.textContent.trim();
    const cleaned = text.replace(/,/g, '');
    const match = cleaned.match(/([-+]?\d*\.?\d+)/);

    if (!match) return;

    const target = parseFloat(match[1]);
    const isDecimal = text.includes('.');
    const suffix = text.replace(match[0], '').replace(/,/g, '');
    const prefix = cleaned.indexOf(match[1]) > 0 ? cleaned.substring(0, cleaned.indexOf(match[1])) : '';
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
      const current = target * eased;

      let display;
      if (isDecimal) {
        const decimalPlaces = (text.split('.')[1] || '').replace(/[^\d]/g, '').length;
        display = current.toFixed(decimalPlaces);
      } else {
        display = Math.round(current).toLocaleString();
      }

      element.textContent = prefix + display + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = text;
      }
    }

    requestAnimationFrame(update);
  }

  const statValues = document.querySelectorAll('.stat-value');
  if (statValues.length > 0) {
    if ('IntersectionObserver' in window) {
      const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const valueEl = entry.target.querySelector('.stat-value');
            if (valueEl && !valueEl.dataset.animated) {
              valueEl.dataset.animated = 'true';
              animateCountUp(valueEl);
            }
            statsObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      document.querySelectorAll('.stat-card, .safety-gauge').forEach(card => {
        statsObserver.observe(card);
      });
    } else {
      statValues.forEach(el => animateCountUp(el));
    }
  }

  /* ----------------------------------------------------------
     9. Scroll Reveal Animations
     ---------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

});
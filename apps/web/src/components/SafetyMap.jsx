import React, { useEffect, useRef, useState } from 'react';

const GOOGLE_NIGHT_MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }]
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }]
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }]
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }]
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }]
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }]
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }]
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }]
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }]
  }
];

export const SafetyMap = ({
  center = [20.2961, 85.8245], // Bhubaneswar, Odisha
  zoom = 14,
  markers = [],
  showCorridor = false,
  height = '100%'
}) => {
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const googleMapRef = useRef(null);
  const activeInfoWindowRef = useRef(null);

  const [mapProvider, setMapProvider] = useState('google_sdk'); // 'google_sdk' | 'vector'
  const [isNightMode, setIsNightMode] = useState(false);
  const [googleAuthFailed, setGoogleAuthFailed] = useState(false);

  // Listen for Google Maps SDK Auth Failure (ApiNotActivatedError / InvalidKey)
  useEffect(() => {
    window.gm_authFailure = () => {
      console.warn('[Google Maps] gm_authFailure triggered. Falling back to Vector Map (Leaflet Carto Voyager).');
      setGoogleAuthFailed(true);
      setMapProvider('vector');
    };
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up previous Leaflet instance if any
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    if (mapProvider === 'google_sdk' && !googleAuthFailed && window.google && window.google.maps) {
      try {
        const map = new window.google.maps.Map(mapContainerRef.current, {
          center: { lat: center[0], lng: center[1] },
          zoom: zoom,
          mapTypeId: 'roadmap',
          disableDefaultUI: false,
          zoomControl: true,
          styles: isNightMode ? GOOGLE_NIGHT_MAP_STYLES : []
        });

        // User Marker on Google Maps
        const userMarker = new window.google.maps.Marker({
          position: { lat: center[0], lng: center[1] },
          map: map,
          title: 'Your Position (Master Canteen, Bhubaneswar)',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: isNightMode ? '#4edea3' : '#0f172a',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3
          }
        });

        const userInfoWindow = new window.google.maps.InfoWindow({
          content: '<div style="padding:6px; font-weight:bold; font-size:12px; color:#0f172a;">📍 Your Current Position<br><span style="font-weight:normal; font-size:11px; color:#45464d;">Master Canteen, Bhubaneswar</span></div>'
        });
        userMarker.addListener('click', () => userInfoWindow.open(map, userMarker));

        // Emergency Markers on Google Maps
        markers.forEach((m) => {
          if (m.lat && m.lng) {
            const marker = new window.google.maps.Marker({
              position: { lat: m.lat, lng: m.lng },
              map: map,
              title: m.title,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: m.color || '#006c49',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2.5
              }
            });

            const cardContent = m.cardHtml ? m.cardHtml : `
              <div style="width:260px; font-family:Inter,sans-serif; padding:4px;">
                <div style="background-image:url('${m.img || ''}'); height:90px; background-size:cover; background-position:center; border-radius:10px; position:relative; margin-bottom:8px;">
                  <span style="position:absolute; top:6px; left:6px; background:#006c49; color:white; font-size:9px; font-weight:bold; padding:2px 6px; border-radius:12px;">✓ VERIFIED</span>
                  <span style="position:absolute; bottom:6px; right:6px; background:rgba(255,255,255,0.9); color:#191c1e; font-size:10px; font-weight:bold; padding:2px 6px; border-radius:6px;">${m.distanceStr || ''}</span>
                </div>
                <h4 style="font-size:13px; font-weight:bold; margin:0 0 2px 0; color:#0f172a;">${m.title}</h4>
                <p style="font-size:11px; color:#45464d; margin:0 0 8px 0;">${m.address || m.snippet || ''}</p>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
                  <a href="tel:${m.phone || '112'}" style="text-align:center; background:#f7f9fb; border:1.5px solid #0f172a; color:#0f172a; font-size:11px; font-weight:bold; padding:6px; border-radius:8px; text-decoration:none;">Dial</a>
                  <a href="https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}" target="_blank" style="text-align:center; background:#0f172a; color:white; font-size:11px; font-weight:bold; padding:6px; border-radius:8px; text-decoration:none;">Nav</a>
                </div>
              </div>
            `;

            const infoWindow = new window.google.maps.InfoWindow({
              content: cardContent
            });

            marker.addListener('click', () => {
              if (activeInfoWindowRef.current) activeInfoWindowRef.current.close();
              infoWindow.open(map, marker);
              activeInfoWindowRef.current = infoWindow;
            });

            if (m.selected) {
              infoWindow.open(map, marker);
              activeInfoWindowRef.current = infoWindow;
            }
          }
        });

        googleMapRef.current = map;
      } catch (err) {
        console.warn('[Google Maps] Error during initialization:', err);
        setMapProvider('vector');
      }
    } else if (window.L) {
      // Leaflet Carto Voyager Map Initialization
      const L = window.L;
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: true
      });

      let tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      if (isNightMode) {
        tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      }

      L.tileLayer(tileUrl, {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      // User Marker
      L.circleMarker(center, {
        radius: 10,
        fillColor: '#0f172a',
        color: '#ffffff',
        weight: 3,
        fillOpacity: 0.9
      }).addTo(map).bindPopup('<b>📍 Master Canteen, Bhubaneswar</b>');

      // Emergency Markers
      markers.forEach((m) => {
        if (m.lat && m.lng) {
          const cardContent = `
            <div style="width:220px; font-family:Inter,sans-serif; padding:2px;">
              <h4 style="font-size:13px; font-weight:bold; margin:0 0 2px 0; color:#0f172a;">${m.title}</h4>
              <p style="font-size:11px; color:#45464d; margin:0 0 8px 0;">${m.address || m.snippet || ''}</p>
              <div style="display:flex; gap:6px;">
                <a href="tel:${m.phone || '112'}" style="flex:1; text-align:center; background:#f7f9fb; border:1px solid #0f172a; color:#0f172a; font-size:10px; font-weight:bold; padding:4px; border-radius:6px; text-decoration:none;">Call ${m.phone || '112'}</a>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}" target="_blank" style="flex:1; text-align:center; background:#0f172a; color:white; font-size:10px; font-weight:bold; padding:4px; border-radius:6px; text-decoration:none;">Navigate</a>
              </div>
            </div>
          `;

          const circle = L.circleMarker([m.lat, m.lng], {
            radius: 9,
            fillColor: m.color || '#006c49',
            color: '#ffffff',
            weight: 2.5,
            fillOpacity: 0.95
          }).addTo(map).bindPopup(cardContent);

          if (m.selected) circle.openPopup();
        }
      });

      leafletMapRef.current = map;
      setTimeout(() => map.invalidateSize(), 250);
    }
  }, [center, zoom, showCorridor, markers, mapProvider, isNightMode, googleAuthFailed]);

  return (
    <div className="relative w-full h-full min-h-[450px] rounded-2xl overflow-hidden border border-outline-variant/60 shadow-xs bg-[#e5e9ec] flex flex-col">
      
      {/* Top Controls Bar */}
      <div className="absolute top-3 right-3 z-20 bg-surface/95 backdrop-blur-md p-1.5 rounded-2xl border border-outline-variant/60 shadow-lg flex items-center gap-2">
        
        {/* Map Provider Switcher */}
        <button
          type="button"
          onClick={() => {
            if (googleAuthFailed) {
              alert('Google Maps API Key requires "Maps JavaScript API" to be enabled in Google Cloud Console. Currently displaying high-reliability Vector Map (Carto Voyager).');
              return;
            }
            setMapProvider(mapProvider === 'google_sdk' ? 'vector' : 'google_sdk');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            mapProvider === 'google_sdk' && !googleAuthFailed
              ? 'bg-secondary text-on-secondary shadow-xs' 
              : 'bg-surface text-on-surface-variant hover:bg-surface-container border border-outline-variant/60'
          }`}
        >
          <span className="material-symbols-outlined text-sm">map</span>
          <span>{mapProvider === 'google_sdk' && !googleAuthFailed ? 'Google Maps' : 'Vector Map'}</span>
        </button>

        {/* Night View Toggle Button */}
        <button
          type="button"
          onClick={() => setIsNightMode(!isNightMode)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            isNightMode 
              ? 'bg-slate-900 text-white border border-slate-700 shadow-md ring-1 ring-slate-700' 
              : 'bg-surface text-on-surface-variant hover:bg-surface-container border border-outline-variant/60'
          }`}
        >
          <span className="material-symbols-outlined text-sm">
            {isNightMode ? 'dark_mode' : 'light_mode'}
          </span>
          <span>{isNightMode ? 'Night Mode Active' : 'Night View'}</span>
        </button>

      </div>

      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[450px] z-0" style={{ height }} />

    </div>
  );
};

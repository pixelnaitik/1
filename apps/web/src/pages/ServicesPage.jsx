import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { SafetyMap } from '../components/SafetyMap';
import { api } from '../services/api';

export const ServicesPage = () => {
  const [activeCategory, setActiveCategory] = useState('hospital'); // 'all' | 'police' | 'hospital' | 'ambulance'
  const [selectedService, setSelectedService] = useState(null);
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(true);
  const [mapCenter, setMapCenter] = useState([20.2961, 85.8245]);

  const [services, setServices] = useState([
    {
      id: 'srv_hosp_01',
      type: 'hospital',
      name: 'Capital General Hospital',
      phone: '+916742391983',
      address: 'Unit 6, Hospital Road, Bhubaneswar',
      distanceStr: '450m',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA11rlnfl6884S9CGCw56n9D2q5a4vL6YQMExjsB4Fqql4TnicSPxm12ISvq0Fv5HCe1yBw831T7t_D805EGwKSdzs7lL8sJxQbUbChWi8D48DfcU4Nuf005ID3Yt1st_OSVitIl8etwQsXgCcJAAmxy9U2VgKRh4JwffyEZoSe3HjHWkDKJOWTTXAdv77RXdsCC98Ejo17NLagWfmBLVtuK-fbxoeMa2EeaAoJnUsIpJdhwzezZJf',
      location: { latitude: 20.2745, longitude: 85.8260 }
    },
    {
      id: 'srv_hosp_02',
      type: 'hospital',
      name: "St. Jude's Trauma Center",
      phone: '+916742725182',
      address: 'KIIT Road, Patia, Bhubaneswar',
      distanceStr: '1.2km',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYgZP6e8WcBDq_JjfDPppqYXMe-XToHoFgqq4QplkxfJcLEUrszGV2jhEEl7AVNfvqLg7cn26nnLEwqlRz1B6DpgMpvnp_ueleZ12arQAXVq9f6C4jPL0849dqpVjdoI15ZuXs67DA_D9ALKThyAce0UAzfkqYRXlozEZ6Q7kGl8FHqG3564TzbqrjXbXE7f2uVRxDkiFa43ywdCgz_51b05i_XkmUUAP4kUnhvzDaBfYq7imh8sJD',
      location: { latitude: 20.3540, longitude: 85.8170 }
    },
    {
      id: 'srv_hosp_03',
      type: 'hospital',
      name: 'Mercy Private Hospital',
      phone: '+916742476789',
      address: 'Near Master Canteen, Janpath, Bhubaneswar',
      distanceStr: '3.5km',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDwqiUXr7-TPp5KeOF8Q5l4gEEVlL28E9VJaKJDY2Vpi8w8DU93keXEGmng1CNbnHS6UJLUuBvsa_NppNR9Z4taBy7_ccG2gENvJ-ITHvARXYmtyvojiPYJOSKcatYfZuhynf9EvWlFgVaXEWr0CQKvIYRkZhIIh0iLsqGJoENxjljhBviI7p1CD2ZkFejysnBBcOBglc5GlTcWKXwDxJ8rmvmQstjfOvwhZmTLGOAN1MC0OF_nL2D',
      location: { latitude: 20.2290, longitude: 85.7760 }
    },
    {
      id: 'srv_pol_01',
      type: 'police',
      name: 'Capital Police Station',
      phone: '112',
      address: 'Master Canteen Sq, Janpath, Bhubaneswar',
      distanceStr: '650m',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDwqiUXr7-TPp5KeOF8Q5l4gEEVlL28E9VJaKJDY2Vpi8w8DU93keXEGmng1CNbnHS6UJLUuBvsa_NppNR9Z4taBy7_ccG2gENvJ-ITHvARXYmtyvojiPYJOSKcatYfZuhynf9EvWlFgVaXEWr0CQKvIYRkZhIIh0iLsqGJoENxjljhBviI7p1CD2ZkFejysnBBcOBglc5GlTcWKXwDxJ8rmvmQstjfOvwhZmTLGOAN1MC0OF_nL2D',
      location: { latitude: 20.2850, longitude: 85.8340 }
    }
  ]);

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await api.getNearbyServices(activeCategory);
        if (res.services && res.services.length > 0) {
          const mapped = res.services.map((s, idx) => ({
            ...s,
            distanceStr: `${s.distanceM}m`,
            img: services[idx % services.length]?.img || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA11rlnfl6884S9CGCw56n9D2q5a4vL6YQMExjsB4Fqql4TnicSPxm12ISvq0Fv5HCe1yBw831T7t_D805EGwKSdzs7lL8sJxQbUbChWi8D48DfcU4Nuf005ID3Yt1st_OSVitIl8etwQsXgCcJAAmxy9U2VgKRh4JwffyEZoSe3HjHWkDKJOWTTXAdv77RXdsCC98Ejo17NLagWfmBLVtuK-fbxoeMa2EeaAoJnUsIpJdhwzezZJf'
          }));
          setServices(mapped);
        }
      } catch (err) {
        console.warn('Using local Bhubaneswar verified services:', err.message);
      }
    }
    loadServices();
  }, [activeCategory]);

  const filteredServices = activeCategory === 'all' 
    ? services 
    : services.filter(s => s.type === activeCategory);

  const mapMarkers = filteredServices.map((s) => ({
    lat: s.location.latitude,
    lng: s.location.longitude,
    title: s.name,
    address: s.address,
    phone: s.phone,
    distanceStr: s.distanceStr,
    img: s.img,
    color: s.type === 'hospital' ? '#006c49' : '#0f172a',
    selected: selectedService?.id === s.id
  }));

  const handleSelectService = (service) => {
    setSelectedService(service);
    setMapCenter([service.location.latitude, service.location.longitude]);
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col md:flex-row font-sans overflow-hidden">
      <Sidebar activeTab="/services" />

      <main className="flex-1 lg:ml-72 relative h-screen w-full bg-[#E8EAED]">
        
        {/* Map View */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <SafetyMap
            center={mapCenter}
            zoom={14}
            markers={mapMarkers}
            showCorridor={false}
          />
        </div>

        {/* Map Header & Filters */}
        <div className="absolute inset-0 z-10 p-4 md:p-8 pt-20 lg:pt-8 pointer-events-none flex flex-col">
          
          {/* Header Card */}
          <div className="mb-3 pointer-events-auto bg-surface/90 backdrop-blur-md p-4 rounded-2xl shadow-sm max-w-xl border border-outline-variant/50">
            <h1 className="text-lg md:text-xl font-extrabold text-primary mb-0.5">
              Emergency Services Directory
            </h1>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Locate nearby verified emergency responders and medical facilities in Bhubaneswar.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex overflow-x-auto pb-4 gap-2 pointer-events-auto">
            <button 
              onClick={() => setActiveCategory('all')}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                activeCategory === 'all' 
                  ? 'bg-secondary text-on-secondary shadow-md' 
                  : 'bg-surface/90 text-on-surface-variant border border-outline-variant hover:bg-surface-container-high'
              }`}
            >
              All
            </button>

            <button 
              onClick={() => setActiveCategory('police')}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                activeCategory === 'police' 
                  ? 'bg-secondary text-on-secondary shadow-md' 
                  : 'bg-surface/90 text-on-surface-variant border border-outline-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-base">local_police</span> Police
            </button>

            <button 
              onClick={() => setActiveCategory('hospital')}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                activeCategory === 'hospital' 
                  ? 'bg-secondary text-on-secondary shadow-md' 
                  : 'bg-surface/90 text-on-surface-variant border border-outline-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-base">local_hospital</span> Hospitals
            </button>

            <button 
              onClick={() => setActiveCategory('ambulance')}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                activeCategory === 'ambulance' 
                  ? 'bg-secondary text-on-secondary shadow-md' 
                  : 'bg-surface/90 text-on-surface-variant border border-outline-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-base">ambulance</span> Ambulances
            </button>
          </div>
        </div>

        {/* Responsive Expandable Drawer */}
        <div className="absolute bottom-4 right-4 z-20 pointer-events-auto max-w-sm w-full">
          <div className="bg-surface/95 backdrop-blur-md rounded-2xl border border-outline-variant/60 shadow-2xl overflow-hidden flex flex-col transition-all">
            
            {/* Drawer Header */}
            <div 
              onClick={() => setIsDrawerExpanded(!isDrawerExpanded)}
              className="p-3.5 bg-surface border-b border-outline-variant/50 flex items-center justify-between cursor-pointer hover:bg-surface-container-low transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-lg">medical_services</span>
                <span className="text-xs font-bold text-primary">Nearby Directory ({filteredServices.length})</span>
              </div>
              <button className="text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined text-base">
                  {isDrawerExpanded ? 'expand_more' : 'expand_less'}
                </span>
              </button>
            </div>

            {/* Scrollable Directory Content */}
            {isDrawerExpanded && (
              <div className="max-h-[300px] overflow-y-auto p-3 space-y-2.5">
                {filteredServices.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => handleSelectService(item)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedService?.id === item.id 
                        ? 'bg-surface-container-lowest border-secondary ring-2 ring-secondary/20 shadow-md' 
                        : 'bg-surface-container-lowest border-outline-variant/40 hover:border-secondary/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-xs font-bold text-primary leading-tight">{item.name}</h4>
                      <span className="text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-md font-bold shrink-0 ml-2">
                        {item.distanceStr || 'Nearby'}
                      </span>
                    </div>

                    <p className="text-[11px] text-on-surface-variant leading-normal mb-2.5">
                      {item.address}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-outline-variant/30">
                      <a 
                        href={`tel:${item.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="py-1.5 px-2 bg-secondary text-on-secondary text-center rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 hover:bg-secondary/90 transition-all shadow-xs"
                      >
                        <span className="material-symbols-outlined text-xs">call</span> Dial
                      </a>

                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${item.location.latitude},${item.location.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="py-1.5 px-2 border-2 border-primary text-primary text-center rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 hover:bg-primary hover:text-on-primary transition-all"
                      >
                        <span className="material-symbols-outlined text-xs">navigation</span> Nav
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

      </main>
    </div>
  );
};

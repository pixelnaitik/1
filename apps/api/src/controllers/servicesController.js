/**
 * Nearby Services Controller
 * SecureVoyage — Pilot Area: Bhubaneswar, Odisha
 */

const BHUBANESWAR_SERVICES = [
  {
    id: 'srv_pol_01',
    type: 'police',
    name: 'Capital Police Station',
    phone: '112',
    address: 'Near Master Canteen Sq, Janpath, Bhubaneswar, Odisha 751001',
    distanceM: 650,
    verifiedAt: '2026-08-01T00:00:00Z',
    location: { latitude: 20.2850, longitude: 85.8340 }
  },
  {
    id: 'srv_pol_02',
    type: 'police',
    name: 'Saheed Nagar Police Station',
    phone: '112',
    address: 'Saheed Nagar, Bhubaneswar, Odisha 751007',
    distanceM: 1100,
    verifiedAt: '2026-08-01T00:00:00Z',
    location: { latitude: 20.2910, longitude: 85.8420 }
  },
  {
    id: 'srv_pol_03',
    type: 'police',
    name: 'Chandrasekharpur Police Station',
    phone: '112',
    address: 'Infocity Rd, Patia, Bhubaneswar, Odisha 751024',
    distanceM: 3200,
    verifiedAt: '2026-08-01T00:00:00Z',
    location: { latitude: 20.3220, longitude: 85.8190 }
  },
  {
    id: 'srv_hosp_01',
    type: 'hospital',
    name: 'Capital Hospital Bhubaneswar',
    phone: '+916742391983',
    address: 'Unit 6, Hospital Road, Bhubaneswar, Odisha 751001',
    distanceM: 400,
    verifiedAt: '2026-08-01T00:00:00Z',
    location: { latitude: 20.2745, longitude: 85.8260 }
  },
  {
    id: 'srv_hosp_02',
    type: 'hospital',
    name: 'KIMS Super Specialty Hospital',
    phone: '+916742725182',
    address: 'KIIT Campus 11, Patia, Bhubaneswar, Odisha 751024',
    distanceM: 1800,
    verifiedAt: '2026-08-01T00:00:00Z',
    location: { latitude: 20.3540, longitude: 85.8170 }
  },
  {
    id: 'srv_hosp_03',
    type: 'hospital',
    name: 'AIIMS Bhubaneswar Trauma Center',
    phone: '+916742476789',
    address: 'Sijua, Dumuduma, Bhubaneswar, Odisha 751019',
    distanceM: 4200,
    verifiedAt: '2026-08-01T00:00:00Z',
    location: { latitude: 20.2290, longitude: 85.7760 }
  },
  {
    id: 'srv_hosp_04',
    type: 'hospital',
    name: 'Apollo Hospitals Bhubaneswar',
    phone: '+916746661016',
    address: 'Lake Area, Sainik School Rd, Bhubaneswar, Odisha 751005',
    distanceM: 2100,
    verifiedAt: '2026-08-01T00:00:00Z',
    location: { latitude: 20.3090, longitude: 85.8330 }
  },
  {
    id: 'srv_amb_01',
    type: 'ambulance',
    name: 'Odisha 108 Emergency Ambulance Hub',
    phone: '108',
    address: 'Capital Hospital Campus, Unit-6, Bhubaneswar',
    distanceM: 450,
    verifiedAt: '2026-08-01T00:00:00Z',
    location: { latitude: 20.2750, longitude: 85.8270 }
  }
];

export const getNearbyServices = (req, res) => {
  const { type } = req.query;

  let services = BHUBANESWAR_SERVICES;
  if (type && type !== 'all') {
    services = services.filter((s) => s.type === type);
  }

  return res.status(200).json({
    services,
    pilotCity: 'Bhubaneswar, Odisha',
    freshness: new Date().toISOString()
  });
};

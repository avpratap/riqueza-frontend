export interface State {
  code: string;
  name: string;
  evTariffPerKWh: number;
  petrolPerLitre: number;
  maintenanceIcePerKm: number;
  maintenanceEvPerKm: number;
}

export interface VariantDefaults {
  batteryKWh: number;
  realWorldWhPerKm: number;
  iceMileageKmPerL: number;
}

export interface CostBreakdown {
  fixed: number;
  maintenance: number;
  running: number;
  savings: number;
  total: number;
}

export interface CalculatorResult {
  ice: CostBreakdown;
  ev: CostBreakdown;
  monthlySavings: number;
  annualSavings: number;
}

// All Indian states with realistic data
export const STATES: State[] = [
  { code: 'AP', name: 'Andhra Pradesh', evTariffPerKWh: 6.0, petrolPerLitre: 101.5, maintenanceIcePerKm: 0.8, maintenanceEvPerKm: 0.2 },
  { code: 'AR', name: 'Arunachal Pradesh', evTariffPerKWh: 6.5, petrolPerLitre: 104.2, maintenanceIcePerKm: 0.9, maintenanceEvPerKm: 0.3 },
  { code: 'AS', name: 'Assam', evTariffPerKWh: 6.2, petrolPerLitre: 103.8, maintenanceIcePerKm: 0.8, maintenanceEvPerKm: 0.2 },
  { code: 'BR', name: 'Bihar', evTariffPerKWh: 6.3, petrolPerLitre: 102.9, maintenanceIcePerKm: 0.8, maintenanceEvPerKm: 0.2 },
  { code: 'CT', name: 'Chhattisgarh', evTariffPerKWh: 5.8, petrolPerLitre: 101.2, maintenanceIcePerKm: 0.7, maintenanceEvPerKm: 0.2 },
  { code: 'GA', name: 'Goa', evTariffPerKWh: 7.0, petrolPerLitre: 107.5, maintenanceIcePerKm: 0.9, maintenanceEvPerKm: 0.2 },
  { code: 'GJ', name: 'Gujarat', evTariffPerKWh: 6.8, petrolPerLitre: 104.2, maintenanceIcePerKm: 0.8, maintenanceEvPerKm: 0.2 },
  { code: 'HR', name: 'Haryana', evTariffPerKWh: 6.6, petrolPerLitre: 103.5, maintenanceIcePerKm: 0.8, maintenanceEvPerKm: 0.2 },
  { code: 'HP', name: 'Himachal Pradesh', evTariffPerKWh: 6.4, petrolPerLitre: 105.8, maintenanceIcePerKm: 0.9, maintenanceEvPerKm: 0.3 },
  { code: 'JK', name: 'Jammu and Kashmir', evTariffPerKWh: 6.7, petrolPerLitre: 106.2, maintenanceIcePerKm: 0.9, maintenanceEvPerKm: 0.3 },
  { code: 'JH', name: 'Jharkhand', evTariffPerKWh: 6.1, petrolPerLitre: 102.1, maintenanceIcePerKm: 0.8, maintenanceEvPerKm: 0.2 },
  { code: 'KA', name: 'Karnataka', evTariffPerKWh: 6.5, petrolPerLitre: 102.5, maintenanceIcePerKm: 0.8, maintenanceEvPerKm: 0.2 },
  { code: 'KL', name: 'Kerala', evTariffPerKWh: 6.7, petrolPerLitre: 105.4, maintenanceIcePerKm: 0.8, maintenanceEvPerKm: 0.2 },
  { code: 'MP', name: 'Madhya Pradesh', evTariffPerKWh: 6.2, petrolPerLitre: 102.8, maintenanceIcePerKm: 0.8, maintenanceEvPerKm: 0.2 },
  { code: 'MH', name: 'Maharashtra', evTariffPerKWh: 7.2, petrolPerLitre: 106.8, maintenanceIcePerKm: 0.9, maintenanceEvPerKm: 0.2 },
  { code: 'MN', name: 'Manipur', evTariffPerKWh: 6.4, petrolPerLitre: 104.5, maintenanceIcePerKm: 0.8, maintenanceEvPerKm: 0.2 },
  { code: 'ML', name: 'Meghalaya', evTariffPerKWh: 6.3, petrolPerLitre: 104.0, maintenanceIcePerKm: 0.8, maintenanceEvPerKm: 0.2 },
  { code: 'MZ', name: 'Mizoram', evTariffPerKWh: 6.5, petrolPerLitre: 104.8, maintenanceIcePerKm: 0.8, maintenanceEvPerKm: 0.2 },
  { code: 'NL', name: 'Nagaland', evTariffPerKWh: 6.6, petrolPerLitre: 105.0, maintenanceIcePerKm: 0.8, maintenanceEvPerKm: 0.2 },
  { code: 'OR', name: 'Odisha', evTariffPerKWh: 6.0, petrolPerLitre: 101.8, maintenanceIcePerKm: 0.8, maintenanceEvPerKm: 0.2 },
  { code: 'PB', name: 'Punjab', evTariffPerKWh: 6.8, petrolPerLitre: 105.2, maintenanceIcePerKm: 0.8, maintenanceEvPerKm: 0.2 },
  { code: 'RJ', name: 'Rajasthan', evTariffPerKWh: 6.4, petrolPerLitre: 103.7, maintenanceIcePerKm: 0.8, maintenanceEvPerKm: 0.2 },
  { code: 'SK', name: 'Sikkim', evTariffPerKWh: 6.9, petrolPerLitre: 106.5, maintenanceIcePerKm: 0.9, maintenanceEvPerKm: 0.3 },
  { code: 'TN', name: 'Tamil Nadu', evTariffPerKWh: 6.2, petrolPerLitre: 102.3, maintenanceIcePerKm: 0.8, maintenanceEvPerKm: 0.2 },
  { code: 'TG', name: 'Telangana', evTariffPerKWh: 6.1, petrolPerLitre: 101.9, maintenanceIcePerKm: 0.8, maintenanceEvPerKm: 0.2 },
  { code: 'TR', name: 'Tripura', evTariffPerKWh: 6.3, petrolPerLitre: 103.2, maintenanceIcePerKm: 0.8, maintenanceEvPerKm: 0.2 },
  { code: 'UP', name: 'Uttar Pradesh', evTariffPerKWh: 6.5, petrolPerLitre: 103.1, maintenanceIcePerKm: 0.8, maintenanceEvPerKm: 0.2 },
  { code: 'UK', name: 'Uttarakhand', evTariffPerKWh: 6.6, petrolPerLitre: 104.5, maintenanceIcePerKm: 0.8, maintenanceEvPerKm: 0.2 },
  { code: 'WB', name: 'West Bengal', evTariffPerKWh: 6.3, petrolPerLitre: 102.8, maintenanceIcePerKm: 0.8, maintenanceEvPerKm: 0.2 },
  { code: 'DL', name: 'Delhi', evTariffPerKWh: 6.8, petrolPerLitre: 96.7, maintenanceIcePerKm: 0.7, maintenanceEvPerKm: 0.1 },
  { code: 'CH', name: 'Chandigarh', evTariffPerKWh: 6.9, petrolPerLitre: 105.8, maintenanceIcePerKm: 0.8, maintenanceEvPerKm: 0.2 },
  { code: 'AN', name: 'Andaman and Nicobar Islands', evTariffPerKWh: 7.5, petrolPerLitre: 110.0, maintenanceIcePerKm: 1.0, maintenanceEvPerKm: 0.3 },
  { code: 'DN', name: 'Dadra and Nagar Haveli and Daman and Diu', evTariffPerKWh: 6.7, petrolPerLitre: 105.5, maintenanceIcePerKm: 0.8, maintenanceEvPerKm: 0.2 },
  { code: 'LD', name: 'Lakshadweep', evTariffPerKWh: 8.0, petrolPerLitre: 112.0, maintenanceIcePerKm: 1.2, maintenanceEvPerKm: 0.4 },
  { code: 'PY', name: 'Puducherry', evTariffPerKWh: 6.4, petrolPerLitre: 103.5, maintenanceIcePerKm: 0.8, maintenanceEvPerKm: 0.2 }
];

// Two vehicle models with different specifications
export const VARIANT_DEFAULTS: Record<string, VariantDefaults> = {
  'S1 Pro': {
    batteryKWh: 3.97,
    realWorldWhPerKm: 30,
    iceMileageKmPerL: 45
  },
  'S1 Pro+': {
    batteryKWh: 5.2,
    realWorldWhPerKm: 25,
    iceMileageKmPerL: 50
  }
};

// Fixed monthly costs
export const FIXED_COSTS = {
  iceFixed: 1800, // Slightly lower for ICE
  evFixed: 2000   // Slightly higher for EV
};

// Constants
export const DAYS_PER_MONTH = 30;

// Rupee formatter for Indian locale
export const formatRupee = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Compact rupee formatter for axis (₹1k style)
export const formatCompactRupee = (amount: number): string => {
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}k`;
  }
  return `₹${amount}`;
};

// Main calculation function
export const calculateEVSavings = (
  dailyDistance: number,
  selectedState: State,
  selectedVariant: string
): CalculatorResult => {
  const variant = VARIANT_DEFAULTS[selectedVariant];
  const monthlyKm = dailyDistance * DAYS_PER_MONTH;

  // EV calculations - NO maintenance cost for EV
  const evRunningCost = monthlyKm * (variant.realWorldWhPerKm / 1000) * selectedState.evTariffPerKWh;
  const evMaintenance = 0; // No maintenance cost for EV
  const evFixedCost = FIXED_COSTS.evFixed;
  const evTotal = evFixedCost + evMaintenance + evRunningCost;

  // ICE calculations
  const iceRunningCost = (monthlyKm / variant.iceMileageKmPerL) * selectedState.petrolPerLitre;
  const iceMaintenance = monthlyKm * selectedState.maintenanceIcePerKm;
  const iceFixedCost = FIXED_COSTS.iceFixed;
  const iceTotal = iceFixedCost + iceMaintenance + iceRunningCost;

  // Savings calculations
  const monthlySavings = Math.max(iceTotal - evTotal, 0);
  const annualSavings = monthlySavings * 12;

  // Calculate savings for EV bar (to match ICE total height visually)
  const evSavings = iceTotal - evTotal;

  return {
    ice: {
      fixed: iceFixedCost,
      maintenance: iceMaintenance,
      running: iceRunningCost,
      savings: 0,
      total: iceTotal
    },
    ev: {
      fixed: evFixedCost,
      maintenance: evMaintenance, // This will be 0
      running: evRunningCost,
      savings: Math.max(evSavings, 0),
      total: evTotal
    },
    monthlySavings: Math.round(monthlySavings),
    annualSavings: Math.round(annualSavings)
  };
};

// Get state by name
export const getStateByName = (name: string): State => {
  return STATES.find(state => state.name === name) || STATES[0];
};

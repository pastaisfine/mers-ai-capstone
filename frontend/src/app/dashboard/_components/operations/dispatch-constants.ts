export interface LocationOption {
  label: string
  formatted: string
  lat: number
  lng: number
  street?: string
  area?: string
  city?: string
  state?: string
  postalCode?: string
  landmark?: string
}

export const LOCATION_OPTIONS: LocationOption[] = [
  {
    label: "Jalan Ampang, KL (Near Mamak Pelita)",
    formatted: "Jalan Ampang, 50450 Kuala Lumpur",
    lat: 3.158,
    lng: 101.714,
    street: "Jalan Ampang",
    area: "KLCC vicinity",
    city: "Kuala Lumpur",
    state: "Wilayah Persekutuan",
    postalCode: "50450",
    landmark: "Mamak Pelita",
  },
  {
    label: "Taman Melawati, KL",
    formatted: "Jalan Bandar 12, Taman Melawati, 53100 Kuala Lumpur",
    lat: 3.21,
    lng: 101.748,
    street: "Jalan Bandar 12",
    area: "Taman Melawati",
    city: "Kuala Lumpur",
    state: "Wilayah Persekutuan",
    postalCode: "53100",
  },
  {
    label: "Federal Highway, KM 4.2",
    formatted: "Federal Highway KM 4.2, 43200 Cheras, Selangor",
    lat: 3.12,
    lng: 101.67,
    street: "Federal Highway",
    area: "KM 4.2",
    city: "Cheras",
    state: "Selangor",
    postalCode: "43200",
  },
  {
    label: "KLCC Park, Kuala Lumpur",
    formatted: "Jalan Pinang, 50088 Kuala Lumpur",
    lat: 3.153,
    lng: 101.714,
    street: "Jalan Pinang",
    city: "Kuala Lumpur",
    state: "Wilayah Persekutuan",
    postalCode: "50088",
  },
  {
    label: "Pantai Hospital KL",
    formatted: "8 Jalan Bukit Pantai, 59100 Kuala Lumpur",
    lat: 3.118,
    lng: 101.666,
    street: "Jalan Bukit Pantai",
    city: "Kuala Lumpur",
    state: "Wilayah Persekutuan",
    postalCode: "59100",
  },
]

export const RESPONDER_UNITS = [
  "Ambulance A1 - EMS Unit",
  "Ambulance B2 - EMS Unit",
  "Bomba Melawati - Unit Engine 1",
  "Bomba Ampang - Unit Engine 2",
  "IPD Cheras - Traffic Patrol",
  "IPD KL Central - Patrol Unit",
  "Hazmat Response Team Alpha",
] as const

export const PANIC_LEVELS = [
  "Extreme",
  "High",
  "Moderate",
  "Low",
  "Calm",
] as const

export const REJECT_REASON_PRESETS = [
  { value: "scam", label: "Suspected scam / prank call" },
  { value: "resolved", label: "Situation already resolved" },
  { value: "duplicate", label: "Duplicate report" },
  { value: "false_alarm", label: "False alarm — no emergency found" },
  { value: "unverified", label: "Unable to verify caller location" },
  { value: "other", label: "Other (add details below)" },
] as const

export function findLocationOption(label: string) {
  return LOCATION_OPTIONS.find((opt) => opt.label === label)
}

export function stripEntityIcon(entity: string) {
  return entity
    .replace(/^[\p{Extended_Pictographic}\uFE0F\u200D\s]+/u, "")
    .trim()
}

export function formatCallDuration(duration: string) {
  if (duration.endsWith("m")) return duration
  return `${duration}m`
}

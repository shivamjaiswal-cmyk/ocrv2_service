// Mock data for OCR Config Studio

export const modules = [
  { id: "trips", name: "Trips" },
  { id: "indent", name: "Indent" },
  { id: "epod", name: "ePOD" },
  { id: "lr", name: "LR" },
  { id: "freight-invoice", name: "Freight Invoice" },
];

export const consignors = [
  { id: "acme", name: "ACME Corp", moduleId: "freight" },
  { id: "globex", name: "Globex Industries", moduleId: "freight" },
  { id: "initech", name: "Initech", moduleId: "warehouse" },
  { id: "umbrella", name: "Umbrella Corp", moduleId: "distribution" },
  { id: "wayne", name: "Wayne Enterprises", moduleId: "customs" },
];

export const transporters = [
  { id: "fastship", name: "FastShip Logistics", consignorId: "acme" },
  { id: "speedcargo", name: "SpeedCargo", consignorId: "acme" },
  { id: "globalfreight", name: "Global Freight Co", consignorId: "globex" },
  { id: "quickhaul", name: "QuickHaul", consignorId: "initech" },
  { id: "primelogistics", name: "Prime Logistics", consignorId: "umbrella" },
];

export const standardFields = [
  { id: "shipment_id", name: "Shipment ID", type: "string", mandatory: true },
  { id: "sender_name", name: "Sender Name", type: "string", mandatory: true },
  { id: "sender_address", name: "Sender Address", type: "string", mandatory: true },
  { id: "receiver_name", name: "Receiver Name", type: "string", mandatory: true },
  { id: "receiver_address", name: "Receiver Address", type: "string", mandatory: true },
  { id: "weight", name: "Weight (kg)", type: "number", mandatory: true },
  { id: "dimensions", name: "Dimensions", type: "string", mandatory: false },
  { id: "ship_date", name: "Ship Date", type: "date", mandatory: true },
  { id: "delivery_date", name: "Expected Delivery", type: "date", mandatory: false },
  { id: "tracking_number", name: "Tracking Number", type: "string", mandatory: true },
  { id: "hazmat_code", name: "Hazmat Code", type: "string", mandatory: false },
  { id: "insurance_value", name: "Insurance Value", type: "number", mandatory: false },
  { id: "special_instructions", name: "Special Instructions", type: "string", mandatory: false },
  { id: "priority", name: "Priority Level", type: "string", mandatory: false },
];

export const sampleOcrOutput = {
  document: {
    type: "Bill of Lading",
    shipment_number: "SHP-2024-00892",
    date_created: "2024-03-15",
  },
  sender: {
    name: "Acme Corporation",
    full_address: "123 Industrial Way, Chicago, IL 60601",
    contact: "John Smith",
    phone: "+1-555-0123",
  },
  receiver: {
    name: "Global Retail Inc",
    full_address: "456 Commerce Blvd, Los Angeles, CA 90210",
    contact: "Jane Doe",
    phone: "+1-555-0456",
  },
  package: {
    weight_kg: 245.5,
    dimensions_cm: "120x80x60",
    quantity: 5,
    description: "Electronic Components",
  },
  tracking: {
    id: "TRK-789456123",
    carrier: "FastShip Logistics",
    service: "Express",
  },
  dates: {
    shipped: "2024-03-15",
    expected_delivery: "2024-03-18",
  },
};

// Extract all JSON paths from sample output for suggestions
export const extractJsonPaths = (obj: Record<string, unknown>, prefix = "$"): string[] => {
  const paths: string[] = [];
  for (const key in obj) {
    const path = `${prefix}.${key}`;
    const value = obj[key];
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      paths.push(...extractJsonPaths(value as Record<string, unknown>, path));
    } else {
      paths.push(path);
    }
  }
  return paths;
};

export const jsonPathSuggestions = extractJsonPaths(sampleOcrOutput);

// Configs with updatedBy field for the Config List
export interface Config {
  id: string;
  moduleId: string;
  consignorId: string | null;
  transporterId: string | null;
  prompt: string;
  mappings: Record<string, { jsonPath: string; mandatory: boolean }>;
  updatedAt: string;
  updatedBy: string;
  hasCustomPrompt: boolean;
}

export const configs: Config[] = [
  {
    id: "config-1",
    moduleId: "freight",
    consignorId: "acme",
    transporterId: null,
    prompt: "Extract ACME shipment details with special attention to hazmat codes and insurance values. Include sender/receiver info, weights, and tracking numbers.",
    mappings: {
      shipment_id: { jsonPath: "$.document.shipment_number", mandatory: true },
      sender_name: { jsonPath: "$.sender.name", mandatory: true },
      sender_address: { jsonPath: "$.sender.full_address", mandatory: true },
      receiver_name: { jsonPath: "$.receiver.name", mandatory: true },
      weight: { jsonPath: "$.package.weight_kg", mandatory: true },
      tracking_number: { jsonPath: "$.tracking.id", mandatory: true },
    },
    updatedAt: "2024-03-15",
    updatedBy: "admin@company.com",
    hasCustomPrompt: true,
  },
  {
    id: "config-2",
    moduleId: "freight",
    consignorId: "acme",
    transporterId: "fastship",
    prompt: "Extract FastShip BOL with priority handling codes and express delivery markers. Pay attention to special instructions.",
    mappings: {
      shipment_id: { jsonPath: "$.document.shipment_number", mandatory: true },
      sender_name: { jsonPath: "$.sender.name", mandatory: true },
      tracking_number: { jsonPath: "$.tracking.id", mandatory: true },
      priority: { jsonPath: "$.tracking.service", mandatory: false },
    },
    updatedAt: "2024-03-14",
    updatedBy: "operator@company.com",
    hasCustomPrompt: true,
  },
  {
    id: "config-3",
    moduleId: "freight",
    consignorId: "globex",
    transporterId: null,
    prompt: "Extract Globex shipment information including all dimensional data and insurance values.",
    mappings: {
      shipment_id: { jsonPath: "$.document.shipment_number", mandatory: true },
      sender_name: { jsonPath: "$.sender.name", mandatory: true },
      dimensions: { jsonPath: "$.package.dimensions_cm", mandatory: true },
    },
    updatedAt: "2024-03-12",
    updatedBy: "admin@company.com",
    hasCustomPrompt: true,
  },
  {
    id: "config-4",
    moduleId: "warehouse",
    consignorId: "initech",
    transporterId: null,
    prompt: "Extract warehouse receipt details including storage location and inventory counts.",
    mappings: {
      shipment_id: { jsonPath: "$.document.shipment_number", mandatory: true },
      receiver_name: { jsonPath: "$.receiver.name", mandatory: true },
    },
    updatedAt: "2024-03-10",
    updatedBy: "manager@company.com",
    hasCustomPrompt: true,
  },
  {
    id: "config-5",
    moduleId: "warehouse",
    consignorId: "initech",
    transporterId: "quickhaul",
    prompt: "Default warehouse prompt for QuickHaul deliveries.",
    mappings: {
      shipment_id: { jsonPath: "$.document.shipment_number", mandatory: true },
    },
    updatedAt: "2024-03-08",
    updatedBy: "operator@company.com",
    hasCustomPrompt: false,
  },
  {
    id: "config-6",
    moduleId: "distribution",
    consignorId: "umbrella",
    transporterId: null,
    prompt: "Extract distribution manifest with route details and delivery scheduling information.",
    mappings: {
      shipment_id: { jsonPath: "$.document.shipment_number", mandatory: true },
      sender_name: { jsonPath: "$.sender.name", mandatory: true },
      receiver_name: { jsonPath: "$.receiver.name", mandatory: true },
      delivery_date: { jsonPath: "$.dates.expected_delivery", mandatory: true },
    },
    updatedAt: "2024-03-05",
    updatedBy: "admin@company.com",
    hasCustomPrompt: true,
  },
];

export const defaultPrompt = `Extract the following information from the document:
- Shipment/Document ID
- Sender name and address
- Receiver name and address
- Package weight and dimensions
- Tracking number
- Ship date and expected delivery date

Return the data in structured JSON format.`;
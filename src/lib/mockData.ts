// Mock data for OCR Config Studio

export const modules = [
  { id: "freight", name: "Freight" },
  { id: "warehouse", name: "Warehouse" },
  { id: "distribution", name: "Distribution" },
  { id: "customs", name: "Customs" },
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

export const configs = [
  {
    id: "config-1",
    moduleId: "freight",
    consignorId: null,
    transporterId: null,
    level: "module",
    prompt: "Extract shipment details including sender, receiver, weight, and dimensions.",
    version: 3,
    createdAt: "2024-01-15",
    updatedAt: "2024-03-10",
  },
  {
    id: "config-2",
    moduleId: "freight",
    consignorId: "acme",
    transporterId: null,
    level: "consignor",
    prompt: "Extract ACME shipment details with special attention to hazmat codes and insurance values.",
    version: 2,
    createdAt: "2024-02-01",
    updatedAt: "2024-03-05",
  },
  {
    id: "config-3",
    moduleId: "freight",
    consignorId: "acme",
    transporterId: "fastship",
    level: "transporter",
    prompt: "Extract FastShip BOL with priority handling codes and express delivery markers.",
    version: 1,
    createdAt: "2024-03-01",
    updatedAt: "2024-03-01",
  },
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

export const fieldMappings = [
  { fieldId: "shipment_id", jsonPath: "$.document.shipment_number", transform: "trim", confidence: 95 },
  { fieldId: "sender_name", jsonPath: "$.sender.name", transform: "uppercase", confidence: 92 },
  { fieldId: "sender_address", jsonPath: "$.sender.full_address", transform: "trim", confidence: 88 },
  { fieldId: "receiver_name", jsonPath: "$.receiver.name", transform: "uppercase", confidence: 94 },
  { fieldId: "receiver_address", jsonPath: "$.receiver.full_address", transform: "trim", confidence: 87 },
  { fieldId: "weight", jsonPath: "$.package.weight_kg", transform: "number", confidence: 96 },
  { fieldId: "ship_date", jsonPath: "$.dates.shipped", transform: "date", confidence: 91 },
  { fieldId: "tracking_number", jsonPath: "$.tracking.id", transform: "trim", confidence: 98 },
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

export const validationRules = [
  { id: "rule-1", field: "weight", operator: "greater_than", value: "0", action: "error", message: "Weight must be positive" },
  { id: "rule-2", field: "ship_date", operator: "not_empty", value: "", action: "error", message: "Ship date is required" },
  { id: "rule-3", field: "insurance_value", operator: "greater_than", value: "10000", action: "warning", message: "High value shipment - verify insurance" },
  { id: "rule-4", field: "hazmat_code", operator: "matches", value: "^HAZ-[A-Z]{2}[0-9]{3}$", action: "error", message: "Invalid hazmat code format" },
];

export const auditTrail = [
  {
    id: "audit-1",
    timestamp: "2024-03-15T14:32:00Z",
    user: "admin@ocrconfig.com",
    action: "Prompt Updated",
    entity: "Config: Freight > ACME",
    changeType: "prompt",
    before: "Extract shipment details...",
    after: "Extract ACME shipment details with special attention...",
  },
  {
    id: "audit-2",
    timestamp: "2024-03-14T10:15:00Z",
    user: "operator@ocrconfig.com",
    action: "Field Mapping Added",
    entity: "Mapping: hazmat_code",
    changeType: "mapping",
    before: null,
    after: "$.package.hazmat_classification",
  },
  {
    id: "audit-3",
    timestamp: "2024-03-13T16:45:00Z",
    user: "admin@ocrconfig.com",
    action: "Validation Rule Created",
    entity: "Rule: Weight Validation",
    changeType: "validation",
    before: null,
    after: "weight > 0 → error",
  },
  {
    id: "audit-4",
    timestamp: "2024-03-12T09:20:00Z",
    user: "manager@ocrconfig.com",
    action: "Mandatory Field Changed",
    entity: "Field: insurance_value",
    changeType: "mandatory",
    before: "Optional",
    after: "Mandatory",
  },
  {
    id: "audit-5",
    timestamp: "2024-03-11T11:00:00Z",
    user: "admin@ocrconfig.com",
    action: "Config Cloned",
    entity: "Config: Freight > Globex",
    changeType: "config",
    before: "Cloned from: Freight > ACME",
    after: "New config created",
  },
];

export const promptVersions = [
  { version: 1, date: "2024-01-15", prompt: "Extract basic shipment information from the document." },
  { version: 2, date: "2024-02-10", prompt: "Extract shipment details including sender, receiver, weight, and dimensions." },
  { version: 3, date: "2024-03-10", prompt: "Extract shipment details including sender, receiver, weight, and dimensions. Pay special attention to tracking numbers and delivery dates." },
];

export const dashboardStats = {
  activeConfigs: 12,
  pendingMappings: 3,
  testRunsToday: 47,
  errorRate: 2.3,
  successfulMappings: 156,
  configHealth: {
    healthy: 9,
    warning: 2,
    error: 1,
  },
};

export const recentActivity = [
  { id: 1, action: "Config updated", target: "Freight > ACME > FastShip", user: "admin", time: "2 hours ago" },
  { id: 2, action: "OCR test run", target: "Warehouse > Initech", user: "operator", time: "3 hours ago" },
  { id: 3, action: "Mapping fixed", target: "Distribution > Umbrella", user: "admin", time: "5 hours ago" },
  { id: 4, action: "New config created", target: "Customs > Wayne", user: "manager", time: "Yesterday" },
  { id: 5, action: "Validation rule added", target: "Freight module", user: "admin", time: "Yesterday" },
];

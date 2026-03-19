const MONITOR_DELIVERY_OPTIONS: Record<string, string[]> = {
  "On courier": ["delivered", "partial completed", "returned", "canceled"],
  delivered: ["completed"],
  partial_delivered: ["partial completed"],
};

const STATUS_OPTIONS_MAP: Record<string, string[]> = {
  pending: ["confirmed", "follow up", "canceled", "deleted"],
  confirmed: ["processing", "canceled"],
  processing: ["processing done", "follow up", "canceled"],
  "warranty processing": ["processing done", "canceled"],
  "warranty added": ["processing done", "canceled"],
  "processing done": ["schedule pickup", "completed", "canceled"],
  "follow up": ["confirmed", "canceled", "deleted"],
  canceled: ["confirmed"],
  cancelled: ["returned"],
  "On courier": ["completed", "canceled", "partial completed"],
  delivered: ["completed"],
  partial_delivered: ["partial completed"],
};

const statusOptions = (status: string, route?: string) => {
  if (route === "monitor") {
    return MONITOR_DELIVERY_OPTIONS[status] || STATUS_OPTIONS_MAP[status] || [];
  }
  return STATUS_OPTIONS_MAP[status] || [];
};

export default statusOptions;

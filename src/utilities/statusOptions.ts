const STATUS_OPTIONS_MAP: Record<string, string[]> = {
  pending: ["confirmed", "follow up", "canceled", "deleted"],
  confirmed: ["processing", "canceled"],
  processing: ["processing done", "canceled"],
  "warranty processing": ["processing done", "canceled"],
  "warranty added": ["processing done", "canceled"],
  "processing done": ["completed", "canceled"],
  "follow up": ["confirmed", "canceled", "deleted"],
  canceled: ["confirmed"],
  cancelled: ["returned"],
};

const statusOptions = (status: string) => {
  return STATUS_OPTIONS_MAP[status] || [];
};

export default statusOptions;

import { PRODUCT_STATUS } from "@/const/products";
import { ROLES } from "@/const/role";

const STATUS_COLORS: Record<string, string> = {
  // Yellow
  pending: "bg-[#fec400]",
  delivered_approval_pending: "bg-[#fec400]",
  partial_delivered_approval_pending: "bg-[#fec400]",
  unknown_approval_pending: "bg-[#fec400]",
  cancelled_approval_pending: "bg-[#fec400]",
  hold: "bg-[#fec400]",

  // Green / Success
  confirmed: "bg-[#6BD3B0]",
  "processing done": "bg-[#6BD3B0]",
  [PRODUCT_STATUS.PUBLISHED]: "bg-[#6BD3B0]",
  Published: "bg-[#6BD3B0]",

  completed: "bg-[#2DB224]",
  "partial completed": "bg-[#2DB224]",
  solved: "bg-[#2DB224]",
  approved: "bg-[#2DB224]",
  active: "bg-[#2DB224]",

  Public: "bg-[#32CD32]",

  // Orange / Processing
  processing: "bg-[#FA8232]",
  in_review: "bg-[#FA8232]",
  "warranty processing": "bg-[#ca8b68]",

  // Teal / Info
  "warranty added": "bg-[#00C3C6]",
  "follow up": "bg-[#00C3C6]",
  "retry required": "bg-[#00C3C6]",

  // Blue
  "on courier": "bg-[#4c84ff]",
  partial_delivered: "bg-[#4c84ff]",

  // Red / Error
  cancelled: "bg-[#fe5461]",
  canceled: "bg-[#fe5461]",
  returned: "bg-[#fe5461]",
  [PRODUCT_STATUS.PRIVATE]: "bg-[#fe5461]",
  Private: "bg-[#fe5461]",

  deleted: "bg-[#C70000]",
  problem: "bg-[#C70000]",
  banned: "bg-[#C70000]",

  // Pink
  "partly returned": "bg-[#E38390]",

  // Gray
  [PRODUCT_STATUS.DRAFT]: "bg-[#808080]",
  Draft: "bg-[#808080]",

  // Roles
  [ROLES.ADMIN]: "bg-teal-500",
  [ROLES.STAFF]: "bg-cyan-500",

  // Default
  all: "bg-primary",
};

const backgroundColor = (status: string) => {
  return STATUS_COLORS[status] || "bg-primary";
};

export default backgroundColor;

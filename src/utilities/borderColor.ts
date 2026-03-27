import { PRODUCT_STATUS } from "@/const/products";

const STATUS_BORDER_COLORS: Record<string, string> = {
  // Yellow
  pending:
    "ring-1 ring-[#fec400] text-[#fec400] hover:bg-[#fec400] hover:text-white",
  delivered_approval_pending:
    "ring-1 ring-[#fec400] text-[#fec400] hover:bg-[#fec400] hover:text-white",
  partial_delivered_approval_pending:
    "ring-1 ring-[#fec400] text-[#fec400] hover:bg-[#fec400] hover:text-white",
  unknown_approval_pending:
    "ring-1 ring-[#fec400] text-[#fec400] hover:bg-[#fec400] hover:text-white",
  cancelled_approval_pending:
    "ring-1 ring-[#fec400] text-[#fec400] hover:bg-[#fec400] hover:text-white",
  hold: "ring-1 ring-[#fec400] text-[#fec400] hover:bg-[#fec400] hover:text-white",

  // Green / Success
  confirmed:
    "ring-1 ring-[#6BD3B0] text-[#6BD3B0] hover:bg-[#6BD3B0] hover:text-white",
  "processing done":
    "ring-1 ring-[#6BD3B0] text-[#6BD3B0] hover:bg-[#6BD3B0] hover:text-white",
  [PRODUCT_STATUS.PUBLISHED]:
    "ring-1 ring-[#6BD3B0] text-[#6BD3B0] hover:bg-[#6BD3B0] hover:text-white",
  Published:
    "ring-1 ring-[#6BD3B0] text-[#6BD3B0] hover:bg-[#6BD3B0] hover:text-white",
  // published: "ring-1 ring-[#6BD3B0] text-[#6BD3B0] hover:bg-[#6BD3B0] hover:text-white", // Handled by constant

  completed:
    "ring-1 ring-[#2DB224] text-[#2DB224] hover:text-white hover:bg-[#2DB224]",
  "partial completed":
    "ring-1 ring-[#2DB224] text-[#2DB224] hover:text-white hover:bg-[#2DB224]",

  Public:
    "ring-1 ring-[#32CD32] text-[#32CD32] hover:text-white hover:bg-[#32CD32]",

  // Orange / Processing
  processing:
    "ring-1 ring-[#FA8232] text-[#FA8232] hover:bg-[#FA8232] hover:text-white",
  in_review:
    "ring-1 ring-[#FA8232] text-[#FA8232] hover:bg-[#FA8232] hover:text-white",
  "warranty processing":
    "ring-1 ring-[#ca8b68] text-[#FA8232] hover:bg-[#ca8b68] hover:text-white",

  // Teal / Info
  "warranty added":
    "ring-1 ring-[#00C3C6] text-[#00C3C6] hover:text-white hover:bg-[#00C3C6]",
  "follow up":
    "ring-1 ring-[#00C3C6] text-[#00C3C6] hover:text-white hover:bg-[#00C3C6]",

  // Blue
  "on courier":
    "ring-1 ring-[#4c84ff] text-[#4c84ff] hover:bg-[#4c84ff] hover:text-white",
  partial_delivered:
    "ring-1 ring-[#4c84ff] text-[#4c84ff] hover:bg-[#4c84ff] hover:text-white",

  // Red / Error
  cancelled:
    "ring-1 ring-[#fe5461] text-[#fe5461]  hover:text-white hover:bg-[#fe5461]",
  canceled:
    "ring-1 ring-[#fe5461] text-[#fe5461]  hover:text-white hover:bg-[#fe5461]",
  returned:
    "ring-1 ring-[#fe5461] text-[#fe5461]  hover:text-white hover:bg-[#fe5461]",
  [PRODUCT_STATUS.PRIVATE]:
    "ring-1 ring-[#fe5461] text-[#fe5461]  hover:text-white hover:bg-[#fe5461]",
  Private:
    "ring-1 ring-[#fe5461] text-[#fe5461]  hover:text-white hover:bg-[#fe5461]",
  // private: "ring-1 ring-[#fe5461] text-[#fe5461]  hover:text-white hover:bg-[#fe5461]", // Handled by constant

  deleted:
    "ring-1 ring-[#C70000] text-[#C70000] hover:text-white hover:bg-[#C70000]",

  // Pink
  "partly returned":
    "ring-1 ring-[#E38390] text-[#E38390] hover:text-white hover:bg-[#E38390]",

  // Gray
  [PRODUCT_STATUS.DRAFT]:
    "ring-1 ring-[#808080] text-[#808080] hover:text-white hover:bg-[#808080]",
  Draft:
    "ring-1 ring-[#808080] text-[#808080] hover:text-white hover:bg-[#808080]",
  // draft: "ring-1 ring-[#808080] text-[#808080] hover:text-white hover:bg-[#808080]", // Handled by constant

  // Default
  all: "ring-1 ring-primary text-primary hover:bg-primary hover:text-white",
};

const borderColor = (status: string) => {
  return (
    STATUS_BORDER_COLORS[status] ||
    "ring-1 ring-primary text-primary hover:bg-primary hover:text-white"
  );
};

export default borderColor;

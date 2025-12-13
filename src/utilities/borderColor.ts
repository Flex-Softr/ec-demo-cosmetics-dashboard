const borderColor = (status: string) => {
  return status === "all"
    ? "ring-1 ring-primary text-primary hover:bg-primary hover:text-white"
    : status === "pending" ||
        status === "delivered_approval_pending" ||
        status === "partial_delivered_approval_pending" ||
        status === "unknown_approval_pending" ||
        status === "cancelled_approval_pending" ||
        status === "hold"
      ? "ring-1 ring-[#fec400] text-[#fec400] hover:bg-[#fec400] hover:text-white"
      : status === "confirmed"
        ? "ring-1 ring-[#6BD3B0] text-[#6BD3B0] hover:bg-[#6BD3B0] hover:text-white"
        : status === "processing" || status === "in_review"
          ? "ring-1 ring-[#FA8232] text-[#FA8232] hover:bg-[#FA8232] hover:text-white"
          : status === "warranty processing"
            ? "ring-1 ring-[#ca8b68] text-[#FA8232] hover:bg-[#ca8b68] hover:text-white"
            : status === "warranty added"
              ? "ring-1 ring-[#00C3C6] text-[#00C3C6] hover:text-white hover:bg-[#00C3C6]"
              : status === "processing done"
                ? "ring-1 ring-[#6BD3B0] text-[#6BD3B0] hover:bg-[#6BD3B0] hover:text-white"
                : status === "On courier" || status === "partial_delivered"
                  ? "ring-1 ring-[#4c84ff] text-[#4c84ff] hover:bg-[#4c84ff] hover:text-white"
                  : status === "canceled" ||
                      status === "cancelled" ||
                      status === "returned"
                    ? "ring-1 ring-[#fe5461] text-[#fe5461]  hover:text-white hover:bg-[#fe5461]"
                    : status === "deleted"
                      ? "ring-1 ring-[#C70000] text-[#C70000] hover:text-white hover:bg-[#C70000]"
                      : status === "completed" || status === "partial completed"
                        ? "ring-1 ring-[#2DB224] text-[#2DB224] hover:text-white hover:bg-[#2DB224]"
                        : status === "partly returned"
                          ? "ring-1 ring-[#E38390] text-[#E38390] hover:text-white hover:bg-[#E38390]"
                          : status === "follow up"
                            ? "ring-1 ring-[#00C3C6] text-[#00C3C6] hover:text-white hover:bg-[#00C3C6]"
                            : status === "Public"
                              ? "ring-1 ring-[#32CD32] text-[#32CD32] hover:text-white hover:bg-[#32CD32]"
                              : status === "Private"
                                ? "ring-1 ring-[#fe5461] text-[#fe5461]  hover:text-white hover:bg-[#fe5461]"
                                : status === "Published"
                                  ? "ring-1 ring-[#6BD3B0] text-[#6BD3B0] hover:bg-[#6BD3B0] hover:text-white"
                                  : status === "Draft"
                                    ? "ring-1 ring-[#808080] text-[#808080] hover:text-white hover:bg-[#808080]"
                                    : "ring-1 ring-primary text-primary hover:bg-primary hover:text-white";
};

export default borderColor;

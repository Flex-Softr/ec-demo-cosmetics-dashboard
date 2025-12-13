const backgroundColor = (status: string) => {
  return status === "all"
    ? "bg-primary"
    : status === "pending" ||
        status === "delivered_approval_pending" ||
        status === "partial_delivered_approval_pending" ||
        status === "unknown_approval_pending" ||
        status === "cancelled_approval_pending" ||
        status === "hold"
      ? "bg-[#fec400]"
      : status === "confirmed"
        ? "bg-[#6BD3B0]"
        : status === "processing" || status === "in_review"
          ? "bg-[#FA8232]"
          : status === "warranty processing"
            ? "bg-[#ca8b68]"
            : status === "warranty added"
              ? "bg-[#00C3C6]"
              : status === "processing done"
                ? "bg-[#6BD3B0]"
                : status === "On courier" || status === "partial_delivered"
                  ? "bg-[#4c84ff]"
                  : status === "cancelled" ||
                      status === "canceled" ||
                      status === "returned"
                    ? "bg-[#fe5461]"
                    : status === "deleted" ||
                        status === "problem" ||
                        status === "banned"
                      ? "bg-[#C70000]"
                      : status === "completed" ||
                          status === "partial completed" ||
                          status === "solved" ||
                          status === "approved" ||
                          status === "active"
                        ? "bg-[#2DB224]"
                        : status === "partly returned"
                          ? "bg-[#E38390]"
                          : status === "follow up" ||
                              status === "retry required"
                            ? "bg-[#00C3C6]"
                            : status === "Public"
                              ? "bg-[#32CD32]"
                              : status === "Private"
                                ? "bg-[#fe5461]"
                                : status === "Published"
                                  ? "bg-[#6BD3B0]"
                                  : status === "Draft"
                                    ? "bg-[#808080]"
                                    : status === "admin"
                                      ? "bg-teal-500"
                                      : status === "staff"
                                        ? "bg-cyan-500"
                                        : "bg-primary";
};

export default backgroundColor;

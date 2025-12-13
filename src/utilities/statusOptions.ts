const statusOptions = (status: string) => {
  const statusOptions =
    status === "pending"
      ? ["confirmed", "follow up", "canceled", "deleted"]
      : status === "confirmed"
        ? ["processing", "canceled"]
        : status === "processing" ||
            status === "warranty processing" ||
            status === "warranty added"
          ? ["processing done", "canceled"]
          : status === "processing done"
            ? ["On courier", "completed", "canceled"]
            : status === "follow up"
              ? ["confirmed", "canceled", "deleted"]
              : status === "canceled"
                ? ["confirmed"]
                : status === "cancelled"
                  ? ["returned"]
                  : [];

  return statusOptions;
};

export default statusOptions;

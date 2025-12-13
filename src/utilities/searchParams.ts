const searchParams = (
  args: { [key: string]: unknown } | ArrayLike<unknown>
) => {
  const params = new URLSearchParams();

  if (args) {
    Object.entries(args).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        if (Array.isArray(value)) {
          // Append each array item separately under the same key
          value.forEach((item) => {
            if (item !== null && item !== undefined && item !== "") {
              params.append(key, item.toString());
            }
          });
        } else {
          params.append(key, value.toString());
        }
      }
    });
  }

  return params.toString();
};

export default searchParams;

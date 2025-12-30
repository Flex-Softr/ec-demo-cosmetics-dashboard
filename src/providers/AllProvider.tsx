"use client";
import { ThemeProvider } from "@/components/provider/theme-provider";
import store from "@/redux/store";
import { Provider } from "react-redux";

const AllProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <Provider store={store}>{children}</Provider>
    </ThemeProvider>
  );
};

export default AllProvider;

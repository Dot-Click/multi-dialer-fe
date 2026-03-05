import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "react-hot-toast";

import Router from "@/router";
import ThemeWrapper from "@/components/common/ThemeWrapper";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeWrapper>
        <Router />
        <Toaster position="top-right" reverseOrder={false} />
      </ThemeWrapper>
    </QueryClientProvider>
  );
};

export default App;

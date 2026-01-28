import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { Toaster } from 'react-hot-toast';

import Router from "@/router";


const App = () => {


  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>

      <Router />
      <Toaster position="top-right" reverseOrder={false} />
    </QueryClientProvider>
  );
}

export default App
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";


import Router from "@/router";


const App = () => {
 

  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>

      <Router/>

      {/* auth pages  */}

      {/* <Login/> */}
      {/* <Code/> */}
      {/* <ChangePassword/> */}
      {/* <AdminLogin/> */}
      {/* <RecoveryPassword/> */}
      {/* <AdminChangePassword/> */}

    

    </QueryClientProvider>
  );
}

export default App
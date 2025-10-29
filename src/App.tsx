import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import Login from "@/pages/auth/login.page";
import Code from "@/pages/auth/code.page";
import ChangePassword from "./pages/auth/changepassword.page";
import AdminLogin from "./pages/auth/adminlogin.page";
import RecoveryPassword from "./pages/auth/recoverypassword.page";
import AdminChangePassword from "./pages/auth/adminchangepassword.page";

import { useState } from "react";
import Router from "./router";


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
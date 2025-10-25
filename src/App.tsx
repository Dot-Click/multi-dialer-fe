import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import Login from "@/pages/auth/login.page";
import Code from "@/pages/auth/code.page";
import ChangePassword from "./pages/auth/changepassword.page";


const App = () => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
    {/* <Login/> */}
    {/* <Code/> */}
    <ChangePassword/>
    </QueryClientProvider>
  );
}

export default App
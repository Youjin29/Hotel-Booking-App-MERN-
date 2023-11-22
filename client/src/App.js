import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { useContext } from "react";
import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Confirm from "./pages/confirm/Confirm";
import Account from "./pages/account/Account";
import Booking from "./pages/booking/Booking";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/hotels" element={<List/>}/>
        <Route path="/hotels/:id" element={<Hotel/>}/>
        <Route path="/login" element={user? <Navigate to="/"/> : <Login/>}/>
        <Route path="/register" element={user? <Navigate to="/"/> : <Register/>}/>
        <Route path="/confirm/:hotelId" element={user? <Confirm/> : <Navigate to="/login"/>}/>
        <Route path="/account/" element= {user? <Account/> : <Navigate to="/login"/>} />
        <Route path="/account/:bookingId" element={user? <Booking/> : <Navigate to="/login"/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

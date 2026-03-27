import Banner from "../../components/Banner/Banner";
import Explorar from "../Explorar/Explorar";
import { getCurrentUser } from "../../utils/token";
import AdminDashboard from "../AdminDashboard/AdminDashboard";

const Home = () => {
  const user = getCurrentUser();
  const isAdmin = user?.roles?.includes("ROLE_ADMIN")

  return (
    <div>
      {isAdmin ? (
        <AdminDashboard />
      ) : (
        <>
          <Banner />
          <Explorar />
        </>
      )}
    </div>
  );


};

export default Home;
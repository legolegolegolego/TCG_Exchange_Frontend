import Banner from "../../components/Banner/Banner";
import Explorar from "../Explorar/Explorar";
import { getCurrentUser } from "../../utils/token";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const isAdmin = user?.roles?.includes("ROLE_ADMIN")

  useEffect(() => {

    if (isAdmin) {
      navigate("/explorar");
    } else {
      return (
        <div>
          <Banner />
          <Explorar />
        </div>
      );

    }
  });


};

export default Home;
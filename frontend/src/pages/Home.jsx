import { Link } from "react-router-dom";

import NavBar from "../components/NavBar";

const Home = () => {
  return (
    <>
      <NavBar />
      <div className="text-center absolute top-1/2">
        <p>Ke bide :) </p>
        <Link to="/restaurants" className="underline">
          Bazata raboti tho!
        </Link>
      </div>
    </>
  );
};

export default Home;

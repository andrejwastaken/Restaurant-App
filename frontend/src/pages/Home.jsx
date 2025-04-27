import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="text-center absolute top-1/2">
      <p>Ke bide :) </p>
      <Link to="/restaurants" className="underline">
        Bazata raboti tho!
      </Link>
    </div>
  );
};

export default Home;

import React from "react";
import HomeCardFeed from "./HomeCardFeed";

function Home({ currentUser }) {

  return (
    <div className="main-content-area">

      <div className="page-content">

        <HomeCardFeed />

      </div>

    </div>
  );
}

export default Home;
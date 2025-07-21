import React from 'react';
import { Link } from 'react-router-dom';

function AppLogo() {
  return (
 <div class="navbar-brand">
        <Link to="/">
        <span class="l">L</span>
        <span class="o">O</span>
        <span class="c">C</span>
        <span class="a">A</span>
        <span class="l2">L</span>
        <span class="r">R</span>
        <span class="seven">7</span>
      </Link>
      </div>
  );
}

export default AppLogo;
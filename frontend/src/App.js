import React from "react"
import {Switch, Route, Link} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import AddReview from "./components/add-review";
import Restaurant from "./components/restaurants";
import RestaurantsList from "./components/restaurants-list";
import Login from "./components/login";

function App() {

  //React Hook
  const [user, setUser] = React.useState(null);

  async function login(user = null) {
    setUser(user);
  }

  async function logout() {
    setUser(null)
  }



  return (
    
    <div>

      {/* 
        Navbar Section, Dummy login (users wont be saved to database)
      */}
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/restaurants" className="navbar-brand ms-2">
          Restaurant Reviews
        </a>
        <div className="navbar-nav me-auto">
          <li className="nav-item">
            <Link to={"/restaurants"} className="nav-link">
              Restaurants
            </Link>
          </li>
          <li className="nav-item">
            { user ? (
              <button onClick={logout} className="nav-link" style={{cursor: 'pointer'}}>
                Logout {user.name}  
              </button>
            ): (
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            )}
          </li>
        </div>
      </nav>


      {/* 
        Route Section
      */}

      <div className="container mt-3">
        <Switch>
          <Route exact path ={["/", "/restaurants"]} component={RestaurantsList} />
          <Route
            path="/restaurants/:id/review"
            render={(props) => (
              <AddReview {...props} user={user} />
            )}
          />
          <Route
            path="/restaurants/:id"
            render={(props) => (
              <Restaurant {...props} user={user} />
            )}
          />
          <Route
            path="/login"
            render={(props) => (
              <Login {...props} login={login} />
            )}
          />

        </Switch>
      </div>

    </div>
  );
}

export default App;

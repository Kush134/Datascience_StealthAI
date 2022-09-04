import './App.css';
import React from "react";
import Home from "./Pages/Home/Home";
import Zoom from "./Pages/Zoom/Zoom";
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import Team from "./Pages/Team/Team";
import About from "./Pages/About/About";
import Legal from "./Pages/Legal/legal";

const App = () => {
    return (
        <div>

            <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <a className="navbar-brand" href="/">
                        <img src="/logo.png" height="30"
                             className="d-inline-block align-top" alt=""/>Stealth
                    </a>

                    <div className="collapse navbar-collapse" style={{"justify-content": "flex-end"}}
                         id="navbarTogglerDemo03">
                        <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                            <li className="nav-item">
                                <a className="nav-link" href="/about">About</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/#getstarted">Youtube Video</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/Zoom">Zoom Transcript</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/legal">Legal Document</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/team">Team</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <Router>
                <Switch>
                    <Route exact path='/'>
                        <Home/>
                    </Route>
                    <Route exact path='/zoom'>
                        <Zoom/>
                    </Route>
                    <Route exact path='/legal'>
                        <Legal/>
                    </Route>
                    <Route exact path='/about'>
                        <About/>
                    </Route>
                    <Route exact path='/team'>
                        <Team/>
                    </Route>
                </Switch>
            </Router>
            <div className="footer">
                <div className="container"><img src="/logo.png" height="20"
                             className="d-inline-block align-top" alt=""/>Stealth</div>
            </div>
        </div>
    );
};

export default App;

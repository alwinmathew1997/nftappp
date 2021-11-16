import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import './index.css';
import { Provider } from 'react-redux';
// import store from './store';

import 'bootstrap/dist/css/bootstrap.min.css';


import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


import Homepage from "./pages/home"






ReactDOM.render(

  <BrowserRouter basename="/" >
  <ToastContainer />

    <Switch>
    <Route path="/home" component={Homepage} />

     
      <Route exact path="/*" component={Homepage}>
        <Redirect to="/home" />
      </Route>
    </Switch>
  </BrowserRouter>,
    document.getElementById("root")

);



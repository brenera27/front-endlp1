import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./pages/home"
import Produtos from "./pages/produtos"
import Pedidos from "./pages/pedidos"
export default function Routes() {
   
    return (   
            <Switch>
                <Route component={Home} exact path="/home" /> 
                <Route component={Pedidos} exact path="/pedidos" /> 
                <Route component={Produtos} exact path="/produtos" /> 
            </Switch>   
    );
}

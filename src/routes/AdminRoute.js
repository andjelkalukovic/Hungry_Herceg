import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { authService } from '../services/auth.service';

export default function AdminRoute({component: Component, ...rest}){

    
    return (

        (authService.isLoged() === "Admin")
        ?
        
        <Route {...rest} render={props => (
            <Component {...props} />
        )} /> 
        
        :
        <Redirect to="/home" />   

    );
};
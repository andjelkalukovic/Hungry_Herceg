import React, {useState} from 'react'
import { authService } from '../../services/auth.service'
import './Login.css'
import { useAlert } from 'react-alert'
import { logInUser } from '../../services/api.service';


let username = '';
let password = '';

export default function LogIn({ history }) {

    const alert = useAlert()

    const [loading,setLoading] = useState(false);
   

    if (authService.isLoged() && authService.isLoged()!=="Admin") history.push('/home');
    else if (authService.isLoged()) history.push('/settings');

    const handleLogin = (e) => {
        e.preventDefault();
        
       setLoading(true);
        logInUser(username, password).then(res => {    
            setLoading(false); 
            if (res.data.message === "Success") {   
                const {token,userId,username} = res.data.data;    
                authService.LogIn(username, userId, token);
                
                if (username === 'Admin') {
                    history.push("/settings");
                }
                else {
                    history.push("/home");
                }
            }
            else {
                alert.error('Wrong username or password!') 
            }
        }).catch(err=>{alert.error('Wrong username or password!'); console.log(err);
         setLoading(false);});

    }

    const handleUsername = (e) => {
        username = e.target.value
    }

    const handlePassword = (e) => {
        password = e.target.value
    }


    return (
        <div className="Wrappeer">
            <div className="loginCard">
                <img src="./img/logo192.png" alt="logo" className='logoPhoto' />
                <div className="loginContent">
                    <h1>Log In</h1>
                    <form onSubmit={handleLogin}>
                        <input type="username" placeholder="Enter username" className="loginIntput" onInput={(e) => handleUsername(e)} required></input>
                        <input type="password" placeholder="Enter password" className="loginIntput" onInput={(e) => handlePassword(e)} required></input>
                        <button type="submit" className="loginBtn"></button>
                    </form>
                </div>
            </div>
            {loading ? <div className="loader" ><div className='spiner'></div></div> : null}
        </div>
    )
}
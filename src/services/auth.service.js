import { appStorage } from "./storage.service";

let loged = null;
let token = "";
let userId = "";

export const authService = {

    LogIn : (USER ,ID, TOKEN)=>{
        //provera usera

        appStorage.setUser(USER);
        appStorage.setUserId(ID);
        appStorage.setToken(TOKEN);
        loged = USER;
        token = TOKEN;
        userId = ID;
    
    },
    
    LogOut : ()=>{
        loged = null;
        appStorage.removeUser();
        appStorage.removeToken();
        appStorage.removeUserId();
        return loged;
    },
    
    isLoged : ()=>loged||appStorage.getUser(),

    getToken : () => token,

    getUserId : () => userId

}

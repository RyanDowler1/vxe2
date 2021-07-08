import jwt from 'jwt-decode';

export  function getToken(){
    return window.localStorage.getItem("lanstad-token");
}

export async function validateToken(token=getToken()){
    
    if(token){
        return await fetch('https://api.stg-lanstad.com/token/check', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Lanstad-Token': token
            }
          }).then((response) => {
            return response.json();
          })
          .then((data) => {
              if(data.hasOwnProperty('valid')){
                  return data.valid;
              } else {
                  return false;
              }
          }).catch(err=>{
            console.log("error", err)
            return false;
          })
    } else {
        return false
    }
    
}

export function decodeToken(token=getToken()){
    if(token){
    const decodedToken = jwt(token);
    return decodedToken;
    }else{
        const errorObject = {};
        return errorObject;
    }
}

// we are not setting the token in vxe, this function will go to the login page in the future
export async function setToken(username, password){
    await fetch('https://api.stg-lanstad.com/token/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, password})
    }).then((response) => {
        return response.json();
    }).then((data) => {
        if(data.token){
            window.localStorage.setItem("lanstad-token", data.token);
        } else {
            //We have to settle which response errors might be and how to manage them.
        }
        
    }).catch(err=>{
        console.log("error", err)
        //We have to settle which response errors might be and how to manage them.
    })
}
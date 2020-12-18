import fetch from 'isomorphic-fetch';
import cookie from 'js-cookie';
import { API } from '../config';


export const signUp = (user) => {
    return fetch(`${API}/signUp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    }).then(res => res.json())
        .catch(err => console.log(err));
}


export const signIn = (user) => {
    return fetch(`${API}/signIn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    }).then(res => res.json())
        .catch(err => console.log(err));
}


export const signOut = (next) => {
    removeCookie('token');
    removeLocalStorage('user');
    next();

    return fetch(`${API}/signOut`, {
        method: "GET"
    }).then(res => console.log('signout success'))
        .catch(err => console.log(err));
}



// get cookie
export const setCookie = (key, value) => {
    if (process.browser) {
        cookie.set(key, value, {
            expires: 1
        });
    }
}

export const removeCookie = (key) => {
    if (process.browser) {
        cookie.remove(key, {
            expires: 1
        })
    }
}

// get cookie
export const getCookie = (key) => {
    if (process.browser) {
        return cookie.get(key)
    }
}

// localStorage
export const setLocalStorage = (key, value) => {
    if (process.browser) {
        localStorage.setItem(key, JSON.stringify(value));
    }
}

export const removeLocalStorage = (key) => {
    if (process.browser) {
        localStorage.removeItem(key);
    }
}

// authenticate user by pass data to cookie and localStorage
export const authenticate = (data, next) => {
    setCookie('token', data.token);
    setLocalStorage('user', data.user);
    next();
}


export const isAuth = () => {
    if (process.browser) {
        const cookieChecked = getCookie('token');
        if (cookieChecked) {
            if (localStorage.getItem('user')) {
                return JSON.parse(localStorage.getItem('user'));
            } else {
                return false;
            }
        }
    }
}




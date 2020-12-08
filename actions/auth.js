import fetch from 'isomorphic-fetch';
import { API } from '../config';


export const signUp = (user) => {
    return fetch(`${API}/signUp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    }).then(res => res.json())
        .catch(err => console.log(err));
}
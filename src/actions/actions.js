import backend from "../api/backend";
import Cookies from "universal-cookie";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';

var dsteem = require('dsteem');

var client = new dsteem.Client('https://api.steemit.com');


const fetchLogin = (admin = false) => async (dispatch) => {

    const cookies = new Cookies();

    let logged_user = "";
    if (cookies.get("name") !== undefined && cookies.get("username") !== undefined && cookies.get("avatar") !== undefined && cookies.get("token") !== undefined)
    {
        const response = (await backend.post('/auth/user',
            {username: cookies.get("username"), token: cookies.get("token"), admin})).data;

        if (response.status === "ok") {
            logged_user = {
                token: cookies.get("token"),
                username: cookies.get("username"),
                name: cookies.get("name"),
                avatar: cookies.get("avatar"),
                license: ""
            };
        }
    }


    dispatch({
        type: 'FETCH_LOGIN',
        payload: logged_user
    });
};


const login = (data) => async(dispatch) => {

    const cookies = new Cookies();

    let next_week = new Date();

    next_week.setDate(next_week.getDate() + 14);

    let name = data.name;
    let profile_image = "./img/default.png";

    if (data.json_metadata.profile !== undefined && data.json_metadata.profile.name !== undefined && data.json_metadata.profile.profile_image !== undefined)
    {
        name = data.json_metadata.profile.name;
        profile_image = data.json_metadata.profile.profile_image
    }

    cookies.set('token', data.token, { path: '/', expires : next_week});
    cookies.set('username', data.name, { path: '/', expires : next_week});
    cookies.set('name',name , { path: '/', expires : next_week});
    cookies.set('avatar',profile_image , { path: '/', expires : next_week});
    cookies.set('type', data.type , { path: '/', expires : next_week});

    let logged_user = {
        token : data.token,
        username : data.name,
        name : name,
        avatar: profile_image,
        license : data.license,
        type : data.type
    };

    dispatch({
        type: 'LOGIN',
        payload: logged_user
    });
};


export {

    fetchLogin,
    login,
};
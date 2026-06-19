import Axios from "axios";
import i18n from "../i18n";

const client = Axios.create({
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

client.interceptors.response.use(res => res, err => {
    if(err.response.status === 502) {
        window.flash(i18n.t('api.serviceNotAvailable'), "red");
    } else if (err.response.status !== 401) {
        window.flash(err.response.data, "red");
    }
    return Promise.reject(err);
});

export default client;
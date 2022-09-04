import axios from "axios/index";
export const SimilarWords = (words) => {
    const payload = {
        words: words
    }
    const headers = {
        "accept": "application/json",
        "Content-Type": "application/json; charset=utf-8"
    }
    return axios.post(`https://ytb-api.azurewebsites.net/api/ytb-similarwords-01`, payload, {headers: headers})
        .then(res => {
            console.log(res);
            if (res.data !== null)
                return res.data;
            else return {};
        }).catch(err => console.log(err));
}
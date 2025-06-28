import axios from "axios";

const BASE_URL = "http://localhost:7965";

export const shortenUrl = async (data) => {
    const response = await axios.post(`${BASE_URL}/shorten`, data);
    return response.data;
}

export const getShortUrlInfo = async (code) => {
    const response = await axios.get(`${BASE_URL}/${code}`);
    return response.data;
}

export const getAllUrls = async () => {
    const response = await axios.get(`${BASE_URL}/all/urls`);
    return response.data;
}
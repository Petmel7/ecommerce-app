import api from './api';

export const register = async (data) => {
    const response = await api.post('/users/register', data);
    return response.data;
};

export const login = async (data) => {
    const response = await api.post('/users/login', data);
    localStorage.setItem('token', response.data.token);
    return response.data;
};

export const addPhone = async (data) => {
    const response = await api.post('/users/add-phone', data);
    return response.data;
};

export const confirmPhone = async (data) => {
    const response = await api.post('/users/confirm-phone', data);
    return response.data;
};

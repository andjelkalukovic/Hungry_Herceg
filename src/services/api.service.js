import axios from 'axios';
import { appStorage } from './storage.service';


const baseURL = "https://hungry-herceg-server.herokuapp.com";

const getHeader = () => ({headers:{Authorization:"Bearer " + appStorage.getToken()}}); // generise objekat header sa tokenom


//Users

export const logInUser = (username, password) => axios.post(baseURL+"/user/login", {username, password});
export const getUserById = (id) => axios.get (baseURL+"/user/"+id)
export const getUsersAll = () => axios.get(baseURL+"/user");
export const createUser = (username, password) => axios.post(baseURL+"/user", {username, password}, getHeader());
export const deleteUserById = (id) => axios.delete(baseURL+"/user/"+id, getHeader());


//Restaurants

export const getRestaurantsAll = () => axios.get(baseURL+"/restaurant");
export const getRestaurantByID = id => axios.get(baseURL+"/restaurant/"+id);
export const createRestaurant = (name, address, tags, meals) => axios.post(baseURL+"/restaurant", {name, address, tags, meals}, getHeader());
export const deleteRestaurantById = (id) => axios.delete(baseURL+"/restaurant/"+id, getHeader());
export const updateMealToRestaurant = (id, meals) => axios.put(baseURL+"/restaurant/"+id, {meals}, getHeader());


 //Polls

export const createPoll = (name, duration, restaurants) => axios.post(baseURL+"/poll", {name, duration:Number(duration), restaurants}, getHeader());
export const getAllPolls = () =>  axios.get(baseURL+"/poll");
export const getPollById = (id) => axios.get(baseURL+"/poll/"+id);
export const deletePollById = (id) =>  axios.delete(baseURL+"/poll/"+id, getHeader());
export const endPollById = (id) => axios.post(baseURL + "/poll/"+id+"/endpoll", getHeader());
export const updateVotesByPollId = (id, votes) => axios.post(baseURL + `/poll/${id}/vote`, {restaurantIds:votes}, getHeader());


//Orders 

export const getAllOrders = () =>  axios.get(baseURL+"/order");
export const getActiveOrders = () =>  axios.get(baseURL+"/order?status=true");
export const getFinishedOrders = () =>  axios.get(baseURL+"/order?status=false");
export const getOrderById = (id) => axios.get(baseURL+"/order/"+id);
export const deleteOrderById = (id) =>  axios.delete(baseURL+"/order/"+id, getHeader());
export const endOrderById = (id) => axios.put(baseURL + "/order/"+id, {status:false},getHeader());

//OrderItem
export const updateOrderItem = (id, quantity, note) => axios.put(baseURL + `/orderItem/${id}`, { quantity: quantity, note: note }, getHeader());
export const createOrderItem = (orderItem) => axios.post(baseURL+"/orderItem", orderItem, getHeader());
export const deleteOrderItemById = (id) =>  axios.delete(baseURL+"/orderItem/"+id, getHeader());

//Meals

export const createMeal = (restaurantId, name, price, tag) => axios.post(baseURL+"/meal", {restaurantId, name, price, tag}, getHeader()); 
export const deleteMealById = (id) => axios.delete(baseURL+"/meal/"+id, getHeader());

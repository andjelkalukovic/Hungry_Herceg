import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import BasicOrderList from "./BasicOrderList";
import CurrentOrderList from "./CurrentOrderList";
import ComboOrderList from "./ComboOrderList";
import { appStorage } from "../../services/storage.service";
import './Order.css'
import { getOrderById } from "../../services/api.service";

const CreateOrderItem = ({ history }) => {
    let { id } = useParams();
    let user = appStorage.getUser();
    const [restaurant,setRestaurant] = useState({});
    const [userOrders,setUserOrders] = useState([]);
    const [orderedMeals, setOrderedMeals] = useState([]);
    const [total, setTotal] = useState(0);
    const [meals,setMeals] = useState([]);
    const [filteredMeals,setFilteredMeals] = useState([]);
    const [refresh,setRefresh] = useState('');
    //povlacenje podataka o order-u preko id-ja
    useEffect(() => {
        let isMounted = true;
        getOrderById(id).then(res => {
            if(isMounted){
            setRestaurant(res.data.data.restaurant);
            setMeals(res.data.data.restaurant.meals);
            setFilteredMeals(res.data.data.restaurant.meals);
            setUserOrders(res.data.data.orderItemList.filter(orderItem => orderItem.user === user));
            let sum = 0;
            res.data.data.orderItemList.filter(orderItem => orderItem.user === user).forEach(orderItem => 
                sum += orderItem.quantity * orderItem.meal.price );
            setTotal(sum);
            }
        });
        return () => {isMounted = false}
    },[id,user,refresh])
        

    //filtriranje meal-ova
    const filterMeals = (input) => {
        if(input.startsWith('#')) {
            // eslint-disable-next-line array-callback-return
            let filter = meals.filter(meal => {
                if(restaurant.tags.find(tag => tag.toLowerCase().includes(input.toLowerCase().substring(1))) ||
                    meal.tag.toLowerCase().includes(input.toLowerCase().substring(1))){
                    return meal;
                }
            })
            setFilteredMeals(filter);
        } else {
            let filter = meals.filter(meal => meal.name.toLowerCase().includes(input.toLowerCase()));
            setFilteredMeals(filter);
        }
    }
    

    // //prima niz mealova, vrsi provere, na kraju stavlja mealove i novu cenu u state
    const addOrderItems = (meals) => {
        let newMeals = [];
        let newPrice = 0;
        meals.forEach((meal) => {
            let alreadyOrdered = orderedMeals.find(
                (orderedMeal) =>
                    orderedMeal.meal === meal._id );
            if (alreadyOrdered) {
                let quantity = parseInt(alreadyOrdered.quantity);
                alreadyOrdered.quantity = quantity += parseInt(
                    document.querySelector(`#q${meal._id}`).value
                );
                newPrice +=
                    alreadyOrdered.price *
                    parseInt(document.querySelector(`#q${meal._id}`).value);
            } else {
                let orderedMeal = {
                    user: appStorage.getUser(),
                    name: meal.name,
                    price: meal.price,
                    orderId: id,
                    meal: meal._id,
                    quantity: document.querySelector(`#q${meal._id}`).value,
                    note: "",
                };
                newMeals.push(orderedMeal);
                newPrice += orderedMeal.price * orderedMeal.quantity;
            }
        });
        setOrderedMeals([...orderedMeals, ...newMeals]);
        setTotal(total + newPrice);
    };

    return (
        <div className='wrapper'>
            <NavBar history={history} />
            <div className='mainPartWrapper'>
            <div className='orderWrapper'>
                <div className='orderContent'>
                    <div className='smallerOrderDiv'>
                        <div className='orderHeadingImg'></div>
                        <div className='orderRestNameWrapp'>
                            <h2 className='orderRestNameHead'>{restaurant.name}</h2>
                        </div>

                        <BasicOrderList
                            filteredMeals={filteredMeals}
                            filterMeals={filterMeals}
                            orderedMeals={orderedMeals}
                            setOrderedMeals={setOrderedMeals}
                            orderId={id}
                            total={total}
                            setTotal={setTotal}
                            addOrderItems={addOrderItems}
                        />
                        <ComboOrderList
                            meals={meals}
                            orderedMeals={orderedMeals}
                            setOrderedMeals={setOrderedMeals}
                            orderId={id}
                            total={total}
                            setTotal={setTotal}
                            addOrderItems={addOrderItems}
                        />
                        <div className='gradientCurrentOrderWrapper'></div>
                    </div>
           
            </div>
            
            <div className='rightCardWrapp'>
                <div className='rightCardContent' >
                <CurrentOrderList
                            userOrders={userOrders}
                            orderedMeals={orderedMeals}
                            setOrderedMeals={setOrderedMeals}
                            total={total}
                            setTotal={setTotal}
                            orderId={id}
                            refresh={refresh}
                            setRefresh={setRefresh}
                            history={history}
                        />
                </div>
            </div>
            </div>
        </div>
        </div>
    );
};
export default CreateOrderItem;

import React from 'react';
import './Order.css'
import { createOrderItem, updateOrderItem, deleteOrderItemById } from '../../services/api.service';
import { appStorage } from '../../services/storage.service';
import { useAlert } from 'react-alert';

const CurrentOrderList = ({ orderedMeals, setOrderedMeals, userOrders, total, setTotal, orderId, refresh, setRefresh, history }) => {
    const alert = useAlert();

    //brisanje orderItem-a iz state-a
    const removeMeal = (orderedMeal) => {
        let index = orderedMeals.findIndex(el => el === orderedMeal);
        orderedMeals.splice(index, 1);
        setTotal(total - orderedMeal.price * orderedMeal.quantity);
    }

    //slanje orderItem-a na server
    const finishOrder = () => {
        if (orderedMeals.length !== 0) {
            orderedMeals.forEach((meal) => {
                // let alreadyOrdered = userOrders.find(
                //     (orderedMeal) =>
                //         orderedMeal.meal._id === meal.meal && orderedMeal.user === appStorage.getUser());
                // if (alreadyOrdered) {
                //     let quantity = Number(meal.quantity) + Number(alreadyOrdered.quantity);
                //     let note = document.querySelector(`#n${meal.meal}`).value;
                //     updateOrderItem(alreadyOrdered._id, Number(quantity), note).then(res => setRefresh(refresh + 'a'));
                // } else {
                    let orderedMeal = {
                        orderId: orderId,
                        meal: meal.meal,
                        quantity: Number(meal.quantity),
                        note: document.querySelector(`#n${meal.meal}`).value,
                    };
                    createOrderItem(orderedMeal).then(res => setRefresh(refresh + 'a'));
            //     }
            });
            setOrderedMeals([]);
            alert.success('Your order was successful');
            history.push('/home');
        } else {
            alert.error('Please choose your meals')
        }
    }

    //brisanje orderItem-a sa servera
    const deleteOrderItem = (orderItemId) => {
        deleteOrderItemById(orderItemId).then(res => setRefresh(refresh + 'a'));
    }

    const handleCancel = () => {
        history.push('/home');
    }

    return (
        <div className='currentOrderWrapp'>
            <div className='comboHedingWrapp'>
                <h3>Current Order</h3>
            </div>
            <div className='currentOrderTxt'>
                <div className='orderBold'>Meal</div>
                <div className='orderBold'>Price</div>
                <div className='orderBold'>Quantity</div>
                <div className='orderBold'>Note</div>
                <div className='orderBold'>Actions</div>
            </div>
            <div id="style-4" className='currOrderClmsWrapp'>
                {userOrders.length !== 0 ? <> {userOrders.map(orderedItem => {
                    return (
                      
                            <div key={orderedItem._id} className='currentOrderTxt'>
                                <div className='currOrdLblWrapp'> <label className='lblCenterAlign'>{orderedItem.meal.name}</label></div>
                                <div className='currOrdLblWrapp'><label className='lblCenterAlign'>{orderedItem.meal.price}</label></div>
                                <div className='currOrdLblWrapp'><label className='lblCenterAlign'>{orderedItem.quantity}</label></div>
                                <div className='bacisNumberDiv'><label className='lblCenterAlign'>{orderedItem.note}</label></div>
                                <div className='currOrdLblWrapp'><img src='/img/del.png' alt='remove' title='Remove Meal' className='removeOrder' onClick={() => deleteOrderItem(orderedItem._id)} /></div>
                            </div> )
                })}<hr></hr>  </> : null}
                <div id="style-4" className='currOrderClmsWrapp'>{orderedMeals.map(orderedMeal => {
                    return (
                        <div key={orderedMeal.meal} className='currentOrderTxt currOrdLblWrapp '>
                            <div className='currOrdLblWrapp'><label className='lblCenterAlign'>{orderedMeal.name}</label></div>
                            <div className='currOrdLblWrapp'><label className='lblCenterAlign'>{orderedMeal.price}</label></div>
                            <div className='currOrdLblWrapp'><label className='lblCenterAlign'>{orderedMeal.quantity}</label></div>
                            <div className='bacisNumberDiv'><input className='orderQuantity' placeholder="Note" type="text" id={'n' + orderedMeal.meal} /></div>
                            <div><img src='/img/del.png' alt='remove' title='Remove Meal' className='removeOrder' onClick={() => removeMeal(orderedMeal)} /></div>
                        </div>
                    )
                })}
                </div>
            </div>
            <div className='currentOrderFooter'> <div><label>Total price: <span className='orderBold'>{total}</span></label></div>
                <div className='orderNowBtnWrap'><button onClick={() => finishOrder(orderedMeals)} className='orderNowBtn'>ORDER NOW!</button>
                <button className='rightBtnCreatePoll' onClick={(e) => handleCancel(e)}>Cancel</button></div>           
            </div>
            <div className='gradientCurrentOrderWrapper'></div>
        </div>
    )
}

export default CurrentOrderList 
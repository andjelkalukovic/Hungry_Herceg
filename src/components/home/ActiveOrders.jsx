import React, { useEffect, useState } from "react";
import { appStorage } from "../../services/storage.service";
import { Link } from "react-router-dom";
import { endOrderById, getActiveOrders } from "../../services/api.service";

let isSubscribed = false;

const ActiveOrders = ({history}) => {
    
    const [loading, setLoading] = useState(true);
    const [activeOrders, setActiveOrders] = useState([]);
    //povlacenje podataka sa back-a
    let interval;

    const getData = () => {
        clearTimeout(interval);
        getActiveOrders().then(res => {
            if (isSubscribed) {
                setActiveOrders(res.data.data);
                setLoading(false);
                interval = setTimeout(() => { getData() }, 2000);
            }
        }).catch((err) => { if (isSubscribed) { interval = window.setTimeout(() => getData(), 10000); } });
    }

    useEffect(() => {

        isSubscribed = true;
        getData();
        return () => { isSubscribed = false; clearTimeout(interval) };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    let user = appStorage.getUser();

    //status order-a menja se u false
    const endOrder = (orderId) => {
        endOrderById(orderId);
    }

    const getEndTime = (createdAt) => {
        let isoDateTime = new Date(createdAt);
        isoDateTime.setMinutes(isoDateTime.getMinutes() + 20);
        return isoDateTime.toLocaleDateString() + " " + isoDateTime.toLocaleTimeString();
    }

    return (

        <div className="active-orders">
            <div className="poll-order-card">
                <img className="pollCardicon" src="./img/pollcard3.png" alt='pollicon' />
                <div className="card-heading">
                    <h1>Active Orders</h1>
                </div>

                <div className="active-orders-info">
                    <div className='ordersHeaderWrapp header'>
                        <div className='orderLblWrapper'>
                            <label className='orderLbl'>Name</label>
                        </div>
                        <div className='orderLblWrapper'>
                            <label className='orderInfoLbl'>Restaurant</label>
                        </div>
                        <div className='orderLblWrapper'>
                            <label className='orderInfoLbl'>Author</label>
                        </div>
                        <div className='orderLblWrapper'>
                            <label className='orderInfoLbl'>Ends</label>
                        </div>
                        <div className='orderLblWrapper'>
                            <label className='orderInfoLbl'>Status</label>
                        </div>
                        <div className='orderLblWrapper'>
                            <label className='orderInfoLbl'>Action</label>
                        </div>
                    </div>

                    <div id="style-5" className='pollRowsWrapp'>
                        {activeOrders.length !== 0 ? <>
                            {activeOrders.map(order => {

                                // eslint-disable-next-line array-callback-return
                                let userOrders = order.orderItemList.filter(orderItem => {
                                    if (orderItem.orderId && orderItem.user) {
                                        return orderItem.orderId === order._id && orderItem.user === user
                                    }
                                })

                                return (

                                    <div key={order._id} className="activeOrdersContent">
                                        <div className='orderInfoWrapper' onClick={() => history.push(`/order/${order._id}`)} style={{cursor: "pointer"}}>
                                        <div className='orderLblWrapper'>
                                            <label className='activeLblinfo' style={{cursor: "pointer"}}>{order.poll.name}</label>
                                        </div>
                                        <div className='orderLblWrapper'>
                                            <label className='activeLblinfo' style={{cursor: "pointer"}}>{order.restaurant ? order.restaurant.name : ''}</label>
                                        </div>
                                        <div className='orderLblWrapper'>
                                            <label className='activeLblinfo' style={{cursor: "pointer"}}>{order.poll.author}</label>
                                        </div>
                                        <div className='orderLblWrapper'>
                                            <label className='activeLblinfo' style={{cursor: "pointer"}}>{getEndTime(order.createdAt)}</label>
                                        </div>
                                        <div className='orderLblWrapper' >
                                            {userOrders.length === 0 ? <label className='activeLblinfo' style={{cursor: "pointer"}}>No Order Yet</label> : <label className='activeLblinfo' style={{cursor: "pointer"}}>You ordered:{userOrders.map(orderItem => {
                                                return (
                                                    <li style={{cursor: "pointer"}} key={orderItem._id}>{orderItem.quantity} x {orderItem.meal.name}</li>
                                                )
                                            })} </label>}
                                        </div>
                                        </div>
                                        <div className="btn-icons">

                                            <div className='actOrderIconWrapp'>
                                                <Link to={`/order/${order._id}`} className='voteBtnLink'><img className='actOrderIcon' src='./img/order.png' alt='logo' title='Go to Order' /></Link>
                                            </div>
                                            {user === order.poll.author ? <>
                                                <div className='actOrderIconWrapp'>
                                                    <img className='actOrderIcon' src="./img/end1.png" alt="icon" title='End order' onClick={() => endOrder(order._id)} />
                                                </div>
                                            </> : <div></div>}
                                        </div>
                                    </div>

                                )
                            })} </> : <div className="noActiveInfo">
                                <div>
                                    <label className="pollLblNoInfo">{loading ? "Loading..." : "No Active Orders"}</label>
                                </div>

                            </div>}
                    </div>
                        <div className='homePageGradient'></div>
                </div>



            </div>

        </div>

    )

}

export default ActiveOrders
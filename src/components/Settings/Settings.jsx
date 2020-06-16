import React, { useState, useEffect } from 'react'
import './Settings.css'
import { authService } from '../../services/auth.service';
import { getRestaurantsAll, getUsersAll, createUser, deleteUserById, createRestaurant, deleteRestaurantById, createMeal, deleteMealById } from '../../services/api.service';
import { useAlert } from 'react-alert';
import DialogBox from '../DialogBox/DialogBox';

let mealName = '';
let mealPrice = '';
let mealsTags = 'slano';
let restaurantName = '';
let restaurantAddress = '';
let restaurantTags = [];
let username = '';
let password = '';

let ID = "";


export default function Settings({history}) {

    const alert = useAlert();

    const [loading,setLoading] = useState(true);
    const [reload, setReload] = useState(true);

    const [showDialogRest, setShowDialogRest] = useState(false);
    const [showDialogMeal, setShowDialogMeal] = useState(false);
    const [showDialogUser, setShowDialogUser] = useState(false);


    const [restaurants, setRestaurants] = useState([]);
    const [users, setUsers] = useState([]);
    const [restaurantSectionSelected, setRestaurantSectionSelected] = useState(false);
    const [usersSectionSelected, setUsersSectionSelected] = useState(false);
    const [mealsSectionSelected, setMealsSectionSelected] = useState(false);
    const [selected_id, setSelected_id] = useState(null);
    const [searchUser, setSearchUser] = useState('');
    const [searchRestaurant, setSearchRestaurant] = useState('');
    const [searchMeals, setSearchMeals] = useState('');



    useEffect(() => {
        setLoading(true)
        getRestaurantsAll().then(res => {
     
            setRestaurants(res.data.data)
            setLoading(false)
        })
        getUsersAll().then(res => {
            setUsers(res.data.data)
            setLoading(false)
        })
    }, [reload])


    const handleSubmitUser = (e) => {
        e.preventDefault()

        if(username.trim() && password.trim()){
            setLoading(true);
            createUser(username, password).then(res => {

                if(res.data.message === "Success"){
                    setReload(!reload);
                }
                else{
                    alert.error(res.data.message)
                    
                }
                setLoading(false);
            }).catch(err => {alert.error('Something went wrong!' + err.message); setLoading(false);})
        }
    }


    const handleSubmitRestaurant = (e) => {
        e.preventDefault()
        setLoading(true);
        createRestaurant(restaurantName, restaurantAddress, restaurantTags, []).then(res => {
            if(res.data.message === "Success"){
                setReload(!reload);
            }
            setLoading(false);
            }).catch(err => {alert.error('Something went wrong!'+err); setLoading(false)})
    }

    const handleSubmitMeal = (e) => {
        e.preventDefault();
        if(selected_id){
            setLoading(true)
            createMeal(selected_id, mealName, Number(mealPrice), mealsTags).then(res => {
                if(res.data.message === "Success"){
                    setReload(!reload);
                }
                setLoading(false);
            }).catch(err => {alert.error('Something went wrong!'+err);setLoading(false);})
        }
        else{
            alert.info("Please select restaurant first.");
        }
    }



    const handleDeleteRestaurant = () => {
        setSelected_id(null)
        setLoading(true);
        deleteRestaurantById(ID).then(res => {
            if(res.data.message === "Success"){
                setReload(!reload);
            }
            setLoading(false);
        }).catch(err => {alert.error('Something went wrong!'+err); setLoading(false);})
    }


    const getMeals = (id, rest) => {
        if(id && rest){
            return rest.find((el) => {
                return el._id === id;
            }).meals
        }
    }

    const handleSelectRestaurant = (id) => {
        setSelected_id(id)
        setMealsSectionSelected(true)
    }

    const handleDeleteUser = () => {
        setLoading(true);
        deleteUserById(ID).then(res => {
            if(res.data.message === "Success"){

                setReload(!reload);
            }
            setLoading(false);
            }).catch(err => {alert.error('Something went wrong!'+err);setLoading(false);})
    }

    const handleDeleteMeal = () => {
        setLoading(true);
        deleteMealById(ID).then(res => {
            if(res.data.message === "Success"){
                setReload(!reload);
            }
            setLoading(false);
            }).catch(err => {alert.error('Something went wrong!'+err);setLoading(false);})
    }


    const getFilteredRestaurants = (search, array) => {
        return searchRestaurant !== ''? array.filter(el => el.name.toLowerCase().includes(search.toLowerCase())):array;
    }


    const getFilteredMeals = (search, array) => {
        return searchMeals !== ''? array.filter(el => el.name.toLowerCase().includes(search.toLowerCase())):array;
    }


    const getFilteredUsers = (search, array) => {
        return array.filter(el => 
            (el.username.toLowerCase().includes(search.toLowerCase()) && el.username !== "Admin"));
    }

    const handleRestaurantSectionSelected = () => {
        setRestaurantSectionSelected(!restaurantSectionSelected)
    }

    const handleUserSectionSelected = () => {
        setUsersSectionSelected(!usersSectionSelected)
    }

    const handleMealsSectionSelected = () => {
        setMealsSectionSelected(!mealsSectionSelected)
    }

    const resturantSectionStyle = restaurantSectionSelected ? { display: "block" } : { display: "none" };
    const userSectionStyle = usersSectionSelected ? { display: "block" } : { display: "none" };
    const mealSectionStyle = mealsSectionSelected ? { display: "block" } : { display: "none" };


    const handleInput = (e) => {
        const {name, value} = e.target
        switch (name) {
            case "restaurantname":restaurantName = value; break;
            case "restaurantaddress":restaurantAddress = value; break;
            case "restauranttags":restaurantTags = value.split(' ');
                                if(restaurantTags[restaurantTags.length - 1] === ''){
                                    restaurantTags.pop()}; break;
            case "restaurantsearch":setSearchRestaurant(value); break;
            case "mealname":mealName = value; break;
            case "mealprice":mealPrice = value; break;
            case "mealtags":mealsTags = value; break;
            case "mealssearch":setSearchMeals(value); break;
            case "username":username = value; break;
            case "password":password = value; break;
            case "usersearch":setSearchUser(value); break;

            default:
                break;
        }
    }


    return (
        <div className='settingsWrapp'>
            <div className='settingsHeader'>
                <div></div>
                <div className='settHeadWrapp'><h1 className='settHeading'>Settings</h1></div>
                <div className='settIconWrapp'><img className='settIcon' src='/img/setti.png' alt='settings' /></div>
                <div className='settLogoutWrapp'>
                    <div onClick={() => { authService.LogOut(); history.push('/login') }} >
                        <img src="/img/logout2.png" alt="icon" className="settLogoutIcon" />
                        <label className='settLogoutLbl'>Logout</label>
                    </div>
                </div>
            </div>
            <div className='settingsMainPart'>
                <div className='settResWrapp'>
                    <div className='mainPartHeader'>
                        <div className='mainPartHeadingWrapp'> <h1 className='mainPartHeading'>Restaurants</h1></div>
                        <div className='settHeaderIconWrapp'><img className='settHeaderIcon' src='/img/settRest.png' alt='logo' onClick={() => handleRestaurantSectionSelected()} /></div>
                    </div>
                    <div style={resturantSectionStyle} className='transitionWapper'>
                        <form onSubmit={(e) => handleSubmitRestaurant(e)}>
                            <div className='createNewWrapp'> <h3 className='createNewHeading'>Create new restaurant</h3></div>
                            <input className='settingsInput' type="text" placeholder="Restaurant name" name="restaurantname" onChange={(e) => handleInput(e)} required></input>
                            <input className='settingsInput' type="text" placeholder="Restaurant address" name="restaurantaddress" onChange={(e) => handleInput(e)}></input>
                            <input className='settingsInput' type="text" placeholder="Restaurant tags" name="restauranttags" onChange={(e) => handleInput(e)}></input>
                            <input type="submit" value="Submit Restaurant" className='settSubmitBtn' />
                        </form>
                        <div>
                            <div className='settSubheadingWrapp'> <h3 className='settSubheading'>Restaurants</h3></div>
                            <input className='settingsInput' type="text" placeholder="Search by name..." name="restaurantsearch" onChange={(e) => handleInput(e)} />
                           <div id="style-4" className=' cetColmWrapper'> {getFilteredRestaurants(searchRestaurant, restaurants).map(el => { return <div className='settColm' key={el._id}><div> 
                            <label onClick={() => handleSelectRestaurant(el._id)} className={el._id === selected_id? 'allRestLbl selected': 'allRestLbl'}>{el.name}</label></div><div>
                            <button className='settDelBtn' onClick={(e) => {ID=el._id; setShowDialogRest(true)}}>Delete</button></div></div> })}</div>
                        </div>
                    </div>
                </div>
                <div className='settMealWrapp'>
                    <div className='mainPartHeader'>
                        <div className='mainPartHeadingWrapp'> <h1 className='mainPartHeading'>Meals</h1></div>
                        <div className='settHeaderIconWrapp'><img className='settHeaderIcon' src='/img/settMeal.png' alt='logo' onClick={() => handleMealsSectionSelected()} /></div>
                    </div>
                    <div style={mealSectionStyle} className='transitionWapper'>
                    <div>
                        <form onSubmit={(e) => handleSubmitMeal(e)}>
                        <div className='createNewWrapp'> <h3 className='createNewHeading'>Create new meal</h3></div>
                        <input className='settingsInput' type="text" placeholder="Meal name" name="mealname" onChange={(e) => handleInput(e)} required></input>
                        <input className='settingsInput' type="number" placeholder="Meal price" name="mealprice" onChange={(e) => handleInput(e)} required></input>
                        <select className='settingsInput' placeholder="Meal tags" name="mealtags" onChange={(e) => handleInput(e)}>
                            <option value="slano">slano</option>
                            <option value="slatko">slatko</option>
                        </select>
                        <input type="submit" value="Submit Meal" className='settSubmitBtn submitMealsBtn'/>
                        </form>
                        <div>
                        <div className='settSubheadingWrapp'> <h3 className='settSubheading'>Meals</h3></div>
                            <input className='settingsInput' type="text" placeholder="Search by name..." name="mealssearch" onChange={(e) => handleInput(e)} />
                        <div id="style-4" className='allSelectMealsWrapp'>  {selected_id !== null ? getFilteredMeals(searchMeals, getMeals(selected_id, restaurants)).map(el => {return <div className='selectedMealsWrapp' key={el._id} >
                            <div><label className='settUsernameLbl'>{el.name}{' '}{el.price}</label></div><div><button className='settDelBtn' onClick={(e) => {ID=el._id; setShowDialogMeal(true)}}>Delete</button></div></div>}): null}</div>  
                        </div>
                    </div>
                    </div>
                </div>
                <div className='settUserWrapp'>
                    <div className='mainPartHeader'>
                        <div className='mainPartHeadingWrapp'> <h1 className='mainPartHeading'>Users</h1></div>
                        <div className='settHeaderIconWrapp'><img className='settHeaderIcon' src='/img/settUser.png' alt='logo' onClick={() => handleUserSectionSelected()} /></div>
                    </div>
                    <div style={userSectionStyle} className='transitionWapper'>
                        <form onSubmit={(e) => handleSubmitUser(e)}>
                            <div className='createNewWrapp'> <h3 className='createNewHeading'>Create new user</h3></div>
                            <input className='settingsInput' type="text" placeholder="Username" name="username" onChange={(e) => handleInput(e)} required></input>
                            <input className='settingsInput' type="text" placeholder="Password" name="password" onChange={(e) => handleInput(e)} required></input>
                            <input type="submit" value="Submit user" className='settSubmitBtn submitUserBtn' />
                        </form>
                        <div>
                            <div  className='settSubheadingWrapp'> <h3 className='settSubheading'>Users</h3></div>
                            <input className='settingsInput' type="text" placeholder="Search by name..." name="usersearch" onChange={(e) => handleInput(e)} />
                           <div id="style-4" className='allFilterUsersWrapp'>{getFilteredUsers(searchUser, users).map(el => { return <div className='settColm' key={el._id}><div> 
                            <label className='settUsernameLbl '>{el.username}</label></div><div><button className='settDelBtn' onClick={(e) => {ID=el._id; setShowDialogUser(true)}}>Delete</button></div></div> })}</div>
                        </div>
                    </div>
                    </div>
            </div>
            {loading ? <div className="loader" ><div className='spiner'></div></div> : null}
            {showDialogRest?<DialogBox title="Delete restaurant" message="Are you sure you want to delete this restaurant?" onYes={()=>{ setShowDialogRest(false); handleDeleteRestaurant()}} onNo={()=>{setShowDialogRest(false)}} />:null}
            {showDialogMeal?<DialogBox title="Delete meal" message="Are you sure you want to delete this meal?" onYes={()=>{ setShowDialogMeal(false); handleDeleteMeal()}} onNo={()=>{setShowDialogMeal(false)}} />:null}
            {showDialogUser?<DialogBox title="Delete user" message="Are you sure you want to delete this user?" onYes={()=>{ setShowDialogUser(false); handleDeleteUser()}} onNo={()=>{setShowDialogUser(false)}} />:null}
        </div>
    )
}
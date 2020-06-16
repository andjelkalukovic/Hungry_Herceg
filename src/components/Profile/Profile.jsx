import React, { useState, useEffect } from "react";
import { getUserById } from "../../services/api.service";
import { appStorage } from "../../services/storage.service";
import { Polar } from "react-chartjs-2";
import "chartjs-plugin-colorschemes";
import NavBar from "../NavBar/NavBar";
import "./Profile.css";


const Profile = ({ history }) => {
  const [loading,setLoading] = useState(true);
  const [userHistory, setUserHistory] = useState([]);
  
  const userId = appStorage.getUserId(); //dohvata id ulogovanog korisnika
  
  const userName = appStorage.getUser(); //dohvata username ulogovanog korisnika
  
  //sprecavanje curenja memorije na asinhronoj komponenti
  //povlacenje sa servera i setovanje podataka za grafikon
    useEffect(() => {
       let isMounted = true;
        setLoading(true);
        getUserById(userId).then((data) => {
          if (isMounted){
            let orderItems = [];
            data.data.data.history.forEach(el => { 
              if(el.meal !== null){
                orderItems.push(el)
              }
            })
            setUserHistory(orderItems);
            setLoading(false);
          }
        });

        return ()=> isMounted=false;
          
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    
  //funkcija za sortiranje niza
  //sortira niz po imenu meal-a
  function compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const mealA = a.meal.name.toUpperCase();
    const mealB = b.meal.name.toUpperCase();

    let comparison = 0;
    if (mealA > mealB) {
      comparison = 1;
    } else if (mealA < mealB) {
      comparison = -1;
    }
    return comparison;
  }

  let sorted = userHistory.sort(compare); //dobijamo sortirane po imenu

  //izbacivanje duplikata
  const uniq = userHistory.filter((a, b) => {
    const _name = JSON.stringify(a.meal.name);
    return (
      b ===
      userHistory.findIndex((obj) => {
        return JSON.stringify(obj.meal.name) === _name;
      })
    );
  });
  //priprema labela
  let labels = [];
  uniq.map((el) => labels.push(el.meal.name)); //stavlja samo po jedan label i time zavrsavamo sa labelima

  //sabiranje kolicine za graficki prikaz
  //funkcija koja ponavlja label onoliko puta koliko ima quantitija
  function repeat(item, times) {
    let rslt = [];
    for (let i = 0; i < times; i++) {
      rslt.push(item);
    }
    return rslt;
  }
  let sortedMeals = sorted.map((el) => repeat(el.meal.name, el.quantity)); //vraca vise nizova sa ponovljenim labelima

  //funkcija koja spaja nizove u sortedMeals
  function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
      return flat.concat(
        Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten
      );
    }, []);
  }
  let oneSortedMeal = flatten(sortedMeals);

  //pravi objekat od meal niza da dobijemo broj ponavljanja
  var counts = {}; //ispisujemo Object.values u data za grafikon
  oneSortedMeal.forEach(function (x) {
    counts[x] = (counts[x] || 0) + 1;
  });

  return (
    <div className="wrapper">
      <NavBar history={history} />
      <div className='mainPartWrapper'>
      <div className="activeProfile">
        <div className="profileWrapper">
          <div className="avatarCard">
            <img className="userAvatar" src="/img/user.png" alt="avatar" />
            <div></div>
            <div className="avatarInfoWrapp">
              <div className="welcomeWrap">
                <label className="welLbl">Welcome</label>
              </div>
              <div className="welcomeWrapÙsername">
                <label className="userNmaeAvatarCardLbl">{userName}</label>
              </div>
              <div className='profileGradientDiv'></div>
            </div>
          </div>
          <div className="chartWrapper">
            <div className="polarDiv">
              <Polar
                width={20}
                height={20}
                options={{ maintainAspectRatio: false ,
                           plugins: {
                           colorschemes: {
                           scheme: 'tableau.Tableau20'
                  }
               }}}
                data={{
                  labels: labels,
                  datasets: [
                    {
                      label: "# of Votes",
                      data: Object.values(counts),
                      borderWidth: 1,
                    }
                  ]
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    {loading ? <div className="loader" ><div className='spiner'></div></div> : null}
    </div>
  );
};
export default Profile;

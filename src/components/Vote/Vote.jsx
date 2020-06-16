import React, { useState, useEffect } from 'react';
import NavBar from '../NavBar/NavBar'
import './Vote.css'
import { getPollById, updateVotesByPollId } from '../../services/api.service';
import { useAlert } from 'react-alert';


let votedList = [];
let max = 3;

export default function Vote({ history, match }) {
    const alert = useAlert()

    const [loading,setLoading] = useState(true);

    const [restaurants, setRestaurants] = useState([]);

    const [pollName, setPollName] = useState("");
    const [endTime, setEndTime] = useState("");
    const [pollAuthor, setPollAuthor] = useState("");


    useEffect(() => {

        const { id } = match.params;

         getPollById(id).then((res)=>{
             
             const {data} = res.data;
            setLoading(false);
             
            if(data.status){
                setPollName(data.name);

                let isoDateTime = new Date(data.ends);
                let localDateTime = isoDateTime.toLocaleDateString() + " " + isoDateTime.toLocaleTimeString();

                setEndTime(localDateTime);
                setRestaurants(data.restaurants);
                setPollAuthor(data.author);
            }
            else{
                alert.error("Poll is ended");

            }
        }).catch(err=>{setLoading(false); alert.error("Something went wrong"+err);
        })

        return ()=>votedList=[];

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const handleVote = (e) => {

        if (e.target.className === 'vote') {

            if (votedList.length < max) { 

                e.target.className = 'voted';
                e.target.innerHTML = "Unvote";

                votedList.push(e.target.id);
            }
            else {
                alert.info(`You can vote for ${max} restsaurants maximum.`); 

            }
        }
        else {
            e.target.className = 'vote';
            e.target.innerHTML = "Vote";
            votedList.splice(votedList.indexOf(e.target.id), 1);
        }

    }

    const confirmVotes = () => {

        const { id } = match.params;
        
        if (votedList.length > 0) {
            setLoading(true);
            updateVotesByPollId(id,votedList).then(res=>{
                setLoading(false)
                if (res.data.message === "Success"){
                    history.push("/home");
                }
                else{
                    alert.error("Something went wrong");
                }
            }).catch(err=>{ setLoading(false); alert.error("Something went wrong"+err); })
        }
        else {
            alert.info("You neet to vote for at least one restaurant!"); 
        }
    }


    return (
        <div className='wrapper'>
            <NavBar history={history} />
            <div className='voteWrapper'>
                <div className="activeVote">
                    <div className="voteCard">
                        <div className='voteHeader'>
                            <img className='voteingIcon' src='/img/voting.png' alt='vote' />
                        </div>
                        <div className='voteCardInfowrapp'>
                            <div className='voteCardInfoHeader'>
                                <div className='voteHeaderFiled'>
                                    <div className='voteCardFildes'><small className='voteFiledSmall'>Poll name</small></div>
                                    <div className='voteCardFildes'><label className='voteFiledLbl'>{pollName}</label> </div>
                                    </div>
                                    
                                    <div className='voteHeaderFiled'>
                                    <div className='voteCardFildes'><small className='voteFiledSmall'>Poll author</small></div>
                                    <div className='voteCardFildes'><label className='voteFiledLbl'>{pollAuthor}</label> </div>
                                    </div>

                                    <div className='voteHeaderFiled'>
                                    <div className='voteCardFildes'><small className='voteFiledSmall'>End time</small></div>
                                    <div className='voteCardFildes'><label className='voteFiledLbl'>{`${endTime}`}</label> </div>
                                    </div>
                            </div>
                            <div className='voteListWrapp' id="style-4">
                                
                                    {restaurants.map(({restaurant}, index) => {
                                        return (
                                            <div className='voteFiledWrapp' key={"res" + index}><div><label className='voteingLbl'> {restaurant.name}</label></div>
                                                <div>
                                                    <button  className="vote" id={restaurant._id} onClick={handleVote}>Vote</button>
                                                </div>
                                            </div>
                                        )
                                    })}
                               
                            </div>
                            <div className='voteBtnWrapp'>
                                <button className='voteBtn' onClick={confirmVotes}>Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {loading ? <div className="loader" ><div className='spiner'></div></div> : null}
        </div>
    )
}
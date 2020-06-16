import React from "react";
import { Link } from "react-router-dom";
import { appStorage } from "../../services/storage.service";
import {
  getAllPolls,
  deletePollById,
  endPollById,
} from "../../services/api.service";

import DialogBox from '../DialogBox/DialogBox';

let ID = "";

class ActivePolls extends React.Component {
  constructor(props) {
    super(props);
    this.countdown = null;
    this.isSubscribed = true;
    this.state = {
      userName: appStorage.getUser(),
      userId: appStorage.getUserId(),
      allPolls: [],
      loading: true,
      isClicked: false,
      showDialog: false,
      alert: alert
    };
  }

  componentDidMount() {
    this.isSubscribed = true;
    this.setAllPolls();
    this.countdown = window.setTimeout(() => this.setAllPolls(), 3000);
  }

  componentWillUnmount() {
    this.isSubscribed = false;
    window.clearTimeout(this.countdown);
  }

  setAllPolls = () => {
    window.clearTimeout(this.countdown);
    getAllPolls()
      .then((res) => {
        if (this.isSubscribed) {
          this.setState({ allPolls: res.data.data, loading: false, isClicked: false });
          this.countdown = window.setTimeout(() => this.setAllPolls(), 3000);
        }
      })
      .catch((err) => {
        if (this.isSubscribed) {
          window.alert("Error occurred" + err);
          this.countdown = window.setTimeout(() => this.setAllPolls(), 10000);
        }
      });
  };

  deletePoll(){
    deletePollById(ID).then((res) => {
      if (res.data.message === "Success") {
        this.setAllPolls();
      }
    });
  }

  render() {
    let allActivePolls = this.state.allPolls.filter((el) => el.status);
    let pollsRow = [];

    if (allActivePolls.length > 0) {
      allActivePolls.forEach((poll, index) => {
        let restaurants = poll.restaurants;
        let userVoted =
          restaurants.filter((restaurant) => {
            return restaurant.votes.includes(this.state.userId);
          }).length > 0;

        let isoDateTime = new Date(poll.ends);
        let localDateTime =
          isoDateTime.toLocaleDateString() +
          " " +
          isoDateTime.toLocaleTimeString();
        if (poll.author === this.state.userName) {
          pollsRow.push(
            <div className="activePollRow" key={`my${index}`}>
              <div className='pollInfoWrapper' onClick={() => {
                {userVoted ? 
                      this.props.alert.error('You already voted!')
                 : 
                      this.props.history.push(`/vote/${poll._id}`)
                }
              }}>
              <div className='activeRow'>
                <label className="activeLblinfo" style={{cursor: "pointer"}}>{poll.name}</label>
              </div>
              <div className='activeRow'>
                <label className="activeLblinfo" style={{cursor: "pointer"}}>{poll.author}</label>
              </div>
              <div className='activeRow'>
                <div>
                  <label className="activeLblinfo" style={{cursor: "pointer"}}>{`${localDateTime}`}</label>
                </div>
              </div>
              </div>
              <div className="poll-icons">
                <div className='pollIconWrapp' >
                  {userVoted ? (
                    <img
                      className="userUnvoteBtn"
                      src="/img/noVote.png"
                      alt=" no vote"
                      title="You have already voted!"
                    />
                  ) : (
                     
                        <img onClick={()=>{this.props.history.push(`/vote/${poll._id}`)}}  className="activePollBtnIcons" src="./img/vote1.png" alt="icon" title="Vote" />
                     
                    )}
                </div>

                <div className='pollIconWrapp'>
                  
                                         
                  <img className="activePollBtnIcons"                  
                  src="./img/end1.png"
                  alt="icon"
                  title="End Poll"
                  onClick={() => {if(this.state.isClicked === false){
                    this.setState({ isClicked: true })
                    endPollById(poll._id).then((res) => {
                      if (res.data.message === "Success") {
                        this.setAllPolls();
                      }
                    }) 
                  }                                   
                    }}
                  />
                </div>
                <div className='pollIconWrapp'>
                  <img
                  className="activePollBtnIcons"
                    src="./img/del.png"
                    alt="icon"
                    title="Delete"
                    onClick={() => {
                        ID = poll._id;
                        this.setState({showDialog:true})
                    }}
                  />
                </div>
              </div>
            </div>
          );
        } else {
          pollsRow.push(
            <div className="active-info" key={`s${index}`}>
              <div className='alignedWrapper'>
                <label className="activeLblinfo">{poll.name}</label>
              </div>
              <div className='alignedWrapper'>
                <label className="activeLblinfo">{poll.author}</label>
              </div>
              <div className='alignedWrapper'>
                <label className="activeLblinfo">{`${localDateTime}`}</label>
              </div>
              <div className="pollGuest alignedWrapper">
                <div>
                  {userVoted ? (
                    <img
                    className="activePollBtnIcons"
                      src="/img/noVote.png"
                      alt=" no vote"
                      title="You can not vote twice !"
                    />
                  ) : (
                      <Link to={`/vote/${poll._id}`} className="voteBtnLink">
                        <img
                        className="activePollBtnIcons"
                          src="./img/vote1.png"
                          alt="icon"
                          title="Vote"
                          className="pollGuestIcon"
                        />
                      </Link>
                    )}
                </div>
              </div>
            </div>
          );
        }
      });
    } else {
      pollsRow = (
        <div className="noActiveInfo">
          <div>
            <label className="pollLblNoInfo">
              {this.state.loading ? "Loading..." : "No Active Polls"}
            </label>
          </div>
        </div>
      );
    }

    return (
      <div className="active-polls">
        <div className="poll-order-card">
          <img
            className="pollCardicon"
            src="./img/pollcard4.png"
            alt="pollicon"
          />
          <div className="card-heading">
            <h1>Active Polls</h1>
          </div>

          <div className="active-polls-info">
            <div className='pollsHeaderWrapp header'>
              <div className='pollsHeadingWrapp'>
                <label>Name</label>
              </div>
              <div className='pollsHeadingWrapp'>
                <label>Author</label>
              </div>
              <div className='pollsHeadingWrapp'>
                <label>Ends</label>
              </div>
              <div className='pollsHeadingWrapp'>
                <label>Action</label>
              </div>
            </div>

            <div id="style-4" className="pollRowsWrapp">
              {pollsRow}
            </div>
            <div className="card-btn-wrapper">
              <button className="btn-green" onClick={()=>this.props.history.push("/createpoll")}>Create New Poll</button>
            </div>

          <div className='homePageGradient'></div>
          </div>

        </div>
        {this.state.showDialog?<DialogBox title="Delete poll"
                               message="Are you sure you want to delete this poll?"
                               onYes={()=>{this.setState({showDialog:false}); this.deletePoll()}}
                               onNo={()=>{this.setState({showDialog:false})}}
                               />:null}
      </div>
    );
  }
}

export default ActivePolls;

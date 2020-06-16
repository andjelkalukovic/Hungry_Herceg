import React from "react";
import { appStorage } from "../../services/storage.service";
import { getFinishedOrders } from "../../services/api.service";
import { CSVLink } from "react-csv";
import InfoDialog from "../DialogBox/InfoDialog";

class FinishedOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: appStorage.getUser(),
      allOrders: [],
      loading: true,
      showInfoDialog: false,
      dialogData: [],
      restaurant: ''
    };
  }

  componentDidMount() {
    this.setAllOrders();
    this.isSubscribed = true;
  }

  componentWillUnmount() {
    this.isSubscribed = false;
    window.clearTimeout(this.countdown);
  }

  setAllOrders = () => {
    window.clearTimeout(this.countdown);
    getFinishedOrders()
      .then((res) => {
        if (this.isSubscribed) {
          this.setState({ allOrders: res.data.data, loading: false });
          this.countdown = window.setTimeout(() => this.setAllOrders(), 2000);
        }
      })
      .catch((err) => {
        if (this.isSubscribed) {
          this.countdown = window.setTimeout(() => this.setAllOrders(), 10000);
        }
      });
  };

  render() {
    let allOrders = this.state.allOrders;

    let ordersRow = [];

    if (allOrders.length > 0) {
       // eslint-disable-next-line array-callback-return
      allOrders.map((order, index) => {
        if (order.restaurant !== "Doesnt exist") {
          let orderItemList = order.orderItemList;

          let data = [];

          if (orderItemList.length > 0) {
            orderItemList.forEach((orderItem) => {
              if (orderItem.meal) {
                let completedOrder = {
                  Restaurant: order.restaurant.name,
                  Name: orderItem.user,
                  Meal: orderItem.meal.name,
                  Quantity: orderItem.quantity,
                  Price: orderItem.meal.price * orderItem.quantity,
                  Note: orderItem.note,
                };

                data.push(completedOrder);
              }
            });

            let isoDateTime = new Date(order.createdAt);
            let localDateTime =
              isoDateTime.toLocaleDateString() +
              " " +
              isoDateTime.toLocaleTimeString();
            
            if (order.poll.author === this.state.userName) {
              ordersRow.push(
                <div className='finishOrderRow' key={`my${index}`}>
                  <div className='finishOrderInfo' onClick={() => { this.setState({dialogData: order.orderItemList, restaurant: order.restaurant.name}); this.setState({showInfoDialog: true});}}>
                  <div className='finishRow'>
                    <label className="finLbl" style={{cursor: "pointer"}}>
                      {order.poll.name}
                    </label>
                  </div>
                  <div className='finishRow'>
                    <label className="finLbl" style={{cursor: "pointer"}}>
                      {order.poll.author}
                    </label>
                  </div>
                  <div className='finishRow'>
                      <label className="finLbl" style={{cursor: "pointer"}}>
                        {order.restaurant.name}
                      </label>
                  </div>
                  </div>
                  <div className='finishRow'>
                        <CSVLink
                          className="excelCsvLink"
                          style={{ color: "black", textDecoration: "none" }}
                          filename={
                            order.restaurant.name +
                            " " +
                            localDateTime +
                            " - complete order" +
                            ".csv"
                          }
                          data={data}
                        >
                          <img
                            className="finishExcelBtn"
                            src="/img/excel.png"
                            alt="excel"
                            title="Download Excel"
                          />
                        </CSVLink>
                  </div>
                  {this.state.showInfoDialog ? <InfoDialog restaurant={this.state.restaurant} data={this.state.dialogData} onClose={() => this.setState({showInfoDialog: false})} /> : null}
                </div>
              );
            } else {
              ordersRow.push(
                <div className='finishOrderRow' key={`s${index}`}>
                  <div className='finishOrderInfo' onClick={() => { this.setState({dialogData: order.orderItemList, restaurant: order.restaurant.name}); this.setState({showInfoDialog: true});}}>
                  <div className='finishRow'>
                    <label className="finLbl" style={{cursor: "pointer"}}>
                      {order.poll.name}
                    </label>
                  </div>
                  <div className='finishRow'>
                    <label className="finLbl" style={{cursor: "pointer"}}>
                      {order.poll.author}
                    </label>
                  </div>
                  <div className='finishRow'>
                    <label className="finLbl" style={{cursor: "pointer"}}>
                      {order.restaurant.name}
                    </label>
                  </div>
                  </div>
                  <div className='finishRow'>
                    <label className="finLbl"></label>
                  </div>
                </div>
              );
            }
          }
        }
      });
    } else {
      ordersRow = (
        <div className="noActiveInfo">
          <div>
            {this.state.loading ? (
              <label className="pollLblNoInfo">Loading...</label>
            ) : (
              <label className="pollLblNoInfo">No orders pending</label>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="finish-orders">
        <div className="finishedOrderCard">
          <img
            className="certifyIcon"
            src="/img/certificate.png"
            alt="pollicon"
          />
          <div className="card-heading">
            <h1>Finished Orders</h1>
          </div>
            <div className="finishOrderHeader">
              <div className='finishOrderHdrWrapp'>
              <div className="finishedOrderFiled">
                <label className="finishOrderLbl">Name</label>
              </div>
              <div className="finishedOrderFiled">
                <label className="finishOrderLbl">Author</label>
              </div>
              <div className="finishedOrderFiled">
                <label className="finishOrderLbl">Restaurant</label>
              </div>
              <div className="finishedOrderFiled">
                <label className="finishOrderLbl">Action</label>
              </div>
              </div>

              <div className="finishedOrderContent">
            <div id="style-4" className="finishOrderRowWrapp ">
              {ordersRow}
            </div>
          </div>

          <div className='homePageGradient'></div>
            </div>
        </div>
      </div>
    );
  }
}

export default FinishedOrders;

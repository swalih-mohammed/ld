import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  Button,
  Card,
  Dimmer,
  Divider,
  Form,
  Grid,
  Header,
  Image,
  Label,
  Loader,
  Menu,
  Message,
  Segment,
  Select,
  Table,
  Container
} from "semantic-ui-react";
import {
  countryListURL,
  addressListURL,
  addressCreateURL,
  addressUpdateURL,
  addressDeleteURL,
  userIDURL,
  paymentListURL,
  orderListURL
} from "../constants";
import { authAxios } from "../utils";

class Dashboard extends React.Component {
  state = {
    orders: []
  };

  componentDidMount() {
    this.handleFetchOrders();
  }

  handleFetchOrders = () => {
    this.setState({ loading: true });
    authAxios
      .get(orderListURL)
      .then(res => {
        this.setState({
          loading: false,
          orders: res.data
        });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  };

  render() {
    const { orders } = this.state;
    // console.log(payments);
    return (
      <Container>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Customer Name</Table.HeaderCell>
              <Table.HeaderCell>Total Amount</Table.HeaderCell>
              <Table.HeaderCell>Order Status</Table.HeaderCell>
              <Table.HeaderCell>Date</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {orders.map(order => {
              return (
                <Table.Row key={order.id}>
                  <Table.Cell>{order.id}</Table.Cell>
                  <Table.Cell>{order.customer_name}</Table.Cell>
                  <Table.Cell>{order.shop_name}</Table.Cell>
                  <Table.Cell>{order.total}</Table.Cell>
                  <Table.Cell>{order.order_status}</Table.Cell>
                  <Table.Cell>{order.start_date}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

export default connect(mapStateToProps)(Dashboard);

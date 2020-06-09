import React from "react";
import { connect } from "react-redux";
import MaterialTable from "material-table";
import TableContainer from "@material-ui/core/TableContainer";
import { Redirect } from "react-router-dom";

// import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import { Alert, AlertTitle } from "@material-ui/lab";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import PhoneIcon from "@material-ui/icons/Phone";
import Fab from "@material-ui/core/Fab";

import { withStyles } from "@material-ui/core/styles";
import { authAxios } from "../../utils";
import {
  orderListURL,
  orderAddressURL,
  orderStatusUpdateURL
} from "../../constants";

const styles = theme => ({
  table: {
    minWidth: 200
  },
  orderDetails: {
    background: "#d1c4e9"
  },
  orderDetailCell: {
    background: "#c5cae9"
  },
  orderDetailTotal: {
    background: "#304ffe"
  },
  addressCard: {
    minWidth: 500,
    backgroundColor: "#ede7f6"
  }
});

class Customer extends React.Component {
  state = {
    orders: [],
    loading: false,
    error: null,
    message: null,
    orderStatus: "Pending"
  };

  componentDidMount() {
    this.FetchOrders();

    // console.log(orders);
  }

  FetchOrders = () => {
    this.setState({ loading: true });
    authAxios
      .get(orderListURL)
      .then(res => {
        this.setState({ orders: res.data, loading: false });
        // console.log(res.data);
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };

  // deleteOrder = id => {
  //   authAxios
  //     .delete(orderDeleteURL(id))
  //     .then(res => {
  //       this.setState({ message: "Order Deleted" });
  //       this.handleCallback();
  //     })
  //     .catch(err => {
  //       this.setState({ error: err });
  //     });
  // };

  updateOrderStatusAccpted = id => {
    authAxios
      .put(orderStatusUpdateURL(id), {
        order_status: "Accepted by Delivery staff"
      })
      .then(res => {
        this.setState({ message: "Order Delivery Accepted" });
        this.handleCallback();
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };

  updateOrderStatusCancelled = id => {
    authAxios
      .put(orderStatusUpdateURL(id), {
        order_status: "Delivery Not available"
      })
      .then(res => {
        this.setState({ message: "Delivery Denied" });
        this.handleCallback();
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };

  handleCallback = () => {
    this.FetchOrders();
  };

  fetchOrderAddress = address_id => {
    authAxios
      .get(orderAddressURL(address_id))
      .then(res => {
        this.setState({ orderAddress: res.data, loading: false });
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };

  render() {
    const { classes } = this.props;
    const { orders, loading, message } = this.state;
    // console.log(orders);
    const { isAuthenticated } = this.props;
    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }

    const columns = [
      { title: "Order No", field: "id" },
      { title: "Customer", field: "customer_name" },
      { title: "Shop", field: "shop_name" },
      { title: "Date", field: "start_date" },
      { title: "Status", field: "order_status" }
    ];

    return (
      <Container>
        {message && (
          <Alert severity="success">
            <AlertTitle>{message}</AlertTitle>
          </Alert>
        )}
        {loading && (
          <div
            align="middle"
            className={classes.loading}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <CircularProgress />
          </div>
        )}
        <Grid item xs={12}>
          <MaterialTable
            options={
              ({
                headerStyle: {
                  // backgroundColor: "#01579b",#bbdefb
                  backgroundColor: "#9fa8da",
                  color: "#212121"
                },
                rowStyle: {
                  backgroundColor: "#e8eaf6"
                }
              },
              {
                pageSize: 20,
                pageSizeOptions: [20, 50, 100]
              })
            }
            title="Orders"
            columns={columns}
            data={orders}
            pageSize={10}
            detailPanel={rowData => {
              const orderItem = rowData.order_items;
              const addressID = rowData.shipping_address;
              const { orderAddress } = this.state;
              return (
                <div>
                  <Grid item xs={12}>
                    <ExpansionPanel>
                      <ExpansionPanelSummary
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <IconButton>
                          <ExpandMoreIcon
                            onClick={() => this.fetchOrderAddress(addressID)}
                          />
                        </IconButton>
                        <Typography>Order Address</Typography>
                      </ExpansionPanelSummary>
                      {orderAddress && (
                        <ExpansionPanelDetails>
                          <Card className={classes.addressCard}>
                            <CardContent>
                              <Typography
                                className={classes.title}
                                color="textSecondary"
                                gutterBottom
                              >
                                Delivery Address
                              </Typography>
                              <Typography variant="h5" component="h2">
                                {orderAddress.place}
                              </Typography>
                              <Typography
                                className={classes.pos}
                                color="textSecondary"
                              >
                                {orderAddress.area}
                              </Typography>
                              <Typography variant="body1" component="p">
                                {orderAddress.road_name}
                                <br />
                                {orderAddress.house_name}
                                <br />
                                {orderAddress.village}
                                <br />
                              </Typography>
                            </CardContent>
                            <CardActions>
                              <IconButton>
                                {" "}
                                <PhoneIcon />{" "}
                              </IconButton>
                              {orderAddress.phone_number}
                            </CardActions>
                          </Card>
                        </ExpansionPanelDetails>
                      )}
                    </ExpansionPanel>
                    <TableContainer component={Paper}>
                      <Table
                        className={classes.table}
                        aria-label="spanning table"
                      >
                        <TableHead>
                          <TableRow className={classes.orderDetails}>
                            <TableCell align="center" colSpan={4}>
                              <Typography
                                variant="h5"
                                component="h5"
                                gutterBottom
                              >
                                Order Details
                              </Typography>
                              <Fab
                                variant="extended"
                                color="primary"
                                size="small"
                                className={classes.extendedIcon}
                                onClick={() =>
                                  this.updateOrderStatusAccpted(rowData.id)
                                }
                              >
                                Accept
                                {/* <EditIcon /> Accept */}
                              </Fab>
                              <Fab
                                variant="extended"
                                color="secondary"
                                size="small"
                                className={classes.extendedIcon}
                                onClick={() => this.deleteOrder(rowData.id)}
                              >
                                {/* <DeleteOutlineIcon /> */}
                                {"  "}
                                Cancel
                              </Fab>
                              {"     "}
                            </TableCell>
                          </TableRow>
                          <TableRow className={classes.orderDetailCell}>
                            <TableCell>Item Name</TableCell>
                            <TableCell align="right">Item Price</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Total Price</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {orderItem.map(row => (
                            <TableRow
                              key={row.desc}
                              className={classes.orderDetailCell}
                            >
                              <TableCell>{row.item.title}</TableCell>
                              <TableCell align="right">
                                {row.quantity}
                              </TableCell>
                              <TableCell align="right">
                                {row.quantity}
                              </TableCell>
                              <TableCell align="right">
                                {row.final_price}
                              </TableCell>
                            </TableRow>
                          ))}

                          <TableRow className={classes.orderDetailTotal}>
                            <TableCell rowSpan={3} />
                            <TableCell align="right" colSpan={2}>
                              Total
                            </TableCell>
                            <TableCell align="right">{rowData.total}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </div>
              );
            }}
          />
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

// export default connect(mapStateToProps)(Profile);

export default connect(mapStateToProps)(withStyles(styles)(Customer));

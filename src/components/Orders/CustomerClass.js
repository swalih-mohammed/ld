import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import MaterialTable from "material-table";
import TableContainer from "@material-ui/core/TableContainer";
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
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

import { withStyles } from "@material-ui/core/styles";
import { authAxios } from "../../utils";
import { orderListURL, orderDeleteURL, orderAddressURL } from "../../constants";
import { fetchCart } from "../../store/actions/cart";

const styles = theme => ({
  table: {
    minWidth: 500
  },
  orderDetails: {
    background: "#e8eaf6"
  },
  orderDetailCell: {
    background: "#c5cae9"
  },
  orderDetailTotal: {
    background: "#304ffe"
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
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
    orderAddress: null
  };

  componentDidMount() {
    this.FetchOrders();
    this.props.refreshCart();
    // console.log(this.props);
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

  deleteOrder = id => {
    authAxios
      .delete(orderDeleteURL(id))
      .then(res => {
        this.setState({ message: "Order Deleted" });
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

    const { isAuthenticated } = this.props;

    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }
    // console.log(isAuthenticated);

    const columns = [
      { title: "Order No", field: "id" },
      { title: "Shop Name", field: "shop_name" },
      { title: "Data", field: "start_date" },
      { title: "Status", field: "order_status" }
    ];

    return (
      <Container>
        {message && (
          <Alert severity="error">
            <AlertTitle>{message}</AlertTitle>
            {/* This is an error alert — <strong>check it out!</strong> */}
          </Alert>
        )}
        {loading && (
          <div
            align="middle"
            // className={classes.loading}
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
              const addressID = rowData.shipping_address;
              const orderItem = rowData.order_items;
              const { orderAddress } = this.state;
              // console.log(rowData);
              // console.log(orderAddress);
              return (
                <div>
                  <Grid item xs={12}>
                    <ExpansionPanel>
                      <ExpansionPanelSummary
                        // expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <IconButton
                          onClick={() => this.fetchOrderAddress(addressID)}
                        >
                          <ExpandMoreIcon />
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
                                variant="h6"
                                component="h6"
                                gutterBottom
                              >
                                Order Details
                              </Typography>

                              <Fab
                                variant="extended"
                                color="secondary"
                                size="small"
                                className={classes.extendedIcon}
                                onClick={() => this.deleteOrder(rowData.id)}
                              >
                                <DeleteOutlineIcon />
                                Delete order
                              </Fab>
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
                              key={row.id}
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

const mapDispatchToProps = dispatch => {
  return {
    refreshCart: () => dispatch(fetchCart())
  };
};

// export default connect(mapStateToProps)(Profile);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Customer));

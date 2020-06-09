import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import { Alert, AlertTitle } from "@material-ui/lab";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import RemoveIcon from "@material-ui/icons/Remove";
import IconButton from "@material-ui/core/IconButton";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";

import { authAxios } from "../../utils";
import { checkoutURL, orderSummaryURL, orderAddressURL } from "../../constants";
import { fetchCart } from "../../store/actions/cart";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 2,
    overflowX: "auto"
  },
  table: {
    minWidth: "100"
  },
  tableHead: {
    background: "#3f51b5",
    color: "white",
    fontWeigth: "bold",
    fontSize: "20pt"
  },
  tablecell: {
    fontSize: "12pt"
  },
  paper: {
    padding: theme.spacing(3),
    margin: "auto",
    minWidth: 350
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
    minWidth: 275
  }
}));

const OrderPreview = props => {
  const { data } = props;
  const { orderAddress } = props;
  const classes = useStyles();
  // console.log(data);

  return (
    <React.Fragment>
      {data && (
        <React.Fragment>
          {data.order_items.map(order_item => {
            return (
              <Paper
                className={classes.paper}
                key={order_item.id}
                elevation={3}
              >
                <Box mt={1} mx="auto">
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm container>
                      <Grid item xs container direction="column" spacing={2}>
                        <Grid item xs>
                          <Typography gutterBottom variant="subtitle1">
                            {order_item.item.title}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography
                            variant="body2"
                            style={{ cursor: "pointer" }}
                          >
                            <IconButton>
                              <AddIcon />
                            </IconButton>
                            <Button>{order_item.quantity}</Button>
                            <IconButton>
                              <RemoveIcon />
                            </IconButton>
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle1">$19.00</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            );
          })}
          {orderAddress && (
            <div>
              <br></br>
              <Card className={classes.addressCard}>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    Shipping Address
                  </Typography>
                  <Typography className={classes.pos} color="textPrimary">
                    {orderAddress.place}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {orderAddress.road_name}, {orderAddress.area},
                    {orderAddress.house_name} {orderAddress.village},
                    {orderAddress.state} {orderAddress.pin_code}
                    <br />
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Change Address</Button>
                </CardActions>
              </Card>
            </div>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

class CheckoutForm extends Component {
  state = {
    data: null,
    loading: false,
    error: null,
    success: false,
    orderAddress: null,
    orderAddressID: 1
  };

  componentDidMount() {
    this.handleFetchOrder();
    this.fetchAddress();
  }

  handleFetchOrder = () => {
    this.setState({ loading: true });
    console.log("fetching");
    authAxios
      .get(orderSummaryURL)
      .then(res => {
        this.setState({ data: res.data, loading: false });
        this.setState({ orderAddressID: res.data.shipping_address });
      })
      .catch(err => {
        if (err.response.status === 404) {
          this.props.history.push("/orders");
        } else {
          this.setState({ error: err, loading: false });
        }
      });
  };

  fetchAddress = () => {
    this.setState({ loading: true });
    const { orderAddressID } = this.state;
    console.log("finding address");
    console.log(orderAddressID);
    authAxios
      .get(orderAddressURL(orderAddressID))
      .then(res => {
        this.setState({ orderAddress: res.data, loading: false });
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };

  submit = ev => {
    ev.preventDefault();
    this.setState({ loading: true });
    const { orderAddressID } = this.state;
    authAxios
      .post(checkoutURL, {
        orderAddressID
      })
      .then(res => {
        this.setState({ loading: false, success: true });
        this.redirectToOrders();
      })
      .catch(err => {
        this.setState({ loading: false, error: err });
      });
  };

  redirectToOrders() {
    setTimeout(this.props.history.push("/orders"), 10000);
  }

  render() {
    // const { classes } = this.props;
    // const { refreshCart } = this.props;
    const {
      data,
      error,
      loading,
      success,
      orderAddressID,
      orderAddress
    } = this.state;

    console.log(orderAddress);
    console.log(orderAddressID);
    console.log(data);

    return (
      <container>
        {loading && (
          <div>
            <CircularProgress color="secondary" />
          </div>
        )}
        {error && (
          <Alert severity="error">
            <AlertTitle>{JSON.stringify(error)}</AlertTitle>
          </Alert>
        )}
        {data ? (
          <OrderPreview data={data} orderAddress={orderAddress} />
        ) : (
          <div>
            <Alert severity="info">No order to show </Alert>
          </div>
        )}

        <br></br>
        <React.Fragment>
          <br></br>
          <Typography variant="h6" component="h2">
            Confirm Order
          </Typography>
          <br></br>

          {success && (
            <Alert severity="success">
              <AlertTitle>{"Your Order is successful"}</AlertTitle>
            </Alert>
          )}
          {/* <Button
            loading={loading}
            disabled={loading}
            primary
            onClick={this.submit}
            style={{ marginTop: "10px" }}
          >
            Submit
          </Button> */}
          <Button variant="contained" color="primary" onClick={this.submit}>
            Submit
          </Button>
        </React.Fragment>
      </container>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    refreshCart: () => dispatch(fetchCart())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(CheckoutForm);

// export default CheckoutForm;

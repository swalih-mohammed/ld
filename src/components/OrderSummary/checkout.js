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
import ButtonBase from "@material-ui/core/ButtonBase";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import RemoveIcon from "@material-ui/icons/Remove";
import IconButton from "@material-ui/core/IconButton";

import { authAxios } from "../../utils";
import { checkoutURL, orderSummaryURL, addressListURL } from "../../constants";
import { fetchCart } from "../../store/actions/cart";
// import CheckoutItem from "./checkout-item";

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
    maxWidth: 350
  }
}));

const OrderPreview = props => {
  const { data } = props;
  const classes = useStyles();
  console.log(data);

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
          {data.shipping_address}
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
    shippingAddresses: [],
    billingAddresses: [],
    selectedShippingAddress: null,
    shop: "",
    place: "",
    mode_of_payment: ""
  };

  componentDidMount() {
    this.handleFetchOrder();
    this.handleFetchShippingAddresses();
  }

  handleFetchShippingAddresses = () => {
    this.setState({ loading: true });
    authAxios
      .get(addressListURL("S"))
      .then(res => {
        this.setState({
          shippingAddresses: res.data.map(a => {
            return {
              key: a.id,
              text: `${a.place}, ${a.area}, ${a.road_name}`,
              value: a.id
            };
          }),
          selectedShippingAddress: this.handleGetDefaultAddress(res.data),

          loading: false
        });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  };

  handleGetDefaultAddress = addresses => {
    const filteredAddresses = addresses.filter(el => el.default === true);
    if (filteredAddresses.length > 0) {
      return filteredAddresses[0].id;
    }
    return "";
  };

  handleFetchOrder = () => {
    this.setState({ loading: true });
    authAxios
      .get(orderSummaryURL)
      .then(res => {
        this.setState({ data: res.data, loading: false });
      })
      .catch(err => {
        if (err.response.status === 404) {
          this.props.history.push("/orders");
        } else {
          this.setState({ error: err, loading: false });
        }
      });
  };

  submit = ev => {
    ev.preventDefault();
    this.setState({ loading: true });
    const { selectedShippingAddress } = this.state;
    authAxios
      .post(checkoutURL, {
        selectedShippingAddress
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
    const { classes } = this.props;
    const { refreshCart } = this.props;
    const {
      data,
      error,
      loading,
      success,
      shippingAddresses,
      selectedShippingAddress
    } = this.state;

    return (
      <div>
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
        <OrderPreview data={data} />
        <br></br>
        <Typography variant="h6" component="h2">
          Address
        </Typography>
        {shippingAddresses.length > 0 ? (
          <Select
            name="selectedShippingAddress"
            value={selectedShippingAddress}
            clearable
            options={shippingAddresses}
            selection
            onChange={event =>
              this.handleSelectChangeAddress(event.target.value)
            }
          />
        ) : (
          // <p>{selectedShippingAddress}</p>
          <p>
            You need to <Link to="/profile">add an address</Link>
          </p>
        )}

        {shippingAddresses.length < 1 ? (
          <p>You need to add an addresse to complete your purchase</p>
        ) : (
          <React.Fragment>
            {/* <Header>Confirm Order?</Header> */}
            {/* <h2>Confirm Order</h2> */}
            <Typography variant="h6" component="h2">
              Confirm Order
            </Typography>

            {success && (
              <Alert severity="success">
                <AlertTitle>{"Your Order is successful"}</AlertTitle>
                {/* This is an error alert — <strong>check it out!</strong> */}
              </Alert>
            )}
            <Button
              loading={loading}
              disabled={loading}
              primary
              onClick={this.submit}
              style={{ marginTop: "10px" }}
            >
              Submit
            </Button>
          </React.Fragment>
        )}
      </div>
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

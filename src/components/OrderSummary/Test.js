import React, { Component } from "react";
import {
  Button,
  Container,
  Dimmer,
  Divider,
  Form,
  Header,
  Image,
  Item,
  Label,
  Loader,
  Message,
  Segment,
  Select,
  Radio
} from "semantic-ui-react";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import JssProvider from "react-jss/lib/JssProvider";
import { createGenerateClassName } from "@material-ui/core/styles";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Alert, AlertTitle } from "@material-ui/lab";
import purple from "@material-ui/core/colors/purple";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
// import JssProvider from "react-jss/lib/JssProvider";
// import { createGenerateClassName } from "@material-ui/core/styles";
// import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import { Link, withRouter } from "react-router-dom";
import { authAxios } from "../../utils";
import {
  checkoutURL,
  orderSummaryURL,
  addCouponURL,
  addressListURL
} from "../../constants";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 200
  },
  tablecell: {
    fontSize: "40pt"
  },
  MuiElevatedCard: {
    borderRadius: muiBaseTheme.spacing.unit / 2,
    transition: "0.3s",
    position: "relative",
    width: "90%",
    overflow: "initial",
    background: "#ffffff",
    padding: `${muiBaseTheme.spacing.unit * 2}px 0`
  },
  MuiCardHeader: {
    flexShrink: 0,
    position: "absolute",
    right: 20,
    left: 20,
    borderRadius: muiBaseTheme.spacing.unit / 2,
    backgroundColor: purple[500],
    overflow: "hidden",
    textAlign: "left"
  }
}));

const muiBaseTheme = createMuiTheme();

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: true
});

const OrderPreview = props => {
  const { data } = props;
  const classes = useStyles();

  return (
    <React.Fragment>
      <JssProvider generateClassName={generateClassName}>
        <MuiThemeProvider>
          <Card className={classes.MuiElevatedCard}>
            <CardHeader
              className={classes.MuiCardHeader}
              title={"Desserts"}
              subheader={"Select your favourite"}
            />
            <CardContent className={"MuiCardContent-root"}>
              <div className={"MuiCardContent-inner"}>
                <Table className={classes.table} aria-label="customized table">
                  <TableHead>
                    <TableRow
                      style={{
                        backgroundColor: "#3f51b5",
                        color: "white",
                        fontSize: 20
                      }}
                    >
                      <TableCell align="left">Item</TableCell>
                      <TableCell align="left">Quantity</TableCell>
                      <TableCell align="left">Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data !== null ? (
                      <React.Fragment>
                        {data.order_items.map(order_item => {
                          return (
                            <TableRow key={order_item.id}>
                              <TableCell component="th" scope="row">
                                {order_item.item.title}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {order_item.quantity}
                              </TableCell>
                              <TableCell align="left">
                                {order_item.final_price}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        <TableRow
                          style={{
                            backgroundColor: "#9fa8da",
                            color: "white",
                            fontSize: 20
                          }}
                        >
                          {/* <TableCell rowSpan={2} /> */}
                          <TableCell colSpan={2}>Total</TableCell>
                          <TableCell align="left">{data.total}</TableCell>
                        </TableRow>
                      </React.Fragment>
                    ) : (
                      <div>No Item in your cart</div>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </MuiThemeProvider>
      </JssProvider>
    </React.Fragment>
  );
};

OrderPreview.getTheme = muiBaseTheme => {
  const offset = 40;
  const cardShadow = "0px 14px 80px rgba(34, 35, 58, 0.2)";
  const headerShadow = "4px 4px 20px 1px rgba(0, 0, 0, 0.2)";
  return {
    MuiCard: {
      root: {
        "&.MuiElevatedCard--01": {
          marginTop: offset,
          borderRadius: muiBaseTheme.spacing.unit / 2,
          transition: "0.3s",
          boxShadow: cardShadow,
          position: "relative",
          width: "90%",
          overflow: "initial",
          background: "#ffffff",
          padding: `${muiBaseTheme.spacing.unit * 2}px 0`,
          "& .MuiCardHeader-root": {
            flexShrink: 0,
            position: "absolute",
            top: -offset,
            right: 20,
            left: 20,
            borderRadius: muiBaseTheme.spacing.unit / 2,
            backgroundColor: purple[500],
            overflow: "hidden",
            boxShadow: headerShadow,
            textAlign: "left",
            "& .MuiCardHeader-title": {
              color: "#ffffff",
              fontWeight: 900,
              letterSpacing: 1
            },
            "& .MuiCardHeader-subheader": {
              color: "#ffffff",
              opacity: 0.87,
              fontWeight: 200,
              letterSpacing: 0.4
            }
          },
          "& .MuiCardContent-root": {
            textAlign: "left",
            "& .MuiCardContent-inner": {
              paddingTop: "38px",
              overflowX: "auto"
            }
          }
        }
      }
    }
  };
};

class CheckoutForm extends Component {
  state = {
    data: null,
    loading: false,
    error: null,
    success: false,
    shippingAddresses: [],
    billingAddresses: [],
    selectedBillingAddress: "",
    selectedShippingAddress: "",
    shop: "",
    place: "",
    mode_of_payment: ""
  };

  componentDidMount() {
    this.handleFetchOrder();
    this.handleFetchBillingAddresses();
    this.handleFetchShippingAddresses();
  }

  handleGetDefaultAddress = addresses => {
    const filteredAddresses = addresses.filter(el => el.default === true);
    if (filteredAddresses.length > 0) {
      return filteredAddresses[0].id;
    }
    return "";
  };

  handleFetchBillingAddresses = () => {
    this.setState({ loading: true });
    authAxios
      .get(addressListURL("B"))
      .then(res => {
        this.setState({
          billingAddresses: res.data.map(a => {
            return {
              key: a.id,
              text: `${a.place}, ${a.area}, ${a.road_name}`,
              value: a.id
            };
          }),
          selectedBillingAddress: this.handleGetDefaultAddress(res.data),
          loading: false
        });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  };

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

  handleAddCoupon = (e, code) => {
    e.preventDefault();
    this.setState({ loading: true });
    authAxios
      .post(addCouponURL, { code })
      .then(res => {
        this.setState({ loading: false });
        this.handleFetchOrder();
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  };

  handleSelectChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  submit = ev => {
    ev.preventDefault();
    this.setState({ loading: true });
    const {
      selectedBillingAddress,
      selectedShippingAddress,
      mode_of_payment
    } = this.state;
    authAxios
      .post(checkoutURL, {
        selectedBillingAddress,
        selectedShippingAddress,
        mode_of_payment
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
    const {
      data,
      error,
      loading,
      success,
      billingAddresses,
      shippingAddresses,
      selectedBillingAddress,
      selectedShippingAddress,
      mode_of_payment
    } = this.state;
    return (
      <div>
        <Container>
          {loading && (
            <div>
              <CircularProgress />
              <CircularProgress color="secondary" />
            </div>
          )}
          {error && (
            <Alert severity="error">
              <AlertTitle>{JSON.stringify(error)}</AlertTitle>
            </Alert>
          )}
          <OrderPreview data={data} />

          <Header>Select Address</Header>
          {shippingAddresses.length > 0 ? (
            <Select
              name="selectedShippingAddress"
              value={selectedShippingAddress}
              clearable
              options={shippingAddresses}
              selection
              onChange={this.handleSelectChange}
            />
          ) : (
            <p>
              You need to <Link to="/profile">add an address</Link>
            </p>
          )}

          <Divider />
          {shippingAddresses.length < 1 ? (
            <p>You need to add an addresse to complete your purchase</p>
          ) : (
            <React.Fragment>
              <Header>Confirm Order?</Header>

              {success && (
                <Alert severity="success">
                  <AlertTitle>{"Your Order is successful"}</AlertTitle>
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
        </Container>
      </div>
    );
  }
}

export default CheckoutForm;

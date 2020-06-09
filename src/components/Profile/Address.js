import React from "react";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import EditIcon from "@material-ui/icons/Edit";
import DeleteSharpIcon from "@material-ui/icons/DeleteSharp";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AddIcon from "@material-ui/icons/Add";
import ListIcon from "@material-ui/icons/List";
import { Alert, AlertTitle } from "@material-ui/lab";
import CircularProgress from "@material-ui/core/CircularProgress";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import { Redirect } from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import DeleteIcon from "@material-ui/icons/Delete";

import {
  addressListURL,
  addressCreateURL,
  addressUpdateURL,
  addressDeleteURL,
  userIDURL,
  placeListURL
} from "../../constants";
import { authAxios } from "../../utils";

const UPDATE_FORM = "UPDATE_FORM";
const CREATE_FORM = "CREATE_FORM";

const styles = theme => ({
  paper: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(3)
    }
  },
  root: {
    minWidth: 275
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
  tab: {
    flexGrow: 1,
    maxWidth: 920
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8)
  },
  root: {
    minWidth: 275
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
  card: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column"
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8)
  },
  form: {
    padding: "30px"
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
});

class AddressForm extends React.Component {
  // constructor() {
  //   super();
  // }
  state = {
    error: null,
    loading: false,
    formData: {
      house_name: "",
      place: "",
      area: "",
      road_name: "",
      village: "",
      district: "",
      state: "",
      pin_code: "",
      phone_number: "",
      default: false,
      id: "",
      user: 1
    },
    saving: false,
    success: false,
    selectedPlace: "Kolapparamb",
    areas: [],
    places: []
  };

  componentDidMount() {
    const { address, formType } = this.props;
    if (formType === UPDATE_FORM) {
      this.setState({ formData: address });
    }
    // this.fetchPlaces();
  }

  handleChange = e => {
    const { formData } = this.state;
    const updatedFormdata = {
      ...formData,
      [e.target.name]: e.target.value
    };
    this.setState({
      formData: updatedFormdata
    });
  };

  handleChangePlace = e => {
    const { formData } = this.state;
    const updatedFormdata = {
      ...formData,
      [e.target.name]: e.target.value
    };
    this.setState({
      formData: updatedFormdata
    });
  };

  fetchPlaces = () => {
    this.setState({ loading: true });
    console.log("mounted");
    authAxios
      .get(placeListURL)
      .then(res => {
        this.setState({ places: res.data, loading: false });
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };

  handleSelectChange = (e, { name, value }) => {
    // console.log("value");
    const { formData } = this.state;
    const updatedFormdata = {
      ...formData,
      [name]: value
    };
    this.setState({
      formData: updatedFormdata
    });
  };

  handleSubmit = e => {
    this.setState({ saving: true });
    e.preventDefault();
    const { formType } = this.props;
    if (formType === UPDATE_FORM) {
      this.handleUpdateAddress();
    } else {
      this.handleCreateAddress();
    }
  };

  handleCreateAddress = () => {
    const { userID, activeItem } = this.props;
    const { formData } = this.state;
    authAxios
      .post(addressCreateURL, {
        ...formData,
        user: userID,
        address_type: "S"
      })
      .then(res => {
        this.setState({
          saving: false,
          success: true,
          formData: { default: false }
        });
        this.props.handleCallback();
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };

  handleUpdateAddress = () => {
    const { userID, activeItem } = this.props;
    const { formData } = this.state;
    authAxios
      .put(addressUpdateURL(formData.id), {
        ...formData,
        user: userID,
        address_type: "S"
      })
      .then(res => {
        this.setState({
          saving: false,
          success: true,
          formData: { default: false }
        });
        this.props.handleCallback();
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };

  render() {
    const { classes } = this.props;

    const {
      error,
      formData,
      success,
      saving,
      selectedPlace,
      places,
      areas
    } = this.state;

    return (
      <React.Fragment>
        <CssBaseline />
        {/* <Container> */}
        <Paper elevation={3} mt={10} mb={10} style={{ padding: "30px" }}>
          <br></br>
          <Typography variant="h5" gutterBottom>
            Address
          </Typography>
          <br></br>

          {success && (
            <Alert severity="success">
              <AlertTitle>Success</AlertTitle>
              Your address was saved
            </Alert>
          )}

          {error && (
            <Alert severity="error">
              <AlertTitle>{JSON.stringify(error)}</AlertTitle>
              {/* This is an error alert — <strong>check it out!</strong> */}
            </Alert>
          )}
          <form
            noValidate
            onSubmit={this.handleSubmit}
            // success={success}
            // error={error}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  id="place"
                  name="place"
                  label="Place Name"
                  fullWidth
                  autoComplete="place"
                  onChange={this.handleChange}
                  value={formData.place}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="area"
                  name="area"
                  label="Area Name"
                  fullWidth
                  autoComplete="area"
                  onChange={this.handleChange}
                  value={formData.area}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="house_name"
                  name="house_name"
                  label="House Name"
                  fullWidth
                  autoComplete="house_name"
                  onChange={this.handleChange}
                  value={formData.house_name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="road_name"
                  name="road_name"
                  label="Road Name"
                  fullWidth
                  autoComplete="road_name"
                  onChange={this.handleChange}
                  value={formData.road_name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="village"
                  name="village"
                  label="Village"
                  fullWidth
                  // autoComplete="village"
                  onChange={this.handleChange}
                  value={formData.village}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="district"
                  name="district"
                  label="District"
                  fullWidth
                  // autoComplete="district"
                  onChange={this.handleChange}
                  value={formData.district}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="state"
                  name="state"
                  label="State"
                  fullWidth
                  onChange={this.handleChange}
                  value={formData.state}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="pin_code"
                  name="pin_code"
                  label="Pin Code"
                  fullWidth
                  autoComplete="pin_code"
                  onChange={this.handleChange}
                  value={formData.pin_code}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="phone_number"
                  name="phone_number"
                  label="Phone Number"
                  fullWidth
                  autoComplete="phone_number"
                  onChange={this.handleChange}
                  value={formData.phone_number}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  value="best"
                  control={<Radio />}
                  label="Default Address"
                  name="default"
                  onChange={this.handleToggleDefault}
                  checked={formData.default}
                />
              </Grid>

              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </Grid>
          </form>
        </Paper>
      </React.Fragment>
    );
  }
}

class Profile extends React.Component {
  state = {
    activeItem: 0,
    addresses: [],
    userID: null,
    selectedAddress: null
    // places: []
  };

  componentDidMount() {
    this.handleFetchAddresses();
    this.handleFetchUserID();
  }

  handleItemClick = name => {
    this.setState({ activeItem: name }, () => {});
    console.log(this.state.activeItem);
  };

  // fetchPlaces = () => {
  //   this.setState({ loading: true });
  //   console.log("mounted");
  //   authAxios
  //     .get(placeListURL)
  //     .then(res => {
  //       this.setState({ places: res.data, loading: false });
  //     })
  //     .catch(err => {
  //       this.setState({ error: err });
  //     });
  // };

  handleAddAddress = name => {
    this.setState({ activeItem: name }, () => {
      this.handleFetchAddresses();
    });
  };

  handleGetActiveItem = () => {
    const { activeItem } = this.state;
    console.log(activeItem);
    if (activeItem === "addAddress") {
      return "addAddress";
    }
    return "Shipping Address";
  };

  handleDeleteAddress = addressID => {
    authAxios
      .delete(addressDeleteURL(addressID))
      .then(res => {
        this.handleCallback();
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };

  handleSelectAddress = address => {
    this.setState({ selectedAddress: address });
    // console.log(address);
  };

  handleFetchUserID = () => {
    authAxios
      .get(userIDURL)
      .then(res => {
        this.setState({ userID: res.data.userID });
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };
  handleFetchAddresses = () => {
    this.setState({ loading: true });
    const { activeItem } = this.state;
    authAxios
      .get(addressListURL(activeItem === "S"))
      .then(res => {
        this.setState({ addresses: res.data, loading: false });
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };

  handleCallback = () => {
    this.handleFetchAddresses();
  };

  renderAddresses = () => {
    const { activeItem, addresses, selectedAddress, userID } = this.state;
    return (
      <div>
        <Grid container spacing={1} maxwidth="md">
          {addresses.map(a => {
            return (
              <Grid item key={a.id} xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    {a.default && (
                      <Badge
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right"
                        }}
                        badgeContent={"Default"}
                        color="primary"
                      ></Badge>
                    )}

                    <Typography variant="h5" component="h2">
                      {a.place}
                    </Typography>
                    <br />
                    <Typography color="textPrimary">
                      {a.house_name} {a.area} {a.roa}
                    </Typography>
                    <Typography variant="body2" component="p">
                      {a.village}
                      <br />
                      {a.pin_code}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Fab
                      color="primary"
                      aria-label="edit"
                      size="small"
                      onClick={() => this.handleSelectAddress(a)}
                    >
                      <EditIcon />
                    </Fab>
                    <Fab
                      color="secondary"
                      aria-label="edit"
                      size="small"
                      onClick={() => this.handleDeleteAddress(a.id)}
                    >
                      <DeleteIcon />
                    </Fab>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </div>
    );
  };

  handleItemClick1 = (event, value) => {
    this.setState({ activeItem: value });
  };

  render() {
    const { classes } = this.props;
    const {
      activeItem,
      error,
      loading,
      userID,
      addresses,
      selectedAddress
    } = this.state;

    const { isAuthenticated } = this.props;
    console.log(isAuthenticated);

    // if (!isAuthenticated) {
    //   return <Redirect to="/" />;
    // }

    return (
      <React.Fragment>
        <Container className={classes.cardGrid} maxwidth="md">
          {loading && (
            <div
              align="middle"
              className={classes.loading}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <CircularProgress />
            </div>
          )}
          {error && (
            <Alert severity="error">
              <AlertTitle>{JSON.stringify(error)}</AlertTitle>
              This is an error alert — <strong>check it out!</strong>
            </Alert>
          )}
          <Paper square className={classes.tab}>
            <Tabs
              variant="fullWidth"
              indicatorColor="secondary"
              textColor="secondary"
              aria-label="icon label tabs example"
              value={this.state.activeItem}
              onChange={this.handleItemClick1}
            >
              <Tab icon={<ListIcon />} label="My Delivery Addresses " />
              <Tab icon={<AddIcon />} label="Add Address" />
            </Tabs>
          </Paper>
          <br></br>
          {activeItem === 1 ? (
            <AddressForm formType={CREATE_FORM} userID={userID} />
          ) : (
            this.renderAddresses()
          )}
          {selectedAddress && (
            <AddressForm
              handleCallback={this.handleCallback}
              userID={userID}
              address={selectedAddress}
              formType={UPDATE_FORM}
            />
          )}
        </Container>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

export default connect(mapStateToProps)(withStyles(styles)(Profile));

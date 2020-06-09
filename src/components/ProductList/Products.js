import React from "react";
import { connect } from "react-redux";
import axios from "axios";

import { Alert, AlertTitle } from "@material-ui/lab";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";

import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";

import JssProvider from "react-jss/lib/JssProvider";
import { createGenerateClassName } from "@material-ui/core/styles";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import { fetchCart } from "../../store/actions/cart";
import { authAxios } from "../../utils";

import {
  addToCartURL,
  ShopProductListURL,
  orderItemDeleteURL,
  orderItemUpdateQuantityURL
} from "../../constants";

const muiBaseTheme = createMuiTheme();

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: true
});

const theme = {
  overrides: {
    MuiCard: {
      root: {
        "&.MuiEngagementCard--01": {
          transition: "0.3s",
          maxWidth: 304,
          margin: "auto",
          boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
          "&:hover": {
            boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
          },
          "& .MuiCardMedia-root": {
            paddingTop: "56.25%"
          },
          "& .MuiCardContent-root": {
            textAlign: "left",
            padding: muiBaseTheme.spacing.unit * 3
          },
          "& .MuiDivider-root": {
            margin: `${muiBaseTheme.spacing.unit * 3}px 0`
          },
          "& .MuiTypography--heading": {
            fontWeight: "bold"
          },
          "& .MuiTypography--subheading": {
            lineHeight: 1.8
          },
          "& .MuiAvatar-root": {
            display: "inline-block",
            border: "2px solid white",
            "&:not(:first-of-type)": {
              marginLeft: -muiBaseTheme.spacing.unit
            }
          },
          "& .MuiButton--readMore": {
            backgroundImage: "linear-gradient(147deg, #fe8a39 0%, #fd3838 74%)",
            boxShadow: "0px 4px 32px rgba(252, 56, 56, 0.4)",
            borderRadius: 100,
            paddingLeft: 24,
            paddingRight: 24,
            color: "#ffffff"
          }
        }
      }
    }
  }
};

class ProductList extends React.Component {
  state = {
    loading: false,
    error: null,
    data: [],
    formData: {}
  };

  componentDidMount() {
    const {
      match: { params }
    } = this.props;
    this.props.refreshCart();
    this.setState({ loading: true });
    axios
      .get(ShopProductListURL(params.shopID))
      .then(res => {
        this.setState({ data: res.data, loading: false });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  }

  handleToggleForm = () => {
    const { formVisible } = this.state;
    this.setState({
      formVisible: !formVisible
    });
  };

  handleFormatData = formData => {
    // convert {colour: 1, size: 2} to [1,2] - they're all variations
    return Object.keys(formData).map(key => {
      return formData[key];
    });
  };

  handleAddToCart = (id, shop, place) => {
    this.setState({ loading: true });
    const { formData } = this.state;
    const variations = this.handleFormatData(formData);
    authAxios
      .post(addToCartURL, { place, shop, id, variations })
      .then(res => {
        this.props.refreshCart();
        this.setState({ loading: false });
        this.check(authAxios);
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  };

  renderVariations = orderItem => {
    let text = "";
    orderItem.item_variations.forEach(iv => {
      text += `${iv.variation.name}: ${iv.value}, `;
    });
    return text;
  };

  handleRemoveQuantityFromCart = slug => {
    authAxios
      .post(orderItemUpdateQuantityURL, { slug })
      .then(res => {
        this.handleFetchOrder();
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };

  handleRemoveItem = itemID => {
    authAxios
      .delete(orderItemDeleteURL(itemID))
      .then(res => {
        this.handleFetchOrder();
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };

  handleChange = (e, { name, value }) => {
    const { formData } = this.state;
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    this.setState({ formData: updatedFormData });
  };

  render() {
    const { data, error, loading } = this.state;
    // const item = data;
    const { classes, isAuthenticated } = this.props;
    // console.log(isAuthenticated);

    return (
      <JssProvider generateClassName={generateClassName}>
        <MuiThemeProvider theme={createMuiTheme(theme)}>
          <div>
            <CssBaseline />
            <Container className={classes.cardGrid} maxWidth="md">
              {loading && (
                <div className={classes.loading}>
                  <CircularProgress />
                  <CircularProgress color="secondary" />
                </div>
              )}
              {error && (
                <Alert severity="error">
                  <AlertTitle>{JSON.stringify(error)}</AlertTitle>
                  This is an error alert — <strong>check it out!</strong>
                </Alert>
              )}
              <Grid container spacing={4} maxwidth="md">
                {data.map(card => (
                  <Grid item key={card.id} xs={12} sm={6} md={4}>
                    <Card className={"MuiEngagementCard--01"}>
                      <CardMedia
                        className={"MuiCardMedia-root"}
                        image={card.image}
                      />
                      <CardContent className={"MuiCardContent-root"}>
                        <Typography
                          className={"MuiTypography--date"}
                          variant={"overline"}
                        >
                          {card.category_name}
                        </Typography>
                        <Typography
                          className={"MuiTypography--heading"}
                          variant={"h6"}
                          gutterBottom
                        >
                          {card.title}
                        </Typography>
                        <Typography
                          className={"MuiTypography--subheading"}
                          variant={"h6"}
                        >
                          Rs: {card.price}
                        </Typography>
                        <Divider className={"MuiDivider-root"} light />
                        <Button
                          className={"MuiButton--readMore"}
                          onClick={() =>
                            this.handleAddToCart(card.id, card.shop)
                          }
                        >
                          Add to cart
                        </Button>
                      </CardContent>
                    </Card>
                    {card.variations &&
                      card.variations.map(v => {
                        return (
                          <React.Fragment>
                            <List className={classes.root}>
                              <ListItem>
                                <ListItemAvatar>
                                  <p>{v.name}</p>
                                </ListItemAvatar>
                                <ListItemText
                                  primary="Photos"
                                  secondary="Jan 9, 2014"
                                />
                              </ListItem>
                            </List>
                          </React.Fragment>
                        );
                      })}
                  </Grid>
                ))}
              </Grid>
            </Container>
          </div>
        </MuiThemeProvider>
      </JssProvider>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    refreshCart: () => dispatch(fetchCart())
  };
};
// const mapStateToProps = state => {
//   return {
//     isAuthenticated: state.auth.token !== null
//   };
// };

export default connect(
  null,
  mapDispatchToProps
)(withStyles(theme)(ProductList));

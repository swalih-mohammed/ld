import React from "react";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import JssProvider from "react-jss/lib/JssProvider";
import { createGenerateClassName } from "@material-ui/core/styles";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { placeShopListURL } from "../../constants";

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

// const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

class ShopList extends React.Component {
  state = {
    loading: false,
    error: null,
    data: []
  };

  componentDidMount() {
    const {
      match: { params }
    } = this.props;
    this.setState({ loading: true });
    axios
      // .get(shopListURL)
      .get(placeShopListURL(params.placeID))
      .then(res => {
        this.setState({ data: res.data, loading: false });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  }

  render() {
    const { data, error, loading } = this.state;
    const cards = data;

    const { classes } = this.props;
    return (
      <JssProvider generateClassName={generateClassName}>
        <MuiThemeProvider theme={createMuiTheme(theme)}>
          <React.Fragment>
            <CssBaseline />
            <div className={classes.drawerHeader}>
              <Container className={classes.cardGrid} maxwidth="md">
                <Grid container spacing={4} maxwidth="md">
                  {cards.map(card => (
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
                            {card.category}
                          </Typography>
                          <Typography
                            className={"MuiTypography--heading"}
                            variant={"h6"}
                            gutterBottom
                          >
                            {card.name}
                          </Typography>
                          <Typography
                            className={"MuiTypography--subheading"}
                            variant={"h6"}
                          >
                            {card.place}
                          </Typography>
                          <Divider className={"MuiDivider-root"} light />
                          <Button
                            className={"MuiButton--readMore"}
                            onClick={() =>
                              this.props.history.push(
                                `/shops/${card.id}/products`
                              )
                            }
                          >
                            Buy From us
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Container>
            </div>
          </React.Fragment>
        </MuiThemeProvider>
      </JssProvider>
    );
  }
}

export default withStyles(theme)(ShopList);

/* eslint-disable max-len,no-script-url,jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import {
  makeStyles,
  useTheme,
  withStyles,
  fade
} from "@material-ui/core/styles";

import axios from "axios";
import { authAxios } from "../../utils";
import { placeListURL } from "../../constants";

const useStyles = makeStyles(theme => ({
  root: {
    maxwidth: 345
  },
  media: {
    height: 140
  }
}));

function Places() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      const res = await axios.get(placeListURL);
      setPlaces(res.data);
      setLoading(false);
    };

    fetchPlaces();
  }, []);

  const goToPlace = id => {
    history.push(`/places/${id}/shops`);
  };
  const refreshPage = () => {
    window.location.reload(false);
  };

  let history = useHistory();

  // function handleClick() {
  //   history.push(`/shops/${card.id}/products`);
  // }

  const classes = useStyles();
  return (
    <React.Fragment>
      <CssBaseline />
      <div className={classes.drawerHeader}>
        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4} maxwidth="md">
            {places.map(place => (
              <Grid item key={place.id} xs={12} sm={6} md={4}>
                <Card className={"MuiRewardCard--01"}>
                  <CardContent className={"MuiCardContent-root"}>
                    <Typography
                      className={"MuiTypography--overline"}
                      variant={"overline"}
                    >
                      {place.village}
                    </Typography>
                    <Typography
                      className={"MuiTypography--heading"}
                      variant={"h6"}
                      gutterBottom
                    >
                      {place.name}
                    </Typography>
                    <Button
                      className={"MuiButton--readMore"}
                      // onClick={() => history.push(`/places/${place.id}/shops`)}
                      onClick={() => {
                        goToPlace(place.id);
                        refreshPage();
                      }}
                    >
                      View Shops
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>
    </React.Fragment>
  );
}

Places.getTheme = muiBaseTheme => ({
  MuiCard: {
    root: {
      "&.MuiRewardCard--01": {
        borderRadius: muiBaseTheme.spacing.unit * 2, // 16px
        transition: "0.3s",
        boxShadow: "0px 14px 80px rgba(34, 35, 58, 0.2)",
        width: "95%",
        position: "center",
        maxwidth: 500,
        marginLeft: "auto",
        overflow: "initial",
        display: "flex",
        alignItems: "center",
        paddingLeft: 8,
        paddingRight: 8,
        background:
          "linear-gradient(34deg, rgba(55,16,83,1) 0%, rgba(162,73,190,1) 29%, rgba(33,16,83,1) 92%)",
        "& .MuiCardMedia-root": {
          flexShrink: 0,
          width: "30%",
          paddingTop: "30%",
          marginLeft: "auto"
        },
        "& .MuiCardContent-root": {
          textAlign: "left",
          padding: muiBaseTheme.spacing.unit * 2
        },
        "& .MuiTypography--overline": {
          lineHeight: 2,
          color: "#ffffff",
          fontWeight: "bold",
          opacity: 0.7
        },
        "& .MuiTypography--heading": {
          fontWeight: "900",
          color: "#ffffff",
          letterSpacing: 0.5
        },
        "& .MuiTypography--subheading": {
          marginBottom: muiBaseTheme.spacing.unit * 2,
          color: "#ffffff"
        },
        "& .MuiButton--readMore": {
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          borderRadius: 100,
          paddingLeft: 48,
          paddingRight: 48,
          color: "#ffffff",
          textTransform: "none"
        }
      }
    }
  }
});
Places.metadata = {
  name: "Reward Card",
  description: "Commonly used in games."
};

export default Places;

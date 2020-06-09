import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import Badge from "@material-ui/core/Badge";
import InputBase from "@material-ui/core/InputBase";
import ListIcon from "@material-ui/icons/List";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

import clsx from "clsx";
import {
  makeStyles,
  useTheme,
  withStyles,
  fade
} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import LockRoundedIcon from "@material-ui/icons/LockRounded";
import SvgIcon from "@material-ui/core/SvgIcon";
import SearchIcon from "@material-ui/icons/Search";

import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../../store/actions/auth";
import { fetchCart } from "../../store/actions/cart";
import { useDispatch } from "react-redux";

const drawerWidth = 300;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
      // marginBottom: theme.spacing(10)
    })
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  },
  rightIcons: {
    marginLeft: "auto"
  },
  rightToolbar: {
    marginLeft: "auto",
    marginRight: -12
  },
  showAppBar: {
    transform: "translateY(0)",
    transition: "transform .5s"
  },
  hideAppBar: {
    transform: "translateY(-110%)",
    transition: "transform .5s"
  }
}));

function Layout(props) {
  const classes = useStyles();
  const theme = useTheme();

  const { cart } = props;
  const { loading } = props;
  const { authenticated } = props;

  const [open, setOpen] = React.useState(false);
  const [openR, setOpenR] = React.useState(false);

  const dispatch = useDispatch();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDrawerOpenR = () => {
    setOpenR(true);
  };

  const handleDrawerCloseR = () => {
    setOpenR(false);
  };
  function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        style={{ margin: 0 }}
        position="sticky"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Link to="/" style={{ color: "#FFF" }}>
            <Typography variant="h5" noWrap>
              Local Dukans
            </Typography>
          </Link>
          {authenticated ? (
            <React.Fragment>
              <MenuItem className={classes.rightIcons}>
                <IconButton
                  aria-label="show 11 new notifications"
                  color="inherit"
                  onClick={handleDrawerOpenR}
                >
                  <Badge
                    badgeContent={`${
                      cart !== null ? cart.order_items.length : 0
                    }`}
                    color="secondary"
                  >
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </MenuItem>
            </React.Fragment>
          ) : (
            <section className={classes.rightToolbar}>
              <Button href="/login" color="inherit" style={{ color: "#FFF" }}>
                Login
              </Button>
              <Button href="/signup" color="inherit" style={{ color: "#FFF" }}>
                Sign Up
              </Button>
            </section>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List component="nav" aria-label="main mailbox folders">
          <ListItem>
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemLink href="/orders">
              <ListItemText primary="Orders" />
            </ListItemLink>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemLink href="/profile">
              <ListItemText primary="Profile" />
            </ListItemLink>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <LockRoundedIcon />
            </ListItemIcon>
            <ListItemLink href="/logout" onClick={props.logout}>
              <ListItemText primary="Log out" />
            </ListItemLink>
          </ListItem>
        </List>
        <Divider />

        <Divider />
      </Drawer>
      {/* right drawer */}
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={openR}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerCloseR}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <TableContainer component={Paper}>
          <Table
            className={classes.table}
            size="small"
            aria-label="a dense table"
          >
            <TableHead>
              <TableRow>
                <TableCell align="right">Item</TableCell>
                <TableCell align="right">Quanitty</TableCell>
                <TableCell align="right">Price</TableCell>
              </TableRow>
            </TableHead>
            {/* {cart !== null ? ( */}
            {cart && (
              <React.Fragment>
                <TableBody>
                  {cart.order_items.map(order_item => {
                    return (
                      <TableRow key={order_item.id}>
                        <TableCell component="th" scope="row">
                          {order_item.item.title}
                        </TableCell>
                        <TableCell align="right">
                          {order_item.quantity}
                        </TableCell>
                        <TableCell align="right">
                          {order_item.final_price}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </React.Fragment>
            )}
          </Table>
        </TableContainer>

        <Divider />
        <Button href="/checkout" variant="contained" color="primary">
          Check out
        </Button>
      </Drawer>
    </div>
  );
}

const styles = theme => ({
  content: {
    // display: "flex",
    alignItems: "center",
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(5),
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  }
});
function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

// footer
const useStylesFooter = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  appBar: {
    top: "auto",
    bottom: 0
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto"
    }
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch"
      }
    }
  },
  toolbar: theme.mixins.toolbar
}));

function Footer() {
  const classes = useStylesFooter();

  return (
    <div className={classes.toolbar}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton href="/">
            <HomeIcon style={{ color: "#FFF" }} />
          </IconButton>

          <Typography className={classes.title} noWrap></Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

class CustomLayout extends React.Component {
  componentDidMount() {
    this.props.fetchCart();
  }

  render() {
    const { authenticated, cart, loading } = this.props;
    const { classes } = this.props;
    // console.log(this.props);
    return (
      <div>
        <Layout
          authenticated={authenticated}
          cart={cart}
          loading={loading}
          logout={this.props.logout}
        />
        <div className={classes.content}>{this.props.children}</div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.auth.token !== null,
    cart: state.cart.shoppingCart,
    loading: state.cart.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logout()),
    fetchCart: () => dispatch(fetchCart())
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(CustomLayout))
);

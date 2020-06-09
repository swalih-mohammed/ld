import React from "react";
import { Route } from "react-router-dom";
import Hoc from "./hoc/hoc";

import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import HomepageLayout from "./containers/Home";
import ProductList from "./containers/ProductList";
import ProductDetail from "./containers/ProductDetail";
import ShopList from "./components/ShopList/ShopList";
import ShopProductList from "./components/ProductList/Products";
import Profile from "./components/Profile/Address";
import Dashboard from "./components/Orders";
import Checkout from "./components/OrderSummary/OrderSummary";
import placesList from "./components/Places";
import PlacesShopList from "./components/ShopList/ShopList";

// import Login from "./containers/Login";
// import Signup from "./containers/Signup";
// import ShopProductList from "./containers/ShopProductList";
// import ShopList from "./containers/ShopList";
// import OrderSummary from "./containers/OrderSummary";
// import Checkout from "./containers/Checkout";
// import Checkout from "./components/OrderSummary/OrderSummary";
// import Profile from "./containers/Profile";
// import Dashboard from "./components/Orders/Orders";
// import Profile from "./components/Profile/Test";
// import Profile from "./components/Profile/Profile";

const BaseRouter = () => (
  <Hoc>
    <Route exact path="/places" component={placesList} />
    <Route path="/places/:placeID" component={PlacesShopList} />
    <Route exact path="/products" component={ProductList} />
    <Route path="/products/:productID" component={ProductDetail} />
    <Route exact path="/shops" component={ShopList} />
    <Route path="/shops/:shopID" component={ShopProductList} />
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
    <Route path="/checkout" component={Checkout} />
    <Route path="/profile" component={Profile} />
    <Route path="/orders" component={Dashboard} />
    <Route exact path="/" component={placesList} />
  </Hoc>
);
export default BaseRouter;

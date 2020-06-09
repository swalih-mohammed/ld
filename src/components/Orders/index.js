import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Customer from "./CustomerClass";
import Owner from "./OwnerClass";
import Delivery from "./DeliveryClass";

import { userTypeURL } from "../../constants";
import { authAxios } from "../../utils";
import { fetchCart } from "../../store/actions/cart";

function OrderIndex() {
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const findUserType = async () => {
      setLoading(true);
      const res = await authAxios.get(userTypeURL);
      setUserType(res.data);
      setLoading(false);
    };

    findUserType();
  }, []);

  if (userType != null) {
    if (userType["UserType"] === "DeliveryStaff") {
      return (
        <div>
          <Delivery />
        </div>
      );
    } else if (userType["UserType"] === "ShopOwner") {
      return (
        <div>
          <Owner />
        </div>
      );
    } else {
      return (
        <div>
          <Customer />
        </div>
      );
    }
  } else {
    return null;
  }
}

// const mapStateToProps = state => {
//   return {
//     authenticated: state.auth.token !== null,
//     cart: state.cart.shoppingCart,
//     loading: state.cart.loading
//   };
// };

export default OrderIndex;

// export default OrderIndex;

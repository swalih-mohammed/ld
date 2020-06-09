const localhost = "http://127.0.0.1:8000";

const apiURL = "/api";

export const endpoint = `${localhost}${apiURL}`;

export const placeListURL = `${endpoint}/places/`;
export const areaListURL = name => `${endpoint}/places/${name}/areas`;
export const placeShopListURL = id => `${endpoint}/places/${id}/shops`;
export const productListURL = `${endpoint}/products/`;
export const shopListURL = `${endpoint}/shops/`;
export const ShopProductListURL = id => `${endpoint}/shops/${id}/products`;
export const productDetailURL = id => `${endpoint}/products/${id}/`;
export const addToCartURL = `${endpoint}/add-to-cart/`;
export const orderSummaryURL = `${endpoint}/order-summary/`;
export const checkoutURL = `${endpoint}/checkout/`;
export const addCouponURL = `${endpoint}/add-coupon/`;
export const countryListURL = `${endpoint}/countries/`;
export const userIDURL = `${endpoint}/user-id/`;
export const userTypeURL = `${endpoint}/user-type/`;
export const addressListURL = addressType =>
  `${endpoint}/addresses/?address_type=${addressType}`;
export const addressCreateURL = `${endpoint}/addresses/create/`;
export const addressUpdateURL = id => `${endpoint}/addresses/${id}/update/`;
export const orderAddressURL = id => `${endpoint}/addresses/${id}/`;
export const addressDeleteURL = id => `${endpoint}/addresses/${id}/delete/`;
export const orderItemDeleteURL = id => `${endpoint}/order-items/${id}/delete/`;
export const orderItemUpdateQuantityURL = `${endpoint}/order-item/update-quantity/`;
export const orderStatusUpdateURL = id =>
  `${endpoint}/orders/${id}/status-update/`;
export const paymentListURL = `${endpoint}/payments/`;
export const orderListURL = `${endpoint}/orders/`;
export const orderDeleteURL = id => `${endpoint}/orders/${id}/delete/`;
// export const placeListURL = `${endpoint}/places/`;

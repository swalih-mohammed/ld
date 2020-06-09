// import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import { connect } from "react-redux";
// import { makeStyles } from "@material-ui/core/styles";
// import Box from "@material-ui/core/Box";
// import Collapse from "@material-ui/core/Collapse";
// import IconButton from "@material-ui/core/IconButton";
// import Table from "@material-ui/core/Table";
// import TableBody from "@material-ui/core/TableBody";
// import TableCell from "@material-ui/core/TableCell";
// import TableContainer from "@material-ui/core/TableContainer";
// import TableHead from "@material-ui/core/TableHead";
// import TableRow from "@material-ui/core/TableRow";
// import Typography from "@material-ui/core/Typography";
// import Paper from "@material-ui/core/Paper";
// import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
// import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
// import Container from "@material-ui/core/Container";
// import Icon from "@material-ui/core/Icon";

// import { userIDURL, userTypeURL, orderListURL } from "../constants";

// import { authAxios } from "../utils";

// const useRowStyles = makeStyles({
//   root: {
//     "& > *": {
//       borderBottom: "unset",
//       margin: "20px",
//       padding: "20px"
//     },
//     orderDtails: {
//       borderBottom: "unset",
//       margin: "300px",
//       padding: "20px"
//     }
//   }
// });

// const Myapp = () => {
//   const [loading, setLoading] = useState(false);
//   const [orders, setOrders] = useState([]);
//   const [userID, setUserID] = useState(null);
//   const [userType, setuserType] = useState(null);
//   const [currentPage, setCurrentPage] = useState(9);
//   const [ordersPerPage] = useState(5);

//   const classes = useRowStyles();

//   useEffect(() => {
//     const findUserType = async () => {
//       setLoading(true);
//       const res = await authAxios.get(userTypeURL);
//       setuserType(res.data);
//       setLoading(false);
//     };

//     findUserType();
//   }, []);

//   useEffect(() => {
//     const findUserID = async () => {
//       setLoading(true);
//       const res = await authAxios.get(userIDURL);
//       setUserID(res.data);
//       setLoading(false);
//     };

//     findUserID();
//   }, []);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       setLoading(true);
//       const res = await authAxios.get(orderListURL);
//       setOrders(res.data);
//       setLoading(false);
//     };

//     fetchOrders();
//   }, []);

//   // Get current orders
//   const indexOfLastOrder = currentPage * ordersPerPage;
//   const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
//   const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

//   // Change page
//   const paginate = pageNumber => setCurrentPage(pageNumber);

//   console.log(ordersPerPage);
//   return (
//     <div className="container mt-5">
//       <h1 className="text-primary mb-3">My Blog</h1>
//       <CustomerTable orders={currentOrders} loading={loading} />
//       <Pagination
//         ordersPerPage={ordersPerPage}
//         totalOrders={orders.length}
//         paginate={paginate}
//       />
//     </div>
//   );
// };

// const Pagination = ({ ordersPerPage, totalOrders, paginate }) => {
//   const pageNumbers = [];

//   for (let i = 1; i <= Math.ceil(totalOrders / ordersPerPage); i++) {
//     pageNumbers.push(i);
//   }
//   console.log(ordersPerPage);

//   return (
//     <nav>
//       <ul className="pagination">
//         {pageNumbers.map(number => (
//           <li key={number} className="page-item">
//             <a onClick={() => paginate(number)} className="page-link">
//               {number}
//             </a>
//           </li>
//         ))}
//       </ul>
//     </nav>
//   );
// };

// function CustomerTable(props) {
//   const { orders } = props;
//   const { UserType } = props;
//   const classes = useRowStyles();
//   return (
//     <Container maxWidth="md">
//       <TableContainer component={Paper}>
//         <Table
//           aria-label="collapsible table"
//           className={classes.paperContainer}
//         >
//           <TableHead>
//             <TableRow>
//               <TableCell />
//               <TableCell align="right">Shop Name</TableCell>
//               <TableCell align="right">Total Amount</TableCell>
//               <TableCell align="right">Date</TableCell>
//               <TableCell align="right">Order Status</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {orders.map(order => (
//               <Customer key={order.id} order={order} />
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Container>
//   );
// }

// function Customer(props) {
//   const { order } = props;
//   const [open, setOpen] = React.useState(false);
//   const classes = useRowStyles();

//   return (
//     <React.Fragment>
//       <TableRow className={classes.root}>
//         <TableCell>
//           <IconButton
//             aria-label="expand row"
//             size="small"
//             onClick={() => setOpen(!open)}
//           >
//             {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
//           </IconButton>
//         </TableCell>
//         <TableCell component="th" scope="row">
//           {order.shop_name}
//         </TableCell>
//         {/* <TableCell align="right">{order.shop_name}</TableCell> */}
//         <TableCell align="right">{order.total}</TableCell>
//         <TableCell align="right">{order.start_date}</TableCell>
//         <TableCell align="right">{order.order_status}</TableCell>
//       </TableRow>
//       <TableRow>
//         <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
//           <Collapse in={open} timeout="auto" unmountOnExit>
//             <Box margin={1}>
//               <Typography variant="h6" gutterBottom component="div">
//                 Order Details
//               </Typography>
//               <Table size="small" aria-label="purchases">
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Item</TableCell>

//                     <TableCell align="right">Quantity</TableCell>
//                     <TableCell align="right">Total price</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {order.order_items.map(order_item => (
//                     <TableRow key={order_item.id}>
//                       <TableCell component="th" scope="row">
//                         {order_item.item.title}
//                       </TableCell>

//                       <TableCell align="right">{order_item.quantity}</TableCell>
//                       <TableCell align="right">
//                         {order_item.final_price}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </Box>
//           </Collapse>
//         </TableCell>
//       </TableRow>
//     </React.Fragment>
//   );
// }

// export default Myapp;

import React from "react";
import { connect } from "react-redux";
import axios from "axios";
// import Button from "react-bootstrap/Button";
import Layout from "react-bootstrap/Button";
import {
  Container,
  Dimmer,
  Image,
  Item,
  Card,
  Icon,
  Loader,
  Message,
  Segment,
  Label,
  Button,
  Select,
  Divider,
  Form,
  Header
} from "semantic-ui-react";
import {
  addToCartURL,
  ShopProductListURL,
  orderItemDeleteURL,
  orderItemUpdateQuantityURL
} from "../constants";
import { fetchCart } from "../store/actions/cart";
import { authAxios } from "../utils";

class ShopProductList extends React.Component {
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

  handleAddToCart = (slug, shop, place) => {
    this.setState({ loading: true });
    const { formData } = this.state;
    const variations = this.handleFormatData(formData);
    authAxios
      .post(addToCartURL, { place, shop, slug, variations })
      .then(res => {
        this.props.refreshCart();
        this.setState({ loading: false });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
    console.log(data);
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
    const { data, error, formData, formVisible, loading } = this.state;
    const item = data;
    return (
      <Container>
        {error && (
          <Message
            error
            header="There was some errors with your submission"
            content={JSON.stringify(error)}
          />
        )}
        {loading && (
          <Segment>
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>

            <Image src="/images/wireframe/short-paragraph.png" />
          </Segment>
        )}
        <Item.Group divided>
          {data.map(item => {
            return (
              <Item key={item.id}>
                <Item.Image src={item.image} />
                <Item.Content>
                  <Item.Header
                    as="a"
                    onClick={() =>
                      this.props.history.push(`/products/${item.id}`)
                    }
                  >
                    {item.title}
                  </Item.Header>
                  <Item.Meta>
                    <span className="cinema">{item.category}</span>
                  </Item.Meta>
                  <Item.Description>{item.description}</Item.Description>
                  <Item.Extra>
                    <Button
                      size="mini"
                      primary
                      floated="right"
                      icon
                      labelPosition="right"
                      onClick={() => this.handleAddToCart(item.slug, item.shop)}
                    >
                      Add
                      <Icon name="cart plus" />
                    </Button>
                    <Button.Group positive size="mini" floated="right">
                      <Button>
                        <Icon
                          name="minus"
                          style={{ float: "left", cursor: "pointer" }}
                          onClick={() =>
                            this.handleRemoveQuantityFromCart(item.slug)
                          }
                        />
                      </Button>
                      <Button>{Item.quantity}</Button>
                      <Button>
                        <Icon
                          name="plus"
                          style={{ float: "right", cursor: "pointer" }}
                          onClick={() => this.handleAddToCart(item.slug)}
                        />
                      </Button>
                    </Button.Group>
                  </Item.Extra>

                  <Item.Extra>
                    {data.variations &&
                      data.variations.map(v => {
                        return (
                          <React.Fragment key={v.id}>
                            <Header as="h3">{v.name}</Header>
                            <Item.Group divided>
                              {v.item_variations.map(iv => {
                                return (
                                  <Item key={iv.id}>
                                    {iv.attachment && (
                                      <Item.Image
                                        size="tiny"
                                        src={`http://127.0.0.1:8000${iv.attachment}`}
                                      />
                                    )}
                                    <Item.Content verticalAlign="middle">
                                      {iv.value}
                                    </Item.Content>
                                  </Item>
                                );
                              })}
                            </Item.Group>
                          </React.Fragment>
                        );
                      })}
                  </Item.Extra>
                </Item.Content>
              </Item>
            );
          })}
        </Item.Group>
      </Container>
    );
  }
}
const mapDispatchToProps = dispatch => {
  return {
    refreshCart: () => dispatch(fetchCart())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(ShopProductList);

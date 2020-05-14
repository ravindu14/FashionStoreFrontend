// @flow
import React, { PureComponent } from "react";

import Row from "components/Row";
import Col from "components/Col";
import ImagePlaceHolder from "assets/image/product-image-placeholder.png";
import classNames from "classnames";
import Button from "components/button";

import "../styles.scss";

type CartProps = {
  cartItems: Array<any>,
  removeFromCart: Function,
  editCartItems: Function,
  handleCart: Function,
  open: boolean,
};

class CartForm extends PureComponent<CartProps> {
  constructor(props) {
    super(props);

    //$FlowFixMe
    this.focusTextInput = this.focusTextInput.bind(this);
    //$FlowFixMe
    this.handleCartModal = this.handleCartModal.bind(this);
    //$FlowFixMe
    this.disableInput = this.disableInput.bind(this);
    //$FlowFixMe
    this.removeProducts = this.removeProducts.bind(this);
    //$FlowFixMe
    this.changeItemQuantity = this.changeItemQuantity.bind(this);
  }

  focusTextInput(productCode) {
    const { disabled } = this.state;

    const updatedInputList = disabled.map((field) => {
      if (productCode === field.id) {
        return {
          ...field,
          disable: false,
        };
      }
      return {
        ...field,
      };
    });

    this.setState(
      {
        ...this.state,
        disabled: [...updatedInputList],
      },
      () => this[`${productCode}-ref`].current.focus()
    );
  }

  disableInput(selectedProductCode) {
    const { editCartItems, cartItems } = this.props;
    const { disabled } = this.state;

    const updatedProduct = cartItems.filter(({ product }) => {
      return product.productCode === selectedProductCode;
    });

    editCartItems(
      {
        product: [
          {
            productCode: updatedProduct[0].product.productCode,
            productTenantId: updatedProduct[0].product.productTenantId,
            quantity: updatedProduct[0].quantity,
            shippingCountry: updatedProduct[0].shippingCountry,
            shippingCost: updatedProduct[0].shippingCost,
            price: updatedProduct[0].price,
          },
        ],
      },
      { page: 1, pageSize: 50 }
    );

    const updatedInputList = disabled.map((field) => {
      if (selectedProductCode === field.id) {
        return {
          ...field,
          disable: true,
        };
      }
      return {
        ...field,
      };
    });

    this.setState({
      ...this.state,
      disabled: [...updatedInputList],
    });
  }

  handleCartModal() {
    this.props.handleCart();
  }

  removeProducts(productCode, tenantId) {
    const { removeCartItems } = this.props;

    removeCartItems(
      { productCode: productCode, productTenantId: tenantId },
      { page: 1, pageSize: 50 }
    );
  }

  changeItemQuantity(productCode, value) {
    const { onEditCArtItems } = this.props;

    onEditCArtItems({ productCode, value: value.target.value });
  }

  render() {
    const { cartItems } = this.props;

    let subTotal = 0;
    cartItems.length > 0 &&
      cartItems.map(({ price, quantity }) => {
        subTotal = subTotal + parseFloat(price) * parseFloat(quantity);
        return null;
      });

    return (
      <div
        className={classNames("cart-modal-container", {
          open: this.props.open,
        })}
      >
        <div className="cart-content">
          <Row>
            <Col size="10">
              <div className="cart-header">Cart</div>
            </Col>
            <Col size="2" className="close-icon-container">
              <div className="close-cart" onClick={this.handleCartModal}>
                close
              </div>
            </Col>
          </Row>
          {cartItems.length > 0 &&
            cartItems.map((item, index) => {
              return (
                <Row key={index}>
                  <Col className="cart-item-body">
                    <div className="cart-image-container">
                      <div className="cart-image">
                        <img
                          src={ImagePlaceHolder}
                          alt={`cart-img-${index}`}
                          className="cart-image"
                        />
                      </div>
                    </div>
                    <div className="cart-item-details-container">
                      <Row className="cart-item-header">
                        <Col sm={12} md={7}>
                          <div className="cart-item-name">
                            {item.productName}
                          </div>
                        </Col>
                        <Col sm={12} md={4}>
                          <div className="cart-item-price">{`LKR ${item.price}`}</div>
                        </Col>
                      </Row>
                      <Row className="cart-item-details">
                        <Col>
                          <Row>
                            <div className="detail-wrapper">
                              <div className="detail-left-wrapper">
                                <div
                                  className="detail-decrease"
                                  onClick={() =>
                                    this.props.editCartItems({
                                      productCode: item.productCode,
                                      action: "decrease",
                                    })
                                  }
                                >
                                  -
                                </div>
                                <div className="detail-show">
                                  {item.quantity}
                                </div>
                                <div
                                  className="detail-increase"
                                  onClick={() =>
                                    this.props.editCartItems({
                                      productCode: item.productCode,
                                      action: "increase",
                                    })
                                  }
                                >
                                  +
                                </div>
                              </div>
                              <div
                                className="detail-right-wrapper"
                                onClick={() =>
                                  this.props.removeFromCart(item.productCode)
                                }
                              >
                                Remove
                              </div>
                            </div>
                          </Row>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              );
            })}
          <Row>
            <Col>
              <div className="billing-details">
                <Row>
                  <Col>
                    <div className="billing-details-label">Total</div>
                  </Col>
                  <Col>
                    <div className="billing-details-total">{`LKR ${subTotal.toFixed(
                      2
                    )}`}</div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="button-checkout">
                <Button
                  htmlType={Button.HTML_TYPE.LINK}
                  link="checkout"
                  onClick={this.props.handleCart}
                >
                  Check out
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default CartForm;

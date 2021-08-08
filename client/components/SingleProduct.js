import React, { Component } from "react"
import { connect } from "react-redux"
import { fetchSingleProduct } from "../store/singleProduct"
import { getNewCartItem } from "../store/cartitem"
import { Link } from "react-router-dom"
import "../styles/SingleProduct.style.css"
class SingleProduct extends Component {
    constructor(props) {
        super(props)
        this.state = { quantity: 1 }
        this.handleChange = this.handleChange.bind(this)
        this.handleAddToCart = this.handleAddToCart.bind(this)
    }
    componentDidMount() {
        this.props.loadProduct(this.props.match.params.id)
    }

    handleChange(event) {
        event.preventDefault()
        console.log("this is quantity", event.target.value)
        const quantity = event.target.value || 1
        this.setState({ quantity })
    }

    handleAddToCart(event) {
        if (this.props.isLoggedIn) {
            const cartitem = {
                productId: this.props.match.params.id, //productID
                quantity: this.state.quantity,
            }
            const userId = this.props.user.id
            this.props.createCartItem(userId, cartitem)
        } else {
            const cartData = JSON.parse(localStorage.getItem("cart")) || []
            console.log(cartData)
            const index = cartData.findIndex(
                item => item.productId == this.props.match.params.id
            )
            if (index == -1) {
                const itemToAdd = {
                    productId: this.props.match.params.id,
                    name: this.props.singleProduct.name,
                    price: this.props.singleProduct.price,
                    quantity: this.state.quantity,
                    imageUrl: this.props.singleProduct.imageUrl,
                }
                cartData.push(itemToAdd)
            } else {
                cartData[index].quantity += parseInt(this.state.quantity)
                console.log("item exists")
            }
            window.localStorage.setItem("cart", JSON.stringify(cartData))

            //   console.log(JSON.parse(localStorage.getItem("cart")));
            //   console.log(JSON.stringify(window.localStorage.getItem("cart")));
        }
    }
    render() {
        const product = this.props.singleProduct || {}
        // const quantity = this.props.singleProduct.quantity;
        // does cartitem need product id only or more?
        let price = product.price / 100
        var formatter = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        })
        price = formatter.format(price)
        return (
            <section className="sp-section">
                <img className="sp-img" src={product.imageUrl} />
                <div className="sp-details">
                    <h1 className="sp-productname">{product.name}</h1>
                    <h3 className="sp-rating">{`⭐️⭐️⭐️⭐️`}</h3>
                    <h3 className="sp-price">{`${price}`}</h3>
                    <select
                        className="sp-selection"
                        id="quantity"
                        onChange={this.handleChange}
                    >
                        <option className="sp-option" value="1">
                            Qty:1
                        </option>
                        <option className="sp-option" value="2">
                            2
                        </option>
                        <option className="sp-option" value="3">
                            3
                        </option>
                        <option className="sp-option" value="4">
                            4
                        </option>
                        <option className="sp-option" value="5">
                            5
                        </option>
                        <option className="sp-option" value="6">
                            6
                        </option>
                        <option className="sp-option" value="7">
                            7
                        </option>
                        <option className="sp-option" value="8">
                            8
                        </option>
                        <option className="sp-option" value="9">
                            9
                        </option>
                        <option className="sp-option" value="10">
                            10
                        </option>
                    </select>
                    <Link to="/addedToCart">
                        <button
                            className="sp-addtocart"
                            type="button"
                            onClick={this.handleAddToCart}
                        >
                            Purchase this item
                        </button>
                    </Link>
                    <h4 className="sp-desc">{product.description}</h4>
                </div>
            </section>
        )
    }
}

const mapState = state => {
    return {
        singleProduct: state.singleProduct,
        isLoggedIn: !!state.auth.id,
        user: state.auth,
    }
}

const mapDispatch = dispatch => {
    return {
        loadProduct: id => {
            dispatch(fetchSingleProduct(id))
        },
        createCartItem: (userId, cartitem) => {
            dispatch(getNewCartItem(userId, cartitem))
        },
    }
}

export default connect(mapState, mapDispatch)(SingleProduct)

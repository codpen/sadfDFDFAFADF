import React, { Component } from 'react';
import './product.scss'
import axios from 'axios'
import { url, headers } from '../../config'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import _ from 'lodash'

import Header from '../Header'
import Navbar from '../Navbar'

class index extends Component {
    state = {
        product : '',
        comfirm_delete: true,
        message: '',
        loading: true
    }

    deleteProduct(id) {   
        axios.delete( url+ '/product/' + id , headers(this.props.user.token) )
        .then(res=>{
            this.props.history.push("/products")
        })
        .catch(err=>{
            this.setState({ message: 'Failed delete', comfirm_delete: false })
        })
    }

    componentDidMount(){
        if(this.props.location.state){
            this.setState({
                product: this.props.location.state,
                loading: false
            })
        }
         else {

            let id = this.props.match.params.id
            axios( url + "/product/" + id )
            .then(res=>{
                if(res.data){
                    this.setState({
                        product: res.data,
                        loading: false
                    })
                }
            })
        }
    }

    price(number){
        var reverse = number.toString().split('').reverse().join(''),
        thousand = reverse.match(/\d{1,3}/g);
        thousand = thousand.join('.').split('').reverse().join('');
        return thousand + ",-";
    }

    render() {
        const { product, comfirm_delete, message, loading } = this.state
        return (
            <div className="detail-product">
                <Header />
                <Navbar />

                { //open comfirm delete category
                    comfirm_delete ? '' :
                    <div className="comfirm-delete">
                        <div>
                            <h3>Are you sure want to delete?</h3>
                            <button onClick={()=>{this.deleteProduct(product.product_id)}}>Yes</button>
                            <button onClick={()=>{this.setState({ comfirm_delete: true })}}>No</button>
                        </div>
                    </div>
                }

                <div>
                    <div className="wrapper">
                        <div className="image">
                           { loading ? <div className="load"></div> :  <img src={product.image} alt=""/> }
                        </div>
                        <div className="detail">
                            <span className="message">{message}</span>

                            <div className="back">
                                 <Link style={{ textDecoration: 'none',  color: '#4694fc', fontWeight: '400'}} to='/products'>Products</Link> { ' > ' + product.name}
                            </div>

                            <div onClick={()=>{this.setState({ comfirm_delete: false })}} className="delete">
                                <i  className="demo-icon icon-minus">&#xe814;</i><span>delete</span>
                            </div>
                            <Link to={{ pathname:`/updateproduct/${product.product_id}`, state:{product} }}>
                            <div className="update">
                                <i className="demo-icon icon-cog">&#xe81a;</i><span>edit</span>
                            </div>
                            </Link>

                            <div className="box">
                            <div className="name">
                                { loading ? <div className="load"></div> : <span>{product.name}</span> }
                            </div>
                            <div className="code">
                                Code Product <br/>
                                { loading ? <div className="load"></div> : <span>{product.code}</span> }
                            </div>
                            <div className="category">
                                <div>
                                    Category <br/>
                                    { loading ? <div className="load"></div> :  <span>{product.category_name}</span> }
                                </div>
                                <div>
                                    Subcategory <br/>
                                    { loading ? <div className="load"></div> :  <span>{product.sub_category_name}</span> }
                                </div>
                            </div>
                            <div className="weight">
                                Weight <br/>
                                { loading ? <div className="load"></div> :  <span>{product.weight}</span> }                               
                            </div>
                            <div className="sizes">
                                <div className="size-stock">
                                    <div>
                                        <span>Size</span>
                                        <hr/>
                                        {
                                           _.isArray(product.sizes) && product.sizes.map( (x,i) => <div key={i} className="size">{x} <hr/></div> )
                                        }
                                    </div>
                                    <div>
                                        <span>Stock</span>
                                        <hr/>
                                        {
                                          _.isArray(product.stocks) && product.stocks.map( (x,i) => <div key={i} className="stock">{x} <hr/></div> )
                                        }
                                    </div>
                                </div>
                            </div>
                            </div>

                            <div className="price">
                                Price <br/>
                                { loading ? <div className="load"></div> : <span>Rp {this.price(product.price)}</span> }
                            </div>
                        </div>
                    </div>
                    <div className="description">
                        Description <br/>
                        <div dangerouslySetInnerHTML={{__html:product.description}}></div>                      
                    </div>
                </div>

            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return({
        user: state.userReducer
    })
}

export default connect(mapStateToProps)(index);
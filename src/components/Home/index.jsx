import React, { Component } from 'react';
import './home.scss'
import { userAction } from '../../actions'
import { connect } from 'react-redux'
import { url, headers } from '../../config'
import axios from 'axios'

import logo from '../../assets/logo.svg'

class index extends Component {
    state = {
        message: ''
    }
    
    componentDidMount() {
        let token = this.props.user.token
        let user = this.props.user.user
        console.log(user)
        if(navigator.onLine){
            axios.get( url + "/admin/profile" , headers(token) )
            .then(res=>{
                if(res.data){
                    localStorage.setItem('token', token)
                    localStorage.setItem('user', JSON.stringify(res.data.data))
                    this.props.userAction(res.data.data, true, token)
                    this.props.history.push("/dashboard")
                }
            })
            .catch(err=>{
                if(err.response){
                    this.props.userAction(null , false, null)
                    this.props.history.push("/login")
                } else {
                    this.props.userAction(user , true, token)
                    this.setState({ message: 'Failed connect server' })
                    this.props.history.push("/dashboard")
                }
            })
        } else {
            if(user && token){
                console.log("dashboard")
                this.props.userAction(user, true, token)
                this.props.history.push("/dashboard")
            } else {
                console.log("login")
                this.props.history.push("/login")
                this.props.userAction(user, false, token)
            }
        }

    }

    render() {
        const { message } = this.state
        return (
            <div className="home">
                <img src={logo} alt="logo"/>
                <h1>e-Commerce</h1>
                <span>{message}</span>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return({
        user: state.userReducer
    })
}

export default connect(mapStateToProps, { userAction }) (index);
import React, { Component } from 'react'
import axios from 'axios'

class Register extends Component {

  constructor(){
    super()
    this.state = {
      name : '',
      email : '',
      password : '',
      password2 : '',
      errors : {}
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onClick = this.onClick.bind(this)
  }

  async onClick(e){
    const res = await fetch('http://localhost:5000/api/users/test')
    const data = await res.json()


    console.log('data :', data);
    e.preventDefault()
  }

  onSubmit(e){
    e.preventDefault()
    const { name , email , password } = this.state

    const newUser = {
      name,
      email,
      password
    }


    const dataString = JSON.stringify(newUser)
    
    axios.post('/users/register', dataString)
          .then(data=>{
            console.log('WORKING')
            console.log('data :', data)
          })
          .catch(error=> {
            console.log('ERROR')
            console.log('err :', error.message)
          })
    
    

    
    
  }

  onChange(e){
    this.setState({[e.target.name] : e.target.value})
  }

  render() {
    return (
      <div className="register">
    <div className="container">
      <div className="row">
        <div className="col-md-8 m-auto">
          <h1 className="display-4 text-center">Sign Up</h1>
          <p className="lead text-center">Create your DevConnector account</p>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <input value={this.state.name} onChange={this.onChange} type="text" className="form-control form-control-lg" placeholder="Name" name="name" />
            </div>
            <div className="form-group">
              <input value={this.state.email} onChange={this.onChange} type="email" className="form-control form-control-lg" placeholder="Email Address" name="email" />
              <small className="form-text text-muted">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
            </div>
            <div className="form-group">
              <input value={this.state.password} onChange={this.onChange} type="password" className="form-control form-control-lg" placeholder="Password" name="password" />
            </div>
            <div className="form-group">
              <input value={this.state.password2} onChange={this.onChange} type="password" className="form-control form-control-lg" placeholder="Confirm Password" name="password2" />
            </div>
            <input type="submit" className="btn btn-info btn-block mt-4" />
          </form>
        </div>
      </div>
      <a href="#" onClick={this.onClick}>Hello</a>
    </div>
  </div>
    )
  }
}

export default Register

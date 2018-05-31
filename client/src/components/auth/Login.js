import React, { Component } from 'react'

class Login extends Component {

  constructor(){
    super()
    this.state = {
      email : '',
      password : '',
      errors : {}
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onSubmit(e){
    const { email, password } = this.state
    const loginUser = { email , password }
    console.log('loginUser :', loginUser);
    e.preventDefault()
  }


  onChange(e){
    this.setState({[e.target.name] : e.target.value})
  }

  render() {
    return (
      <div className="login">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <h1 className="display-4 text-center">Log In</h1>
            <p className="lead text-center">Sign in to your DevConnector account</p>
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <input onChange={this.onChange} type="email" className="form-control form-control-lg" placeholder="Email Address" name="email" />
              </div>
              <div className="form-group">
                <input onChange={this.onChange} type="password" className="form-control form-control-lg" placeholder="Password" name="password" />
              </div>
              <input onChange={this.onChange} type="submit" className="btn btn-info btn-block mt-4" />
            </form>
          </div>
        </div>
      </div>
    </div>
    )
  }
}

export default Login

import { Link } from 'react-router-dom';
import React from 'react';

function Login() {
  return (
    <div className='login-container'>
      <div className='login-body'>
        <form className='login-form'>
          <div>
            <input  type="text" id="username" name="username" placeholder='Enter username'  />
            <input  type="password" id="password" name="password" placeholder='Enter your password' />
          </div>
          <a className='forget-pass' href='#'>Forgot your password?</a>
          <div className='login-btns'>
              <Link className='reg login-btn' to="/ad-dashboard">SIGN IN</Link>
              <Link className='reg login-btn' to="/registration">REGISTER</Link>
          </div>
        </form>
        <h2 className='school'>GINK INNOVATION </h2>
      </div>
    </div>
  )
}

export default Login;
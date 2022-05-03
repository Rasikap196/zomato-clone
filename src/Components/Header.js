import React from 'react';
import '../Styles/header.css';
import { withRouter } from 'react-router-dom';
import Modal from 'react-modal';
import GoogleLogin from 'react-google-login';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'antiquewhite',
        border: 'solid 1px brown'
    },
};

class Header extends React.Component {
    constructor() {
        super();
        this.state = {
            loginModalIsOpen: false,
            userName: undefined,
            isLoggedIn: false,
            createAccountModalIsOpen: false,
            userName : undefined,
            password : undefined,
            firstName : undefined,
            lastName : undefined,
            accountExistModalIsOpen: false
        }
    }

    handleNavigate = () => {
        this.props.history.push('/');
    }

    handleLogin = () => {
        this.setState({ loginModalIsOpen: true });
    }

    responseGoogle = (response) => {
        this.setState({ isLoggedIn: true, userName: response.profileObj.name, loginModalIsOpen: false });
    }

    handleLogout = () => {
        this.setState({ isLoggedIn: false, userName: undefined });
    }

    handleCreateAccount = () =>{
        this.setState({createAccountModalIsOpen: true})
    }

    handleModal = (state, value) => {
        this.setState({ [state]: value });
    }
    handleInputChange = (state, event) => {
        this.setState({ [state]: event.target.value });
    }

    getResponse = () =>{
        const { userName, password, firstName, lastName } = this.state;
        const data = {
            user : userName,
            pwd : password ,
            fn : firstName,
            ln :lastName
        }
        if ( userName && password && firstName && lastName ) {
          return fetch(`http://localhost:8989/usersignup`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => 
             response.json()
    
            
            ).catch(err => console.log(err))
           
        }
        else {
            alert('Please all fill to Proceed...');
        }
    }
    createAccount = (event) => {
           

           this.getResponse().then(response => {
               console.log("acc response %j", response)
               if(response.message !== "User Already exists..."){
                this.setState({isLoggedIn: true, userName: response.user.username , createAccountModalIsOpen: false})
    
               }
               else{
                this.setState({ accountExistModalIsOpen: true, createAccountModalIsOpen: false})
     
               }
                })
    
        event.preventDefault();
    }

    render() {
        const { loginModalIsOpen, isLoggedIn, userName, createAccountModalIsOpen, accountExistModalIsOpen   } = this.state;
        return (
            <div className="header">
                <div className="header-logo" onClick={this.handleNavigate}>
                    <p>e!</p>
                </div>
                {
                    !isLoggedIn ? <div className="user-account">
                        <div className='login' onClick={this.handleLogin}>Login</div>
                        <div className='signup' onClick={this.handleCreateAccount}>Create an account</div>
                    </div> :
                        <div className="user-account">
                            <div className='login'>{userName}</div>
                            <div className='signup' onClick={this.handleLogout}>Logout</div>
                        </div>
                }

                <Modal
                    isOpen={loginModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <button className='btn btn-primary' >Continue with Credentials</button>
                        <br />
                        <GoogleLogin
                            clientId="508995979157-ett56j2jajhoh6qlqdonc9oeiqj5ofms.apps.googleusercontent.com"
                            buttonText="Continue with Google"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />
                    </div>
                </Modal>

                <Modal
                    isOpen={createAccountModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <div class="glyphicon glyphicon-remove" style={{ float: 'right', marginBottom: '10px' }}
                            onClick={() => this.handleModal('createAccountModalIsOpen', false)}></div>
                        <form>
                        <label class="form-label">First Name</label>
                            <input type="text" class="form-control" onChange={(event) => this.handleInputChange('firstName', event)} />
                            <label class="form-label">Last Name</label>
                            <input type="text" class="form-control" onChange={(event) => this.handleInputChange('lastName', event)} />
                            <label class="form-label">User Name</label>
                            <input type="text" class="form-control" onChange={(event) => this.handleInputChange('userName', event)} />
                            <label class="form-label">Password</label>
                            <input type="text" class="form-control" onChange={(event) => this.handleInputChange('password', event)} />
                            <button class="btn btn-danger" style={{ marginTop: '20px', float: 'right' }} onClick={this.createAccount}>Create Account</button>
                        </form>
                    </div>
                </Modal>

                <Modal
                    isOpen={accountExistModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <div class="glyphicon glyphicon-remove" style={{ float: 'right', marginBottom: '10px' }}
                            onClick={() => this.handleModal('accountExistModalIsOpen', false)}></div>
                        <h3>Account Already Exist</h3>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default withRouter(Header);
import Router from 'next/router';
import { useState, useEffect } from 'react';
import { signIn, authenticate, isAuth } from '../../actions/auth';


const SigninComponent = () => {
    const [values, setValues] = useState({
        email: "",
        password: "",
        error: "",
        loading: false,
        message: "",
        showForm: true
    });

    const { email, password, error, loading, message, showForm } = values;

    useEffect(() => {
        isAuth() && Router.push('/');
    }, []);

    const handleChange = e => {
        setValues({
            ...values,
            error: false,
            [e.target.name]: e.target.value
        })
    }

    const handleSignIn = e => {
        e.preventDefault();
        setValues({ ...values, loading: true, error: false })

        const user = { email, password }
        signIn(user)
            .then(data => {
                if (data.error) {
                    setValues({ ...values, error: data.error, loading: false })
                } else {
                    // authenticate user
                    authenticate(data, () => {
                        if (isAuth() && isAuth().role === 1) {
                            Router.push('/admin');
                        } else {
                            Router.push('/user');
                        }
                    })
                }
            })
    }

    const showLoading = () => loading ? <div className="alert alert-info">Loading...</div> : "";
    const showError = () => error ? <div className="alert alert-danger">{error}</div> : "";
    const showMessage = () => message ? <div className="alert alert-info">{message}</div> : "";


    const signupForm = () => {
        return (
            <form onSubmit={handleSignIn}>
                <div className="form-group">
                    <label htmlFor="">Enter Your Email</label>
                    <input name="email" value={email} type="email" className="form-control" onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="">Enter Your Password</label>
                    <input name="password" value={password} type="password" className="form-control" onChange={handleChange} />
                </div>
                <button className="btn btn-primary mt-3">Sign In</button>
            </form>
        )
    }

    return (
        <>
            {showLoading()}
            {showError()}
            {showMessage()}
            {showForm && signupForm()}
        </>
    );
};

export default SigninComponent;
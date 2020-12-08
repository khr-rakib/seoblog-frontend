import { useState } from 'react';
import { signUp } from '../../actions/auth';


const SignupComponent = () => {
    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        error: "",
        loading: false,
        message: "",
        showForm: true
    });

    const { name, email, password, error, loading, message, showForm } = values;

    const handleChange = e => {
        setValues({
            ...values,
            error: false,
            [e.target.name]: e.target.value
        })
    }

    const handleSignUp = e => {
        e.preventDefault();
        setValues({ ...values, loading: true, error: false })

        const user = { name, email, password }
        signUp(user)
            .then(data => {
                if (data.error) {
                    setValues({ ...values, error: data.error, loading: false })
                } else {
                    setValues({ ...values, name: "", email: "", password: "", error: "", loading: false, message: data.msg, showForm: false })
                }
            })
    }

    const showLoading = () => loading ? <div className="alert alert-info">Loading...</div> : "";
    const showError = () => error ? <div className="alert alert-danger">{error}</div> : "";
    const showMessage = () => message ? <div className="alert alert-info">{message}</div> : "";


    const signupForm = () => {
        return (
            <form onSubmit={handleSignUp}>
                <div className="form-group">
                    <label htmlFor="">Enter Your Name</label>
                    <input name="name" value={name} type="text" className="form-control" onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="">Enter Your Email</label>
                    <input name="email" value={email} type="email" className="form-control" onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="">Enter Your Password</label>
                    <input name="password" value={password} type="password" className="form-control" onChange={handleChange} />
                </div>
                <button className="btn btn-primary mt-3">Sign Up</button>
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

export default SignupComponent;
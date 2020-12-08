import Layout from '../components/Layout';
import SignupComponent from '../components/auth/SignupComponent';


const signup = () => {
    return (
        <Layout>
            <div className="container">
                <h2 className="text-center mt-5 mb-3">Signup Form</h2>
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <div className="card shadow">
                            <div className="card-body">
                                <SignupComponent />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Layout>
    );
};

export default signup;
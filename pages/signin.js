import Layout from '../components/Layout'
import Link from 'next/link';
import SigninComponent from '../components/auth/SigninComponent';

const signin = () => {
    return (
        <Layout>
            <div className="container">
                <h2 className="text-center mt-5 mb-3">Signin Form</h2>
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <div className="card shadow">
                            <div className="card-body">
                                <SigninComponent />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default signin;
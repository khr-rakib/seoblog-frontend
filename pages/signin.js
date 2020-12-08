import Layout from '../components/Layout'
import Link from 'next/link';

const signin = () => {
    return (
        <Layout>
            <h2>Sign In page</h2>
            <Link href="/signup">
                <a>Sign up</a>
            </Link>
        </Layout>
    );
};

export default signin;
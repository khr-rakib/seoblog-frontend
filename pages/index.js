import Link from 'next/link';
import Layout from '../components/Layout';

const Index = () => {
    return (
        <Layout>
            HI i m layout
            <Link href="/signin">
                <a>Sign In</a>
            </Link>
        </Layout>
    )
}

export default Index;
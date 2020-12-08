import Header from './Header';
const Layout = ({ children }) => {
    return (
        <>
            <Header />
            {
                children
            }
            <h2>fooer</h2>
        </>
    )
}

export default Layout;
import { useState } from 'react';
import { APP_NAME } from '../config';
import Link from 'next/link';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
} from 'reactstrap';

const Example = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <div>
            <Navbar color="light" light expand="md">
                <div className="container">
                    <Link href="/">
                        <NavLink className="navbar-brand font-weight-bold">{APP_NAME}</NavLink>
                    </Link>
                    <NavbarToggler onClick={toggle} />
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <Link className="nav-link" href="/signin">
                                    <NavLink>
                                        SignIn
                                    </NavLink>
                                </Link>
                            </NavItem>
                            <NavItem>
                                <Link href="/signup" className="nav-link">
                                    <NavLink>
                                        SignUp
                                    </NavLink>
                                </Link>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </div>
            </Navbar>
        </div>
    );
}

export default Example;
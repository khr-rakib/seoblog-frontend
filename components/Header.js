import { useState } from 'react';
import { APP_NAME } from '../config';
import Link from 'next/link';
import Router from 'next/router';
import NProgress from 'nprogress';
import ".././node_modules/nprogress/nprogress.css";
import { isAuth, signOut } from '../actions/auth';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';





Router.onRouteChangeStart = url => NProgress.start();
Router.onRouteChangeComplete = url => NProgress.done();
Router.onRouteChangeError = url => NProgress.done();


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
                <Link className="nav-link" href="/blogs">
                  <NavLink>
                    Blogs
                  </NavLink>
                </Link>
              </NavItem>


              {
                !isAuth() && (
                  <>
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
                  </>
                )
              }
              {
                isAuth() && (<NavItem>
                  <NavLink style={{ cursor: "pointer" }} onClick={() => signOut(() => Router.replace('/signin'))}>
                    SignOut
                  </NavLink>
                </NavItem>)
              }

              {
                isAuth() && isAuth().role === 0 && (
                  <NavItem>
                    <Link href='/user'>
                      <NavLink>
                        {`${isAuth().name}'s Dashboard`}
                      </NavLink>
                    </Link>
                  </NavItem>)
              }
              {
                isAuth() && isAuth().role === 1 && (
                  <NavItem>
                    <Link href='/admin'>
                      <NavLink>
                        {`${isAuth().name}'s Dashboard`}
                      </NavLink>
                    </Link>
                  </NavItem>
                )
              }



            </Nav>
          </Collapse>
        </div>
      </Navbar>
    </div >
  );
}

export default Example;
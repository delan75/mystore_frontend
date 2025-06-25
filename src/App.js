// src/App.js
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { useAuth } from './hooks/useAuth';
import PrivateRoute from './components/PrivateRoute';
import AuthPage from './pages/AuthPage';
import ResetPassword from './pages/ResetPassword';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Shop from './pages/Shop';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Chats from './pages/Chats';
import Support from './pages/Support';
import AccountSettings from './pages/AccountSettings';
import PrivacyCenter from './pages/PrivacyCenter';
import Feedback from './pages/Feedback';
import History from './pages/History';
import Settings from './pages/Settings';
import Categories from './pages/Categories';
import AddCategory from './pages/AddCategory';
import EditCategory from './pages/EditCategory';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/Loading.css';

// Check if user has manager or admin role
const ManagerRoute = ({ component: Component, ...rest }) => {
    const { user, loading } = useAuth();

    return (
        <Route
            {...rest}
            render={props => {
                if (loading) {
                    return (
                        <div className="loading-screen">
                            <div className="spinner">
                                <i className="fas fa-spinner fa-spin fa-3x"></i>
                            </div>
                            <p>Loading...</p>
                        </div>
                    );
                }

                // Check if user has the right role
                if (!user || (user.role !== 'manager' && user.role !== 'admin')) {
                    return <Redirect to="/dashboard" />;
                }

                return <Component {...props} />;
            }}
        />
    );
};

// Check if user has order management access (admin, manager, or cashier)
const OrderManagementRoute = ({ component: Component, ...rest }) => {
    const { user, loading } = useAuth();

    return (
        <Route
            {...rest}
            render={props => {
                if (loading) {
                    return (
                        <div className="loading-screen">
                            <div className="spinner">
                                <i className="fas fa-spinner fa-spin fa-3x"></i>
                            </div>
                            <p>Loading...</p>
                        </div>
                    );
                }

                // Check if user has the right role
                if (!user || (user.role !== 'admin' && user.role !== 'manager' && user.role !== 'cashier')) {
                    return <Redirect to="/dashboard" />;
                }

                return <Component {...props} />;
            }}
        />
    );
};

function App() {
    return (
        <AuthProvider>
                <CurrencyProvider>
                    <Router>
                <Switch>
                    {/* Public routes */}
                    <Route exact path="/" component={LandingPage} />
                    <Route path="/auth" component={AuthPage} />
                    <Route path="/reset-password" component={ResetPassword} />
                    <Route path="/shop" component={Shop} />

                    {/* Regular user routes */}
                    <PrivateRoute path="/dashboard" component={Dashboard} />
                    <PrivateRoute path="/products" component={Products} />
                    <PrivateRoute exact path="/orders" render={() => <Redirect to="/orders/my" />} />
                    <PrivateRoute path="/orders/create" render={(props) => <Orders {...props} mode="create" />} />
                    <PrivateRoute path="/orders/my" render={(props) => <Orders {...props} mode="my" />} />
                    <OrderManagementRoute
                        path="/orders/manage"
                        component={(props) => <Orders {...props} mode="manage" />}
                    />
                    <PrivateRoute path="/profile" component={Profile} />

                    {/* Chat routes */}
                    <PrivateRoute exact path="/chats" component={Chats} />
                    <PrivateRoute path="/chats/new" render={(props) => <Chats {...props} mode="new" />} />
                    <PrivateRoute path="/chats/blocked" render={(props) => <Chats {...props} mode="blocked" />} />
                    <ManagerRoute
                        path="/chats/manage"
                        component={(props) => <Chats {...props} mode="manage" />}
                    />

                    <PrivateRoute path="/support" component={Support} />
                    <PrivateRoute path="/account-settings" component={AccountSettings} />
                    <PrivateRoute path="/privacy" component={PrivacyCenter} />
                    <PrivateRoute path="/feedback" component={Feedback} />
                    <PrivateRoute path="/history" component={History} />
                    <PrivateRoute path="/settings" component={Settings} />

                    {/* Manager/Admin only routes */}
                    <ManagerRoute path="/products/add" component={AddProduct} />
                    <ManagerRoute path="/categories" component={Categories} />
                    <ManagerRoute path="/categories/add" component={AddCategory} />
                    <ManagerRoute path="/categories/edit/:id" component={EditCategory} />
                </Switch>
                <ToastContainer />
                </Router>
            </CurrencyProvider>
        </AuthProvider>
    );
}

export default App;

import { Outlet } from 'react-router';
import Header from './Header';

const Layout = () => {
    return (
        <div>
            <Header />
            <main className="bg-blackPrimary">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
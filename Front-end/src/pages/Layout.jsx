
import Navbar from './Navbar';

const Layout = ({ children }) => { // 1. Add children prop here
  const containerStyle = {
    zoom: "87%",
    minHeight: "125vh",
    width: "100%",
    transformOrigin: "top left"
  };

  return (
    <div className="app-container" style={containerStyle}>
      <Navbar />
      <div className="page-content">
        {children} {/* 2. Replace <Outlet /> with {children} */}
      </div>
    </div>
  );
};

export default Layout;
import React, { useState } from "react";
import { useHistory, Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const BlogNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const isLoggedIn = !!sessionStorage.getItem("user");

  const isActive = (path) => {
    if (path === "/blog") return location.pathname.startsWith("/blog");
    return location.pathname === path;
  };

  return (
    <header className="blog-header">
      <div className="blog-header-container">
        <div className="blog-logo" onClick={() => history.push("/")}>
          <img src="/image.png" alt="CalVant" />
        </div>
        <nav className="blog-nav">
          <button
            className="blog-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <ul className={`blog-nav-list ${mobileMenuOpen ? "active" : ""}`}>
            <li>
              <Link
                to="/"
                className={isActive("/") ? "active" : ""}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={isActive("/about") ? "active" : ""}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/blog"
                className={isActive("/blog") ? "active" : ""}
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
            </li>
            {!isLoggedIn && (
              <li>
                <Link
                  to="/login"
                  className="blog-login-btn"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default BlogNavbar;

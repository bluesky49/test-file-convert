import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="copy-right">Copyright © {new Date().getFullYear()} By Ming Wang</div>
      <div className="footer-text">All rights reserved</div>
    </footer>
  )
};
export default Footer;

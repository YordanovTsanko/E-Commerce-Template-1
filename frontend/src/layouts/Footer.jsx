import React from "react";
import { Link } from "react-router-dom";
import { FiMail, FiPhone, FiMapPin, FiClock } from "react-icons/fi";
import { Brand } from "./Header";
import { SITE, CATEGORIES } from "../config/site";

const Footer = () => (
  <footer className="site-footer">
    <div className="site-footer__inner">
      <div>
        <Brand />
        <p>{SITE.tagline}. Доставка до адрес в цялата страна и плащане при получаване.</p>
      </div>

      <div>
        <h4>Категории</h4>
        <ul>
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link to={`/product/type/${c.slug}`}>{c.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4>Профил</h4>
        <ul>
          <li><Link to="/profile">Моят профил</Link></li>
          <li><Link to="/profile/orders">Моите поръчки</Link></li>
          <li><Link to="/cart">Количка</Link></li>
          <li><Link to="/contact">Контакти</Link></li>
        </ul>
      </div>

      <div>
        <h4>Връзка с нас</h4>
        <ul className="footer-contact">
          <li><FiPhone /><a href={`tel:${SITE.phone.replace(/\s/g, "")}`}>{SITE.phone}</a></li>
          <li><FiMail /><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
          <li><FiMapPin /><span>{SITE.address}</span></li>
          <li><FiClock /><span>{SITE.workingHours}</span></li>
        </ul>
      </div>
    </div>
    <div className="site-footer__bottom">
      <span>© {new Date().getFullYear()} {SITE.name}. Всички права запазени.</span>
      <span>Разработено от Цанко Йорданов</span>
    </div>
  </footer>
);

export default Footer;

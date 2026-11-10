import React from "react";
import { Link } from "react-router-dom";
import { FiTruck, FiRefreshCw, FiShield } from "react-icons/fi";
import SearchBar from "../../components/products/SearchBar";
import { CATEGORIES, SITE } from "../../config/site";
import { formatPrice } from "../../utils/format";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const HomePage = () => {
  useDocumentTitle();

  return (
    <>
      <section className="hero">
        <div>
          <h1 className="hero__title">Облекло, техника и спорт на едно място</h1>
          <p className="hero__lead">
            Подбрани продукти в шест категории, ясни цени и доставка до вратата ви.
            Плащате, когато получите пратката.
          </p>
        </div>
        <div className="hero__side">
          <SearchBar />
          <div className="hero__facts">
            <div className="hero__fact">
              <strong>{formatPrice(SITE.shippingPrice)}</strong>доставка до адрес
            </div>
            <div className="hero__fact">
              <strong>Над {formatPrice(SITE.freeShippingFrom)}</strong>доставката е безплатна
            </div>
            <div className="hero__fact">
              <strong>Наложен платеж</strong>плащане при получаване
            </div>
          </div>
        </div>
      </section>

      <section className="page" style={{ paddingTop: 8 }} aria-labelledby="cats">
        <div className="section-head">
          <h2 className="section-title" id="cats">Разгледайте по категория</h2>
        </div>
        <div className="mosaic">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} to={`/product/type/${c.slug}`} className="tile">
              <img src={c.img} alt="" loading="lazy" />
              <div className="tile__body">
                <div className="tile__name">{c.label}</div>
                <div className="tile__note">{c.note}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="perks">
          <div className="perk">
            <FiTruck />
            <div>
              <strong>Доставка до адрес</strong>
              <span>Куриерът носи пратката до вратата ви в цялата страна.</span>
            </div>
          </div>
          <div className="perk">
            <FiRefreshCw />
            <div>
              <strong>14 дни за връщане</strong>
              <span>Можете да се откажете от покупката в 14-дневен срок.</span>
            </div>
          </div>
          <div className="perk">
            <FiShield />
            <div>
              <strong>Сигурно пазаруване</strong>
              <span>Плащате на куриера едва след като видите пратката.</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;

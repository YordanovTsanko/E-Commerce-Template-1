import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CircularProgress, InputAdornment, TextField } from "@mui/material";
import { FiSearch } from "react-icons/fi";
import api from "../../api/axios";
import { formatPrice } from "../../utils/format";
import ProductImage from "./ProductImage";

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Търсене с изчакване (debounce) — не праща заявка при всяко натискане на клавиш. */
const SearchBar = () => {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    const q = term.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const { data } = await api.get(
          `/api/v1/product/search/${encodeURIComponent(escapeRegex(q))}`,
          { signal: controller.signal }
        );
        setResults(data.products || []);
        setFailed(false);
      } catch (e) {
        if (e.code !== "ERR_CANCELED") setFailed(true);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [term]);

  useEffect(() => {
    const close = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const showPanel = open && term.trim().length >= 2;

  return (
    <div className="search" ref={boxRef}>
      <TextField
        type="search"
        value={term}
        placeholder="Търсете продукт, напр. „рокля“ или „слушалки“"
        onChange={(e) => {
          setTerm(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        slotProps={{
          htmlInput: { "aria-label": "Търсене на продукти" },
          input: {
            sx: { height: 56, fontSize: "1.02rem" },
            startAdornment: (
              <InputAdornment position="start">
                <FiSearch size={20} color="var(--muted)" />
              </InputAdornment>
            ),
            endAdornment: loading ? (
              <InputAdornment position="end">
                <CircularProgress size={18} />
              </InputAdornment>
            ) : null,
          },
        }}
      />
      {showPanel && (
        <div className="search__results" role="listbox">
          {failed ? (
            <div className="search__empty">Търсенето не е достъпно в момента. Опитайте отново.</div>
          ) : !loading && results.length === 0 ? (
            <div className="search__empty">Няма продукти за „{term.trim()}“. Опитайте с друга дума.</div>
          ) : (
            results.slice(0, 12).map((p) => (
              <Link
                key={p._id}
                to={`/product/type/${p.category}/${p._id}`}
                className="search__item"
                onClick={() => setOpen(false)}
              >
                <ProductImage src={p.img} alt="" />
                <span>{p.name}</span>
                <small>{formatPrice(p.price)}</small>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

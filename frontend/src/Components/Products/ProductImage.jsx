import React from "react";
import { FALLBACK_IMAGE } from "../../config/site";

const ProductImage = ({ src, alt, ...rest }) => (
  <img
    src={src || FALLBACK_IMAGE}
    alt={alt}
    loading="lazy"
    onError={(e) => {
      e.currentTarget.onerror = null;
      e.currentTarget.src = FALLBACK_IMAGE;
    }}
    {...rest}
  />
);

export default ProductImage;

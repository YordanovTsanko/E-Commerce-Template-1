import { useEffect } from "react";
import { SITE } from "../config/site";

const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;
  }, [title]);
};

export default useDocumentTitle;

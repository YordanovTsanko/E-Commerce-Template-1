import { useCallback, useEffect, useState } from "react";
import api, { getApiErrorMessage } from "../api/axios";

/** Малък помощник за GET заявки със състояния loading / error / reload. */
const useApi = (url, pick = (d) => d) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(url);
      setData(pick(res.data));
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, setData, loading, error, reload: load };
};

export default useApi;

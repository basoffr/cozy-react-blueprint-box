
import { useNavigate } from "react-router-dom";

/**
 * Navigates to previous page if history length > 1,
 * otherwise to a provided fallback.
 */
export function useNavigateBack(fallback: string) {
  const navigate = useNavigate();
  
  return () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };
}

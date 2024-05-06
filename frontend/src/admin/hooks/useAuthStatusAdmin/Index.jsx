import { useEffect, useState } from "react";

export function useAuthStatusAdmin() {
  const [loggedInAdmin, setLoggedInAdmin] = useState(false);
  const [checkStatusAdmin, setCheckStatusAdmin] = useState(true);

  useEffect(() => {
    const checkAuthStatusAdmin = async () => {
      try {
        const admin_token = localStorage.getItem("admin_token");
        if (!admin_token) {
          setLoggedInAdmin(false);
          setCheckStatusAdmin(false);
          return;
        }

        if (admin_token) {
          setLoggedInAdmin(true);
          setCheckStatusAdmin(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setCheckStatusAdmin(false);
      }
    };

    checkAuthStatusAdmin();
  }, []);

  return { loggedInAdmin, checkStatusAdmin };
}

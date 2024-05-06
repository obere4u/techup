
import { useEffect, useState } from "react";

export function useAuthStatusTalent() {
  const [loggedInTalent, setLoggedInTalent] = useState(false);
  const [checkStatusTalent, setCheckStatusTalent] = useState(true);

  useEffect(() => {
    const checkAuthStatusTalent = async () => {
      try {
        const access_token = localStorage.getItem("access_token");
        if (!access_token) {
          setLoggedInTalent(false);
          setCheckStatusTalent(false);
          return;
        }

        if (access_token) {
          setLoggedInTalent(true);
          setCheckStatusTalent(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setCheckStatusTalent(false);
      }
    };

    checkAuthStatusTalent();
  }, []);

  return { loggedInTalent, checkStatusTalent };
}

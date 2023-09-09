import axios from "axios";
import { useEffect } from "react";

export default function Game() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://songssam.site:8080/auth/login",
          {
            authorizationCode: "카카오톡에서 받은 authorizationCode",
          }
        );

        console.log(response);

      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      로그인 테스트 중
    </>
  );
}

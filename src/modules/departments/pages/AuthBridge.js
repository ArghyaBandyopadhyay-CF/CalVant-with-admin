import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const AuthBridge = () => {
  const history = useHistory();
  console.log("AuthBridge loaded");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userParam = params.get("user");

    if (token && userParam) {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", userParam);
      
      const emailParam = params.get("email");
      if (emailParam) sessionStorage.setItem("email", emailParam);

      try {
        const userObj = JSON.parse(userParam);
        const email = emailParam || userObj.email || "unknown@example.com";
        const name = userObj.name || email;
        if (userObj.name) sessionStorage.setItem("uname", userObj.name);
        
        import('../../../services/activities').then(({ captureActivity }) => 
          captureActivity({
            action: 'LOGIN',
            name: name,
            email: email,
            url: "/auth-bridge",
            item: [{ role: userObj.role || "USER" }]
          })
        );
      } catch (err) {
        console.warn('Login log failed in bridge:', err);
      }

      window.history.replaceState({}, document.title, "/");
      history.replace("/");
    } else {
      history.replace("/login");
    }
  }, [history]);

  return <div>Redirecting...</div>;
};

export default AuthBridge;

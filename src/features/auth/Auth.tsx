import { useState } from "react";
import { signIn, signUp } from "../../services/authService";

interface AuthCredentials {
  email: string;
  password: string;
}

function Auth() {

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (): Promise<void> => {
    const error = await signIn(email, password);
    if (error) alert(error);
  };

  const handleRegister = async (): Promise<void> => {
    const error = await signUp(email, password);
    if (error) alert(error);
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Auth;
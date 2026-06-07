export { default as Auth } from "./components/Auth";
export { default as useAuth } from "./hooks/useAuth";

export {
  getCurrentUser,
  initUserKeys,
  signIn,
  signUp,
  signOut
} from "./services/authService";

export {
  getCurrentUserFromAuth,
  onAuthStateChange,
  signInWithEmail,
  signUpWithEmail,
  signOutFromAuth
} from "./repositories/authRepository";

export {
  findUserPublicKey,
  insertUserPublicKey
} from "./repositories/userKeyRepository";

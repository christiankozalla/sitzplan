import { Dispatch, FC, SetStateAction, useState } from "react";
import { supabase } from "../../lib/supabase";
import styles from "./Login.module.css";

interface LoginProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const Login: FC<LoginProps> = ({ setOpen }) => {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (email: string) => {
    const isEmailValid = validate(email);
    if (isEmailValid) {
      try {
        setLoading(true);
        const { error } = await supabase.auth.signIn({ email });

        if (error) throw error;
        else setSuccess(true);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      } finally {
        setLoading(false);
        setTimeout(() => setOpen(false), 5000);
      }
    } else {
      // setError(true), hightlight input visually, make error styles disapear onChange
    }
  };

  const validate = (email: string): boolean => {
    const splitted = email.split("@");
    return email.length > 5 && splitted.length === 2;
  };

  return (
    <>
      <p className={styles.description}>
        <span>Melde dich über unseren Magic Link an.</span>
        <br />
        <span>Ganz ohne Passwort.</span>
        <br />
        <span>Gleich in deiner Inbox.</span>
        <img src="src/assets/logo.svg" alt="Seaty Logo" />
      </p>
      {success && (
        <p className={styles.success}>
          <strong>Juhuu! Die Mail ist raus!</strong>
          <br />
          Klick&apos; auf den Magic Link in deiner Mail, um hierher
          zurückzukehren!
        </p>
      )}
      <form>
        <div className={styles.form}>
          <label htmlFor="user-email" className="screenReaderOnly">
            Deine Email-Adresse
          </label>
          <input
            type="email"
            id="user-email"
            placeholder="Deine Email"
            autoFocus
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              handleLogin(email);
            }}
            disabled={loading}
          >
            {loading ? "Lade..." : "Log In"}
          </button>
        </div>
      </form>
    </>
  );
};

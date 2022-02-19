import { useState, useEffect, FC, Dispatch, SetStateAction } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import styles from "./Account.module.css";

interface AccountProps {
  session: Session;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

interface Profile {
  username: string;
  website: string;
  avatar_url: string;
}

export const Account: FC<AccountProps> = ({ session, setOpen }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [avatar_url, setAvatarUrl] = useState("");

  useEffect(() => {
    getProfile();
  }, [session]);

  const getProfile = async () => {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      if (user) {
        const { data, error, status } = await supabase
          .from("profiles")
          .select(`username, website, avatar_url`)
          .eq("id", user.id)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setUsername(data.username);
          setWebsite(data.website);
          setAvatarUrl(data.avatar_url);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async ({ username, website, avatar_url }: Profile) => {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      if (user) {
        const updates = {
          id: user.id,
          username,
          website,
          avatar_url,
          updated_at: new Date(),
        };

        const { error } = await supabase.from("profiles").upsert(updates, {
          returning: "minimal",
        });

        if (error) {
          throw error;
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.account}>
      <form>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="text" value={session.user?.email} disabled />
        </div>
        <div>
          <label htmlFor="username">Name</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="website">Website / Social</label>
          <input
            id="website"
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div className={styles.buttons}>
          <button
            onClick={() => updateProfile({ username, website, avatar_url })}
            disabled={loading}
          >
            {loading ? "Lade..." : "Update"}
          </button>

          <button
            className={styles.logout}
            onClick={() => {
              supabase.auth.signOut();
              setOpen(false);
            }}
          >
            Log Out
          </button>
        </div>
      </form>
    </div>
  );
};

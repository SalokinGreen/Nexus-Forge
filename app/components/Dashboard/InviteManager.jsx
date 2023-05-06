import { useState, useEffect } from "react";
import { useSupabase } from "../../supabase-provider";
import styles from "../../../Styles/InviteManager.module.css";
export default function InviteManager() {
  const [invites, setInvites] = useState([]);
  const [message, setMessage] = useState("");
  const { supabase } = useSupabase();

  useEffect(() => {
    fetchInvites();
  }, []);

  const fetchInvites = async () => {
    const { data, error } = await supabase.from("invites").select("*");
    if (error) {
      console.error("Error fetching invites:", error);
    } else {
      setInvites(data);
    }
  };
  const handleDelete = async (inviteId) => {
    const { error } = await supabase
      .from("invites")
      .delete()
      .match({ id: inviteId });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Invite code deleted!");
      fetchInvites();
    }
  };

  const createInvite = async (e) => {
    // random code
    const newInviteCode = Math.random().toString(36).substring(2, 15);

    const { data, error } = await supabase
      .from("invites")
      .insert([{ code: newInviteCode }]);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Invite code created!");
      fetchInvites();
    }
  };

  return (
    <div className={styles.container}>
      <h1>Invite Manager</h1>

      <button type="submit" className={styles.button} onClick={createInvite}>
        Create
      </button>
      {message && <p className={styles.message}>{message}</p>}

      <h2>Existing Invite Codes</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Code</th>
            <th>Used</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invites.map((invite) => (
            <tr key={invite.id}>
              <td>{invite.code}</td>
              <td>{invite.is_used ? "Yes" : "No"}</td>
              <td>{new Date(invite.created_at).toLocaleString()}</td>
              <td>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(invite.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

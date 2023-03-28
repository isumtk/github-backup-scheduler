import styles from "@/styles/Modal.module.css";
import { useEffect, useRef, useState } from "react";

const AddRepoModal = (props: any) => {
  const { closeModal } = props;
  const [repository, setRepository] = useState<string>("");
  const [frequency, setFrequency] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);
  const [hasMessage, setHasMessage] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleBackup = async (
    url: string | undefined,
    frequency: string | undefined
  ) => {
    const response = await fetch("/api/backup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        frequency,
      }),
    });
    const data = await response.text();
    // console.log(data);
    setHasMessage(true);
    setMessage(data);
  };

  const addBackupRepo = async (
    url: string | undefined,
    frequency: string | undefined
  ) => {
    const response = await fetch("/api/get-repo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url,
        frequency: frequency,
      }),
    });

    // console.log({ url, frequency });

    const data = await response.text();
    if (!response.ok) {
      setHasError(true);
      setError(data);
    }
    if (response.ok) {
      setHasMessage(true);
      setMessage("Success");
      setTimeout(() => {
        handleBackup(url, frequency);
        closeModal();
      }, 4000);
    }
  };
  const validateForm = async (e: any) => {
    e.preventDefault();
    addBackupRepo(repository, frequency);
  };

  return (
    <main className={styles.modal_wrapper}>
      <div className={styles.modal_body}>
        <div className={styles.modal_body_wrap}>
          <header className={styles.modal_body_header}>
            <h4>Enter the details for your backup</h4>
          </header>
          <form className={styles.form_body} onSubmit={validateForm}>
            <div className={styles.form_element}>
              <label className={styles.form_label}>Github Repo :</label>
              <input
                className={styles.form_input}
                type={"text"}
                placeholder="Repository link"
                value={repository}
                onChange={(e) => setRepository(e.target.value)}
              ></input>
            </div>
            <div className={styles.form_element}>
              <label className={styles.form_label}>Frequency :</label>
              <select
                className={styles.form_select}
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              >
                <option value={"0 * * * *"}>Hourly</option>
                <option value={"0 0 * * *"}>Daily</option>
                <option value={"0 0 * * 0"}>Weekly</option>
                <option value={"0 0 */14 * *"}>Fortnightly</option>
                <option value={"0 0 1 * *"}>Monthly</option>
              </select>
            </div>
            <div className={styles.form_error}>
              <p>{hasError ? error : null}</p>
              <p className={styles.message}>{hasMessage ? message : null}</p>
            </div>
            <button className={styles.form_button} type={"submit"}>
              Create Backup
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AddRepoModal;

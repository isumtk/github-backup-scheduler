import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import AddRepoModal from "@/components/modal";

interface BackUpData {
  url: string;
  frequency: string;
}

const FrequencyType: { [key: string]: string } = {
  "0 * * * *": "Hourly",
  "0 0 * * *": "Daily",
  "0 0 * * 0": "Weekly",
  "0 0 */14 * *": "Fortnightly",
  "0 0 1 * *": "Monthly",
};

export default function Home() {
  const [modal, setModal] = useState<boolean>(false);
  const getBackupRepo = async () => {
    const response = await fetch("/api/get-repo", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.text();
    const { repos } = JSON.parse(data);
    // console.log(repos);
    setBackups(repos);
  };

  const [backups, setBackups] = useState<BackUpData[]>([]);

  useEffect(() => {
    getBackupRepo();
  }, []);

  useEffect(() => {
    getBackupRepo();
  }, [modal]);

  return (
    <>
      <Head>
        <title>Github Backup Scheduler</title>
        <meta name="description" content="Schedule backups of your git repos" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {modal && <AddRepoModal closeModal={() => setModal(false)} />}
      <main className={styles.main}>
        <header className={styles.header}>
          <h2 className={styles.header_title}>Github Backup Scheduler</h2>
          <button
            className={styles.option_button}
            onClick={() => setModal(true)}
          >
            Add Backup
          </button>
        </header>
        <div className={styles.body_content}>
          {backups.length > 0 ? (
            backups.map((backup, idx) => (
              <article className={styles.backup_element} key={idx}>
                <p className={styles.backup_repo_name}> {backup.url}</p>
                <button className={styles.backup_repo_frequency}>
                  {FrequencyType[`${backup.frequency}`]}
                </button>
              </article>
            ))
          ) : (
            <section className={styles.no_backup_found}>
              <h2 className={styles.no_backup_text}>
                No backups scheduled,
                <br /> please press{" "}
                <span className={styles.emphasis}>Add Backup</span> to schedule
                backups
              </h2>
            </section>
          )}
        </div>
      </main>
    </>
  );
}

import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useState } from "react";

interface BackUpData {
  url: string;
  frequency: string;
}

export default function Home() {
  const handleBackupClick = async () => {
    const response = await fetch("/api/backup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: "https://github.com/isumtk/overlapping-squares.git",
        frequency: "0 0 * * *",
      }),
    });
    const data = await response.text();
    console.log(data);
  };

  const handleAddRepoClick = async () => {
    const response = await fetch("/api/add-repo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        repoUrl: "https://github.com/isumtk/squares.git",
        backupFrequency: "0 0 * * *",
      }),
    });
    const data = await response.text();
    console.log(data);
  };

  const [backups, setBackups] = useState<BackUpData[]>([]);

  return (
    <>
      <Head>
        <title>Github Backup Scheduler</title>
        <meta name="description" content="Schedule backups of your git repos" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <header className={styles.header}>
          <h2 className={styles.header_title}>Github Backup Scheduler</h2>
          <button className={styles.option_button}>Add Backup</button>
        </header>
        <div className={styles.body_content}>
          {backups.length > 0 ? (
            backups.map((backup, idx) => (
              <article className={styles.backup_element} key={idx}>
                <p className={styles.backup_repo_name}> {backup.url}</p>
                <button>{backup.frequency}</button>
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

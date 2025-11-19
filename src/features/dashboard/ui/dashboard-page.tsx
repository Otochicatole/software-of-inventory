"use client";
import { dataDashboard } from "@/features/dashboard/services/data-dashboard-links";
import styles from "@/features/dashboard/styles/dashboard.module.css";
import { useRouter } from "next/navigation";
import { Item } from "@/features/dashboard/types/dashboard-types";

export default function DashboardPage() {
  
  const router = useRouter();

  const handleClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className={styles.dashboard}>
      <h1>Dashboard</h1>
      <div className={styles.container}>
        {dataDashboard.map((item: Item, index: number) => (
          <article
            onClick={() => handleClick(item.path)}
            key={index}
            className={styles.item}
            title={item.title}
          >
            <h2>{item.title}</h2>
            {item.icon}
          </article>
        ))}
      </div>
    </div>
  );
}

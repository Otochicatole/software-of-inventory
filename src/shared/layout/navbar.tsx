"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, TrendingUp } from "lucide-react";
import styles from "../styles/navbar.module.css";

export default function Navbar() {
    const pathname = usePathname();

    const navItems = [
        {
            href: "/",
            label: "Stock",
            icon: Package,
        },
        {
            href: "/sales",
            label: "Ventas",
            icon: TrendingUp,
        },
    ];

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <Package size={28} />
                    <span className={styles.brandName}>Etheon</span>
                </div>

                <ul className={styles.navList}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}


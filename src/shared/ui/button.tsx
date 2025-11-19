import {ReactNode, ButtonHTMLAttributes} from "react";
import styles from '@/shared/styles/button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
}

export default function Button({
    children,
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    className = '',
    type = 'button',
    ...rest
}: ButtonProps) {
    const variantClass = styles[variant] || styles.primary;
    const sizeClass = styles[size] || styles.medium;
    const widthClass = fullWidth ? styles.fullWidth : '';
    
    const combinedClassName = `${styles.button} ${variantClass} ${sizeClass} ${widthClass} ${className}`.trim();

    return (
        <button 
            className={combinedClassName}
            type={type}
            {...rest}
        >
            {children}
        </button>
    )
}
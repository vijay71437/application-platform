function Badge({
    children,
    variant = "default", // default | success | danger | warning | info | neutral | purple
    className = "",
}) {
    return (
        <span className={`badge badge-${variant} ${className}`}>
            {children}
        </span>
    );
}

export default Badge;

function Button({
    children,
    variant = "primary", // primary | secondary | danger | success | ghost | outline
    size = "md", // sm | md | lg
    loading = false,
    icon: Icon = null,
    className = "",
    disabled,
    ...props
}) {
    return (
        <button
            className={`button button-${variant} button-${size} ${loading ? "is-loading" : ""} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <span className="button-spinner" />
            ) : Icon ? (
                <span className="button-icon">
                    <Icon size={16} />
                </span>
            ) : null}
            <span>{children}</span>
        </button>
    );
}

export default Button;

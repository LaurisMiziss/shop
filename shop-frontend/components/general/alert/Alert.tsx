import "./Alert.css";
type Alert = {type: "success" | "error", message: string} | null;

interface AlertProps {
    alert: Alert;
    onRemoveAlert: () => void;
}

export function Alert({ alert, onRemoveAlert }: AlertProps) {
    return (
        <div className="alert-container" onMouseEnter={onRemoveAlert}>
            {alert && (
                <div className={`alert ${alert.type}`}>
                    {alert.message}
                </div>
            )}
        </div>
    );
}
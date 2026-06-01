import "./Success.css";
interface SuccessProps {
    message: string | null;
    onNavigateBack: () => void;
}

export function Success({ message, onNavigateBack}: SuccessProps) {

    return (
        <div className="success-container">

            <div className="success-card">
                <p className="success-message">
                    {message ? message : "Successfully done!"}
                </p>

                <button
                    type="button"
                    className="success-btn"
                    onClick={onNavigateBack}
                >
                    ← Return
                </button>
            </div>

        </div>
    );
}
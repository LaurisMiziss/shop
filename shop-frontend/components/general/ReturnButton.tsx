import "./ReturnButton.css";

interface ReturnButtonProps {
    onNavigateBack: () => void;
}

export function ReturnButton({
    onNavigateBack
}: ReturnButtonProps) {

    return (
        <button className="return-button" type="button" onClick={onNavigateBack}>
            ← Return
        </button>
    );
}
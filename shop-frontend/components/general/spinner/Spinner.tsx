import "./Spinner.css";
interface SpinnerProps {
    size?: number;
}

export const Spinner = ({ size = 24 }: SpinnerProps) => {
    return (
        <div
            className="spinner"
            style={{ width: size, height: size }}
        />
    );
};
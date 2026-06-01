import "./QueryBox.css";

interface QueryBoxProps {
    query: string;
    keyWord: string;
    onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function QueryBox({ query, keyWord, onQueryChange }: QueryBoxProps) {
    return (
        <div className="query-box">
            <input
                className="query-input"
                type="text"
                inputMode="numeric"
                placeholder={`Enter ${keyWord.toLowerCase()} ID (e.g. 12345)`}
                value={query}
                onChange={onQueryChange}
            />
        </div>
    );
}
interface SearchQueryProps {
    totalCount: number;
    savedQuery: string;
}

export function SearchQuery({ totalCount, savedQuery }: SearchQueryProps) {
    return (
        <div>
            {totalCount > 0  && savedQuery? (
                <p>Was found {totalCount} products using keyword: "{savedQuery}"</p>
            ) : !savedQuery ? (
                <p></p>
            ) : (
                <p>Nothing was found using keyword: "{savedQuery}", try different keyword</p>
            )}
        </div>
    );
}
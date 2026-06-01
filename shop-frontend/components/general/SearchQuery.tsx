interface SearchQueryProps {
    totalCount: number;
    savedQuery: string | null;
}

export function SearchQuery({ totalCount, savedQuery }: SearchQueryProps) {
    return (
        <div style={{margin: "1%"}}>
            {totalCount > 0  && savedQuery? (
                <p>Was found <b>{totalCount}</b> products using keyword: "<b>{savedQuery}</b>"</p>
            ) : !savedQuery ? (
                <p></p>
            ) : (
                <p>Nothing was found using keyword: "<b>{savedQuery}</b>", try different keyword</p>
            )}
        </div>
    );
}
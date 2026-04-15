import "./Pagination.css";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange
}: PaginationProps) {

    const generatePages = () => {
        const pages = [];

        const maxVisible = 5;
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, start + maxVisible - 1);

        // adjust if near end
        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(
                <li
                    key={i}
                    className={`page-item ${i === currentPage ? "active" : ""}`}
                >
                    <button onClick={() => onPageChange(i)}>
                        {i}
                    </button>
                </li>
            );
        }

        return pages;
    };

    return (
        <div className="pagination">
            <button
                className="nav-btn"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                ←
            </button>

            <ul className="page-list">
                {generatePages()}
            </ul>

            <button
                className="nav-btn"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                →
            </button>
        </div>
    );
}

import "./Pagination.css";
import { useEffect } from "react";

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

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, [currentPage]);

    const generatePages = () => {
        const pages = [];

        const maxVisible = 5;
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(
                <li
                    key={i}
                    className={`page-btn ${i === currentPage ? "active" : ""}`}
                >
                    <button onClick={() => onPageChange(i)} disabled={i === currentPage && currentPage === totalPages}>
                        {i}
                    </button>
                </li>
            );
        }

        return pages;
    };

return (
        <div className="pagination"> 

            <button className="nav-btn" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} >
                ←
            </button> 
            
            <ul className="page-list">
                {generatePages()}
            </ul>
            
            <button className="nav-btn" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} >
                →
            </button> 
            
        </div>
    );
}

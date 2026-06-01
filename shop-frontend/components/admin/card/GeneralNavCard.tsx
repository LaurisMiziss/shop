import "./GeneralNavCard.css";
interface GeneralNavCardProps {
    name: string | null;
    onNavigate: () => void;
}

export function GeneralNavCard({ name, onNavigate }: GeneralNavCardProps) {
    if (!name) {
        return (
            <div>
                <p>Specify card name</p>
            </div>
        );
    }

    const selectIcon = () => {
        switch (name) {
            case "Products":
                return (
                    <span className="icon-item"> Product section
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-carrot">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M3 21s9.834 -3.489 12.684 -6.34a4.487 4.487 0 0 0 0 -6.344a4.483 4.483 0 0 0 -6.342 0c-2.86 2.861 -6.347 12.689 -6.347 12.689l.005 -.005" />
                            <path d="M9 13l-1.5 -1.5" />
                            <path d="M16 14l-2 -2" />
                            <path d="M22 8s-1.14 -2 -3 -2c-1.406 0 -3 2 -3 2s1.14 2 3 2s3 -2 3 -2" />
                            <path d="M16 2s-2 1.14 -2 3s2 3 2 3s2 -1.577 2 -3c0 -1.86 -2 -3 -2 -3" />
                        </svg>
                    </span>
                );
            case "Categories":
                return (
                    <span className="icon-item"> Category section 
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-category">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M4 4h6v6h-6l0 -6" />
                            <path d="M14 4h6v6h-6l0 -6" />
                            <path d="M4 14h6v6h-6l0 -6" />
                            <path d="M14 17a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                        </svg>
                    </span>
                );
            case "Orders":
                return (
                    <span className="icon-item"> Order section 
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-truck-delivery">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                            <path d="M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                            <path d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" />
                            <path d="M3 9l4 0" />
                        </svg>
                    </span>
                );
            case "Users":
                return (
                    <span className="icon-item"> User section 
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-user">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                            <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                        </svg>
                    </span>
                );
            default:
                return <span className="icon-item">Error</span>;
        };
    };

    return (
        <div onClick={onNavigate}>
            
            <div className="inline-container">
                {selectIcon()}
            </div>

        </div>
    );
}
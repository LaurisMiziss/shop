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
                return "pr icon";
            case "Categories":
                return "ct icon";
            case "Orders":
                return "or icon";
            case "Users":
                return "us icon";
            default:
                return "img with error";
        };
    };

    return (
        <div onClick={onNavigate}>
            
            <img src={selectIcon()} alt={`Image of ${name.toLocaleLowerCase()}`} />

        </div>
    );
}
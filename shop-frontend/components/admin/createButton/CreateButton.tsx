interface CreateButtonProps {
    name: "product" | "category";
    onNavigateToCreationPage: () => void;
}

export function CreateButton({ name, onNavigateToCreationPage }: CreateButtonProps) {
    return (
        <button type="button" onClick={onNavigateToCreationPage}>
            {`Create a new ${name}`}
        </button>
    );
}
import "../general/ComponentList.css";
import type { UserInList } from "../../../types/user";
import { Alert } from "../../general/alert/Alert";
import { ViewButtonGroup } from "../../general/viewButtonGroup/ViewButtonGroup";
import { QueryBox } from "../general/QueryBox";
import { Spinner } from "../../general/spinner/Spinner";

interface UserListProps {
    users: UserInList[] | null;
    loading: boolean;
    alert: {type: "success" | "error", message: string} | null;
    view: "table" | "grid";
    query: string;
    onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUserClick: (userId: number) => void;
    onViewChange: (view: "table" | "grid") => void;
    removeAlert: () => void;
}

export function UserList({
    users,
    loading,
    alert,
    view,
    query,
    onQueryChange,
    onUserClick,
    onViewChange,
    removeAlert
}: UserListProps) {

    if (!users) {
        return (
            <div className="centred-content">
                <p>
                    Error 404
                    <br />
                    Users are not found
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="centred-content">
                <Spinner size={32} />
            </div>
        );
    }

    return (
        <div className="container">

            {/* ALERT */}
            <Alert alert={alert} onRemoveAlert={removeAlert} />

            <div className="head-container">
                
                <ViewButtonGroup view={view} onViewChange={onViewChange} />

                <QueryBox
                    query={query}
                    keyWord={"User"}
                    onQueryChange={onQueryChange}
                />

            </div>

            {view === "table" ? (
                <div className="table-container">

                    {/* TABLE VIEW */}

                    <table className="table">
                        
                        <thead>

                            <tr>

                                <th>User ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Full name</th>
                                <th>Phone</th>
                                <th>Country</th>
                                <th>Last login</th>

                            </tr>

                        </thead>

                        <tbody>
                            {users.map(user => {
                                return (
                                    <tr
                                        key={user.id}
                                        onClick={() => onUserClick(user.id)}
                                        className="table-row"
                                    >
                                        <td className="table-cell">
                                            {user.id}
                                        </td>

                                        <td className="table-cell">
                                            {user.username}
                                        </td>

                                        <td className="table-cell">
                                            {user.email}
                                        </td>

                                        <td className="table-cell">
                                            {user.role}
                                        </td>

                                        <td className="table-cell">
                                            {user.full_name}
                                        </td>

                                        <td className="table-cell">
                                            {user.phone}
                                        </td>

                                        <td className="table-cell">
                                            {user.country}
                                        </td>

                                        <td className="table-cell">
                                            {user.last_login ? new Date(user.last_login).toLocaleString() : "null"}
                                        </td>

                                    </tr>

                                );

                            })}

                        </tbody>

                    </table>

                </div>

            ) : (
                <div className="grid-container">

                    {/* GRID VIEW */}

                    {users.map(user => (
                        <div
                            key={user.id}
                            className="card"
                            onClick={() => onUserClick(user.id)}
                        >

                            <div className="card-row">
                                <strong>ID:</strong> {user.id}
                            </div>

                            <div className="card-row">
                                <strong>Username:</strong> {user.username}
                            </div>

                            <div className="card-row">
                                <strong>Email:</strong> {user.email}
                            </div>

                            <div className="card-row">
                                <strong>Phone:</strong> {user.phone}
                            </div>

                            <div className="card-row">
                                <strong>Country:</strong> {user.country}
                            </div>

                            <div className="card-row">
                                <strong>Last login:</strong> {user.last_login ? new Date(user.last_login).toLocaleString() : "null"}
                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}
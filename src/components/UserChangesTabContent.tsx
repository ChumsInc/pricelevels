import {useAppDispatch, useAppSelector} from "../app/configureStore";
import {
    loadPriceChangeUsers,
    selectCurrentUser,
    selectUserChangesLoading,
    selectUsers,
    setCurrentUser
} from "../ducks/pricing";
import {ChangeEvent, useEffect} from "react";
import UserChangeTable from "./UserChangesTable";
import {SpinnerButton} from "chums-components";

const UserChangesTabContent = () => {
    const dispatch = useAppDispatch();
    const users = useAppSelector(selectUsers);
    const currentUser = useAppSelector(selectCurrentUser);
    const loading = useAppSelector(selectUserChangesLoading);

    useEffect(() => {
        dispatch(loadPriceChangeUsers());
    }, [])

    const selectUserHander = (ev:ChangeEvent<HTMLSelectElement>) => {
        dispatch(setCurrentUser(ev.target.value));
    }

    const reloadHandler = () => {
        dispatch(loadPriceChangeUsers());
        if (currentUser) {
            dispatch(setCurrentUser(currentUser));
        }
    }
    const downloadURL = `/api/sales/pricing/chums/changes/${encodeURIComponent(currentUser || '')}.txt`;

    return (
        <div className="row g-3">
            <div className="col-3">
                <div className="input-group input-group-sm">
                    <span className="input-group-text bi-person-circle" />
                    <select className="form-select form-select-sm" value={currentUser || ''} onChange={selectUserHander}>
                        <option value=""></option>
                        {users.map(u => <option value={u.email} key={u.id} disabled={!u.changes}>
                            {u.UserName}
                            {(u.changes > 0) ? `  (${u.changes})` : ''}
                        </option>)}
                    </select>
                    <SpinnerButton spinning={loading} size="sm" onClick={reloadHandler} >Reload</SpinnerButton>
                    {!!currentUser && <a className="btn btn-sm btn-outline-success bi-file-earmark-arrow-down-fill" href={downloadURL} target="_blank" />}
                </div>
            </div>
            <div className="col">
                <UserChangeTable />
            </div>
        </div>
    )
}

export default UserChangesTabContent;

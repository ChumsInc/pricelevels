import {ChangeEvent, HTMLAttributes} from "react";

export interface FilterInputProps extends HTMLAttributes<HTMLInputElement>{
    value: string,
    onChange: (ev:ChangeEvent<HTMLInputElement>) => void;
}
const FilterInput = ({value, onChange, className, ...props}:FilterInputProps) => {
    return (
        <div className="input-group input-group-sm">
            <div className="input-group-text bi-funnel-fill"/>
            <input type="search" className="form-control form-control-sm"
                   value={value} onChange={onChange} {...props}/>
        </div>
    )
}

export default FilterInput;

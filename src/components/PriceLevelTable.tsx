import {useAppDispatch, useAppSelector} from "../app/configureStore";
import {selectPriceLevels} from "../ducks/pricing";
import {PriceCodeTableField, PriceLevelTableField} from "../ducks/pricing/types";
import {DndProvider, useDrop} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import type {CSSProperties} from "react";


const styles: CSSProperties = {
    border: '1px solid black',
    position: 'relative'
}

const PriceLevelTable = () => {
    return (
        <DndProvider backend={HTML5Backend}>
            <div style={styles}>

            </div>
        </DndProvider>
    )
}

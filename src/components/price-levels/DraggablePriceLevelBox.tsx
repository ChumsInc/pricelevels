import React, {CSSProperties, FC, memo, MouseEvent} from "react";
import {EditablePriceLevel} from "../../ducks/pricing/types";
import {DragSourceMonitor, useDrag, useDrop} from "react-dnd";
import PriceLevelBox from "./PriceLevelBox";
import classNames from "classnames";
import {useAppDispatch} from "../../app/configureStore";
import {setCurrentPriceLevel} from "../../ducks/pricing/actions";

const getStyles = (isDragging: boolean): CSSProperties => {
    return {
        opacity: isDragging ? 0 : 1,
    }
}

const style: CSSProperties = {
    flex: '1 1 10rem',
    border: '1px solid var(--bs-primary)',
    padding: '0.5rem 1rem',
    margin: '1rem',
    backgroundColor: 'white',
    cursor: 'move',
}
export interface DraggablePriceLevelBoxProps {
    level: EditablePriceLevel,
    active?: boolean,
    moveCard: (id: string, to: number) => void,
    findCard: (id: string) => { index: number };
}

interface Item {
    level: EditablePriceLevel
    originalIndex: number
}

const DraggablePriceLevelBox: FC<DraggablePriceLevelBoxProps> = ({level, active, moveCard, findCard}) => {
    const dispatch = useAppDispatch();

    const originalIndex = findCard(level.PriceLevel).index;
    const [{isDragging}, drag] = useDrag(
        () => ({
            type: 'price-level',
            item: {level, originalIndex},
            collect: (monitor: DragSourceMonitor) => ({isDragging: monitor.isDragging()}),
            end: (item, monitor) => {
                const {level: droppedLevel, originalIndex} = item;
                const didDrop = monitor.didDrop();
                if (!didDrop) {
                    moveCard(droppedLevel.PriceLevel, originalIndex);
                }
            }
        }),
        [level, originalIndex, moveCard],
    )
    const [, drop] = useDrop(
        () => ({
            accept: 'price-level',
            hover({level: draggedLevel}: Item) {
                if (draggedLevel.PriceLevel !== level.PriceLevel) {
                    const {index: overIndex} = findCard(level.PriceLevel);
                    console.log('useDrop.hover', overIndex);
                    moveCard(draggedLevel.PriceLevel, overIndex);
                }
            }
        }),
        [findCard, moveCard]
    )
    const opacity = isDragging ? 0 : 1;

    const clickHandler = () => {
        dispatch(setCurrentPriceLevel(level));
    }

    return (
        <div ref={(node) => drag(drop(node))} className={classNames("price-level-box", {active})} style={{opacity}} onClick={clickHandler}>
            <div className="price-level-header">
                <strong>{level.PriceLevel}</strong>
                <small>{level.priceCodes || 0}/{level.customers || 0}</small>
            </div>
            <div><small>{level.PriceLevelDescription || '---'}</small></div>
        </div>
    )
}

export default memo(DraggablePriceLevelBox);

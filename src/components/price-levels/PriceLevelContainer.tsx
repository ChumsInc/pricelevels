import React, {CSSProperties, memo, useCallback, useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {loadPriceLevels, savePriceLevelSort,} from "../../ducks/pricing/actions";
import {selectCurrentPriceLevel, selectPriceLevels, selectPriceLevelsLoading} from '../../ducks/pricing/selectors'
import {useDrop} from "react-dnd";
import DraggablePriceLevelBox from "./DraggablePriceLevelBox";
import update from 'immutability-helper';
import {priceLevelSort} from "../../ducks/pricing/utils";
import {SpinnerButton} from "chums-components";

const styles: CSSProperties = {
    border: '1px solid black',
    position: 'relative',
    margin: '1rem',
    padding: '1rem',
    maxHeight: '75vh',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
}

const PriceLevelContainer = () => {
    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectPriceLevelsLoading);
    const priceLevels = useAppSelector(selectPriceLevels);
    const currentPriceLevel = useAppSelector(selectCurrentPriceLevel);
    const [cards, setCards] = useState(Object.values(priceLevels).sort(priceLevelSort));

    useEffect(() => {
        setCards(Object.values(priceLevels).sort(priceLevelSort))
    }, [priceLevels])

    const findCard = useCallback(
        (id: string) => {
            const [card] = cards.filter(c => c.PriceLevel === id);
            return {
                card,
                index: cards.indexOf(card)
            }
        },
        [cards]);

    const moveCard = useCallback(
        (id: string, atIndex: number) => {
            const {card, index} = findCard(id);
            setCards(update(cards, {
                $splice: [
                    [index, 1],
                    [atIndex, 0, card],
                ]
            }));
        },
        [findCard, cards, setCards]
    )
    const [, drop] = useDrop(() => ({accept: 'price-level'}))

    const reloadHandler = () => {
        dispatch(loadPriceLevels());
    }

    const saveSortHandler = () => {
        dispatch(savePriceLevelSort(cards));
    }

    return (
        <div>
            <div className="row g-3">
                <div className="col-auto">
                    <SpinnerButton spinning={loading} color="primary" size="sm"
                                   onClick={reloadHandler}>Reload</SpinnerButton>
                </div>
                <div className="col-auto">
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={saveSortHandler}>Save
                        Sorting
                    </button>
                </div>
                <div className="col-auto">
                    Drage and Drop to sort.
                </div>
                <div className="col">
                    <span className="text-info">Key: <strong className="me-5">Price Level</strong> <em>price codes / customers</em></span>
                </div>
            </div>
            <div className="price-levels-sort-container mt-3" ref={drop}>
                {cards.map((priceLevel) => (
                    <DraggablePriceLevelBox key={priceLevel.PriceLevel} level={priceLevel} moveCard={moveCard}
                                            findCard={findCard}
                                            active={currentPriceLevel?.PriceLevel === priceLevel.PriceLevel}/>
                ))}
            </div>
        </div>
    )
}

export default memo(PriceLevelContainer)

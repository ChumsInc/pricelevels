import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import PriceLevelContainer from "./PriceLevelContainer";


const PriceLevelDNDProvider = () => {

    return (
        <DndProvider backend={HTML5Backend}>
            <PriceLevelContainer/>
        </DndProvider>
    )
}
export default PriceLevelDNDProvider;

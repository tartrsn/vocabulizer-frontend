import React from 'react';
import BEM from "../../utils/BEM"
import TextArea from "../TextArea/TextArea";
import './App.css';
const b = BEM("App")

const lorem = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis, consequuntur culpa dolorem, ea eveniet excepturi, libero magni minima molestiae quae quidem ratione veniam voluptate? At optio quisquam reiciendis saepe vel?"

const App = () => (
    <div className={b()}>
        <TextArea value={lorem}>{(value) => value}</TextArea>
    </div>
);

export default App;

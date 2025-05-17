
import { useRef, useEffect, useState } from "react";
import "../App.css";


function Canvas() {

    const canvasReference = useRef(null);
    const contextReference = useRef(null);

    const [isPressed, setIsPressed] = useState(false)

    const beginDraw = (e) => {
        contextReference.current.beginPath();
        contextReference.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsPressed(true)
    };
    const updateDraw = (e) => {
        if(!isPressed) return;

        contextReference.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

        contextReference.current.stroke();
    };
    const endDraw = () => {
        contextReference.current.closePath();
        setIsPressed(false);
    };
    
    useEffect(() => {
        const canvas = canvasReference.current;
        canvas.width = 800;
        canvas.height = 800;

        const context = canvas.getContext("2d");
        context.linecap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 2;
        contextReference.current = context;
    }, []);

    return (
        <div className = "Canvas" id="my_canvas">
            <canvas
            ref={canvasReference}
            onMouseDown={beginDraw}
            onMouseMove={updateDraw}
            onMouseUp={endDraw}
            />
        </div>
    )

   

}

export default Canvas
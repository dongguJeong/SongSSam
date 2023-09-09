import React, {useRef, useEffect} from 'react'

export function useCanvas  (
    width  : number, 
    height : number, 
    ) {
        const canvasRef = useRef<HTMLCanvasElement>(null);
      
        useEffect(() => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');

            const setCanvas = () => {
                if(canvas && ctx) {
                    canvas.style.width = `${width}px`;
                    canvas.style.height = `${height}px`;  
                    const numLines = 5;
                    const lineHeight = height / (numLines+1); 
                    const lineWidth = width;

                    for (let i = 0; i < numLines; i++) {
                        const yPos = i * lineHeight+lineHeight;
                        ctx.beginPath();
                        ctx.moveTo(10, yPos);
                        ctx.lineTo(lineWidth, yPos);
                        ctx.strokeStyle = 'black';
                        ctx.stroke();
                    }
                }
            }

            setCanvas();

        },[width, height,]);

        return canvasRef;
    }



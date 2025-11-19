export default class Canvas {
    constructor() {
        this.canvas = null;
        this.pathTShirt = null;
        this.container_group = null;
        this.pointers = [];
    }

    initCanvas(canvasId) {
        this.canvas = new fabric.Canvas(canvasId, {
            width: 800,
            height: 600,
            backgroundColor: 'white'
        });
        this.canvas.renderAll();
    }

    createContainer(colorBackground) {
        this.pathTShirt = new fabric.Path('M 300 300 L 300 500 L 600 500 L 600 300 Z', {
            fill: colorBackground,
            stroke: 'black',
            strokeWidth: 2,
            selectable: true,
            evented: true,
            hasControls: true,
            hasBorders: true,
        });

        setTimeout(() => {
            this.container_group.setControlVisible('mt', false);
            this.container_group.setControlVisible('mb', false);
            this.container_group.setControlVisible('ml', false);
            this.container_group.setControlVisible('mr', false);
            this.container_group.setControlVisible('mtr', false);
            this.canvas.renderAll();
        }, 100);

        this.container_group = new fabric.Group([this.pathTShirt], {
            left: 300,
            top: 300,
            selectable: true,
            subTargetCheck: true
        });

        this.canvas.add(this.container_group);
        this.canvas.renderAll();
    }

    rerenderTShirt(color) {
        this.pathTShirt.set('fill', color);
        this.canvas.renderAll();
    }

    getMouseClick(mode, options) {
        this.canvas.off('mouse:down');
    
        this.canvas.on('mouse:down', (e) => {
            if (mode === 'drawing_line') {
                const pointer = this.canvas.getPointer(e.e);
                this.pointers.push({
                    x: pointer.x,
                    y: pointer.y
                });
    
                const color = options[0] || 'black';
                const width = parseInt(options[1]) || 2;
            
                this.drawLine(mode, color, width);
            } else if (mode === 'free_drawing') {
                this.canvas.isDrawingMode = true;
                this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
                this.canvas.freeDrawingBrush.width = options.width || 5;
                this.canvas.freeDrawingBrush.color = options.color || 'black';
            } else {
                this.canvas.isDrawingMode = false
            }
        });
    }

    drawLine(mode, color, width) {
        if (mode === 'drawing_line' && this.pointers.length === 2) {
            const [point1, point2] = this.pointers;
        
            const line = new fabric.Line([
                point1.x, point1.y,
                point2.x, point2.y
            ], {
                stroke: color,
                strokeWidth: parseInt(width), 
                selectable: true, 
                hasBorders: true,
                hasControls: true,
                evented: true,
                cornerStyle: 'circle',
                cornerSize: 12
            });

            this.canvas.remove(this.container_group);
        
            this.container_group.add(line);
        
            this.canvas.add(this.container_group);
        
            this.pointers = [];
            this.canvas.renderAll();
        }
    }

    getMouseDriving() {

    }
}
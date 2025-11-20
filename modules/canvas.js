export default class Canvas {
    constructor() {
        this.canvas = null;
        this.pathTShirt = null;
        this.container_group = null;
        this.pointers = [];
        this.tempShape = null;
        this.isDrawing = false
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
            selectable: false,
            evented: false,
            hasControls: false,
            hasBorders: false,
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
        this.canvas.off('mouse:move');
        this.canvas.off('mouse:up');
    
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
            } 
            else if (mode === 'free_drawing') {
                this.getMouseDrawing(options);
            }
            else if (mode === 'drawing_rect') {
                this.startDrawingRect(e, options);
            }
            else if (mode === 'drawing_triangle') {
                this.startDrawingTriangle(e, options);
            }
            else if (mode === 'drawing_circle') {
                this.startDrawingCircle(e, options);
            }
            else if (mode === 'drawing_path') {
                this.startDrawingPath(e, options);
            }
            else {
                this.canvas.isDrawingMode = false;
                this.isDrawing = false;
            }
        });
    }

    //РИСОВАНИЕ ПРЯМОУГОЛЬНИКА
    startDrawingRect(e, options) {
        this.isDrawing = true;
        const pointer = this.canvas.getPointer(e.e);
        const startX = pointer.x;
        const startY = pointer.y;

        this.tempShape = new fabric.Rect({
            left: startX,
            top: startY,
            width: 0,
            height: 0,
            fill: options[2] || 'transparent',
            stroke: options[0] || 'black',
            strokeWidth: parseInt(options[1]) || 2,
            selectable: false,
            strokeDashArray: [3, 3]
        });

        this.canvas.add(this.tempShape);

        // Следим за движением мыши
        this.canvas.on('mouse:move', (e) => {
            if (!this.isDrawing || !this.tempShape) return;
            
            const pointer = this.canvas.getPointer(e.e);
            const currentX = pointer.x;
            const currentY = pointer.y;

            this.tempShape.set({
                width: Math.abs(currentX - startX),
                height: Math.abs(currentY - startY),
                left: Math.min(startX, currentX),
                top: Math.min(startY, currentY)
            });

            this.canvas.renderAll();
        });

        // Завершаем рисование
        this.canvas.once('mouse:up', () => {
            if (this.tempShape && this.tempShape.width > 5 && this.tempShape.height > 5) {
                this.finalizeShape(this.tempShape);
            } else {
                this.canvas.remove(this.tempShape);
            }
            this.isDrawing = false;
            this.tempShape = null;
        });
    }

    //РИСОВАНИЕ ТРЕУГОЛЬНИКА
    startDrawingTriangle(e, options) {
        this.isDrawing = true;
        const pointer = this.canvas.getPointer(e.e);
        const startX = pointer.x;
        const startY = pointer.y;

        this.tempShape = new fabric.Triangle({
            left: startX,
            top: startY,
            width: 0,
            height: 0,
            fill: options[2] || 'transparent',
            stroke: options[0] || 'black',
            strokeWidth: parseInt(options[1]) || 2,
            selectable: false,
            strokeDashArray: [3, 3]
        });

        this.canvas.add(this.tempShape);

        this.canvas.on('mouse:move', (e) => {
            if (!this.isDrawing || !this.tempShape) return;
            
            const pointer = this.canvas.getPointer(e.e);
            const currentX = pointer.x;
            const currentY = pointer.y;

            this.tempShape.set({
                width: Math.abs(currentX - startX),
                height: Math.abs(currentY - startY),
                left: Math.min(startX, currentX),
                top: Math.min(startY, currentY)
            });

            this.canvas.renderAll();
        });

        this.canvas.once('mouse:up', () => {
            if (this.tempShape && this.tempShape.width > 5 && this.tempShape.height > 5) {
                this.finalizeShape(this.tempShape);
            } else {
                this.canvas.remove(this.tempShape);
            }
            this.isDrawing = false;
            this.tempShape = null;
        });
    }

    //РИСОВАНИЕ КРУГА
    startDrawingCircle(e, options) {
        this.isDrawing = true;
        const pointer = this.canvas.getPointer(e.e);
        const startX = pointer.x;
        const startY = pointer.y;

        this.tempShape = new fabric.Circle({
            left: startX,
            top: startY,
            radius: 0,
            fill: options[2] || 'transparent',
            stroke: options[0] || 'black',
            strokeWidth: parseInt(options[1]) || 2,
            selectable: false,
            strokeDashArray: [3, 3]
        });

        this.canvas.add(this.tempShape);

        this.canvas.on('mouse:move', (e) => {
            if (!this.isDrawing || !this.tempShape) return;
            
            const pointer = this.canvas.getPointer(e.e);
            const currentX = pointer.x;
            const currentY = pointer.y;

            const radius = Math.sqrt(
                Math.pow(currentX - startX, 2) + 
                Math.pow(currentY - startY, 2)
            ) / 2;

            this.tempShape.set({
                radius: radius,
                left: startX - radius,
                top: startY - radius
            });

            this.canvas.renderAll();
        });

        this.canvas.once('mouse:up', () => {
            if (this.tempShape && this.tempShape.radius > 5) {
                this.finalizeShape(this.tempShape);
            } else {
                this.canvas.remove(this.tempShape);
            }
            this.isDrawing = false;
            this.tempShape = null;
        });
    }

    //РИСОВАНИЕ ПУТИ ПО ТОЧКАМ (полилиния)
    startDrawingPath(e, options) {
        const pointer = this.canvas.getPointer(e.e);
        
        // Первая точка
        if (!this.pointers.length) {
            this.pointers.push({ x: pointer.x, y: pointer.y });
            this.tempShape = new fabric.Polyline([...this.pointers], {
                stroke: options[0] || 'black',
                strokeWidth: parseInt(options[1]) || 2,
                fill: '',
                selectable: false,
                strokeDashArray: [3, 3]
            });
            this.canvas.add(this.tempShape);
        } 
        // Добавляем точки к существующему пути
        else {
            this.pointers.push({ x: pointer.x, y: pointer.y });
            this.tempShape.set({ points: [...this.pointers] });
        }

        this.canvas.renderAll();

        // Двойной клик или правый клик завершает путь
        this.canvas.once('mouse:dblclick', () => {
            this.finalizePath(options);
        });

        // ESC завершает путь
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.finalizePath(options);
            }
        }, { once: true });
    }

    finalizePath(options) {
        if (this.pointers.length >= 2) {
            const path = new fabric.Polyline(
                this.pointers.map(p => ({ x: p.x, y: p.y })),
                {
                    stroke: options[0] || 'black',
                    strokeWidth: parseInt(options[1]) || 2,
                    fill: '',
                    selectable: true,
                    hasControls: true,
                    evented: true
                }
            );
            
            this.finalizeShape(path);
        }
        
        this.cleanupDrawing();
    }

    // УНИВЕРСАЛЬНЫЙ МЕТОД ДОБАВЛЕНИЯ ФИГУР В ГРУППУ
    finalizeShape(shape) {
        shape.set({
            selectable: true,
            hasControls: true,
            evented: true,
            strokeDashArray: []
        });

        this.canvas.remove(this.tempShape);
        this.canvas.remove(this.container_group);
        this.container_group.add(shape);
        this.canvas.add(this.container_group);
        this.canvas.renderAll();
    }

    //ОЧИСТКА ПЕРЕМЕННЫХ РИСОВАНИЯ
    cleanupDrawing() {
        if (this.tempShape) {
            this.canvas.remove(this.tempShape);
            this.tempShape = null;
        }
        this.pointers = [];
        this.isDrawing = false;
        this.canvas.off('mouse:move');
        this.canvas.off('mouse:up');
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

    getMouseDrawing(options) {
        this.canvas.off('path:created')
        
        this.canvas.isDrawingMode = true;
        this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
        this.canvas.freeDrawingBrush.width = options[1] || 5;
        this.canvas.freeDrawingBrush.color = options[0] || 'black';

        this.canvas.on('path:created', (e) => {
            console.log('h');
            
            const path = e.path
            this.canvas.remove(path)
            this.canvas.isDrawingMode = false

            this.canvas.remove(this.container_group)
            this.container_group.add(path)
            this.canvas.add(this.container_group)

            this.canvas.isDrawingMode = true

            this.canvas.renderAll();
        })
    }
}
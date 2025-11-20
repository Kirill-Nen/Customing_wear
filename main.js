import Canvas from './modules/canvas.js';

class Main {
    constructor() {
        this.canvas = new Canvas();
        this.colors = ['#FF0000', '#FFFF00', '#00FF00', '#0000FF', '#FFFFFF', '#000000'];
        this.modes = ['drawing_line', 'free_drawing', 'drawing_rect', 'drawing_triangle', 'drawing_circle', 'drawing_path'];

        this.activeColorBackground = this.colors[0];
        this.drawingMode = null;

        this.toolMap = {
            'tool-free': 'free_drawing',
            'tool-line': 'drawing_line', 
            'tool-rect': 'drawing_rect',
            'tool-circle': 'drawing_circle',
            'tool-triangle': 'drawing_triangle',
            'tool-path': 'drawing_path'
        };
    }

    createColorBackgroundPanel(parent) {
        const fragment = document.createDocumentFragment();

        this.colors.forEach((item) => {
            const colorSwatch = document.createElement('div');
            colorSwatch.classList.add('color-swatch');
            if (item === this.activeColorBackground) {
                colorSwatch.classList.add('active');
            }
            colorSwatch.style.backgroundColor = item;
            colorSwatch.setAttribute('data-color', item);

            colorSwatch.addEventListener('click', () => {
                this.setActiveColor(colorSwatch, item);
            });

            fragment.appendChild(colorSwatch);
        });

        parent.appendChild(fragment);
    }

    setActiveColor(colorElement, color) {
        document.querySelectorAll('.color-swatch').forEach(item => {
            item.classList.remove('active');
        });

        colorElement.classList.add('active');
        this.activeColorBackground = color;

        this.canvas.rerenderTShirt(this.activeColorBackground);
        
        this.updateStatus(`Цвет футболки изменен на ${color}`);
    }

    setupToolControls() {
        const toolButtons = document.querySelectorAll('.tool-btn');
        toolButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const toolId = e.currentTarget.id;
                this.activateTool(toolId);
            });
        });

        const clearBtn = document.getElementById('clear-btn');
        const cancelBtn = document.getElementById('cancel-btn');

        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearCanvas());
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.cancelDrawing());
        }

        this.setupInputListeners();
    }

    activateTool(toolId) {
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        const activeTool = document.getElementById(toolId);
        activeTool.classList.add('active');

        const color_line = document.getElementById('color-line').value || '#000000';
        const width_line = document.getElementById('width-line').value || 2;
        const fill_line = document.getElementById('fill-line').value || '#FFFFFF';

        const mode = this.toolMap[toolId];
        if (mode) {
            this.drawingMode = mode;
            
            if (mode === 'free_drawing' || mode === 'drawing_line' || mode === 'drawing_path') {
                this.canvas.getMouseClick(mode, [color_line, width_line]);
            } else {
                this.canvas.getMouseClick(mode, [color_line, width_line, fill_line]);
            }

            this.updateToolIndicator(toolId);
            this.updateStatus(`Активирован инструмент: ${this.getToolName(toolId)}`);
        }
    }

    getToolName(toolId) {
        const names = {
            'tool-free': 'Кисть',
            'tool-line': 'Линия',
            'tool-rect': 'Прямоугольник', 
            'tool-circle': 'Круг',
            'tool-triangle': 'Треугольник',
            'tool-path': 'Кривая'
        };
        return names[toolId] || 'Инструмент';
    }

    updateToolIndicator(toolId) {
        const indicator = document.getElementById('currentTool');
        if (indicator) {
            indicator.textContent = this.getToolName(toolId);
        }
    }

    setupInputListeners() {
        const colorLine = document.getElementById('color-line');
        const widthLine = document.getElementById('width-line'); 
        const fillLine = document.getElementById('fill-line');

        if (colorLine) {
            colorLine.addEventListener('input', (e) => {
                document.getElementById('color-line-value').textContent = e.target.value.toUpperCase();
            });
        }

        if (widthLine) {
            widthLine.addEventListener('input', (e) => {
                document.getElementById('width-line-value').textContent = e.target.value + 'px';

                if (this.drawingMode) {
                    this.updateCurrentDrawingMode();
                }
            });
        }

        if (fillLine) {
            fillLine.addEventListener('input', (e) => {
                document.getElementById('fill-line-value').textContent = e.target.value.toUpperCase();
            });
        }
    }

    updateCurrentDrawingMode() {
        if (!this.drawingMode) return;

        const color_line = document.getElementById('color-line').value || '#000000';
        const width_line = document.getElementById('width-line').value || 2;
        const fill_line = document.getElementById('fill-line').value || '#FFFFFF';

        if (this.drawingMode === 'free_drawing' || this.drawingMode === 'drawing_line' || this.drawingMode === 'drawing_path') {
            this.canvas.getMouseClick(this.drawingMode, [color_line, width_line]);
        } else {
            this.canvas.getMouseClick(this.drawingMode, [color_line, width_line, fill_line]);
        }
    }

    clearCanvas() {
        if (confirm('Вы уверены, что хотите очистить весь холст?')) {
            this.canvas.clearCanvas(this.activeColorBackground)
            this.updateStatus('Холст очищен');
        }
    }

    cancelDrawing() {
        this.canvas.getMouseClick(null, []);
        
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        this.drawingMode = null;
        this.updateStatus('Режим рисования отменен');
    }

    updateStatus(message) {
        const statusText = document.getElementById('statusText');
        if (statusText) {
            statusText.textContent = message;

            setTimeout(() => {
                if (statusText.textContent === message) {
                    statusText.textContent = 'Готов к работе';
                }
            }, 3000);
        }
    }

    start() {
        this.canvas.initCanvas('canvas');
        this.canvas.createContainer(this.activeColorBackground);

        const colorsPanel = document.getElementById('colorGrid');
        if (colorsPanel) {
            this.createColorBackgroundPanel(colorsPanel);
        }

        this.setupToolControls();

        setTimeout(() => {
            this.activateTool('tool-free');
        }, 100);

        console.log('Application started successfully');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new Main();
    app.start();
});
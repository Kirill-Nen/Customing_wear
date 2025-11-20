import Canvas from './modules/canvas.js';
const canvas = new Canvas

class Main {
    constructor() {
        this.colors = ['red', 'yellow', 'green', 'blue', 'white', 'black'];
        this.modes = ['drawing_line', 'free_drawing', 'drawing_rect', 'drawing_triangle', 'drawing_circle', 'drawing_path']

        this.activeColorBackground = this.colors[0]
        this.drawingMode = null
    }

    createColorBackgroundPanel(parent) {
        const fragment = document.createDocumentFragment()

        this.colors.forEach((item) => {
            const colorButton = document.createElement('div')
            colorButton.classList.add('color-button')
            if (item === this.activeColorBackground) {
                colorButton.classList.add('active-color-button')
            }
            colorButton.style.backgroundColor = item

            fragment.appendChild(colorButton)
        })

        parent.appendChild(fragment)
    }

    addListenerForColorsButton(parent, setActiveColor) {
        const colorsElements = parent.querySelectorAll('div')

        colorsElements.forEach((item) => {
            item.addEventListener('click', () => {
                colorsElements.forEach((item) => {
                    if (item.classList.contains('active-color-button')) {
                        item.classList.remove('active-color-button')
                    }
                });

                this.activeColorBackground = setActiveColor(item)

                canvas.rerenderTShirt(this.activeColorBackground)
            })
        })
    }

    drawingModeControll() {
        document.querySelector('.button-container').addEventListener('click', (e) => {
            const color_line = document.querySelector('#color-line').value || 'black'
            const width_line = document.querySelector('#width-line').value || 2
            const fill_line = document.querySelector('#fill-line').value || 'white'
            if (e.target.classList.contains('line-on')) {
                this.drawingMode = this.modes[0]
                canvas.getMouseClick(this.drawingMode, [color_line, width_line])
            }  else if (e.target.classList.contains('free-drawing')) {
                this.drawingMode = this.modes[1]
                canvas.getMouseClick(this.drawingMode, [color_line, width_line])
            } else if (e.target.classList.contains('rect')) {
                this.drawingMode = this.modes[2]
                canvas.getMouseClick(this.drawingMode, [color_line, width_line, fill_line])
            } else if (e.target.classList.contains('triage')) {
                this.drawingMode = this.modes[3]
                canvas.getMouseClick(this.drawingMode, [color_line, width_line, fill_line])
            } else if (e.target.classList.contains('circle')) {
                this.drawingMode = this.modes[4]
                canvas.getMouseClick(this.drawingMode, [color_line, width_line, fill_line])
            } else if (e.target.classList.contains('path')) {
                this.drawingMode = this.modes[5]
                canvas.getMouseClick(this.drawingMode, [color_line, width_line])
            } else {
                this.drawingMode = null
                canvas.getMouseClick(this.drawingMode)
            }
        })
    }

    start(colors_panel) {
        controlls.createColorBackgroundPanel(colors_panel)

        controlls.addListenerForColorsButton(colors_panel, (item) => {
            const activeColor = item.style.backgroundColor
            item.classList.add('active-color-button')

            return activeColor
        })

        canvas.initCanvas('canvas')
        canvas.createContainer(this.activeColorBackground)
    }
}

const controlls = new Main

const colorsPanel = document.querySelector('.color-list')

controlls.start(colorsPanel)

controlls.drawingModeControll()
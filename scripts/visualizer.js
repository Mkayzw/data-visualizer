class DataFlowVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    visualizeArray(data) {
        this.clear();
        const boxWidth = 60;
        const boxHeight = 40;
        const spacing = 20;
        const startX = (this.canvas.width - (data.length * (boxWidth + spacing))) / 2;
        const startY = this.canvas.height / 2;

        data.forEach((value, index) => {
            const x = startX + index * (boxWidth + spacing);
            
            // Draw box
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, startY, boxWidth, boxHeight);
            
            // Draw value
            this.ctx.fillStyle = '#333';
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(value, x + boxWidth/2, startY + boxHeight/2);
        });
    }

    visualizeLinkedList(data) {
        this.clear();
        const boxWidth = 60;
        const boxHeight = 40;
        const spacing = 40;
        const startX = (this.canvas.width - (data.length * (boxWidth + spacing))) / 2;
        const startY = this.canvas.height / 2;

        data.forEach((value, index) => {
            const x = startX + index * (boxWidth + spacing);
            
            // Draw box
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, startY, boxWidth, boxHeight);
            
            // Draw value
            this.ctx.fillStyle = '#333';
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(value, x + boxWidth/2, startY + boxHeight/2);

            // Draw arrow
            if (index < data.length - 1) {
                this.ctx.beginPath();
                this.ctx.moveTo(x + boxWidth, startY + boxHeight/2);
                this.ctx.lineTo(x + boxWidth + spacing, startY + boxHeight/2);
                this.ctx.stroke();
                
                // Draw arrow head
                this.ctx.beginPath();
                this.ctx.moveTo(x + boxWidth + spacing, startY + boxHeight/2);
                this.ctx.lineTo(x + boxWidth + spacing - 10, startY + boxHeight/2 - 5);
                this.ctx.lineTo(x + boxWidth + spacing - 10, startY + boxHeight/2 + 5);
                this.ctx.closePath();
                this.ctx.fill();
            }
        });
    }
} 
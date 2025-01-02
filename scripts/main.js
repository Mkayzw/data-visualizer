document.addEventListener('DOMContentLoaded', () => {
    const visualizer = new DataFlowVisualizer('visualizerCanvas');
    const structureType = document.getElementById('structureType');
    const dataInput = document.getElementById('dataInput');
    const visualizeBtn = document.getElementById('visualize');

    visualizeBtn.addEventListener('click', () => {
        const data = dataInput.value.split(',').map(item => item.trim());
        
        switch(structureType.value) {
            case 'array':
                visualizer.visualizeArray(data);
                break;
            case 'linkedList':
                visualizer.visualizeLinkedList(data);
                break;
            case 'tree':
                // To be implemented
                alert('Tree visualization coming soon!');
                break;
            case 'graph':
                // To be implemented
                alert('Graph visualization coming soon!');
                break;
        }
    });
}); 
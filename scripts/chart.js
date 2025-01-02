// Sample data constant
const SAMPLE_DATA = [
    { year: 2015, value: 2.4 },
    { year: 2016, value: 3.1 },
    { year: 2017, value: 4.2 },
    { year: 2018, value: 3.8 },
    { year: 2019, value: 2.9 },
    { year: 2020, value: 1.5 },
    { year: 2021, value: 5.2 },
    { year: 2022, value: 4.7 }
];

class BarChart {
    constructor(containerId) {
        this.container = d3.select(containerId);
        this.margin = { top: 40, right: 20, bottom: 50, left: 60 };
        this.width = this.container.node().getBoundingClientRect().width - this.margin.left - this.margin.right;
        this.height = this.container.node().getBoundingClientRect().height - this.margin.top - this.margin.bottom;
        
        this.setupSvg();
        this.setupScales();
        this.setupAxes();
        this.setupTooltip();
        
        // Add zoom behavior
        this.zoom = d3.zoom()
            .scaleExtent([1, 5])
            .on('zoom', (event) => this.handleZoom(event));
            
        this.svg.call(this.zoom);
    }

    setupSvg() {
        this.svg = this.container.append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
            .append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
    }

    setupScales() {
        this.xScale = d3.scaleBand()
            .range([0, this.width])
            .padding(0.1);

        this.yScale = d3.scaleLinear()
            .range([this.height, 0]);
    }

    setupAxes() {
        this.xAxis = this.svg.append('g')
            .attr('class', 'axis')
            .attr('transform', `translate(0,${this.height})`);

        this.yAxis = this.svg.append('g')
            .attr('class', 'axis');

        // Add X axis label
        this.svg.append('text')
            .attr('class', 'axis-label')
            .attr('x', this.width / 2)
            .attr('y', this.height + 40)
            .style('text-anchor', 'middle')
            .text('Year');

        // Add Y axis label
        this.svg.append('text')
            .attr('class', 'axis-label')
            .attr('transform', 'rotate(-90)')
            .attr('x', -this.height / 2)
            .attr('y', -40)
            .style('text-anchor', 'middle')
            .text('Growth Rate (%)');
    }

    setupTooltip() {
        this.tooltip = d3.select('.tooltip');
    }

    update(data) {
        // Update scales
        this.xScale.domain(data.map(d => d.year));
        this.yScale.domain([0, d3.max(data, d => d.value)]);

        // Update axes with current theme colors
        this.xAxis.call(d3.axisBottom(this.xScale))
            .selectAll('text')
            .attr('fill', 'currentColor');

        this.yAxis.call(d3.axisLeft(this.yScale))
            .selectAll('text')
            .attr('fill', 'currentColor');

        // Data binding
        const bars = this.svg.selectAll('.bar')
            .data(data);

        // Remove old bars
        bars.exit().remove();

        // Add new bars
        const newBars = bars.enter()
            .append('rect')
            .attr('class', 'bar');

        // Update all bars
        bars.merge(newBars)
            .transition()
            .duration(750)
            .attr('x', d => this.xScale(d.year))
            .attr('y', d => this.yScale(d.value))
            .attr('width', this.xScale.bandwidth())
            .attr('height', d => this.height - this.yScale(d.value));

        // Add hover interactions
        this.svg.selectAll('.bar')
            .on('mouseover', (event, d) => {
                this.tooltip
                    .style('opacity', 1)
                    .html(`
                        <div class="font-medium">Year: ${d.year}</div>
                        <div class="text-sm">Growth: ${d.value}%</div>
                    `)
                    .style('left', `${event.pageX + 10}px`)
                    .style('top', `${event.pageY - 10}px`);
            })
            .on('mouseout', () => {
                this.tooltip.style('opacity', 0);
            });

        // Update axis labels with current theme colors
        this.svg.selectAll('.axis-label')
            .attr('fill', 'currentColor');
    }

    resize() {
        // Update width and height based on container size
        this.width = this.container.node().getBoundingClientRect().width - this.margin.left - this.margin.right;
        this.height = this.container.node().getBoundingClientRect().height - this.margin.top - this.margin.bottom;

        // Update SVG size
        this.container.select('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom);

        // Update scales
        this.xScale.range([0, this.width]);
        this.yScale.range([this.height, 0]);

        // Update axes and labels
        this.xAxis
            .attr('transform', `translate(0,${this.height})`)
            .call(d3.axisBottom(this.xScale));

        this.yAxis.call(d3.axisLeft(this.yScale));

        // Update axis labels
        this.svg.select('.axis-label')
            .attr('x', this.width / 2)
            .attr('y', this.height + 40);

        // Update bars
        this.svg.selectAll('.bar')
            .attr('x', d => this.xScale(d.year))
            .attr('y', d => this.yScale(d.value))
            .attr('width', this.xScale.bandwidth())
            .attr('height', d => this.height - this.yScale(d.value));
    }

    // Add new method for handling zoom
    handleZoom(event) {
        const newX = event.transform.rescaleX(this.xScale);
        const newY = event.transform.rescaleY(this.yScale);
        
        this.xAxis.call(d3.axisBottom(newX));
        this.yAxis.call(d3.axisLeft(newY));
        
        this.svg.selectAll('.bar')
            .attr('x', d => newX(d.year))
            .attr('y', d => newY(d.value))
            .attr('height', d => this.height - newY(d.value));
    }

    // Add method for line chart
    drawLine(data) {
        const line = d3.line()
            .x(d => this.xScale(d.year))
            .y(d => this.yScale(d.value));

        this.svg.append('path')
            .datum(data)
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke', 'hsl(var(--primary))')
            .attr('stroke-width', 2)
            .attr('d', line);
    }

    // Add method for area chart
    drawArea(data) {
        const area = d3.area()
            .x(d => this.xScale(d.year))
            .y0(this.height)
            .y1(d => this.yScale(d.value));

        this.svg.append('path')
            .datum(data)
            .attr('class', 'area')
            .attr('fill', 'hsl(var(--primary))')
            .attr('opacity', 0.3)
            .attr('d', area);
    }

    // Update the visualization method to handle different chart types
    visualize(data, type = 'bar') {
        this.clear();
        
        // Update scales
        this.xScale.domain(data.map(d => d.year));
        this.yScale.domain([0, d3.max(data, d => d.value)]);

        // Update axes
        this.updateAxes();

        switch(type) {
            case 'line':
                this.drawLine(data);
                break;
            case 'area':
                this.drawArea(data);
                break;
            default:
                this.drawBars(data);
        }
    }

    // Add method to load CSV data
    static async loadCSV(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const csvData = d3.csvParse(event.target.result, d => ({
                    year: +d.year,
                    value: +d.value
                }));
                resolve(csvData);
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    // Add method to fetch API data
    static async fetchAPIData() {
        // Replace with your API endpoint
        const response = await fetch('https://api.example.com/data');
        const data = await response.json();
        return data.map(d => ({
            year: +d.year,
            value: +d.value
        }));
    }

    clear() {
        // Clear all paths and bars
        this.svg.selectAll('.bar, .line, .area').remove();
    }

    updateAxes() {
        this.xAxis.call(d3.axisBottom(this.xScale))
            .selectAll('text')
            .attr('fill', 'currentColor');

        this.yAxis.call(d3.axisLeft(this.yScale))
            .selectAll('text')
            .attr('fill', 'currentColor');
    }

    drawBars(data) {
        // Data binding
        const bars = this.svg.selectAll('.bar')
            .data(data);

        // Remove old bars
        bars.exit().remove();

        // Add new bars
        const newBars = bars.enter()
            .append('rect')
            .attr('class', 'bar');

        // Update all bars
        bars.merge(newBars)
            .transition()
            .duration(750)
            .attr('x', d => this.xScale(d.year))
            .attr('y', d => this.yScale(d.value))
            .attr('width', this.xScale.bandwidth())
            .attr('height', d => this.height - this.yScale(d.value));

        // Add hover interactions
        this.svg.selectAll('.bar')
            .on('mouseover', (event, d) => {
                this.tooltip
                    .style('opacity', 1)
                    .html(`
                        <div class="font-medium">Year: ${d.year}</div>
                        <div class="text-sm">Growth: ${d.value}%</div>
                    `)
                    .style('left', `${event.pageX + 10}px`)
                    .style('top', `${event.pageY - 10}px`);
            })
            .on('mouseout', () => {
                this.tooltip.style('opacity', 0);
            });
    }
}

// Update the initialization code
document.addEventListener('DOMContentLoaded', async () => {
    const chart = new BarChart('#chart-container');
    let currentData = [...SAMPLE_DATA]; // Create a copy of sample data

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        chart.visualize(currentData, document.getElementById('chartType').value);
    });

    // Event listeners for controls
    document.getElementById('chartType').addEventListener('change', (e) => {
        chart.visualize(currentData, e.target.value);
    });

    document.getElementById('dataSource').addEventListener('change', async (e) => {
        switch(e.target.value) {
            case 'csv':
                document.getElementById('csvFile').click();
                break;
            case 'api':
                try {
                    currentData = await BarChart.fetchAPIData();
                    chart.visualize(currentData, document.getElementById('chartType').value);
                } catch (error) {
                    console.error('Failed to fetch API data:', error);
                    // Fallback to sample data if API fails
                    currentData = SAMPLE_DATA;
                    chart.visualize(currentData, document.getElementById('chartType').value);
                    alert('Failed to fetch API data. Falling back to sample data.');
                }
                break;
            default:
                currentData = SAMPLE_DATA;
                chart.visualize(currentData, document.getElementById('chartType').value);
        }
    });

    document.getElementById('csvFile').addEventListener('change', async (e) => {
        if (e.target.files[0]) {
            try {
                currentData = await BarChart.loadCSV(e.target.files[0]);
                chart.visualize(currentData, document.getElementById('chartType').value);
            } catch (error) {
                console.error('Failed to load CSV:', error);
            }
        }
    });

    // Year range filter
    const updateYearRange = () => {
        const start = +document.getElementById('yearStart').value;
        const end = +document.getElementById('yearEnd').value;
        const filteredData = currentData.filter(d => d.year >= start && d.year <= end);
        chart.visualize(filteredData, document.getElementById('chartType').value);
    };

    document.getElementById('yearStart').addEventListener('change', updateYearRange);
    document.getElementById('yearEnd').addEventListener('change', updateYearRange);

    // Initialize with sample data
    chart.visualize(currentData, 'bar');

    // Make chart responsive
    window.addEventListener('resize', () => {
        chart.resize();
    });
}); 
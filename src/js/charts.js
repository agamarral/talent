function load_horizontal_barchart(container_id, data, domain) {

    // set the dimensions and margins of the graph
    const margin = {top: 20, right: 30, bottom: 40, left: 550};
    width = screen.width*0.7 - margin.left - margin.right;
    height = screen.height - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select(container_id)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);


    const tooltip = d3.select(container_id)
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background", "#fff")
        .style("color", "#69b3a2")
        .text("a simple tooltip");


    // Add X axis
    const x = d3.scaleLinear()
        .domain([0, domain])
        .range([ 0, width]);

    const xAxis = svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end")
        .style("font-size","12px");

    // Y axis
    const y = d3.scaleBand()
        .range([ 0, height ])
        .domain(data.map(d => d.name))
        .padding(.1);

    const yAxis =svg.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("font-size","12px")
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                .style("font-size","24px");
        })
        .on('mouseout', function (d, i) {
            d3.select(this).transition()
                .style("font-size","12px");
        });

    //Bars
    svg.selectAll("myRect")
        .data(data)
        .join("rect")
        .attr("x", x(0) )
        .attr("y", d => y(d.name))
        .attr("width", d => x(d.qty))
        .attr("height", y.bandwidth())
        .attr("fill", "#69b3a2")
        //Our new hover effects
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '.85');
            
            tooltip.transition()
                .text(this.__data__.qty)
                .style("visibility", "visible");
        })
        .on("mousemove", function(d, i){
            tooltip.style("top", (d.y-10)+"px")
            .style("left",(d.x+10)+"px");})

        .on('mouseout', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '1');

            tooltip.transition()
                .style("visibility", "hidden");
        });
}

function load_donut_chart(container_id, data) {

    // set the dimensions and margins of the graph
    const width = screen.width * .2;
    height = width;
    margin = 10;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width, height) / 2 - margin

    // append the svg object to the div called 'my_dataviz'
    const svg = d3.select(container_id)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width/2},${height/2})`);

    const tooltip = d3.select(container_id)
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background", "#fff")
        .style("color", "#69b3a2")
        .text("a simple tooltip");        

    // set the color scale
    const color = d3.scaleOrdinal()
        .domain(Object.keys(data))
        .range(d3.schemeDark2);

    // Compute the position of each group on the pie:
    const pie = d3.pie()
        .sort(null) // Do not sort group by size
        .value(d => d[1])
        const data_ready = pie(Object.entries(data))

    // The arc generator
    const arc = d3.arc()
        .innerRadius(radius * 0.4)         // This is the size of the donut hole
        .outerRadius(radius * 0.7)

    // Another arc that won't be drawn. Just for labels positioning
    const outerArc = d3.arc()
        .innerRadius(radius * 0.7)
        .outerRadius(radius * 0.7)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
        .selectAll('allSlices')
        .data(data_ready)
        .join('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data[1]))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
        //Our new hover effects
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '.85');
            
            tooltip.transition()
                .text(this.__data__.value)
                .style("visibility", "visible");
        })
        .on("mousemove", function(d, i){
            tooltip.style("top", (d.y-10)+"px")
            .style("left",(d.x+10)+"px");})

        .on('mouseout', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '1');

            tooltip.transition()
                .style("visibility", "hidden");
        });        

    // Add the polylines between chart and labels:
    svg
        .selectAll('allPolylines')
        .data(data_ready)
        .join('polyline')
        .attr("stroke", "black")
        .style("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .attr('points', function(d) {
        const posA = arc.centroid(d) // line insertion in the slice
        const posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
        const posC = outerArc.centroid(d); // Label position = almost the same as posB
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
        posC[0] = radius * 0.75 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
        return [posA, posB, posC]
        })

    // Add the polylines between chart and labels:
    svg
        .selectAll('allLabels')
        .data(data_ready)
        .join('text')
        .text(d => d.data[0])
        .style("font-size","20px")
        .attr("fill", "white")
        .attr('transform', function(d) {
            const pos = outerArc.centroid(d);
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            pos[0] = radius * 0.80 * (midangle < Math.PI ? 1 : -1);
            return `translate(${pos})`;
        })
        .style('text-anchor', function(d) {
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            return (midangle < Math.PI ? 'start' : 'end')
        })

}

function load_circular_barchart(container, data) {
    // set the dimensions and margins of the graph
    const margin = {top: 150, right: 150, bottom: 150, left: 150},
    width = screen.width*.7 - margin.left - margin.right,
    height = screen.height*.7 - margin.top - margin.bottom,
    innerRadius = 70,
    outerRadius = Math.min(width, height) / 3;   // the outerRadius goes from the middle of the SVG area to the border

    // append the svg object
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${width/2+margin.left}, ${height/2+margin.top})`);

    const tooltip = d3.select(container)
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background", "#fff")
        .style("color", "#a9203e")
        .text("a simple tooltip");           

    // Scales
    const x = d3.scaleBand()
        .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
        .align(0)                  // This does nothing
        .domain(data.map(d => d.name)); // The domain of the X axis is the list of states.
        const y = d3.scaleRadial()
        .range([innerRadius, outerRadius])   // Domain will be define later.
        .domain([0, 500]); // Domain of Y is from 0 to the max seen in the data

    // Add the bars
    svg.append("g")
        .selectAll("path")
        .data(data)
        .join("path")
        .attr("fill", "#ff8c00")
        .attr("d", d3.arc()     // imagine your doing a part of a donut plot
            .innerRadius(innerRadius)
            .outerRadius(d => y(d['qty']))
            .startAngle(d => x(d.name))
            .endAngle(d => x(d.name) + x.bandwidth())
            .padAngle(0.01)
            .padRadius(innerRadius))
        //Our new hover effects
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '.85');
            
            tooltip.transition()
                .text(this.__data__.qty)
                .style("visibility", "visible");
        })
        .on("mousemove", function(d, i){
            tooltip.style("top", (d.y-10)+"px")
            .style("left",(d.x+10)+"px");})

        .on('mouseout', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '1');

            tooltip.transition()
                .style("visibility", "hidden");
        });      

    // Add the labels
    svg.append("g")
        .selectAll("g")
        .data(data)
        .join("g")
            .attr("text-anchor", function(d) { return (x(d.name) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
            .attr("transform", function(d) { return "rotate(" + ((x(d.name) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d['qty'])+10) + ",0)"; })
        .append("text")
            .text(function(d){return(d.name)})
            .attr("transform", function(d) { return (x(d.name) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
            .style("font-size", "20px")
            .attr("fill", "white")
            .attr("alignment-baseline", "middle")
}
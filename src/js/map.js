class GeoMap {

    constructor( containerLabel) {


        // Set up the map container dimensions
        let margin = {top: 30, right: 30, bottom: 30, left: 30};

        let width = d3.select(containerLabel)
        .node()
        .getBoundingClientRect().width;

        let height = screen.height;
        let canvasWidth = width;
        let canvasHeight = height - margin.top - margin.bottom;

        // create the canvas
        this.canvas = d3.select(containerLabel)
        .append('canvas')
        .attr('width', canvasWidth)
        .attr('height', canvasHeight);

        // create the context
        this.context = this.canvas
        .node()
        .getContext('2d'); 
        //context.translate(0, 300);

        // the projection 
        this.projection = d3.geoEquirectangular()
        .scale(200)
        .translate([width / 2, height / 2]);

        // the geo generator
        this.geoGenerator = d3.geoPath()
        .projection(this.projection)
        .context(this.context);

        // the circleGenerator
        this.circleGenerator = 0;

        //the geojson data
        this.geojson = 0;
    }

    async loadMap( path2Geojson) {

        // Load GeoJSON data
        d3.json(path2Geojson)
        .then(data => {
            this.geojson = data;
            this.drawMap();
        });
        
    }
    async drawMap() {

        if (this.geojson != 0) {
            // Draw the map using the loaded GeoJSON data
            this.context.beginPath();
            this.geoGenerator({type: 'FeatureCollection', features: this.geojson.features});
            this.context.fillStyle = "#fff";
            this.context.fill();
            this.context.strokeStyle = "#eee";
            this.context.stroke();
            this.context.save();
        }
    }    
    drawCircle(centerCoord, radius ) {

        this.circleGenerator = d3.geoCircle()
        .center(centerCoord)
        .radius(radius);
        
        this.context.beginPath();
        this.context.strokeStyle = '#e9692c';
        this.context.lineWidth = 4;
        this.context.fillStyle =  "rgb(255,160,122, 0.5)";

        this.geoGenerator(this.circleGenerator());
        this.context.stroke();
        this.context.fill();
    }
    drawLine(initCoord, endCoord) {

    	this.context.beginPath();
        this.context.strokeStyle = 'red';
        this.geoGenerator({type: 'Feature', geometry: {type: 'LineString', coordinates: [initCoord, endCoord]}});
        this.context.stroke();
    }
    redrawMap() {
        this.context.reset();
        this.drawMap();
    }

}
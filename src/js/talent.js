
let stats = Object();

// Asynchronous JSON load
async function loadDataFromJSON(filepath) {
    let response = await fetch(filepath);
    let data = await response.json();
    return data;
}

// Fill the destinations panel

function writeDestination(dest, totalMoved) {

    div = document.getElementById("destinations");
    b = document.createElement("div");
    b.className = "roboto-regular fs-5";
    b.innerHTML = '<span class="numHighlight fs-1">' + totalMoved + '</span> dels graduats enquestats vivien ' + dest + '</span>';
    div.appendChild(b);
}
// wait for document ready
window.addEventListener('load', () => { 
    // init
    var controller = new ScrollMagic.Controller();

    // define movement of panels
    var wipeAnimation = new TimelineMax()
        .fromTo("section.panel.turqoise", 1, {y: "-100%"}, {y: "0%", ease: Linear.easeNone})  // in from top
        .fromTo("section.panel.map",      1, {y: "-100%"}, {y: "0%", ease: Linear.easeNone}) // in from top
        .fromTo("section.panel.green",    1, {y: "-100%"}, {y: "0%", ease: Linear.easeNone})  // in from right
        .fromTo("section.panel.stats",    1, {y:  "-100%"}, {y: "0%", ease: Linear.easeNone})  // in from right
        .fromTo("section.panel.bordeaux", 1, {y: "-100%"}, {y: "0%", ease: Linear.easeNone}) // in from top
        .fromTo("section.panel.grants",   1, {y:  "-100%"}, {y: "0%", ease: Linear.easeNone}); // in from top */
        
     // create scene to pin and link animation
     new ScrollMagic.Scene({
            triggerElement: "#pinContainer",
            triggerHook: "onLeave",
            duration: "600%"
        })
        .setPin("#pinContainer")
        .setTween(wipeAnimation)
        //.addIndicators() // add indicators (requires plugin)
        .addTo(controller);

    new ScrollMagic.Scene({
        triggerElement: "#trigg1",
        triggerHook: 0.9, // show, when scrolled 10% into view
        duration: "80%", // hide 10% before exiting view (80% + 10% from bottom)
        offset: 50 // move trigger to center of element
    })
    .setClassToggle("#section2_1", "fadeinout1") // add class to reveal
    .addTo(controller);

    new ScrollMagic.Scene({
        triggerElement: "#trigg1",
        triggerHook: 0.9, // show, when scrolled 10% into view
        duration: "80%", // hide 10% before exiting view (80% + 10% from bottom)
        offset: 50 // move trigger to center of element
    })
    .setClassToggle("#section2_2", "fadeinout2") // add class to reveal
    .addTo(controller);

    new ScrollMagic.Scene({
        triggerElement: "#trigg1",
        triggerHook: 0.9, // show, when scrolled 10% into view
        duration: "80%", // hide 10% before exiting view (80% + 10% from bottom)
        offset: 50 // move trigger to center of element
    })
    .setClassToggle("#section2_3", "fadein3") // add class to reveal
    .addTo(controller);

    new ScrollMagic.Scene({
        triggerElement: "#trigg2",
        triggerHook: 0.9, // show, when scrolled 10% into view
        duration: "80%", // hide 10% before exiting view (80% + 10% from bottom)
        offset: 50 // move trigger to center of element
    })
    .setClassToggle("#section3_1", "fadeinout1") // add class to reveal
    .addTo(controller);

    new ScrollMagic.Scene({
        triggerElement: "#trigg2",
        triggerHook: 0.9, // show, when scrolled 10% into view
        duration: "80%", // hide 10% before exiting view (80% + 10% from bottom)
        offset: 50 // move trigger to center of element
    })
    .setClassToggle("#section3_2", "fadeinout2") // add class to reveal
    .addTo(controller);

    new ScrollMagic.Scene({
        triggerElement: "#trigg2",
        triggerHook: 0.9, // show, when scrolled 10% into view
        duration: "80%", // hide 10% before exiting view (80% + 10% from bottom)
        offset: 50 // move trigger to center of element
    })
    .setClassToggle("#section3_3", "fadein3") // add class to reveal
    .addTo(controller);

    new ScrollMagic.Scene({
        triggerElement: "#trigg3",
        triggerHook: 0.9, // show, when scrolled 10% into view
        duration: "80%", // hide 10% before exiting view (80% + 10% from bottom)
        offset: 50 // move trigger to center of element
    })
    .setClassToggle("#section4_1", "fadein1") // add class to reveal
    .addTo(controller);
});


geoZone = document.getElementById('countrySelect');
geoZone.addEventListener('change', (e) => {
    maxRadius = 10;
    maxMoved = Math.max( ...Object.values(stats.moved_x_zones) );
    zone = geoZone.options[geoZone.selectedIndex].value;
    
    // reset all controls
    div = document.getElementById("destinations");
    div.innerHTML = '';
    // redraw the map
    geoMap.redrawMap();

    if (zone == 'All') {
        writeDestination(" fora de l'estat espanyol", stats.total_moved);
    }

    if (zone == 'All' || zone == "UK") {
        totalMoved = stats.moved_x_zones["UK"];
        radius = maxRadius * totalMoved / maxMoved;
        geoMap.drawCircle([-2, 53.5074], radius);
        writeDestination("al Regne Unit", totalMoved);
    }
    if (zone == 'All' || zone == "UE") {
        totalMoved = stats.moved_x_zones["UE"];
        radius = maxRadius * totalMoved / maxMoved;
        geoMap.drawCircle([25, 59.5074], radius);
        writeDestination("a d'altres estats de la UE", totalMoved);
    }
    if (zone == 'All' || zone == "NDAM") {
        totalMoved = stats.moved_x_zones["NDAM"];
        radius = maxRadius * totalMoved / maxMoved;
        geoMap.drawCircle([-110, 53.5074], radius);
        writeDestination("a Nordamèrica", totalMoved);
    }
    if (zone == 'All' || zone == "FR") {
        totalMoved = stats.moved_x_zones["FR"];
        radius = maxRadius * totalMoved / maxMoved;
        geoMap.drawCircle([2, 47.5074], radius);
        writeDestination("a França", totalMoved); 
    }
    if (zone == 'All' || zone == "SDAM") {
        totalMoved = stats.moved_x_zones["SDAM"];
        radius = maxRadius * totalMoved / maxMoved;
        geoMap.drawCircle([-70, 0], radius);
        writeDestination("a Sudamèrica o Centreamèrica", totalMoved);      
    }
    if (zone == 'All' || zone == "GER") {
        totalMoved = stats.moved_x_zones["GER"];
        radius = maxRadius * totalMoved / maxMoved;
        geoMap.drawCircle([8, 51.5074], radius);
        writeDestination("a Alemanya", totalMoved);       
    }
    if (zone == 'All' || zone == "EXT_UE") {
        totalMoved = stats.moved_x_zones["EXT_UE"];
        radius = maxRadius * totalMoved / maxMoved;
        geoMap.drawCircle([28, 50.5074], radius);
        writeDestination("a d'altres estats d'Europa no UE", totalMoved);     
    }    
    if (zone == 'All' || zone == "AS") {
        totalMoved = stats.moved_x_zones["AS"];
        radius = maxRadius * totalMoved / maxMoved;
        geoMap.drawCircle([80, 43.5074], radius);
        writeDestination("a Àsia", totalMoved);       
    } 
    if (zone == 'All' || zone == "OC") {
        totalMoved = stats.moved_x_zones["OC"];
        radius = maxRadius * totalMoved / maxMoved;
        geoMap.drawCircle([130, -25.5074], radius);
        writeDestination("a Oceania", totalMoved);       
    } 
    if (zone == 'All' || zone == "AF") {
        totalMoved = stats.moved_x_zones["AF"];
        radius = maxRadius * totalMoved / maxMoved;
        geoMap.drawCircle([15, 25], radius);
        writeDestination("a Àfrica", totalMoved);     
    }
    
});


// draw the map
let geoMap = new GeoMap('#map-container');
geoMap.loadMap("assets/data/all.geojson");

// draw the stats
loadDataFromJSON('assets/data/graduates_mobility.json').then((gd) => {
    stats = JSON.parse(gd);

    titus = Array();
    Object.keys(stats.titus).map( (key) => {
        titu = Object();
        titu['name'] = key;
        titu['qty'] = stats.titus[key];
        titus.push(titu);
    });
    load_horizontal_barchart("#titu_chart", titus, 400);

    ambits = Array();
    Object.keys(stats.ambits).map( (key) => {
        ambit = Object();
        ambit['name'] = key;
        ambit['qty'] = stats.ambits[key];
        ambits.push(ambit);
    });
    load_horizontal_barchart("#ambit_chart", ambits, 500);


    load_donut_chart("#gender_chart", stats.genders);
    load_donut_chart("#age_chart", stats.ages);

    grants = Array();
    Object.keys(stats.grants).map ((key) => {
        grant = Object();
        grant['name'] = key;
        grant['qty'] = stats.grants[key];
        grants.push(grant);
    });
    load_circular_barchart("#grants_chart", grants);

});

last_viz = "ambit";

// control select list for studies visibility
titu_viz = document.getElementById('vizSelect');
titu_viz.addEventListener('change', (e) => {
    viz = titu_viz.options[titu_viz.selectedIndex].value;
    if (viz != last_viz) {
        // toggle between titus and ambit
        titu_el = document.getElementById('titu_cont')
        titu_el.classList.toggle("d-none");

        ambit_el = document.getElementById('ambit_cont')
        ambit_el.classList.toggle("d-none");

        last_viz = viz;
    }
});
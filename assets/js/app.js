
var svgWidth = 980;
var svgHeight = 600;

var margin = {
    top: 20,
    right: 20,
    bottom: 50,
    left: 50
  };

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;
console.log(width)
// create svg wraper
var svg = d3.select(".chart")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width",svgWidth);

var chartGroup  = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);;



// read in csv
d3.csv("assets/data/data.csv").then(function(healthDate,err) {
    console.log(healthDate);
    if (err) throw err;
    // change data type
    healthDate.forEach(data=>{
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    // create x y axis scale
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthDate, d => d["poverty"] * 0.8),
                d3.max(healthDate, d => d["poverty"] * 1.2)
        ])
        .range([0,width]);

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthDate, d => d["healthcare"] * 0.8),
        d3.max(healthDate, d => d["healthcare"] * 1.2)
        ])
        .range([height,0]);
    
    // create axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftaxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
        .classed("x-axis",true)
        .attr("transform",`translate(0,${height})`)
        .call(bottomAxis);

    var yAxis = chartGroup.append("g")
        .classed("y-axis",true)
        //.attr("transform",`translate(20,0)`)
        .call(leftaxis)
    
    //create circle
    var circleGroup = chartGroup.selectAll("circle")
        .data(healthDate)
        .enter()
        .append("circle")
        .attr("class",d=>d.abbr)
        .attr("cx",d=>xLinearScale(d.poverty))
        .attr("cy",d=>yLinearScale(d.healthcare))
        .attr("r",15)
        .attr("fill","pink")
        .attr("opacity","0.5")

    // add state text in circle
    var textGroup = chartGroup.selectAll(".text")
        .data(healthDate)
        .join("text")
        .classed("text",true)
        .attr("x",d=>xLinearScale(d["poverty"]))
        .attr("y",d=>yLinearScale(d["healthcare"]))
        .attr("text-anchor", "middle")
        .attr("font-size","10px")
        .text(d=>d.abbr)

    /****************************************  create axis label *****************************************/ 
    // x label
    var xLabelGroup = chartGroup.append("g")
    var povertyLabel = xLabelGroup.append("text")
        .attr("x", `${width / 2}`)
        .attr("y", `${height + 40}`)
        .attr("value", "poverty_percent") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty(%)");
    
    // y label
    var ylabelGroup = chartGroup.append("g")
    var healthcareLabel = ylabelGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height / 2))
        .attr("y", 0 - margin.left+20)
        .attr("value", "healthcare_percent") // value to grab for event listener
        .classed("active", true)
        .text("Lacks Healthcare(%)");


    /****************************************  create tool tip *****************************************/ 
    // 1: initialize tooltip
    // 2: create tooltip in chartgroup
    // 3: create mouseover and mouseout event
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
          return (`<strong>${d.state}</strong><br>
                  Poverty:${d.poverty}%<br>
                  Healthcare:${d.healthcare}%`);
        });
    
    chartGroup.call(toolTip);

    circleGroup.on("mouseover",function(d){
        toolTip.show(d, this);
    }).on("mouseout", function(d){
        toolTip.hide(d)
    }); 
    

    console.log(healthDate.map(d=>d.abbr))


    
});
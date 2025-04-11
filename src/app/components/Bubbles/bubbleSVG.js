import * as d3 from 'd3';

export const createBubbles = (svg, data) => {
    const bubbles = svg
      .selectAll('g')
      .data(data, d => d.id)
      .enter()
      .append('g')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    // Create a clip path to make the circle
    // bubbles.append("defs")
    // .append("clipPath")
    // .attr("id", d => `circleClip-${d.x}`)
    // .append("circle")
    // .attr("r", d => d.radius)
    // .attr('transform', d => `translate(${-(d.radius * 0.255)},${-(d.radius * 0.18)})`);

    // Create a shadow filter to add a 3D shadow effect
    const filter = svg.append("defs")
    .append("filter")
    .attr("id", "shadow")
    .attr("x", "-50%")
    .attr("y", "-50%")
    .attr("width", "200%")
    .attr("height", "200%");

    filter.append("feDropShadow")
    .attr("dx", 3)  // Horizontal offset
    .attr("dy", 2)  // Vertical offset
    .attr("stdDeviation", 3)
    .attr("flood-color", "#bdbdbd");  // Set shadow color to light grey;  // Blur radius

    // Add a 3D gradient border
    const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "gradientBorder")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%");

    gradient.append("stop")
      .attr("offset", "50%")
      .attr("stop-color", "#ffffff")
      .attr("stop-opacity", 1);
    
    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#000000")
      .attr("stop-opacity", 0.8);

    bubbles.append('circle')
      .attr('r', d => d.radius)
      .attr('fill', 'white')
      .attr("stroke", "url(#gradientBorder)")
      .attr("stroke-width", 0.5)
      .style("filter", "url(#shadow)");

      // Add the background image inside each bubble (circle)
    bubbles.append('image')
    .attr("id", "bubble-image")
    .attr("x", d => -d.radius)  // Horizontal position: 20px from left edge
    .attr("y", d => -d.radius)  // Vertical position: 20px from top edge
      .attr('width', d => d.radius * 1.5) // 1.5
      .attr('height', d => d.radius * 1.5) // 1.5
      .attr('xlink:href', d => d.logo)
      // .attr('preserveAspectRatio', 'xMidYMid slice')
      // .attr("clip-path", d => "url(#circleClip-" + d.x + ")")
      .attr('transform', d => `translate(${d.radius * 0.255},${d.radius * 0.18})`)
      .style('border-radius', '50%');  // Round the corners

    // Add hover action to change the color and show text
    bubbles
    .on("mouseover", function (event, d) {
      d3.select(this).select("#bubble-image")
        .attr("cursor", "pointer")
        .attr("opacity", 0.3); // Change circle color to grey

      d3.select(this).append("text")
        .attr("id", "hover-text")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .attr("dy", 5) // Adjust the vertical position
        .style("font-size", d => d.radius / 3 + "px")
        .style("fill", "black")
        .text("Menu"); // Display "Test"
    })
    .on("mouseout", function () {
      d3.select(this).select("#bubble-image")
        .attr("opacity", 1); // Reset color back to steelblue

      d3.select(this).selectAll("#hover-text").remove(); // Remove the text when mouse leaves
    });

  return bubbles;
};

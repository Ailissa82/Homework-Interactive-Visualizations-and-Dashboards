function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata/${sample}`;
  d3.json(url).then(function (response) {

    // Use d3 to select the panel with id of `#sample-metadata`
    var meta_data = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    meta_data.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(response).forEach(([key, value]) => {
      var row = meta_data.append('p');
      row.text(`${key}: ${value}`);
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
    });
  });
}
// BONUS: Build the Gauge Chart
// buildGauge(data.WFREQ);


function buildCharts(sample) {
  var url = `/samples/${sample}`;

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(url).then(function (response) {
    var s_x = response.otu_ids;
    var s_y = response.sample_values;
    var s_text = response.otu_labels;

    // @TODO: Build a Bubble Chart using the sample data
    var trace = {
      x: s_x,
      y: s_y,
      mode: "markers",
      marker: {
        size: s_y,
        color: s_x,
        color_scale: "rainbow"
      },
      text: s_text,

    };
    var data = [trace];
    var layout = {
      title: "<b>Sample Sizes</b>",
      showlegend: false,
      autosize: true
    };
    Plotly.newPlot("bubble", data, layout, {
      scrollZoom: true
    });
  });
    d3.json(url).then(function (response) {
    var pie_x = response.otu_ids.slice(0, 10);
    var pie_y = response.sample_values.slice(0, 10);
    var pie_text = response.otu_labels.slice(0, 10);
// console.log(pie_y);
    var pieTrace = {
      values: pie_y,
      labels: pie_x,
      type: "pie",
      // text: pie_text,
    };

    var pieLayout = {
      title: "<b>Top 10 Samples</b>",
      yaxis: { autorange: true },
      // margin: { l: 10, r: 10, b: 10, t: 10, pad: 4 }
    };

  Plotly.newPlot("pie", [pieTrace], pieLayout);
  });
}




  function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });

      // Use the first sample from the list to build the initial plots
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }

  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }

  // Initialize the dashboard
  init();
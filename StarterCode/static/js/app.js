function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
 
  init();
  
  function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
    
  }
  
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }

  function buildCharts(sample) {
 
    d3.json("samples.json").then((data) => {
     
      console.log(data);
        var samplesArray = data.samples;
        console.log(samplesArray);
       
        var selectedIdSamples = samplesArray.filter(data => data.id == sample);
        console.log(selectedIdSamples);
       
        var firstSample = selectedIdSamples[0];
        console.log(firstSample);
  
        var otuIds = firstSample.otu_ids;
        var otuLabels = firstSample.otu_labels;
        var sampleValues = firstSample.sample_values;
        console.log(otuIds);
        console.log(otuLabels);
        console.log(sampleValues);
    
        var yticks = otuIds.slice(0,10).map(id => "OTU " + id).reverse();
        console.log(yticks);
        
        var barData = [{
          x: sampleValues.slice(0,10).reverse(),
          text: otuLabels.slice(0,10).reverse(),
          type: "bar"
        }];
    
        var barLayout = {
          title: "Top 10 Bacteria Cultures Found",
          yaxis: {
            tickmode: "array",
            tickvals: [0,1,2,3,4,5,6,7,8,9],
            ticktext: yticks
          },
          annotations: [{
            xref: 'paper',
            yref: 'paper',
            x: 0.5,
            xanchor: 'center',
            y: -0.25,
            yanchor: 'center',
            text: 'The bar chart displays the top 10 bacterial species (OTUs)<br>with the number of samples found in your belly button',
            showarrow: false
          }]
        };
  
        Plotly.newPlot("bar", barData, barLayout, {responsive: true});
    
        var bubbleData = [{
          x: otuIds,
          y: sampleValues,
          text: otuLabels,
          mode: 'markers',
          marker: {
            size: sampleValues,
            color: otuIds,
            colorscale: "Earth"
          }
        }];
      
        var bubbleLayout = {
          title: 'Bacteria Cultures Per Sample',
          showlegend: false,
          xaxis: {title: "OTU ID", automargin: true},
          yaxis: {automargin: true},
          hovermode: "closest"
        };
        console.log(bubbleLayout);
    
        Plotly.newPlot("bubble", bubbleData, bubbleLayout, {responsive: true});
    
        var metadata_SelId = data.metadata.filter(data => data.id == sample);
        console.log(metadata_SelId);  
    
        var washFreq = +metadata_SelId[0].wfreq;
        var gaugeData = [
          {
            domain: { x: [0, 1], y: [0, 1] },
            value: washFreq,
            type: "indicator"
          },
          {
            values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
            rotation: 90,
            text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
            textinfo: "text",
            textposition: "inside",
            marker: {
              colors: [
                "rgba(0, 105, 11, .5)",
                "rgba(10, 120, 22, .5)",
                "rgba(14, 127, 0, .5)",
                "rgba(110, 154, 22, .5)",
                "rgba(170, 202, 42, .5)",
                "rgba(202, 209, 95, .5)",
                "rgba(210, 206, 145, .5)",
                "rgba(232, 226, 202, .5)",
                "rgba(240, 230, 215, .5)",
                "rgba(255, 255, 255, 0)"
              ]
            },
            labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
            hoverinfo: "label",
            hole: 0.5,
            type: "pie",
            showlegend: false
          }
        ];
        
        var gaugeLayout = { 
            height: 600,
            width: 600,
            title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per week"}
        };
    
        Plotly.newPlot("gauge", gaugeData, gaugeLayout, {responsive: true});
      });
    }

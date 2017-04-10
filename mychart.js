function csv2Array(str) {
  var csvData = [];
  var lines = str.split("\n");
  for (var i = 0; i < lines.length; ++i) {
    var cells = lines[i].split(",");
    csvData.push(cells);
  }
  return csvData;
}

function convertData(source) {
  var data = [];
  var max = 1;
  var buf = {};
  for (var row in source) {
    y = String(parseInt(parseFloat(source[row][1])*2.0 + 0.5))*0.5;
    x = String(parseInt(parseFloat(source[row][2])*2.0 + 0.5))*0.5;
    if ( buf[x] == undefined ){
      buf[x] = {};
      buf[x][y] = 1;
    } else if ( buf[x][y] == undefined ){
      buf[x][y] = 1;
    }else{ buf[x][y] ++; }

    if ( buf[x][y] > max ){ max = buf[x][y]; }
  };

  for (var i in buf) {
    for (var j in buf[i]) {
      if ( buf[i][j] < max*0.1 ){ buf[i][j] = undefined; continue; }
      data.push( { x:i, y:j, r:20*buf[i][j]/max } );
    }
  }
  return data;
}

function readyChart() {
  var data = [];
  for( var i=0; i<datasets.length; i++ ){
    data.push({});
    datasets[i].data = data[i];
  }

  var ctx = document.getElementById("myChart").getContext("2d");
  var myChart = new Chart(ctx, {
    type: 'bubble',
    data: {
      datasets: datasets
    },
    options: {
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: '室温 [℃]'
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: '湿度 [%]'
          }
        }]
      }
    }
  });

  return myChart;
}

function main() {

  var myChart = readyChart();

  updateChart(filePath, myChart,0);

  setInterval(updateChart(filePath,myChart),60000);
}


function updateChart(filePath, myChart, idx) {

  if ( idx == undefined ) { return; }
  if ( idx >= filePath.length ){ return; }
  var req = new XMLHttpRequest();
  req.open("GET", filePath[idx], true);
  req.onload = function() {
    var data = convertData(csv2Array(req.responseText));
    myChart.data.datasets[idx].data = data;
    myChart.update();
    updateChart(filePath, myChart, idx+1);
  }
  req.send(null);
}

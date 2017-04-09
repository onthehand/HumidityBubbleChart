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
    x = String(parseInt(parseFloat(source[row][1]) + 0.5));
    y = String(parseInt(parseFloat(source[row][2]) + 0.5));
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
      data.push( { x:i, y:j, r:20*buf[i][j]/max } );
    }
  }
  return data;
}

function readyChart() {
  var data = [{},{},{},{},{},{}] ;

  var ctx = document.getElementById("myChart").getContext("2d");
  var myChart = new Chart(ctx, {
    type: 'bubble',
    data: {
      datasets: [
        {
          label: "リビング",
          data: data[0],
          borderColor: '#FF0000',
          borderWidth: 3,
          showLine: true
        },
        {
          label: "寝室",
          data: data[1],
          borderColor: '#00FFFF',
          borderWidth: 3,
          showLine: true
        },
        {
          label: "子供部屋",
          data: data[2],
          borderColor: '#FF00FF',
          borderWidth: 3,
          showLine: true
        },
        {
          label: "洗面所",
          data: data[3],
          borderColor: '#0000FF',
          borderWidth: 3,
          showLine: true
        },
        {
          label: "苔培養棚",
          data: data[4],
          borderColor: '#00FF00',
          borderWidth: 3,
          showLine: true
        },
        {
          label: "洗面所収納",
          data: data[5],
          borderColor: '#666666',
          borderWidth: 3,
          showLine: true
        }


      ]
    },
    options: {
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: '湿度 [%]'
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: '室温 [℃]'
          }
        }]
      }
    }
  });

  return myChart;
}

function main() {

  var filePath = [
  	'./data/log_1.txt?'+new Date().getTime(),
  	'./data/log_2.txt?'+new Date().getTime(),
  	'./data/log_3.txt?'+new Date().getTime(),
  	'./data/log_4.txt?'+new Date().getTime(),
  	'./data/log_5.txt?'+new Date().getTime(),
  	'./data/log_6.txt?'+new Date().getTime()
	];

  var myChart = readyChart();

  updateChart(filePath, myChart,0);

  setInterval(updateChart(filePath,myChart),60000);
}


function updateChart(filePath, myChart, idx) {

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

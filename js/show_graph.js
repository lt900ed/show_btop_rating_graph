function add_graph(ctx, is_ground, val) {
  if (window.myChart) {
    window.myChart.destroy();
  }

  var border_color = "rgba(255, 255, 255)"
  if(is_ground) {
    border_color = "rgba(252, 183, 20)"
  } else {
    border_color = "rgba(112, 176, 224)"
  }

  var label_num = [...Array(val.length).keys()];
  var zeros = [...Array(val.length).fill(0)];
  window.myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: label_num,
      datasets: [
        {
          label: 'rating',
          data: val,
          borderColor: border_color,
          backgroundColor: "rgba(0,0,0,0)",
          borderWidth: 6
        },
        {
          label: 'zero line',
          data: zeros,
          borderColor: "rgba(255,255,255,0.8)",
          backgroundColor: "rgba(0,0,0,0)",
          borderDash: [5, 5],
          pointRadius: 0
        }
      ],
    },
    options: {
      title: {
        display: false
      },
      scales: {
        x: {
          display: false
        },
        y: {
          display: true,
          // min: 0,            // 最小値
          // max: 25,           // 最大値
          ticks: {
            color: "rgba(255, 255, 255 ,1)",
            font: {
              size: 20
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });

  return myLineChart;
}

function step_by_step(ctx, is_ground) {
  window.val.push(window.val[window.val.length - 1] + 1)
  add_graph(ctx, is_ground, window.val);
}

function regularly_update(ctx, is_ground) {
  window.val.push(window.val[window.val.length - 1] + 1)
  add_graph(ctx, is_ground, window.val);
}

function get_csv_data(dataPath, ctx, is_ground) {
  $.ajax({
    url: dataPath,
    type: 'GET',
    dataType: 'text',
    timeout: 5000,
    success:function(res) {
      var arr = csv2array(res);
      var today_balance_arr = get_today_val(arr);
      var today_balance_score = today_balance_arr[today_balance_arr.length - 1]
      var now_rating_score = arr[arr.length - 1][1]
      if (JSON.stringify(window.display_arr) != JSON.stringify(today_balance_arr)) {
        window.display_arr = today_balance_arr;
        add_graph(ctx, is_ground, window.display_arr);
        change_score(today_balance_score, now_rating_score);
      }
    },
    error:function() {
      alert("ロード失敗");
    }
  });
}

function change_score(today_balance_score, now_rating_score) {
  var cd = '';
  if (today_balance_score > 0) {
    cd = '+';
    $('#today-balance-score').addClass('plus-clr');
    $('#now-rating-score').addClass('plus-clr');
    $('#now-rating-desc').addClass('plus-clr');
    $('#today-balance-score').removeClass('minus-clr');
    $('#now-rating-score').removeClass('minus-clr');
    $('#now-rating-desc').removeClass('minus-clr');
  } else if (today_balance_score < 0) {
    cd = '';
    $('#today-balance-score').removeClass('plus-clr');
    $('#now-rating-score').removeClass('plus-clr');
    $('#now-rating-desc').removeClass('plus-clr');
    $('#today-balance-score').addClass('minus-clr');
    $('#now-rating-score').addClass('minus-clr');
    $('#now-rating-desc').addClass('minus-clr');
  } else {
    cd = '±';
    $('#today-balance-score').removeClass('plus-clr');
    $('#now-rating-score').removeClass('plus-clr');
    $('#now-rating-desc').removeClass('plus-clr');
    $('#today-balance-score').removeClass('minus-clr');
    $('#now-rating-score').removeClass('minus-clr');
    $('#now-rating-desc').removeClass('minus-clr');
  }
  $('#today-balance-score').text(cd + today_balance_score);

  var rate_desc = '';
  var rate_descs = [
    [2700, 'S-'],
    [2400, 'A+'],
    [2100, 'A'],
    [1950, 'A-'],
    [1875, 'B+'],
    [1800, 'B'],
    [1750, 'B-'],
    [1700, 'C+'],
    [1650, 'C'],
    [1600, 'C-'],
    [1550, 'D+'],
    [1525, 'D'],
    [1450, 'D-']
  ]
  for (let i = 0; i < rate_descs.length; i++) {
    if (rate_descs[i][0] <= now_rating_score) {
      rate_desc = rate_descs[i][1]
      break;
    }
  }
  $('#now-rating-score').text(now_rating_score);
  $('#now-rating-desc').text(rate_desc);
}

function get_today_val(arr) {
  var index = 0
  arr.forEach(function(row, i) {
    if (row[2] == 1) {
      index = i
    }
  });
  var today_arr = arr.slice(index);
  var today_balance_arr = today_arr.map((i) => {return i[1] - today_arr[0][1]})
  return today_balance_arr
}

function csv2array(data) {
  const dataArray = [];
  const dataString = data.split('\r\n');
  var tmp_arr;
  for (let i = 1; i < dataString.length; i++) {
    tmp_arr = dataString[i].split(',');
    if (tmp_arr.length == 3) {
      dataArray[i - 1] = tmp_arr;
    }
  }
  return dataArray;
}

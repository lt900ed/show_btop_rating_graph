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
  var vw = $(window).width()
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
          borderWidth: Math.floor(vw / 50),
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
              size: Math.floor(vw / 20)
            }
          }
        }
      },
      elements: {
        point: {
          radius: Math.floor(vw / 90),
          backgroundColor: border_color
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
  var btop_today = get_btop_date(new Date())
  arr.forEach(function(row, i) {
    if (str2date_hmiymd(row[0]) < btop_today) {
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

function get_btop_date(date) {
  date_start = date
  if (date.getHours() < 5) {
    date_start.setDate(date.getDate() - 1)
  }
  return new Date(date_start.getFullYear(), date_start.getMonth(), date_start.getDate(), 5, 0, 0)
}

function str2date_hmiymd(txt) {
  i_colon = txt.indexOf(':')
  i_space = txt.indexOf(' ')
  i_slash_1 = txt.indexOf('/')
  i_slash_2 = txt.indexOf('/', i_slash_1 + 1)
  hour = Number(txt.substr(0, i_colon))
  minute = Number(txt.substr(i_colon + 1, i_space - i_colon - 1))
  year = Number(txt.substr(i_space + 1, i_slash_1 - i_space - 1))
  month = Number(txt.substr(i_slash_1 + 1, i_slash_2 - i_slash_1 - 1))
  day = Number(txt.substr(i_slash_2 + 1))
  return new Date(year, month - 1, day, hour, minute, 0)
}
let chartInstance = null;

const centerTextPlugin = {
  id: 'centerText',
  beforeDraw: (chart) => {
    const { ctx, width, height } = chart;
    ctx.restore();
    
    // Draw Score
    const scoreStr = chart.config.data.datasets[0].data[0].toString();
    const scoreColor = chart.config.data.datasets[0].backgroundColor[0];
    
    // Calculate font size relative to height
    const fontSizeScore = (height / 3.5).toFixed(2);
    ctx.font = `${fontSizeScore}px "Bebas Neue", sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = scoreColor;
    
    const textXScore = Math.round((width - ctx.measureText(scoreStr).width) / 2);
    // Move up slightly because we only draw 270 deg (bottom is empty)
    const textYScore = height / 2;
    
    ctx.fillText(scoreStr, textXScore, textYScore);
    
    // Draw Label
    const labelStr = 'CREDIBILITY';
    const fontSizeLabel = (height / 15).toFixed(2);
    ctx.font = `${fontSizeLabel}px "DM Mono", monospace`;
    ctx.fillStyle = '#4a4846'; // muted color
    
    const textXLabel = Math.round((width - ctx.measureText(labelStr).width) / 2);
    const textYLabel = textYScore + parseInt(fontSizeScore) / 2 + 5;
    
    ctx.fillText(labelStr, textXLabel, textYLabel);
    
    ctx.save();
  }
};

function initChart(score, verdictColor) {
  const container = document.getElementById('chart-container');
  if (container) {
    container.style.maxWidth = '280px';
    container.style.margin = '0 auto';
  }
  
  const ctx = document.getElementById('credibility-chart').getContext('2d');
  
  if (chartInstance) {
    chartInstance.destroy();
  }
  
  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [score, 100 - score],
        backgroundColor: [verdictColor, '#1e1e1e'],
        borderWidth: 0
      }]
    },
    options: {
      cutout: '78%',
      circumference: 270,
      rotation: 135,
      animation: {
        animateRotate: true,
        duration: 1500
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: false
        }
      }
    },
    plugins: [centerTextPlugin]
  });
}

function updateChart(score, verdictColor) {
  initChart(score, verdictColor);
}

window.TruthLensChart = {
  initChart,
  updateChart
};

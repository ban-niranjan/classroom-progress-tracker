import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './ProgressCharts.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function ProgressCharts({ stats, studentProgress }) {
  // Chart 1: Checkpoint Completion Rates
  const checkpointChartData = {
    labels: stats?.map(stat => stat.checkpointTitle) || [],
    datasets: [
      {
        label: 'Completion Rate (%)',
        data: stats?.map(stat => parseFloat(stat.percentage)) || [],
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 1,
      },
    ],
  };

  const checkpointChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Checkpoint Completion Rates',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.parsed.y.toFixed(2)}% completed`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      },
    },
  };

  // Chart 2: Student Progress Comparison
  const studentChartData = {
    labels: studentProgress?.map(sp => sp.studentName) || [],
    datasets: [
      {
        label: 'Checkpoints Completed',
        data: studentProgress?.map(sp => sp.completedCheckpoints) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const studentChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Student Progress Comparison',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const student = studentProgress[context.dataIndex];
            return [
              `Completed: ${context.parsed.y}/${student.totalCheckpoints}`,
              `Progress: ${student.percentage}%`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      },
    },
  };

  return (
    <div className="progress-charts">
      <div className="chart-container">
        <Bar data={checkpointChartData} options={checkpointChartOptions} />
      </div>
      <div className="chart-container">
        <Bar data={studentChartData} options={studentChartOptions} />
      </div>
    </div>
  );
}

export default ProgressCharts;
import React, { useContext, useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { SidebarContext } from '../contexts/SidebarContext';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';

const Dashboard = () => {

  const colors = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A', '#26a69a', '#D10CE8'];

  console.log(process.env.REACT_APP_API_URL, "this is ")


  const [totalPatients, setTotalPatients] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalTests, setTotalTests] = useState(0);
  const [majorTests, setMajorTests] = useState(0);
  const [patientsTest, setPatientsTest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { isSidebarOpen } = useContext(SidebarContext);

  //for Laboratory Total Revenue Trend 

  const [selectedRange, setSelectedRange] = useState('monthly');

  const [selectedRange2, setSelectedRange2] = useState('monthly');// 'monthly' by default


  // For all records on top

  useEffect(() => {
    // Fetch total number of tests
    fetch(`${process.env.REACT_APP_API_URL}/api/tests/all-tests`)
      .then(res => res.json())
      .then(data => {
        setTotalTests(data.length); // Assuming the response is an array of tests
      })
      .catch(err => console.error('Error fetching total tests:', err));

    // Fetch total number of patients
    fetch(`${process.env.REACT_APP_API_URL}/api/patients/all-patients`)
      .then(res => res.json())
      .then(data => {
        setTotalPatients(data.length); // Assuming the response is an array of patients
      })
      .catch(err => console.error('Error fetching total patients:', err));

    fetch(`${process.env.REACT_APP_API_URL}/api/patients/all-patients-tests`)
      .then(res => res.json())
      .then(data => {
        console.log('API Data:', data); // Debug: Check if the API data is as expected

        setMajorTests(data.length); // Assuming the response is an array of major test requests

        const total = data.reduce((acc, item) => {
          const price = Number(item.price) || 0;
          return acc + price;
        }, 0);

        console.log('Total Revenue:', total); // Debug: Check if total is calculated correctly

        setTotalRevenue(total); // Ensure it's updating the state
      })
      .catch(err => console.error('Error fetching major tests:', err));

  }, []); // Empty dependency array ensures this runs once on component mount



  // const [RangeColumnChart, setRangeColumnChart] = useState({
  //   series: [{
  //     // name: "Incress",
  //     name: "Patient",
  //     data: [
  //       {
  //         x: 'Jan',
  //         y: [1, 9]
  //       },
  //       {
  //         x: 'Feb',
  //         y: [1, 9]
  //       },
  //       {
  //         x: 'Mar',
  //         y: [1, 9]
  //       }, {
  //         x: 'April',
  //         y: [9, 12]
  //       }, {
  //         x: 'May',
  //         y: [10, 12]
  //       }, {
  //         x: 'Jun',
  //         y: [3, 11]
  //       },
  //       {
  //         x: 'Jul',
  //         y: [3, 4]
  //       },
  //       {
  //         x: 'Aug',
  //         y: [8, 11]
  //       },
  //       {
  //         x: 'Sep',
  //         y: [3, 11]
  //       }
  //       ,
  //       {
  //         x: 'Oct',
  //         y: [5, 11]
  //       }
  //       ,
  //       {
  //         x: 'Nov',
  //         y: [3, 8]
  //       },
  //       {
  //         x: 'Dec',
  //         y: [3, 11]
  //       }

  //     ]
  //   }, {
  //     name: "Tests",
  //     data: [
  //       {
  //         x: 'Jan',
  //         y: [1, 2]
  //       },
  //       {
  //         x: 'Feb',
  //         y: [4, 9]
  //       },
  //       {
  //         x: 'Mar',
  //         y: [6, 9]
  //       }, {
  //         x: 'April',
  //         y: [7, 12]
  //       }, {
  //         x: 'May',
  //         y: [6, 10]
  //       }, {
  //         x: 'Jun',
  //         y: [5, 9],

  //       }, {
  //         x: 'Jul',
  //         y: [3, 4]
  //       },
  //       {
  //         x: 'Aug',
  //         y: [8, 11]
  //       },
  //       {
  //         x: 'Sep',
  //         y: [3, 11]
  //       }
  //       ,
  //       {
  //         x: 'Oct',
  //         y: [5, 11]
  //       }
  //       ,
  //       {
  //         x: 'Nov',
  //         y: [3, 8]
  //       },
  //       {
  //         x: 'Dec',
  //         y: [3, 11]
  //       }
  //     ]
  //   }],
  //   options: {
  //     chart: {
  //       type: 'rangeBar',
  //       height: 350
  //     },
  //     plotOptions: {
  //       bar: {
  //         horizontal: false
  //       }
  //     },
  //     dataLabels: {
  //       enabled: true
  //     },
  //     colors: ['#145883', '#ED803B'], // Add your desired colors for each series
  //     xaxis: {
  //       categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  //     }

  //   }
  // });




  const [RangeColumnChart, setRangeColumnChart] = useState({
    series: [
      {
        name: "Patients",
        data: Array(12).fill({ x: '', y: [0, 0] })  // Placeholder for 12 months
      },
      {
        name: "Tests",
        data: Array(12).fill({ x: '', y: [0, 0] })  // Placeholder for 12 months
      }
    ],
    options: {
      chart: {
        type: 'rangeBar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      dataLabels: {
        enabled: true
      },
      colors: ['#145883', '#ED803B'],  // Add desired colors for each series
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      }
    }
  });

  useEffect(() => {
    // Fetch the patient and test data
    Promise.all([
      fetch(`${process.env.REACT_APP_API_URL}/api/patients/all-patients`).then(res => res.json()),
      fetch(`${process.env.REACT_APP_API_URL}/api/patients/all-patients-tests`).then(res => res.json())
    ])
      .then(([patients, tests]) => {
        const monthlyPatients = Array(12).fill(0);  // Initialize with 0
        const monthlyTests = Array(12).fill(0);  // Initialize with 0

        // Calculate monthly patient data
        patients.forEach(patient => {
          const createdAt = new Date(patient.created_at);
          const month = createdAt.getMonth();  // Get month index (0 for Jan, 11 for Dec)
          monthlyPatients[month] += 1;  // Increment patient count for that month
        });

        // Calculate monthly test data
        tests.forEach(test => {
          const createdAt = new Date(test.created_at);
          const month = createdAt.getMonth();  // Get month index (0 for Jan, 11 for Dec)
          monthlyTests[month] += 1;  // Increment test count for that month
        });

        // Calculate cumulative sums for both patients and tests
        let cumulativePatients = 0;
        let cumulativeTests = 0;

        const updatedPatientData = monthlyPatients.map((count, index) => {
          cumulativePatients += count;  // Add the current month's count to the cumulative total
          return { x: RangeColumnChart.options.xaxis.categories[index], y: [cumulativePatients - count, cumulativePatients] };
        });

        const updatedTestData = monthlyTests.map((count, index) => {
          cumulativeTests += count;  // Add the current month's count to the cumulative total
          return { x: RangeColumnChart.options.xaxis.categories[index], y: [cumulativeTests - count, cumulativeTests] };
        });

        // Update the chart data
        setRangeColumnChart(prevState => ({
          ...prevState,
          series: [
            {
              name: 'Patients',
              data: updatedPatientData  // Use the updated data for patients
            },
            {
              name: 'Tests',
              data: updatedTestData  // Use the updated data for tests
            }
          ]
        }));
      })
      .catch(err => console.error('Error fetching data:', err));
  }, []);







  const [barData, setBarData] = useState({
    series: [{
      name: 'Inflation',
      data: [0], // Initialize with empty or default data
      color: '#145883'
    }],
    options: {
      chart: {
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          borderRadius: 0,
          dataLabels: {
            position: 'top',
          },
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return formatRevenue(val); // Your custom format function
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ["#474848"]
        }
      },
      xaxis: {
        categories: [], // Will be updated dynamically
        position: 'bottom',
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            gradient: {
              colorFrom: '#474848',
              colorTo: '#474848',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            }
          }
        },
        tooltip: {
          enabled: true,
        }
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: function (val) {
            return formatRevenue(val);
          }
        }
      },
      title: {
        text: 'Inflation Data',
        floating: true,
        offsetY: 330,
        align: 'center',
        style: {
          color: '#444'
        }
      }
    }
  });


  function processData(data) {
    return data.map(item => {
      const { price, dis_perc, tax_perc } = item;
      const finalPrice = price - (price * dis_perc / 100) + (price * tax_perc / 100);
      return { ...item, finalPrice };
    });
  }

  const formatRevenue = (value) => {
    if (value >= 1e6) {
      return (value / 1e6).toFixed(2) + 'M'; // Format in millions (M)
    } else if (value >= 1e3) {
      return (value / 1e3).toFixed(1) + 'K'; // Format in thousands (K)
    }
    return value.toFixed(2); // Format smaller values with 2 decimal places
  };


  useEffect(() => {
    const endpoint = `${process.env.REACT_APP_API_URL}/api/patients/all-patients-tests`;

    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        const processedData = processData(data); // Helper function to process data

        if (selectedRange === 'monthly') {
          const monthlyRevenue = Array(12).fill(0);
          data.forEach(item => {
            const { price, dis_perc, tax_perc, created_at } = item;
            const saleMonth = new Date(created_at).getMonth(); // 0 for Jan, 1 for Feb, etc.
            const finalPrice = price - (price * dis_perc / 100) + (price * tax_perc / 100);
            monthlyRevenue[saleMonth] += finalPrice;
          });

          setBarData(prevState => ({
            ...prevState,
            series: [{ ...prevState.series[0], data: monthlyRevenue }],
            options: {
              ...prevState.options,
              xaxis: {
                ...prevState.options.xaxis,
                categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] // Month names
              },
              // title: {
              //   text: 'Monthly Revenue',
              // }
            }
          }));
        } else if (selectedRange === 'yearly') {
          const yearlyRevenue = {};

          data.forEach(item => {
            const { price, dis_perc, tax_perc, created_at } = item;
            const saleYear = new Date(created_at).getFullYear(); // Get the year
            const finalPrice = price - (price * dis_perc / 100) + (price * tax_perc / 100);

            yearlyRevenue[saleYear] = (yearlyRevenue[saleYear] || 0) + finalPrice;
          });

          const years = Object.keys(yearlyRevenue);
          const revenues = Object.values(yearlyRevenue);

          setBarData(prevState => ({
            ...prevState,
            series: [{ ...prevState.series[0], data: revenues }],
            options: {
              ...prevState.options,
              xaxis: {
                ...prevState.options.xaxis,
                categories: years // Yearly data
              },
              // title: {
              //   text: 'Yearly Revenue',
              // }
            }
          }));
        } else if (selectedRange === 'daily') {
          const dailyRevenue = Array(7).fill(0); // Array for each day of the current week (Sunday to Saturday)
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

          // Get current date and calculate the start (Sunday) and end (Saturday) of the current week
          const today = new Date();
          const currentDay = today.getDay(); // Get current day (0 for Sunday, 6 for Saturday)

          // Calculate the start and end of the week (Sunday to Saturday)
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - currentDay); // Set to Sunday

          const endOfWeek = new Date(today);
          endOfWeek.setDate(today.getDate() + (6 - currentDay)); // Set to Saturday

          // Process data and sum revenue for each day in the current week
          data.forEach(item => {
            const { price, dis_perc, tax_perc, created_at } = item;
            const saleDate = new Date(created_at);

            // Check if the sale date is within the current week
            if (saleDate >= startOfWeek && saleDate <= endOfWeek) {
              const saleDay = saleDate.getDay(); // Get the day of the week (0 for Sunday, 6 for Saturday)
              const finalPrice = price - (price * dis_perc / 100) + (price * tax_perc / 100);
              dailyRevenue[saleDay] += finalPrice;
            }
          });

          setBarData(prevState => ({
            ...prevState,
            series: [{ ...prevState.series[0], data: dailyRevenue }],
            options: {
              ...prevState.options,
              xaxis: {
                ...prevState.options.xaxis,
                categories: dayNames, // Dynamic days of the week
              },
              // title: {
              //   text: 'Current Week Revenue',
              // }
            }
          }));
        }
      })
      .catch(err => console.error('Error fetching data:', err));
  }, [selectedRange]);  // Re-run effect when selectedRange changes



  const [pieData, setPieData] = useState({
    series: [], // Initially an empty array for revenue values
    options: {
      chart: {
        type: 'donut',
      },
      colors: ['#01263E', '#024269', '#2E5269', '#036BAD', '#487B9B', '#019DFF', '#7ACBFF'],
      labels: [], // Initially an empty array for test names
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        floating: false,
        fontSize: '10px',
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    },
  });


  useEffect(() => {
    // Fetch the revenue data for each test from the backend
    axios.get(`${process.env.REACT_APP_API_URL}/api/patients/all-patients-tests`)
      .then((response) => {
        const testData = response.data;

        // Create an object to accumulate revenue by test name
        const revenueByTest = {};

        testData.forEach(test => {
          const testName = test.item_name || 'Unknown Test'; // Fallback for undefined test names
          const price = parseFloat(test.price) || 0;
          const discount = parseFloat(test.dis_value) || 0;
          const tax = parseFloat(test.tax_value) || 0;

          // Calculate total revenue for the test
          const totalRevenue = price - discount + tax;

          // Accumulate the revenue by test name
          if (revenueByTest[testName]) {
            revenueByTest[testName] += totalRevenue;
          } else {
            revenueByTest[testName] = totalRevenue;
          }
        });

        // Extract labels (test names) and series (revenue values)
        const labels = Object.keys(revenueByTest);
        const series = Object.values(revenueByTest);

        // Ensure labels and series are not empty or invalid
        if (labels.length && series.length) {
          // Update the pieData state with the new labels and series
          setPieData((prevData) => ({
            ...prevData,
            series: series,
            options: {
              ...prevData.options,
              labels: labels,
            },
          }));
        } else {
          console.error('No valid data for pie chart');
        }
      })
      .catch((error) => {
        console.error('Error fetching test data:', error);
      });
  }, []);



  const [LineColumn, setLineColumn] = useState({
    series: [
      {
        color: "#B3D6EC",
        name: 'Revenue',
        type: 'column',
        data: Array(12).fill(0)
      },
      {
        color: '#145883',
        name: 'Patient',
        type: 'line',
        data: Array(12).fill(0)
      }
    ],
    options: {
      chart: {
        height: 350,
        type: 'line',
        toolbar: { show: false },
        zoom: { enabled: false }
      },
      stroke: {
        width: [0, 2],
        curve: 'smooth'
      },
      markers: {
        size: 5,
        colors: ['#145883'],
        strokeColors: '#ffffff',
        strokeWidth: 2,
        hover: { size: 7 }
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [0, 1],
        style: { fontSize: '12px', colors: ['#474848'] },
        formatter: function (val, opts) {
          const seriesIndex = opts.seriesIndex;
          if (seriesIndex === 0) {
            return formatRevenue(val);
          }
          return Math.round(val);
        },
        offsetY: -10,
        dropShadow: { enabled: false },
        background: { enabled: false }
      },
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      yaxis: [
        {
          labels: { formatter: value => formatRevenue(value) }
        },
        {
          opposite: true,
          labels: { formatter: value => Math.round(value) }
        }
      ]
    }
  });


  useEffect(() => {
    // Fetch lab sales items (revenue data) and patient data
    Promise.all([
      fetch(`${process.env.REACT_APP_API_URL}/api/patients/all-patients-tests`).then(res => res.json()),
      fetch(`${process.env.REACT_APP_API_URL}/api/patients/all-patients`).then(res => res.json())
    ])
      .then(([revenueData, patientData]) => {
        let monthlyRevenue = Array(12).fill(0);
        let monthlyPatients = Array(12).fill(0);

        let dailyRevenue = Array(7).fill(0);  // 7 days of the week: Sunday (0) to Saturday (6)
        let dailyPatients = Array(7).fill(0); // Same for daily patient counts

        let yearlyRevenue = {};
        let yearlyPatients = {};

        // Get the current date and calculate the start and end of the current week
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Sunday of the current week
        const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6)); // Saturday of the current week

        // Process revenue data
        revenueData.forEach(item => {
          const { price, dis_perc, tax_perc, created_at } = item;
          const saleDate = new Date(created_at);
          const saleMonth = saleDate.getMonth();
          const saleYear = saleDate.getFullYear();
          const saleDayOfWeek = saleDate.getDay(); // Sunday = 0, Monday = 1, etc.

          const finalPrice = price - (price * dis_perc / 100) + (price * tax_perc / 100);

          if (selectedRange2 === 'monthly') {
            monthlyRevenue[saleMonth] += finalPrice;
          } else if (selectedRange2 === 'daily') {
            // Check if the sale date is within the current week
            if (saleDate >= startOfWeek && saleDate <= endOfWeek) {
              dailyRevenue[saleDayOfWeek] += finalPrice;
            }
          } else if (selectedRange2 === 'yearly') {
            yearlyRevenue[saleYear] = (yearlyRevenue[saleYear] || 0) + finalPrice;
          }
        });

        // Process patient data
        patientData.forEach(patient => {
          const patientDate = new Date(patient.created_at);
          const patientMonth = patientDate.getMonth();
          const patientYear = patientDate.getFullYear();
          const patientDayOfWeek = patientDate.getDay(); // Sunday = 0, Monday = 1, etc.

          if (selectedRange2 === 'monthly') {
            monthlyPatients[patientMonth] += 1;
          } else if (selectedRange2 === 'daily') {
            // Check if the patient date is within the current week
            if (patientDate >= startOfWeek && patientDate <= endOfWeek) {
              dailyPatients[patientDayOfWeek] += 1;
            }
          } else if (selectedRange2 === 'yearly') {
            yearlyPatients[patientYear] = (yearlyPatients[patientYear] || 0) + 1;
          }
        });

        let updatedRevenueData;
        let updatedPatientData;
        let xAxisLabels = [];

        if (selectedRange2 === 'monthly') {
          updatedRevenueData = monthlyRevenue;
          updatedPatientData = monthlyPatients;
          xAxisLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        } else if (selectedRange2 === 'daily') {
          // For daily data, the labels should be days of the week (Sun, Mon, Tue, etc.)
          updatedRevenueData = dailyRevenue;
          updatedPatientData = dailyPatients;
          xAxisLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];  // Correct labels for days of the week
        } else if (selectedRange2 === 'yearly') {
          updatedRevenueData = Object.values(yearlyRevenue);
          updatedPatientData = Object.values(yearlyPatients);
          xAxisLabels = Object.keys(yearlyRevenue);  // Show years as x-axis labels
        }

        // Update the LineColumn state with formatted revenue and patient data
        setLineColumn(prevState => ({
          ...prevState,
          series: [
            { ...prevState.series[0], data: updatedRevenueData },
            { ...prevState.series[1], data: updatedPatientData }
          ],
          options: {
            ...prevState.options,
            labels: xAxisLabels  // Update x-axis labels dynamically based on the selected range
          }
        }));
      })
      .catch(err => console.error('Error fetching data:', err));
  }, [selectedRange2]); // Rerun effect when selectedRange2 changes






  const isRecent = (dateString) => {
    const now = new Date();
    const testDate = new Date(dateString);
    const diffInDays = (now - testDate) / (1000 * 60 * 60 * 24); // Difference in days
    return diffInDays <= 2; // Change the number of days as per your requirement
  };

  // Function to fetch and filter recent tests
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/patients/all-patients-tests`);
        if (!response.ok) {
          throw new Error('Failed to fetch patients');
        }
        const data = await response.json();

        // Filter the data to include only recent tests
        const recentTests = data.filter((test) => isRecent(test.created_at));

        setPatientsTest(recentTests); // Set only recent tests
        await checkReports(recentTests); // Check for reports after fetching filtered tests
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Fetch reports and update patients status
  const checkReports = async (patients) => {
    const updatedPatients = await Promise.all(patients.map(async (patient) => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/reports/report/${patient.sales_item_id}`);

      if (response.ok) {
        const reports = await response.json();

        // Check if there are reports for the patient
        if (reports.length > 0) {
          // Update status based on the current patient status
          let updatedStatus = patient.status;

          if (patient.status === 'In-Progress') {
            updatedStatus = 'In-Progress'; // Keep status as 'In-Progress' if it's already in progress
          } else if (patient.status === 'Sample Received') {
            updatedStatus = 'Sample Received'; // If already marked as 'Sample Received', maintain it
          } else {
            updatedStatus = 'Report Generated'; // Set to 'Report Generated' if reports are found and no other status applies
          }

          return {
            ...patient,
            status: updatedStatus, // Set the updated status
            isReportAvailable: true, // Flag to check if report exists
            reports, // Include reports in the patient object
          };
        }
      }

      // Return the patient with their original status if no reports found or status remains unchanged
      return {
        ...patient,
        isReportAvailable: false,
        status: patient.status // Maintain current status if no reports found 
      };
    }));

    setPatientsTest(updatedPatients); // Update state with modified patients
  };


  // Filter patients based on search term
  // const filteredPatients = patientsTest.filter((patient) =>
  //   patient.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   patient.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const filteredPatients = patientsTest.filter((patient) =>
    patient.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.sales_item_id.toString().toLowerCase().includes(searchTerm.toLowerCase()) // Convert to string before applying toLowerCase
  );



  if (loading) {
    return <div>
      <div>
        <Sidebar />
        <main
          id="mainContent"
          className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}
          style={{ marginLeft: isSidebarOpen ? '20rem' : '0' }}
        >
          <LoadingSpinner />
        </main>
      </div>
    </div>;
  }

  if (error) {
    return <div>
      <div>
        <Sidebar />
        <main
          id="mainContent"
          className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}
          style={{ marginLeft: isSidebarOpen ? '20rem' : '0' }}
        >
          Some technical Issue ...
        </main>
      </div>
    </div>;
  }






  return (
    <>

      <Sidebar />


      <main
        id="mainContent"
        className={`transition-all duration-300 ${isSidebarOpen ? 'md:ml-0 sm:ml-0 lg:ml-80' : 'ml-0'}`}
      // style={{ marginLeft: isSidebarOpen ? '20rem' : '0' }} // Adjust the value to match your sidebar width
      >

        <div className="p-6">

          {/* Dashboard Boxes */}


          <div className="">
            <div className="flex flex-wrap  -mx-6 ">

              {/* Total Patient */}
              <div className=" w-full px-4 sm:w-1/2 xl:w-1/4 my-2">

                <div className="flex items-center justify-center px-5 py-4 bg-[#E4EBEF] rounded-md shadow-sm">
                  <div className="p-4 bg-white bg-opacity-75 rounded-full">
                    <svg className='h-[26px] w-[26px] lg:w-[40px] lg:h-[40px]' viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_412_306)">
                        <path d="M20.0002 1.5625C20.2722 1.78588 20.5295 2.01993 20.7814 2.26562C20.8491 2.33007 20.9168 2.39453 20.9865 2.46093C21.0477 2.52539 21.109 2.58984 21.1721 2.65625C21.2183 2.70378 21.2645 2.75131 21.3121 2.80029C22.9318 4.52961 23.4274 6.76515 23.3695 9.06898C23.2749 11.2347 22.1372 13.1646 20.6008 14.6289C18.9284 16.0925 16.7677 16.8344 14.5447 16.7303C12.7238 16.6061 10.9882 15.9795 9.60956 14.7656C9.54652 14.7138 9.48348 14.6619 9.41852 14.6085C7.87734 13.3016 6.81489 11.3179 6.64081 9.29687C6.48316 6.86864 7.07723 4.80718 8.59394 2.89062C8.63321 2.83916 8.67249 2.7877 8.71296 2.73468C9.05657 2.30466 9.48812 1.97516 9.92206 1.64062C9.98501 1.59208 10.0479 1.54354 10.1128 1.49353C11.0014 0.840645 11.9841 0.426327 13.0471 0.156245C13.1039 0.141699 13.1608 0.127153 13.2194 0.112167C15.5459 -0.419841 18.0989 0.147436 20.0002 1.5625Z" fill="#145883" />
                        <path d="M7.46695 19.9885C7.53341 19.9882 7.59987 19.9879 7.66834 19.9876C7.89051 19.9868 8.11268 19.9865 8.33486 19.9862C8.49441 19.9857 8.65396 19.9852 8.81351 19.9846C9.33721 19.983 9.86092 19.9822 10.3846 19.9814C10.5653 19.9811 10.7461 19.9807 10.9268 19.9804C11.7764 19.9789 12.626 19.9778 13.4755 19.9772C14.4539 19.9764 15.4321 19.9743 16.4104 19.9712C17.168 19.9688 17.9256 19.9677 18.6832 19.9674C19.135 19.9672 19.5867 19.9665 20.0385 19.9646C20.4642 19.9627 20.8899 19.9624 21.3156 19.9632C21.4709 19.9633 21.6262 19.9628 21.7815 19.9617C24.0402 19.9469 25.9978 20.6458 27.6689 22.1872C28.0306 22.5571 28.1971 22.9153 28.2029 23.4375C28.1592 23.7468 28.0675 23.9689 27.8389 24.1852C27.4089 24.5047 27.0156 24.5946 26.4842 24.5312C26.2406 24.4094 26.0625 24.2623 25.8634 24.0781C24.8415 23.1348 23.5767 22.5655 22.1755 22.5671C22.1117 22.5669 22.0479 22.5667 21.9822 22.5664C21.7685 22.5658 21.5549 22.5656 21.3413 22.5655C21.1881 22.5652 21.0348 22.5648 20.8816 22.5644C20.4653 22.5633 20.049 22.5628 19.6326 22.5625C19.3723 22.5622 19.112 22.5619 18.8517 22.5616C18.0366 22.5605 17.2215 22.5598 16.4064 22.5595C15.4667 22.5591 14.527 22.5577 13.5873 22.5555C12.8603 22.5538 12.1332 22.553 11.4062 22.5529C10.9723 22.5528 10.5384 22.5523 10.1045 22.5509C9.69597 22.5497 9.28745 22.5495 8.8789 22.5502C8.7295 22.5502 8.5801 22.5499 8.43071 22.5491C7.39883 22.5441 6.47536 22.6107 5.54179 23.0957C5.48907 23.1227 5.43635 23.1498 5.38203 23.1777C4.35247 23.725 3.63327 24.5054 3.10039 25.5322C3.07494 25.5803 3.04949 25.6283 3.02327 25.6778C2.5917 26.5541 2.54206 27.4897 2.53795 28.4488C2.53663 28.5664 2.53521 28.6841 2.5337 28.8017C2.53002 29.1078 2.52767 29.4138 2.52562 29.7199C2.52327 30.0337 2.51964 30.3474 2.51613 30.6612C2.50945 31.2741 2.50417 31.887 2.4998 32.5C2.54351 32.4997 2.58723 32.4994 2.63227 32.4991C3.6978 32.4922 4.76333 32.4871 5.82888 32.4838C6.34418 32.4822 6.85946 32.48 7.37475 32.4764C7.87219 32.473 8.36961 32.4712 8.86706 32.4703C9.05669 32.4698 9.24632 32.4686 9.43594 32.4669C9.70189 32.4647 9.96777 32.4644 10.2337 32.4645C10.3509 32.4628 10.3509 32.4628 10.4704 32.4611C10.9515 32.4639 11.3181 32.535 11.7186 32.8125C12.033 33.1431 12.1012 33.4818 12.1272 33.9252C12.0983 34.2708 11.9591 34.5193 11.7186 34.7656C11.43 34.9686 11.2351 35.0294 10.8837 35.0303C10.7951 35.0311 10.7065 35.0318 10.6152 35.0326C10.5187 35.0323 10.4223 35.0319 10.3228 35.0316C10.2207 35.0321 10.1185 35.0326 10.0132 35.0332C9.73349 35.0346 9.45377 35.0345 9.17403 35.034C8.94028 35.0338 8.70653 35.0343 8.47278 35.0348C7.92121 35.0358 7.36966 35.0357 6.8181 35.0348C6.24956 35.0339 5.68105 35.035 5.11252 35.0371C4.62392 35.0389 4.13533 35.0394 3.64672 35.0389C3.35511 35.0387 3.06352 35.0388 2.77191 35.0402C2.44667 35.0416 2.12148 35.0405 1.79624 35.0392C1.65175 35.0403 1.65175 35.0403 1.50435 35.0415C0.673034 35.0343 0.673034 35.0343 0.3123 34.6875C-0.0262467 34.3009 -0.0450042 33.9916 -0.0393959 33.5016C-0.039818 33.4309 -0.0402401 33.3602 -0.040675 33.2873C-0.04165 33.0542 -0.0403617 32.8211 -0.0389572 32.5879C-0.0389693 32.4248 -0.0390858 32.2617 -0.0393017 32.0986C-0.0394098 31.7565 -0.0384293 31.4145 -0.0366493 31.0725C-0.0344427 30.6368 -0.0346427 30.2012 -0.0356408 29.7655C-0.0361879 29.4283 -0.0355712 29.0912 -0.0346048 28.754C-0.0342549 28.5936 -0.0342237 28.4331 -0.0345321 28.2727C-0.0370101 25.8473 0.697315 23.8688 2.39482 22.1313C3.74871 20.8412 5.58202 19.9881 7.46695 19.9885Z" fill="#145883" />
                        <path d="M18.5102 3.63434C19.6434 4.5499 20.4721 5.74812 20.7813 7.1875C20.8111 7.52519 20.8106 7.85947 20.8057 8.19824C20.8059 8.2844 20.8062 8.37056 20.8064 8.45932C20.8012 9.26801 20.7088 10.0014 20.3516 10.7324C20.3244 10.7888 20.2973 10.8451 20.2693 10.9032C19.4869 12.4645 18.2076 13.4253 16.5824 13.9914C15.105 14.4046 13.4806 14.1636 12.1512 13.4412C11.8272 13.2574 11.533 13.0549 11.25 12.8125C11.1752 12.7557 11.1752 12.7557 11.099 12.6978C10.1137 11.9142 9.43384 10.6041 9.21877 9.375C9.14196 8.22013 9.09636 7.07565 9.6094 6.01563C9.64817 5.92902 9.68694 5.84241 9.72689 5.75318C10.0531 5.08355 10.4912 4.58011 11.0156 4.0625C11.0688 4.00943 11.122 3.95636 11.1768 3.90167C13.1831 2.02488 16.3571 2.05523 18.5102 3.63434Z" fill="#FAFDFF" />
                        <path d="M29.5312 26.6406C30.3934 26.9391 30.7422 28.0204 31.1377 28.7647C31.4875 29.4191 31.8434 30.0689 32.2119 30.7129C32.6811 31.5346 33.1258 32.3685 33.5664 33.2058C34.0079 34.0439 34.4633 34.8742 34.9219 35.7031C34.9981 35.7038 34.9981 35.7038 35.0759 35.7045C35.6057 35.7095 36.1354 35.7161 36.6652 35.7236C36.8628 35.7262 37.0604 35.7284 37.2581 35.7302C37.5424 35.7328 37.8267 35.7369 38.111 35.7413C38.2432 35.742 38.2432 35.742 38.3781 35.7428C38.8806 35.7522 39.2746 35.7761 39.6597 36.1356C40.0324 36.623 40.0558 36.9686 40 37.5781C39.8493 37.9157 39.6556 38.1151 39.3307 38.2939C38.8859 38.4472 38.3905 38.4038 37.9245 38.4009C37.8055 38.4011 37.6866 38.4014 37.5676 38.4018C37.3191 38.4023 37.0706 38.4016 36.822 38.4001C36.5042 38.3983 36.1865 38.3994 35.8687 38.4012C35.6233 38.4024 35.378 38.402 35.1326 38.4012C35.0155 38.401 34.8983 38.4012 34.7812 38.402C34.6172 38.4028 34.4533 38.4016 34.2894 38.3998C34.1963 38.3996 34.1032 38.3993 34.0073 38.3991C33.6281 38.3406 33.3878 38.1569 33.1247 37.8851C32.8899 37.5406 32.6997 37.1749 32.5049 36.8066C32.1663 36.1735 31.8216 35.545 31.4648 34.9219C30.9772 34.0677 30.5161 33.2 30.0574 32.33C30.03 32.278 30.0026 32.2261 29.9743 32.1725C29.8997 32.0309 29.8252 31.8892 29.7507 31.7474C29.6041 31.4745 29.4517 31.2059 29.2969 30.9375C28.6289 31.7362 28.7515 32.7669 28.75 33.75C28.4664 33.75 28.1828 33.75 27.8906 33.75C27.8591 33.8505 27.8591 33.8505 27.8269 33.953C27.7343 34.219 27.6249 34.4664 27.504 34.7208C27.4813 34.7686 27.4587 34.8165 27.4354 34.8658C27.3612 35.023 27.2865 35.1799 27.2119 35.3369C26.8813 36.0342 26.5541 36.7325 26.2408 37.4378C26.2148 37.4961 26.1888 37.5544 26.162 37.6144C26.0101 37.955 26.0101 37.955 25.86 38.2964C25.2332 39.7329 25.2332 39.7329 24.6094 40C24.393 40.029 24.393 40.029 24.1553 40.0342C24.0774 40.0373 23.9996 40.0404 23.9194 40.0436C23.5778 39.9834 23.3616 39.8552 23.125 39.6094C22.907 39.2957 22.7257 38.9634 22.5439 38.6279C22.4901 38.5309 22.4362 38.4339 22.3821 38.337C22.2694 38.1348 22.1573 37.9324 22.0457 37.7298C21.7973 37.2803 21.5416 36.835 21.286 36.3896C21.2086 36.2544 21.1313 36.1191 21.0541 35.9837C20.9578 35.815 20.8595 35.6475 20.7591 35.4813C20.625 35.2344 20.625 35.2344 20.5402 34.9657C20.4241 34.6508 20.3459 34.5038 20.0781 34.2969C19.4081 34.1303 18.6869 34.1945 18.0029 34.2139C17.7161 34.2183 17.4293 34.2213 17.1424 34.2233C16.9642 34.2249 16.786 34.2281 16.6079 34.2332C16.1677 34.2412 15.8462 34.2414 15.4688 33.9844C15.1742 33.6826 14.9716 33.3466 14.9512 32.9199C14.9845 32.5041 15.1241 32.2088 15.4278 31.9226C15.941 31.5503 16.4788 31.5864 17.0901 31.5942C17.2018 31.5944 17.3134 31.5944 17.4251 31.5942C17.6582 31.5944 17.8912 31.5958 18.1242 31.5983C18.4218 31.6014 18.7192 31.6017 19.0168 31.6011C19.247 31.6009 19.4772 31.6019 19.7075 31.6032C19.8171 31.6037 19.9268 31.604 20.0365 31.6039C21.2428 31.605 21.2428 31.605 21.7052 31.9956C21.9716 32.33 22.1971 32.6746 22.4072 33.0469C22.4748 33.1642 22.5425 33.2815 22.6102 33.3988C22.6606 33.4867 22.6606 33.4867 22.7121 33.5764C22.8662 33.8429 23.0247 34.1066 23.1836 34.3701C23.4231 34.768 23.6617 35.1665 23.8989 35.5658C23.975 35.6997 23.975 35.6997 24.0625 35.7813C24.0876 35.7263 24.1128 35.6713 24.1386 35.6146C24.9673 33.8036 24.9673 33.8036 25.3691 33.0144C25.6493 32.4592 25.9127 31.896 26.1768 31.333C26.2141 31.2535 26.2141 31.2535 26.2522 31.1725C26.5462 30.5468 26.8343 29.919 27.114 29.2868C27.1661 29.1697 27.2182 29.0525 27.2703 28.9354C27.3693 28.713 27.4668 28.49 27.5635 28.2666C27.9688 27.3459 28.3998 26.4843 29.5312 26.6406Z" fill="#145883" />
                      </g>
                      <defs>
                        <clipPath id="clip0_412_306">
                          <rect width="40" height="40" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>

                  </div>

                  <div className="mx-3 space-y-1">
                    <div className="text-gray-500 font-semibold text-xs lg:text-sm">Total Patient</div>

                    <h4 className="text-2xl lg:text-3xl font-bold text-gray-700">{totalPatients}</h4>

                    <p className="text-gray-500 text-xs lg:text-sm flex">

                      <div className='text-[#145883] flex flex-row items-center justify-between'>
                        <svg className='w-4 h-4 lg:w-5 lg:h-5' viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 17.5L10 5.5" stroke="#145883" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M4.1665 10.5L9.99984 4.66666L15.8332 10.5" stroke="#145883" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                        <span className='font-bold'>16%</span>
                      </div>


                      <span className='text-black font-semibold'>this month</span>

                    </p>

                  </div>
                </div>



              </div>



              {/* Total Tests */}
              <div className=" w-full px-4 sm:w-1/2 xl:w-1/4 my-2">

                <div className="flex items-center justify-center px-5 py-4 bg-[#E4EBEF] rounded-md shadow-sm">
                  <div className="p-4 bg-white bg-opacity-75 rounded-full">
                    <svg className='h-[26px] w-[26px] lg:w-[40px] lg:h-[40px]' viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_413_489)">
                        <path d="M33.6325 0.581058C34.3861 1.20556 34.8424 2.01759 35.0586 3.04688C35.1432 4.15824 34.9391 5.06624 34.375 5.98215C34.0831 6.36424 33.7698 6.71914 33.454 7.07524C33.3607 7.18173 33.2675 7.28831 33.1744 7.39495C32.9232 7.68218 32.671 7.9683 32.4186 8.25423C32.1544 8.55399 31.891 8.85478 31.6275 9.15545C31.1293 9.72374 30.6303 10.2911 30.131 10.8582C29.5622 11.5042 28.9944 12.1512 28.4266 12.7983C27.2593 14.1286 26.091 15.4576 24.9219 16.7857C25.3207 16.7924 25.7194 16.7972 26.1183 16.8004C26.2537 16.8018 26.3891 16.8036 26.5244 16.8059C26.7201 16.8092 26.9158 16.8107 27.1115 16.8119C27.2009 16.8139 27.2009 16.8139 27.2921 16.8161C27.7559 16.8162 28.2735 16.751 28.6404 16.3977C28.9498 15.9943 29.0519 15.6099 29.126 15.0949C29.1993 14.6455 29.3245 14.4246 29.6094 14.1071C29.9217 13.9287 30.2864 13.9604 30.625 14.0179C30.9403 14.2159 31.136 14.4304 31.25 14.8214C31.3526 15.9249 31.0525 16.8991 30.4688 17.7679C30.4236 17.8452 30.3785 17.9225 30.332 18.0022C29.5624 18.9307 28.5726 19.2581 27.4801 19.2941C27.1734 19.2977 26.8667 19.2985 26.56 19.2984C26.4424 19.2987 26.3248 19.299 26.2072 19.2993C25.9551 19.3 25.7031 19.3005 25.451 19.3008C25.052 19.3013 24.6531 19.3028 24.2541 19.3045C24.1172 19.305 23.9803 19.3056 23.8433 19.3062C23.7748 19.3064 23.7062 19.3067 23.6356 19.307C22.7077 19.3108 21.7799 19.3137 20.852 19.3148C20.2247 19.3156 19.5974 19.3176 18.9701 19.321C18.6387 19.3228 18.3073 19.3239 17.9759 19.3234C17.6643 19.323 17.3527 19.3243 17.0411 19.3267C16.9271 19.3274 16.8131 19.3274 16.6991 19.3267C16.076 19.3235 15.6063 19.3342 15.0781 19.7321C14.9141 19.9239 14.9141 19.9239 14.8096 20.1395C14.7726 20.2078 14.7357 20.276 14.6976 20.3463C14.4739 20.8266 14.4489 21.3738 14.5819 21.8949C14.7866 22.4138 15.1164 22.8011 15.5693 23.0411C15.7922 23.1294 15.9588 23.1476 16.1939 23.1481C16.2755 23.1487 16.3572 23.1493 16.4413 23.1499C16.5301 23.1497 16.6189 23.1495 16.7104 23.1492C16.8046 23.1497 16.8987 23.1502 16.9958 23.1506C17.2005 23.1516 17.4052 23.1522 17.6099 23.1522C17.9353 23.1524 18.2606 23.154 18.586 23.1559C19.3953 23.1603 20.2046 23.163 21.0138 23.1649C21.641 23.1664 22.2682 23.1685 22.8953 23.1723C23.1649 23.1739 23.4345 23.175 23.7041 23.1749C25.9723 23.175 27.8718 23.5153 29.9658 24.5145C30.7998 24.9121 31.6137 25.2429 32.5 25.4464C32.5604 25.4607 32.6207 25.4749 32.6829 25.4895C34.5814 25.9201 36.5282 25.8017 38.3926 25.2302C38.85 25.1128 39.2257 25.0932 39.6484 25.3348C39.882 25.5751 39.982 25.7476 40.0262 26.1042C40.0313 26.4738 40.0159 26.7412 39.8926 27.0871C38.8675 28.2585 36.4449 28.2296 35.083 28.2366C32.5773 28.2216 30.3374 27.4549 28.0469 26.3393C28.0505 26.3988 28.0541 26.4583 28.0579 26.5196C28.0914 27.4972 27.8448 28.2939 27.2656 29.0179C26.7588 29.618 26.1442 29.9552 25.4147 30.0181C24.1892 30.041 23.263 29.5241 22.2656 28.75C22.237 28.7889 22.2084 28.8278 22.179 28.8679C21.6484 29.5348 20.9561 29.9458 20.1688 30.0213C18.8575 30.0572 17.8446 29.5256 16.9043 28.5114C16.8431 28.4428 16.7818 28.3743 16.7188 28.3036C16.664 28.2442 16.6092 28.1848 16.5527 28.1236C16.1204 27.6179 15.8675 27.0405 15.6064 26.408C15.5827 26.3512 15.5591 26.2943 15.5348 26.2358C15.4736 26.0836 15.4181 25.9285 15.3632 25.7732C15.1951 25.4633 15.0629 25.4265 14.7607 25.3237C14.0348 25.036 13.5051 24.5376 13.0469 23.8393C12.7431 23.9817 12.5511 24.2051 12.3207 24.4686C12.2596 24.5381 12.2596 24.5381 12.1972 24.609C12.0609 24.7643 11.9251 24.9203 11.7893 25.0762C11.6917 25.1877 11.594 25.2992 11.4963 25.4106C11.2311 25.7132 10.9664 26.0165 10.7017 26.3198C10.425 26.6369 10.1478 26.9535 9.87074 27.2701C9.40556 27.8018 8.94069 28.3339 8.47601 28.8662C7.93823 29.4822 7.40004 30.0977 6.86162 30.713C6.34417 31.3043 5.82696 31.8959 5.30986 32.4876C5.08954 32.7397 4.86914 32.9918 4.6487 33.2437C4.38939 33.5402 4.13028 33.8368 3.87132 34.1337C3.77605 34.2428 3.68072 34.3519 3.58532 34.4609C3.45552 34.6092 3.32596 34.7577 3.19647 34.9064C3.12378 34.9896 3.05109 35.0728 2.97619 35.1586C2.81033 35.3407 2.81033 35.3407 2.73438 35.5357C5.14301 36.0738 7.31803 34.9352 9.29249 33.43C10.2 32.716 11.0563 31.9131 11.875 31.0714C11.9432 31.0066 12.0115 30.9418 12.0818 30.875C12.3189 30.5526 12.3136 30.3759 12.3126 29.9588C12.3132 29.8956 12.3139 29.8323 12.3145 29.7671C12.3163 29.5656 12.3156 29.3644 12.3145 29.163C12.3142 28.9622 12.3144 28.7615 12.3161 28.5607C12.3174 28.3781 12.3169 28.1955 12.3162 28.0129C12.3551 27.541 12.4631 27.1924 12.7539 26.8415C13.0629 26.6328 13.3216 26.564 13.6786 26.6434C14.013 26.7628 14.1904 26.892 14.3862 27.2391C14.5207 27.584 14.4958 27.9518 14.4919 28.3231C14.492 28.4103 14.4921 28.4974 14.4922 28.5872C14.4921 28.7709 14.4912 28.9546 14.4896 29.1383C14.4873 29.4187 14.488 29.699 14.489 29.9794C14.4885 30.1583 14.4878 30.3373 14.487 30.5162C14.4872 30.5996 14.4875 30.6831 14.4877 30.769C14.4792 31.4471 14.3362 31.8618 13.9085 32.3515C13.8691 32.395 13.8297 32.4385 13.7891 32.4833C13.7269 32.553 13.7269 32.553 13.6635 32.6241C13.3366 32.9858 12.9938 33.3197 12.6373 33.6429C12.4145 33.846 12.1988 34.057 11.9824 34.269C9.68466 36.45 6.68119 38.4252 3.59375 38.2143C2.46508 38.0531 1.53379 37.6712 0.625 36.875C0.549268 36.8124 0.473535 36.7498 0.395508 36.6853C0.0826288 36.3602 -0.0202588 36.0868 -0.0585938 35.6083C-0.0427462 35.1752 0.0425513 34.9818 0.303249 34.6704C0.367327 34.5931 0.431405 34.5158 0.497425 34.4361C0.565306 34.357 0.633187 34.2779 0.703125 34.1964C0.767626 34.1207 0.832127 34.0449 0.898583 33.9668C1.1092 33.722 1.32171 33.4794 1.53473 33.2373C1.61554 33.1451 1.69633 33.0529 1.77711 32.9607C1.94938 32.7641 2.12178 32.5676 2.29426 32.3713C2.56694 32.0609 2.83932 31.7501 3.11165 31.4393C3.68878 30.7807 4.26625 30.1225 4.84375 29.4643C5.46953 28.7511 6.09525 28.0378 6.72059 27.3241C6.99146 27.015 7.26253 26.7061 7.53375 26.3973C7.70177 26.206 7.86963 26.0144 8.03745 25.8228C8.11546 25.7338 8.19353 25.6449 8.27168 25.5561C8.37802 25.4352 8.4841 25.314 8.59016 25.1928C8.64967 25.125 8.70918 25.0572 8.77049 24.9873C8.91132 24.831 8.91132 24.831 8.98438 24.6429C8.89857 24.6087 8.89857 24.6087 8.81104 24.5738C8.22407 24.278 7.77891 23.6845 7.5 23.0357C7.47513 22.9806 7.45025 22.9255 7.42462 22.8687C7.25306 22.4051 7.23922 21.9362 7.23145 21.4397C7.2297 21.3745 7.22796 21.3092 7.22616 21.242C7.23021 20.1081 7.79341 19.1774 8.29102 18.2422C8.35912 18.1128 8.42718 17.9833 8.49518 17.8538C8.86571 17.15 9.24253 16.451 9.62738 15.7572C9.91769 15.2263 10.194 14.6856 10.4728 14.1468C11.9677 11.2583 13.2434 8.86924 15.7812 7.05357C15.8515 7.00313 15.9218 6.95269 15.9942 6.90072C16.4665 6.5618 16.9396 6.22438 17.4131 5.88745C17.7292 5.66235 18.045 5.43675 18.3608 5.21105C18.5158 5.10037 18.6707 4.98978 18.8258 4.87928C19.2301 4.59097 19.6335 4.3011 20.0357 4.00879C20.1188 3.94866 20.202 3.88852 20.2876 3.82656C20.4452 3.71255 20.6025 3.59807 20.7594 3.48302C21.6915 2.81031 22.8413 2.10953 23.9844 2.32143C24.2893 2.49883 24.5229 2.68925 24.6875 3.03572C24.8036 3.53789 24.7545 3.83504 24.5312 4.28572C24.234 4.61679 23.9562 4.71285 23.5596 4.79911C22.8971 4.96831 22.3646 5.29892 21.7969 5.71429C21.6862 5.79357 21.5754 5.87273 21.4645 5.9518C21.2163 6.12958 20.9688 6.30866 20.7217 6.48856C20.2825 6.80812 19.8411 7.12355 19.3994 7.43862C19.3213 7.4944 19.2432 7.55017 19.1627 7.60764C18.7535 7.89982 18.344 8.19156 17.9343 8.48284C17.4763 8.80863 17.019 9.13578 16.5625 9.46429C16.5097 9.50214 16.4569 9.53999 16.4025 9.57899C15.1151 10.5068 14.3071 11.6781 13.5547 13.1696C13.4458 13.3829 13.3365 13.5959 13.2272 13.8089C13.1995 13.8631 13.1718 13.9173 13.1433 13.9731C12.8449 14.5556 12.5387 15.1324 12.2314 15.7087C12.1762 15.8124 12.1211 15.9161 12.0659 16.0197C11.9266 16.2813 11.7872 16.5428 11.6478 16.8042C11.5021 17.0775 11.3565 17.3508 11.2109 17.6242C11.182 17.6785 11.1531 17.7328 11.1233 17.7887C10.9808 18.0563 10.8386 18.3241 10.6969 18.5923C10.4605 19.0398 10.2234 19.4863 9.97742 19.9271C9.50113 20.745 9.50113 20.745 9.40125 21.6947C9.51578 22.0928 9.71177 22.317 10.0244 22.5391C10.3294 22.612 10.5691 22.6274 10.8594 22.5C11.1457 22.2607 11.3891 21.9812 11.6406 21.6964C11.6992 21.643 11.7578 21.5896 11.8182 21.5346C12.2466 21.127 12.3507 20.7045 12.4613 20.102C12.6698 19.006 13.2512 18.1231 14.0604 17.4997C14.7138 17.065 14.7138 17.065 15.0636 17.0342C16.094 16.9154 16.6471 16.1034 17.3342 15.2953C17.4708 15.1383 17.6076 14.9815 17.7446 14.825C18.0382 14.4885 18.3304 14.1505 18.6215 13.8112C19.0429 13.32 19.4669 12.8317 19.8916 12.344C20.5814 11.5518 21.2694 10.7575 21.9562 9.96173C22.6215 9.19075 23.2874 8.42029 23.9541 7.65085C23.9952 7.60343 24.0363 7.55602 24.0786 7.50716C24.5276 6.98905 24.9768 6.47118 25.4263 5.95363C25.4659 5.90809 25.5054 5.86255 25.5462 5.81563C25.7043 5.63354 25.8625 5.45145 26.0207 5.2694C26.4827 4.73762 26.944 4.20511 27.4042 3.6712C27.727 3.2967 28.0506 2.92305 28.3744 2.54969C28.5068 2.39672 28.6389 2.24343 28.7707 2.08981C28.951 1.87977 29.1323 1.67087 29.3138 1.4622C29.3654 1.4015 29.417 1.3408 29.4702 1.27825C30.5808 0.0114048 32.2446 -0.377132 33.6325 0.581058ZM31.2974 2.73327C31.2434 2.79048 31.1895 2.8477 31.1339 2.90664C30.6753 3.41644 30.2213 3.93116 29.7693 4.44855C29.6514 4.5831 29.5336 4.71764 29.4157 4.85215C29.0971 5.21587 28.7788 5.57987 28.4604 5.94393C28.1272 6.32498 27.7938 6.70582 27.4604 7.08669C26.9013 7.72554 26.3423 8.36459 25.7834 9.00373C25.1364 9.74363 24.4892 10.4832 23.8418 11.2226C23.2859 11.8574 22.7303 12.4924 22.1747 13.1276C21.8429 13.507 21.511 13.8863 21.1789 14.2655C20.8674 14.6213 20.556 14.9773 20.2448 15.3335C20.1302 15.4646 20.0156 15.5956 19.9008 15.7265C19.745 15.9043 19.5895 16.0824 19.434 16.2606C19.3879 16.313 19.3418 16.3655 19.2943 16.4196C19.082 16.6152 19.082 16.6152 18.9844 16.875C20.0958 17.0859 21.4057 17.2984 22.388 16.5408C23.1064 15.9196 23.7221 15.1581 24.3348 14.4075C24.623 14.0582 24.9196 13.7184 25.2152 13.3774C25.7091 12.8052 26.1975 12.2274 26.6821 11.6451C27.3651 10.8244 28.057 10.0141 28.7511 9.20572C29.6814 8.12135 30.6088 7.03356 31.5266 5.93528C31.6255 5.81714 31.7245 5.69919 31.8237 5.58145C31.9593 5.42039 32.0942 5.25857 32.2288 5.0965C32.2679 5.05038 32.307 5.00426 32.3472 4.95674C32.6754 4.55853 32.9401 4.16168 33.0078 3.61049C32.9528 3.17795 32.797 2.91029 32.5122 2.62207C32.1253 2.34173 31.6333 2.37599 31.2974 2.73327ZM17.6562 25.625C18.0369 26.4951 18.5235 27.0791 19.2969 27.5C19.6384 27.6211 19.9869 27.6484 20.332 27.5279C20.5211 27.3658 20.598 27.2066 20.7031 26.9643C20.7342 26.6711 20.7342 26.6711 20.7227 26.3672C20.7214 26.2656 20.7202 26.1639 20.719 26.0592C20.7178 25.8086 20.7178 25.8086 20.625 25.625C19.6453 25.625 18.6656 25.625 17.6562 25.625ZM22.8906 25.625C22.94 25.7244 22.9893 25.8239 23.0401 25.9263C23.0679 25.9823 23.0956 26.0382 23.1242 26.0958C23.4708 26.7729 23.9969 27.2206 24.6191 27.5335C24.9806 27.6233 25.2675 27.6518 25.6104 27.4777C25.7981 27.306 25.8536 27.2189 25.9375 26.9643C25.9564 26.6715 25.9564 26.6715 25.9473 26.3616C25.9459 26.2571 25.9444 26.1526 25.943 26.0449C25.9412 25.9653 25.9394 25.8856 25.9375 25.8036C25.6404 25.5795 25.3389 25.6021 24.9963 25.6076C24.9361 25.6078 24.8758 25.6081 24.8138 25.6083C24.6219 25.6093 24.4301 25.6116 24.2383 25.6138C24.108 25.6147 23.9777 25.6156 23.8474 25.6163C23.5284 25.6182 23.2095 25.6213 22.8906 25.625Z" fill="#145883" />
                        <path d="M36.4842 7.5893C36.7072 7.77866 36.9139 7.98391 37.1242 8.19128C37.7162 8.73515 38.3132 8.87248 39.0532 8.97148C39.4384 9.04485 39.6312 9.20405 39.8915 9.53545C40.0915 9.89856 40.0558 10.3015 39.9999 10.7143C39.8724 11.0181 39.6879 11.1935 39.4383 11.3728C38.2709 11.6693 37.0769 11.1403 36.0936 10.4464C35.0411 9.62523 35.0411 9.62523 34.8659 8.9959C34.8252 8.53832 34.8387 8.24919 35.078 7.85715C35.5246 7.37295 35.9229 7.32305 36.4842 7.5893Z" fill="#145883" />
                        <path d="M14.4636 37.5619C14.5833 37.5598 14.5833 37.5598 14.7054 37.5576C14.7912 37.5571 14.877 37.5566 14.9654 37.5561C15.054 37.5553 15.1426 37.5545 15.2339 37.5537C15.4213 37.5524 15.6087 37.5516 15.7962 37.5513C16.0825 37.5502 16.3688 37.5458 16.6551 37.5413C16.8373 37.5405 17.0195 37.5398 17.2017 37.5394C17.3299 37.5368 17.3299 37.5368 17.4607 37.5341C18.1242 37.5386 18.1242 37.5386 18.4105 37.8055C18.7075 38.1782 18.787 38.4074 18.7752 38.9261C18.724 39.2962 18.5321 39.5453 18.2956 39.7896C18.0886 39.9367 17.9655 39.9446 17.723 39.9454C17.6029 39.9466 17.6029 39.9466 17.4804 39.9479C17.3513 39.9471 17.3513 39.9471 17.2197 39.9463C17.1309 39.9465 17.0421 39.9468 16.9506 39.9471C16.7629 39.9472 16.5751 39.9467 16.3874 39.9456C16.1001 39.9442 15.813 39.9456 15.5258 39.9473C15.3434 39.9472 15.1609 39.9468 14.9785 39.9463C14.8497 39.9471 14.8497 39.9471 14.7183 39.9479C14.638 39.9471 14.5577 39.9462 14.475 39.9454C14.4046 39.9452 14.3343 39.9449 14.2618 39.9447C13.9464 39.8909 13.7386 39.7295 13.5304 39.4587C13.3933 39.071 13.3851 38.7159 13.4377 38.3036C13.6811 37.7472 13.9297 37.5692 14.4636 37.5619Z" fill="#145883" />
                        <path d="M29.229 37.5619C29.3487 37.5598 29.3487 37.5598 29.4708 37.5576C29.5566 37.5571 29.6424 37.5566 29.7308 37.5561C29.8194 37.5553 29.908 37.5545 29.9993 37.5537C30.1867 37.5524 30.3741 37.5516 30.5616 37.5513C30.8479 37.5502 31.1342 37.5458 31.4205 37.5413C31.6027 37.5405 31.7849 37.5398 31.9671 37.5394C32.0953 37.5368 32.0953 37.5368 32.2261 37.5341C32.8897 37.5386 32.8897 37.5386 33.1756 37.8031C33.4063 38.0952 33.5132 38.2747 33.5177 38.6733C33.492 39.1271 33.4242 39.4097 33.1249 39.7321C32.8832 39.9006 32.7 39.9339 32.4186 39.9366C32.3013 39.9384 32.3013 39.9384 32.1816 39.9401C32.0975 39.9403 32.0134 39.9405 31.9268 39.9407C31.7965 39.9416 31.7965 39.9416 31.6635 39.9425C31.4798 39.9434 31.296 39.9438 31.1123 39.9438C30.8316 39.9442 30.551 39.9474 30.2703 39.9508C30.0917 39.9513 29.9131 39.9517 29.7344 39.9519C29.6088 39.9538 29.6088 39.9538 29.4806 39.9557C29.0044 39.9524 28.7207 39.9199 28.3593 39.5536C28.131 39.1781 28.1533 38.743 28.203 38.3036C28.4465 37.7472 28.6951 37.5692 29.229 37.5619Z" fill="#145883" />
                        <path d="M21.7895 37.5735C21.8693 37.5723 21.9491 37.5712 22.0313 37.57C22.1612 37.569 22.1612 37.569 22.2937 37.568C22.3825 37.5673 22.4714 37.5666 22.5629 37.5658C22.7513 37.5646 22.9396 37.5636 23.128 37.5629C23.4157 37.5614 23.7034 37.5575 23.9911 37.5535C24.174 37.5526 24.3569 37.5519 24.5398 37.5513C24.6687 37.5489 24.6687 37.5489 24.8003 37.5465C25.2818 37.5481 25.5729 37.5737 25.9375 37.9464C26.1671 38.3222 26.1338 38.7562 26.0938 39.1964C25.9579 39.5804 25.7965 39.7423 25.4688 39.9107C25.1655 39.9529 24.8636 39.9525 24.5584 39.9526C24.4699 39.9533 24.3814 39.9539 24.2902 39.9546C24.1033 39.9556 23.9163 39.9559 23.7293 39.9555C23.4437 39.9554 23.1581 39.9591 22.8725 39.963C22.6906 39.9635 22.5088 39.9637 22.327 39.9637C22.1991 39.9659 22.1991 39.9659 22.0687 39.9682C21.4074 39.9613 21.4074 39.9613 21.1213 39.6967C20.8908 39.4053 20.7867 39.2266 20.7764 38.8299C20.801 38.3045 20.9221 38.0441 21.25 37.6786C21.443 37.5683 21.5736 37.5762 21.7895 37.5735Z" fill="#145883" />
                      </g>
                      <defs>
                        <clipPath id="clip0_413_489">
                          <rect width="40" height="40" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>


                  </div>

                  <div className="mx-3 space-y-1">
                    <div className="text-gray-500 font-semibold text-xs lg:text-sm">Total Tests</div>

                    <h4 className="text-2xl lg:text-3xl font-bold text-gray-700">{totalTests}</h4>

                    <p className="text-gray-500 text-xs lg:text-sm flex">

                      <div className='text-[#145883] flex flex-row items-center justify-between'>
                        <svg className='w-4 h-4 lg:w-5 lg:h-5' viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 17.5L10 5.5" stroke="#145883" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M4.1665 10.5L9.99984 4.66666L15.8332 10.5" stroke="#145883" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                        <span className='font-bold'>16%</span>
                      </div>


                      <span className='text-black font-semibold'>this month</span>

                    </p>

                  </div>
                </div>



              </div>


              {/* Major Test Request*/}
              <div className=" w-full px-4 sm:w-1/2 xl:w-1/4 my-2">

                <div className="flex items-center justify-center px-5 py-4 bg-[#E4EBEF] rounded-md shadow-sm">
                  <div className="p-4 bg-white bg-opacity-75 rounded-full">
                    <svg className='h-[26px] w-[26px] lg:w-[40px] lg:h-[40px]' viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.7813 2.10937C11.1585 2.29439 11.3662 2.52054 11.5626 2.89062C11.5626 3.01953 11.5626 3.14843 11.5626 3.28125C13.4188 3.28125 15.2751 3.28125 17.1876 3.28125C17.1876 3.12656 17.1876 2.97187 17.1876 2.8125C17.2791 2.65258 17.2791 2.65258 17.4024 2.51953C17.4622 2.45246 17.4622 2.45246 17.5233 2.38403C17.8283 2.11259 18.0992 2.07555 18.4962 2.08404C18.7673 2.12311 18.9334 2.24917 19.1407 2.42187C19.1874 2.4541 19.2341 2.48632 19.2823 2.51953C19.3751 2.65625 19.3751 2.65625 19.4532 3.28125C21.3094 3.28125 23.1657 3.28125 25.0782 3.28125C25.104 3.10078 25.1297 2.92031 25.1563 2.73437C25.3175 2.43902 25.5484 2.236 25.8594 2.10937C26.2179 2.05239 26.5413 2.07132 26.8653 2.24121C27.271 2.54145 27.3484 2.79581 27.4219 3.28125C27.5547 3.27941 27.5547 3.27941 27.6902 3.27753C28.0244 3.27323 28.3585 3.27057 28.6927 3.26837C28.8363 3.26721 28.9798 3.26562 29.1234 3.26357C30.9797 3.23773 32.4795 3.54963 33.8819 4.8584C34.9499 5.97606 35.3235 7.3349 35.3251 8.84096C35.3255 8.92715 35.3259 9.01335 35.3263 9.10215C35.3275 9.38608 35.328 9.66999 35.3284 9.95392C35.3289 10.1517 35.3293 10.3495 35.3298 10.5472C35.3305 10.9085 35.331 11.2697 35.3312 11.6309C35.3316 12.1617 35.3329 12.6924 35.3352 13.2231C35.3371 13.684 35.3377 14.1449 35.3378 14.6058C35.3381 14.8015 35.3387 14.9971 35.3397 15.1927C35.3411 15.4661 35.3409 15.7395 35.3404 16.0129C35.3411 16.0936 35.3418 16.1744 35.3426 16.2575C35.3401 16.6782 35.3192 16.9825 35.0782 17.3437C34.6891 17.6949 34.456 17.7578 33.9432 17.7512C33.5835 17.7199 33.4181 17.5652 33.1837 17.3047C32.9956 17.036 32.959 16.8371 32.9586 16.5174C32.9581 16.4074 32.9581 16.4074 32.9576 16.2951C32.9576 16.2148 32.9577 16.1344 32.9577 16.0516C32.9573 15.9245 32.9573 15.9245 32.9569 15.7948C32.9563 15.6104 32.9559 15.426 32.9556 15.2416C32.9551 14.9492 32.9539 14.6569 32.9524 14.3646C32.9483 13.5332 32.9445 12.7019 32.9433 11.8706C32.9426 11.3623 32.9403 10.8539 32.937 10.3456C32.936 10.1522 32.9356 9.95886 32.9358 9.7655C32.936 9.49401 32.9343 9.22259 32.9321 8.95111C32.9326 8.87202 32.9331 8.79292 32.9337 8.71144C32.9227 7.86375 32.6504 7.15686 32.0899 6.51855C31.4127 5.91828 30.6937 5.67008 29.7947 5.66314C29.6921 5.66104 29.6921 5.66104 29.5875 5.65889C29.3718 5.6547 29.1562 5.65203 28.9405 5.64941C28.7931 5.64682 28.6458 5.64412 28.4984 5.64132C28.1396 5.63473 27.7808 5.62949 27.4219 5.625C27.4107 5.71213 27.3995 5.79926 27.388 5.88903C27.3283 6.27095 27.222 6.37183 26.9532 6.64062C26.5886 6.86966 26.1975 6.83527 25.7813 6.79687C25.4914 6.69199 25.3702 6.55237 25.21 6.29883C25.0782 6.01562 25.0782 6.01562 25.0782 5.625C23.2219 5.625 21.3657 5.625 19.4532 5.625C19.4532 5.77968 19.4532 5.93437 19.4532 6.09375C19.2745 6.4313 19.1102 6.65896 18.7501 6.79687C18.3325 6.84859 17.9998 6.84947 17.6172 6.66504C17.4169 6.47972 17.295 6.3444 17.1876 6.09375C17.1876 5.93906 17.1876 5.78437 17.1876 5.625C15.3313 5.625 13.4751 5.625 11.5626 5.625C11.5368 5.83125 11.511 6.0375 11.4844 6.25C11.26 6.52174 11.0267 6.77428 10.665 6.82312C10.1937 6.82964 9.89748 6.81392 9.53131 6.48437C9.27215 6.22521 9.2638 5.98037 9.21881 5.625C8.78945 5.62847 8.36018 5.63396 7.93087 5.64121C7.78519 5.6434 7.63949 5.64506 7.49379 5.64617C6.3927 5.65502 5.39897 5.72149 4.53131 6.48437C3.89677 7.19792 3.71375 7.95575 3.7203 8.89187C3.71994 8.97334 3.71957 9.05481 3.71919 9.13875C3.71826 9.40982 3.719 9.68086 3.71974 9.95193C3.71942 10.1471 3.719 10.3422 3.71849 10.5373C3.71754 11.0111 3.71767 11.4849 3.71835 11.9587C3.71888 12.344 3.71895 12.7292 3.7187 13.1145C3.71866 13.1695 3.71863 13.2244 3.71859 13.2811C3.71852 13.3927 3.71844 13.5044 3.71836 13.6161C3.71769 14.6617 3.71846 15.7074 3.71972 16.753C3.72077 17.6491 3.72059 18.5451 3.71951 19.4412C3.71825 20.4832 3.71776 21.5253 3.71848 22.5674C3.71855 22.6786 3.71863 22.7899 3.7187 22.9011C3.71874 22.9558 3.71877 23.0106 3.71881 23.0669C3.71901 23.4515 3.71867 23.836 3.71812 24.2206C3.71739 24.7387 3.71791 25.2568 3.71927 25.775C3.71957 25.9649 3.71949 26.1548 3.71897 26.3447C3.71833 26.6044 3.71914 26.864 3.7203 27.1237C3.71978 27.1985 3.71926 27.2732 3.71872 27.3501C3.72607 28.1977 3.96322 28.8948 4.53131 29.5312C5.32502 30.2397 6.14542 30.3476 7.17909 30.3426C7.28621 30.3429 7.39332 30.3433 7.50043 30.3438C7.72951 30.3447 7.95858 30.3449 8.18767 30.3446C8.55017 30.344 8.91265 30.3453 9.27515 30.3468C10.1095 30.35 10.9439 30.3509 11.7783 30.3518C12.5443 30.3526 13.3104 30.3539 14.0764 30.3571C14.4366 30.3585 14.7967 30.3588 15.1568 30.3583C15.3808 30.3581 15.6048 30.359 15.8288 30.3601C15.9817 30.3605 16.1346 30.3598 16.2876 30.3591C17.1323 30.365 17.1323 30.365 17.5001 30.625C17.8225 30.9736 17.9154 31.2366 17.9075 31.7142C17.8705 32.0687 17.717 32.2876 17.461 32.5244C17.1635 32.7253 16.9411 32.7444 16.5904 32.7459C16.4985 32.7464 16.4067 32.747 16.312 32.7476C16.2111 32.7478 16.1102 32.748 16.0062 32.7482C15.8989 32.7487 15.7916 32.7492 15.6843 32.7498C15.3314 32.7514 14.9785 32.7522 14.6256 32.753C14.5038 32.7533 14.3819 32.7536 14.2601 32.754C13.6869 32.7554 13.1136 32.7566 12.5404 32.7572C11.8812 32.758 11.222 32.76 10.5627 32.7632C10.0519 32.7655 9.54107 32.7667 9.03022 32.767C8.72583 32.7671 8.42146 32.7678 8.11708 32.7698C6.21857 32.7815 4.43626 32.7417 2.97909 31.3484C1.6394 30.0133 1.28969 28.5391 1.28584 26.6993C1.28644 26.5147 1.28708 26.3301 1.28775 26.1455C1.28733 25.948 1.28677 25.7505 1.28609 25.553C1.28482 25.075 1.285 24.597 1.28591 24.1191C1.28662 23.7301 1.28671 23.3412 1.28637 22.9523C1.28632 22.8967 1.28627 22.8411 1.28623 22.7838C1.28613 22.6707 1.28602 22.5577 1.28592 22.4446C1.28503 21.3878 1.28605 20.3309 1.28773 19.2741C1.28913 18.3698 1.28889 17.4656 1.28745 16.5613C1.28577 15.5079 1.28512 14.4545 1.28608 13.4011C1.28618 13.2885 1.28627 13.1759 1.28637 13.0633C1.28642 13.0079 1.28647 12.9525 1.28652 12.8955C1.28678 12.5076 1.28633 12.1198 1.2856 11.7319C1.28462 11.2086 1.28533 10.6854 1.28713 10.1621C1.28754 9.97089 1.28742 9.77967 1.28673 9.58845C1.281 7.84552 1.4581 6.24562 2.71983 4.92649C3.73135 3.91151 4.99182 3.28895 6.44276 3.27238C6.57211 3.27239 6.70146 3.27282 6.83081 3.27362C6.93369 3.27378 6.93369 3.27378 7.03866 3.27395C7.25594 3.27439 7.47321 3.27537 7.69049 3.27636C7.83855 3.27676 7.98661 3.27711 8.13468 3.27743C8.49606 3.27829 8.85743 3.27964 9.21881 3.28125C9.24077 3.18275 9.26272 3.08426 9.28534 2.98278C9.36002 2.64774 9.49568 2.4842 9.76569 2.26562C10.0999 2.06951 10.4019 2.05658 10.7813 2.10937Z" fill="#145883" />
                      <path d="M35.3123 21.0156C35.3763 21.0678 35.4404 21.12 35.5064 21.1737C35.9721 21.5671 36.3487 22.0169 36.7185 22.5C36.7883 22.59 36.7883 22.59 36.8595 22.6819C38.328 24.6715 38.9374 27.1878 38.6075 29.6329C38.4446 30.6931 38.1414 31.6971 37.656 32.6563C37.6217 32.7257 37.5874 32.7952 37.552 32.8668C36.4447 35.0083 34.4948 36.6479 32.2215 37.417C29.712 38.2138 27.0435 38.0651 24.672 36.8837C22.3429 35.6538 20.7278 33.5999 19.9076 31.1285C19.1663 28.699 19.4457 26.0825 20.6101 23.8379C20.9299 23.2436 21.2823 22.7043 21.7185 22.1875C21.8158 22.0712 21.8158 22.0712 21.9151 21.9525C22.7593 20.9731 23.7728 20.2682 24.9217 19.6875C25.009 19.6433 25.0963 19.5991 25.1863 19.5535C28.5131 18.0062 32.5414 18.6914 35.3123 21.0156ZM23.701 23.4598C22.2708 25.0946 21.7337 27.0718 21.8748 29.2188C21.9331 29.674 22.0493 30.11 22.1873 30.5469C22.2147 30.6357 22.2421 30.7245 22.2703 30.816C22.6237 31.8345 23.2394 32.6691 23.9842 33.4375C24.0253 33.4843 24.0663 33.5312 24.1087 33.5794C25.1786 34.7558 26.8587 35.4462 28.4234 35.5634C29.3345 35.6055 30.2177 35.5849 31.0935 35.3125C31.1427 35.2974 31.1919 35.2823 31.2425 35.2667C32.4105 34.8978 33.3384 34.2907 34.2185 33.4375C34.2663 33.3955 34.314 33.3535 34.3632 33.3102C35.4978 32.2767 36.2479 30.4938 36.3376 28.9765C36.4125 26.7616 35.7389 24.9369 34.3022 23.2617C33.0831 21.9641 31.285 21.1408 29.5066 21.0779C27.2625 21.0404 25.2689 21.829 23.701 23.4598Z" fill="#145883" />
                      <path d="M32.4217 25.7813C32.727 25.94 32.9078 26.1469 33.0809 26.4404C33.1863 26.9208 33.1341 27.2331 32.8904 27.6563C32.4275 28.161 31.8504 28.5687 31.3102 28.988C30.9999 29.2296 30.695 29.4777 30.3904 29.7266C29.9839 30.0579 29.5762 30.3876 29.1648 30.7129C29.0988 30.7655 29.0988 30.7655 29.0313 30.8192C28.6096 31.1512 28.2831 31.3876 27.7342 31.4063C27.0232 31.2878 26.6662 30.6931 26.2498 30.1563C26.1783 30.066 26.1066 29.9757 26.035 29.8856C25.8416 29.6405 25.6543 29.3915 25.4686 29.1406C25.4238 29.0819 25.3791 29.0232 25.3331 28.9627C25.0678 28.5864 25.0017 28.2688 25.0779 27.8125C25.2158 27.4067 25.4044 27.2306 25.7811 27.0313C26.0926 26.9364 26.3847 26.9292 26.7015 27.0163C27.0997 27.2301 27.375 27.6232 27.6561 27.9688C27.7153 28.0391 27.7745 28.1095 27.8355 28.1821C27.9686 28.3594 27.9686 28.3594 27.9686 28.5156C28.5277 28.0915 29.0799 27.6602 29.6238 27.2168C29.6768 27.1736 29.7299 27.1304 29.7845 27.0858C29.8873 27.0019 29.9901 26.918 30.0929 26.8341C30.6042 26.4167 30.6042 26.4167 30.858 26.218C30.9883 26.1151 31.1148 26.0074 31.24 25.8984C31.6282 25.7121 32.0004 25.7062 32.4217 25.7813Z" fill="#145883" />
                      <path d="M18.3203 21.0547C18.4074 21.0535 18.4945 21.0523 18.5843 21.051C19.0789 21.0534 19.3928 21.0697 19.7656 21.4063C20.0512 21.7294 20.1289 21.9824 20.1083 22.4027C20.0437 22.778 19.8783 23.0405 19.5703 23.2715C19.1621 23.4552 18.7809 23.4543 18.3398 23.457C18.2436 23.4595 18.2436 23.4595 18.1454 23.4619C17.6943 23.4648 17.3637 23.3933 16.9531 23.2031C16.6634 22.906 16.5516 22.6529 16.5381 22.2412C16.5434 21.8789 16.6307 21.6827 16.875 21.4063C17.3124 21.0114 17.7512 21.0468 18.3203 21.0547Z" fill="#145883" />
                      <path d="M10.0049 21.0596C10.0879 21.059 10.171 21.0585 10.2565 21.0579C10.6948 21.0615 11.0321 21.074 11.4062 21.3281C11.6722 21.6156 11.7866 21.8176 11.8164 22.2119C11.7875 22.6388 11.6508 22.9077 11.333 23.1885C10.9176 23.4852 10.515 23.4565 10.0195 23.4619C9.95165 23.4642 9.88378 23.4664 9.81384 23.4688C9.34056 23.4734 8.98823 23.394 8.59375 23.125C8.31374 22.838 8.26014 22.6108 8.24707 22.2217C8.26154 21.888 8.27924 21.6579 8.51562 21.4063C9.00073 21.0507 9.41521 21.0484 10.0049 21.0596Z" fill="#145883" />
                      <path d="M26.6212 13.8037C26.7049 13.8014 26.7887 13.7992 26.8751 13.7968C27.3904 13.7927 27.7071 13.8319 28.1251 14.1406C28.4102 14.4442 28.3987 14.7848 28.3869 15.1828C28.3479 15.4778 28.2477 15.6423 28.0469 15.8594C27.5909 16.19 27.1598 16.1881 26.6163 16.1914C26.5515 16.193 26.4867 16.1946 26.4199 16.1963C25.9405 16.1993 25.5533 16.1448 25.1765 15.8203C24.8827 15.4313 24.8108 15.1745 24.8438 14.6875C24.9801 14.3217 25.1462 14.124 25.4688 13.9062C25.8446 13.781 26.2275 13.8072 26.6212 13.8037Z" fill="#145883" />
                      <path d="M10.0048 13.7939C10.0878 13.7934 10.1709 13.7928 10.2564 13.7923C10.6948 13.7958 11.032 13.8084 11.4062 14.0625C11.6721 14.35 11.7866 14.552 11.8163 14.9463C11.7874 15.3732 11.6507 15.6421 11.3329 15.9229C10.9257 16.2137 10.5437 16.1884 10.0585 16.1914C9.96228 16.1938 9.96228 16.1938 9.86411 16.1963C9.41305 16.1991 9.08221 16.128 8.67179 15.9375C8.29526 15.5417 8.25736 15.2731 8.26499 14.7418C8.28563 14.4732 8.33003 14.3381 8.51554 14.1406C9.00065 13.7851 9.41513 13.7828 10.0048 13.7939Z" fill="#145883" />
                      <path d="M18.3204 13.7891C18.4075 13.7878 18.4946 13.7866 18.5844 13.7854C19.079 13.7878 19.3929 13.8041 19.7657 14.1406C20.0513 14.4638 20.129 14.7167 20.1084 15.137C20.0438 15.5124 19.8784 15.7749 19.5704 16.0059C19.1608 16.1902 18.7777 16.1887 18.3351 16.1914C18.2703 16.193 18.2055 16.1946 18.1387 16.1963C17.5953 16.1997 17.2273 16.1079 16.8067 15.7422C16.5484 15.4382 16.5353 15.171 16.5409 14.7876C16.5857 14.4195 16.795 14.2129 17.06 13.9737C17.4375 13.7301 17.8877 13.7831 18.3204 13.7891Z" fill="#145883" />
                    </svg>


                  </div>

                  <div className="mx-3 space-y-1">
                    <div className="text-gray-500 font-semibold text-xs lg:text-sm">Major Test Request</div>

                    <h4 className="text-2xl lg:text-3xl font-bold text-gray-700">{majorTests}</h4>

                    <p className="text-gray-500 text-xs lg:text-sm flex">

                      <div className='text-[#145883] flex flex-row items-center justify-between'>
                        <svg className='w-4 h-4 lg:w-5 lg:h-5' viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 17.5L10 5.5" stroke="#145883" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M4.1665 10.5L9.99984 4.66666L15.8332 10.5" stroke="#145883" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                        <span className='font-bold'>16%</span>
                      </div>


                      <span className='text-black font-semibold'>this month</span>

                    </p>

                  </div>
                </div>



              </div>


              {/*Total Revenue   */}

              <div className=" w-full px-4  sm:w-1/2 xl:w-1/4 my-2">

                <div className="flex items-center justify-center px-5 py-4 bg-[#E4EBEF] rounded-md shadow-sm">
                  <div className="p-4 bg-white bg-opacity-75 rounded-full">
                    <svg className='h-[26px] w-[26px] lg:w-[40px] lg:h-[40px]' viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_413_515)">
                        <path d="M11.6749 -0.0293089C11.7651 -0.0289713 11.8553 -0.0286338 11.9482 -0.0282861C13.2645 -0.0225217 14.5597 0.00746867 15.8594 0.234363C15.9823 0.255096 15.9823 0.255096 16.1076 0.276248C18.5048 0.690494 21.4729 1.40545 22.9688 3.51561C23.2419 3.98095 23.3687 4.36429 23.3709 4.9066C23.3718 5.04556 23.3718 5.04556 23.3726 5.18734C23.3728 5.28872 23.373 5.39011 23.3733 5.49456C23.3737 5.60264 23.3743 5.71071 23.3748 5.81879C23.3765 6.1735 23.3773 6.52821 23.378 6.88292C23.3784 7.00528 23.3787 7.12763 23.379 7.24999C23.3805 7.82505 23.3816 8.40012 23.3823 8.97518C23.383 9.63774 23.3851 10.3003 23.3882 10.9628C23.3906 11.4757 23.3917 11.9886 23.392 12.5015C23.3922 12.8074 23.3929 13.1134 23.3949 13.4193C23.3967 13.7075 23.397 13.9956 23.3962 14.2838C23.3961 14.4389 23.3976 14.594 23.3992 14.7491C23.394 15.6392 23.161 16.282 22.5782 16.9531C22.5342 17.0045 22.4902 17.0558 22.4448 17.1088C20.5704 19.137 17.108 19.6152 14.5313 19.9219C14.4458 19.9321 14.4458 19.9321 14.3585 19.9425C13.8514 19.9988 13.3493 20.0137 12.8394 20.0159C12.7534 20.0163 12.6674 20.0167 12.5789 20.0172C12.3971 20.0179 12.2154 20.0185 12.0336 20.0188C11.763 20.0195 11.4923 20.0219 11.2217 20.0244C9.64953 20.0319 8.09104 19.8984 6.5479 19.5898C6.46527 19.5735 6.38264 19.5572 6.29751 19.5403C4.69144 19.2093 3.10014 18.7144 1.7188 17.8125C1.72033 18.146 1.7244 18.4794 1.73072 18.8129C1.73252 18.9261 1.73365 19.0393 1.73408 19.1525C1.73068 20.0787 1.73068 20.0787 2.18755 20.8594C4.37897 23.0061 8.64792 23.2386 11.4877 23.2123C11.8872 23.2071 12.2866 23.2 12.686 23.1924C12.9836 23.1873 13.2812 23.184 13.5788 23.1808C13.7142 23.1773 13.7142 23.1773 13.8523 23.1737C14.4718 23.1679 14.4718 23.1679 14.7813 23.351C15.0328 23.6453 15.0303 23.8818 15.0281 24.259C15.0001 24.4531 15.0001 24.4531 14.8145 24.6924C14.2646 25.0983 13.5052 25.0131 12.847 25.0159C12.7609 25.0163 12.6748 25.0167 12.5861 25.0172C12.4039 25.0179 12.2217 25.0185 12.0395 25.0188C11.7682 25.0195 11.4968 25.0219 11.2255 25.0244C9.652 25.0319 8.09237 24.8987 6.5479 24.5898C6.46527 24.5735 6.38264 24.5572 6.29751 24.5403C4.69144 24.2093 3.10014 23.7144 1.7188 22.8125C1.72033 23.146 1.7244 23.4794 1.73072 23.8129C1.73252 23.9261 1.73365 24.0393 1.73408 24.1525C1.73068 25.0787 1.73068 25.0787 2.18755 25.8594C4.37897 28.0061 8.64792 28.2386 11.4877 28.2123C11.8872 28.2071 12.2866 28.2 12.686 28.1924C12.9836 28.1873 13.2812 28.184 13.5788 28.1808C13.7142 28.1773 13.7142 28.1773 13.8523 28.1737C14.4718 28.1679 14.4718 28.1679 14.7813 28.351C15.0328 28.6453 15.0303 28.8818 15.0281 29.259C15.0001 29.4531 15.0001 29.4531 14.8145 29.6924C14.2646 30.0983 13.5052 30.0131 12.847 30.0159C12.7609 30.0163 12.6748 30.0167 12.5861 30.0172C12.4039 30.0179 12.2217 30.0185 12.0395 30.0188C11.7682 30.0195 11.4968 30.0219 11.2255 30.0244C9.652 30.0319 8.09237 29.8987 6.5479 29.5898C6.46527 29.5735 6.38264 29.5572 6.29751 29.5403C4.69144 29.2093 3.10014 28.7144 1.7188 27.8125C1.72033 28.146 1.7244 28.4794 1.73072 28.8129C1.73252 28.9261 1.73365 29.0393 1.73408 29.1525C1.73068 30.0787 1.73068 30.0787 2.18755 30.8594C4.37897 33.0061 8.64792 33.2386 11.4877 33.2123C11.8872 33.2071 12.2866 33.2 12.686 33.1924C12.9836 33.1873 13.2812 33.184 13.5788 33.1808C13.7142 33.1773 13.7142 33.1773 13.8523 33.1737C14.4718 33.1679 14.4718 33.1679 14.7813 33.351C15.0328 33.6453 15.0303 33.8818 15.0281 34.259C15.0001 34.4531 15.0001 34.4531 14.8145 34.6924C14.2646 35.0983 13.5052 35.0131 12.847 35.0159C12.7609 35.0163 12.6748 35.0167 12.5861 35.0172C12.4039 35.0179 12.2217 35.0185 12.0395 35.0188C11.7682 35.0195 11.4968 35.0219 11.2255 35.0244C9.652 35.0319 8.09237 34.8987 6.5479 34.5898C6.46527 34.5735 6.38264 34.5572 6.29751 34.5403C4.3123 34.1312 1.81789 33.4501 0.543874 31.7392C0.206817 31.2267 -0.0191796 30.7839 -0.0200479 30.1595C-0.0205517 30.0676 -0.0210559 29.9758 -0.021575 29.8811C-0.021333 29.7808 -0.0210911 29.6806 -0.0208418 29.5773C-0.0211339 29.4692 -0.0214936 29.3611 -0.0219147 29.253C-0.0228698 28.9562 -0.02285 28.6595 -0.0226657 28.3628C-0.0226338 28.0426 -0.0234961 27.7224 -0.0242369 27.4022C-0.0255345 26.7751 -0.0259642 26.1479 -0.0260513 25.5208C-0.0261255 25.0109 -0.0264465 24.501 -0.0269418 23.9912C-0.0283177 22.5453 -0.029039 21.0994 -0.0289218 19.6535C-0.0289156 19.5756 -0.0289092 19.4976 -0.0289028 19.4173C-0.0288964 19.3393 -0.0288903 19.2613 -0.0288837 19.1809C-0.0288202 17.9164 -0.0303151 16.652 -0.0325184 15.3875C-0.0347633 14.0888 -0.035841 12.7902 -0.035706 11.4915C-0.0356542 10.7626 -0.0360835 10.0336 -0.037766 9.30466C-0.0391894 8.68395 -0.0395272 8.06326 -0.0384669 7.44256C-0.0379571 7.126 -0.0379469 6.80947 -0.0393038 6.49291C-0.0405346 6.20279 -0.0403076 5.9127 -0.0389473 5.62257C-0.038595 5.46861 -0.0397726 5.31465 -0.0410156 5.16069C-0.0331499 4.14589 0.303683 3.47822 0.992482 2.74993C3.61748 0.267589 8.28232 -0.0535712 11.6749 -0.0293089ZM1.95318 4.29686C1.74486 4.61584 1.65813 4.85515 1.7188 5.23436C2.13642 6.24677 3.23703 6.70665 4.18023 7.10807C8.69668 8.94931 14.8741 8.82524 19.3751 7.03124C20.2209 6.67049 21.0441 6.17301 21.5625 5.39061C21.6395 5.09382 21.6611 4.90765 21.5674 4.61425C20.4974 3.0254 18.205 2.45294 16.4258 2.0996C12.2702 1.33583 5.15361 0.912235 1.95318 4.29686ZM21.2305 7.93944C19.2086 9.15599 16.8409 9.56886 14.5313 9.84374C14.4743 9.85056 14.4172 9.85739 14.3585 9.86442C13.8514 9.92064 13.3493 9.93562 12.8394 9.93773C12.7534 9.93818 12.6674 9.93862 12.5789 9.93908C12.3971 9.93982 12.2154 9.94033 12.0336 9.94063C11.763 9.94138 11.4923 9.9438 11.2217 9.94628C9.64953 9.95375 8.09104 9.82031 6.5479 9.51171C6.46527 9.49537 6.38264 9.47904 6.29751 9.46221C4.88123 9.17032 3.29034 8.78095 2.08043 7.95012C1.89462 7.79799 1.89462 7.79799 1.7188 7.81249C1.70907 8.14595 1.70202 8.47933 1.69734 8.81289C1.69539 8.9261 1.69273 9.0393 1.68933 9.15248C1.65695 10.0774 1.65695 10.0774 2.10943 10.8594C2.16119 10.9165 2.21295 10.9736 2.26629 11.0324C5.39917 13.5815 10.6858 13.5764 14.4971 13.1885C16.8389 12.9176 19.8695 12.483 21.4612 10.5408C21.6674 10.2352 21.6498 9.96199 21.6483 9.60357C21.6482 9.55014 21.6481 9.49672 21.648 9.44167C21.6475 9.27133 21.6466 9.10099 21.6456 8.93065C21.6452 8.81504 21.6448 8.69943 21.6445 8.58382C21.6436 8.30066 21.6423 8.01752 21.6407 7.73436C21.4902 7.73436 21.3533 7.86219 21.2305 7.93944ZM21.2305 12.9394C19.2086 14.156 16.8409 14.5689 14.5313 14.8437C14.4743 14.8506 14.4172 14.8574 14.3585 14.8644C13.8514 14.9206 13.3493 14.9356 12.8394 14.9377C12.7534 14.9382 12.6674 14.9386 12.5789 14.9391C12.3971 14.9398 12.2154 14.9403 12.0336 14.9406C11.763 14.9414 11.4923 14.9438 11.2217 14.9463C9.64953 14.9538 8.09104 14.8203 6.5479 14.5117C6.46527 14.4954 6.38264 14.479 6.29751 14.4622C4.88123 14.1703 3.29034 13.781 2.08043 12.9501C1.89462 12.798 1.89462 12.798 1.7188 12.8125C1.70907 13.1459 1.70202 13.4793 1.69734 13.8129C1.69539 13.9261 1.69273 14.0393 1.68933 14.1525C1.65695 15.0774 1.65695 15.0774 2.10943 15.8594C2.16119 15.9165 2.21295 15.9736 2.26629 16.0324C5.39917 18.5815 10.6858 18.5764 14.4971 18.1885C16.8389 17.9176 19.8695 17.483 21.4612 15.5408C21.6674 15.2352 21.6498 14.962 21.6483 14.6036C21.6482 14.5501 21.6481 14.4967 21.648 14.4417C21.6475 14.2713 21.6466 14.101 21.6456 13.9307C21.6452 13.815 21.6448 13.6994 21.6445 13.5838C21.6436 13.3007 21.6423 13.0175 21.6407 12.7344C21.4902 12.7344 21.3533 12.8622 21.2305 12.9394Z" fill="#145883" />
                        <path d="M27.1488 19.9814C27.2325 19.9806 27.3163 19.9798 27.4025 19.9791C29.2813 19.9655 31.1146 19.9855 32.9685 20.3125C33.051 20.3267 33.1335 20.3409 33.2185 20.3556C35.3816 20.7417 38.163 21.4804 39.531 23.3594C39.8511 23.8576 40.0088 24.2389 40.0112 24.8344C40.012 24.9753 40.012 24.9753 40.0129 25.1191C40.0131 25.222 40.0133 25.3248 40.0135 25.4308C40.014 25.5404 40.0145 25.65 40.0151 25.7596C40.0167 26.1194 40.0175 26.4792 40.0183 26.839C40.0186 26.9631 40.019 27.0872 40.0193 27.2113C40.0208 27.7945 40.0219 28.3777 40.0225 28.961C40.0233 29.633 40.0254 30.305 40.0285 30.977C40.0309 31.4972 40.032 32.0174 40.0323 32.5376C40.0325 32.8479 40.0332 33.1582 40.0351 33.4685C40.037 33.7608 40.0373 34.053 40.0365 34.3453C40.0364 34.5027 40.0379 34.66 40.0395 34.8173C40.0338 35.8064 39.7404 36.4716 39.0622 37.1875C37.1952 38.9508 34.3335 39.5188 31.8747 39.8437C31.8245 39.8505 31.7743 39.8574 31.7226 39.8644C30.6889 40.001 29.6627 40.0267 28.6209 40.0247C28.3564 40.0244 28.0921 40.0262 27.8276 40.0282C24.5396 40.0378 20.1844 39.5833 17.6706 37.2024C17.0531 36.5838 16.6326 35.993 16.6288 35.0934C16.6283 35.0007 16.6277 34.9081 16.6271 34.8126C16.6269 34.7113 16.6267 34.6099 16.6265 34.5054C16.626 34.3973 16.6255 34.2893 16.625 34.1812C16.6233 33.8265 16.6225 33.4718 16.6217 33.1171C16.6214 32.9947 16.6211 32.8723 16.6208 32.75C16.6193 32.1749 16.6182 31.5999 16.6175 31.0248C16.6167 30.3622 16.6147 29.6997 16.6115 29.0372C16.6092 28.5243 16.608 28.0114 16.6078 27.4985C16.6076 27.1925 16.6069 26.8866 16.6049 26.5807C16.6031 26.2925 16.6028 26.0043 16.6036 25.7162C16.6036 25.5611 16.6021 25.406 16.6006 25.2509C16.6057 24.3608 16.8388 23.718 17.4216 23.0469C17.4656 22.9955 17.5096 22.9441 17.5549 22.8912C19.7223 20.5459 24.1658 20.004 27.1488 19.9814ZM18.6765 24.292C18.4421 24.5736 18.3451 24.7799 18.3591 25.1562C18.6035 25.9221 19.3449 26.3701 20.0183 26.7282C23.5949 28.5503 28.2962 28.6597 32.1872 28.0469C32.2699 28.0339 32.3526 28.0209 32.4379 28.0075C34.304 27.7009 36.7375 27.2032 38.0466 25.7031C38.257 25.3843 38.3418 25.1458 38.281 24.7656C37.8373 23.6901 36.6234 23.2302 35.6247 22.8125C34.1403 22.2098 32.5216 21.9616 30.9372 21.7969C30.869 21.7894 30.8008 21.7819 30.7305 21.7742C29.9691 21.6998 29.2064 21.6997 28.4421 21.6992C28.3336 21.6991 28.3336 21.6991 28.2229 21.699C25.1649 21.7026 20.9444 21.9193 18.6765 24.292ZM18.3591 27.7344C18.3533 28.0707 18.349 28.407 18.3462 28.7433C18.345 28.8576 18.3434 28.9719 18.3414 29.0861C18.3385 29.251 18.3372 29.4158 18.3362 29.5807C18.335 29.6797 18.3337 29.7787 18.3325 29.8807C18.383 30.4035 18.6523 30.7366 19.0195 31.0876C22.044 33.5555 27.2392 33.5432 30.9087 33.2168C31.3368 33.1715 31.762 33.1138 32.1872 33.0469C32.2699 33.0339 32.3526 33.0209 32.4379 33.0075C34.2597 32.7082 36.7986 32.2177 38.0466 30.7031C38.2622 30.3406 38.3091 30.0785 38.3038 29.6588C38.3035 29.6057 38.3032 29.5526 38.3028 29.4979C38.3015 29.33 38.2986 29.1621 38.2956 28.9941C38.2944 28.8796 38.2934 28.765 38.2924 28.6505C38.2898 28.3711 38.2858 28.0918 38.281 27.8125C38.0121 27.9171 37.7611 28.0359 37.5071 28.1729C35.9471 29 34.2282 29.3906 32.4997 29.6875C32.4207 29.7015 32.3417 29.7155 32.2603 29.7299C30.954 29.9502 29.6361 29.9458 28.3151 29.9512C28.1849 29.9521 28.1849 29.9521 28.052 29.9531C24.668 29.9716 21.3346 29.3855 18.3591 27.7344ZM18.3591 32.7344C18.3533 33.0707 18.349 33.407 18.3462 33.7434C18.345 33.8576 18.3434 33.9719 18.3414 34.0861C18.3385 34.251 18.3372 34.4158 18.3362 34.5807C18.335 34.6797 18.3337 34.7787 18.3325 34.8807C18.383 35.4035 18.6523 35.7366 19.0195 36.0876C22.044 38.5555 27.2392 38.5432 30.9087 38.2168C31.3368 38.1715 31.762 38.1138 32.1872 38.0469C32.2699 38.0339 32.3526 38.0209 32.4379 38.0075C34.2597 37.7082 36.7986 37.2177 38.0466 35.7031C38.2622 35.3406 38.3091 35.0785 38.3038 34.6588C38.3035 34.6057 38.3032 34.5526 38.3028 34.4979C38.3015 34.33 38.2986 34.1621 38.2956 33.9941C38.2944 33.8796 38.2934 33.765 38.2924 33.6505C38.2898 33.3711 38.2858 33.0918 38.281 32.8125C38.0121 32.9171 37.7611 33.0359 37.5071 33.1729C35.9471 34 34.2282 34.3906 32.4997 34.6875C32.4207 34.7015 32.3417 34.7155 32.2603 34.7299C30.954 34.9502 29.6361 34.9458 28.3151 34.9512C28.1849 34.9521 28.1849 34.9521 28.052 34.9531C24.668 34.9716 21.3346 34.3855 18.3591 32.7344Z" fill="#145883" />
                      </g>
                      <defs>
                        <clipPath id="clip0_413_515">
                          <rect width="40" height="40" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>


                  </div>

                  <div className="mx-3 space-y-1">
                    <div className="text-gray-500 font-semibold text-xs lg:text-sm">Total Revenue</div>

                    <h4 className="text-2xl lg:text-3xl font-bold text-gray-700">₹{formatRevenue(totalRevenue)}</h4>

                    <p className="text-gray-500 text-xs lg:text-sm flex">

                      <div className='text-[#145883] flex flex-row items-center justify-between'>
                        <svg className='w-4 h-4 lg:w-5 lg:h-5' viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 17.5L10 5.5" stroke="#145883" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M4.1665 10.5L9.99984 4.66666L15.8332 10.5" stroke="#145883" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                        <span className='font-bold'>16%</span>
                      </div>


                      <span className='text-black font-semibold'>this month</span>

                    </p>

                  </div>
                </div>



              </div>






            </div>
          </div>


          {/* Data Charts */}


          <div className='mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4'>
            {/* Bar chart */}
            <div className='rounded bg-[#E4EBEF] md:col-span-2 lg:col-span-3'>
              <div id="chart">
                <div className="px-4 py-4 flex flex-col justify-between h-full">
                  {/* Top Section */}
                  <div className="flex justify-between items-center w-full">
                    {/* Revenue Details */}
                    <div className="flex flex-col items-start space-y-1">
                      <p className="text-lg md:text-base text-sm font-semibold text-[#145883]">Laboratory Total Revenue Trend</p>
                    </div>

                    {/* Dropdown Menu */}
                    <div>
                      <select
                        onChange={(e) => setSelectedRange(e.target.value)}
                        className="text-black border-2 border-[#A5A9AB] font-semibold bg-[#E4EBEF] rounded text-sm px-3 py-1 focus:outline-none transition-all duration-300 ease-in-out hover:bg-gray-100"
                      >
                        <option value="daily">Daily</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                  </div>
                </div>
                <ReactApexChart options={barData.options} series={barData.series} type="bar" height={250} />
              </div>
            </div>

            {/* Range Column chart */}
            <div className='rounded bg-[#E4EBEF]  md:col-span-1 lg:col-span-2'>
              <div id="chart">
                <div className="px-4 py-4 flex flex-col justify-between">
                  {/* Top Section */}
                  <div className="flex justify-between items-center w-full">
                    {/* Revenue Details */}
                    <div className="flex flex-col items-start space-y-1">
                      <p className="text-lg font-semibold text-[#145883]">Laboratory Patient Trend</p>
                    </div>

                    {/* Dropdown Menu */}
                    {/* <div>
                      <select
                        className="text-black border-2 border-[#A5A9AB] font-semibold bg-[#E4EBEF] rounded text-sm px-3 py-1 focus:outline-none transition-all duration-300 ease-in-out hover:bg-gray-100"
                      >
                        <option value="last-year">Yearly</option>
                        <option value="last-year">Monthly</option>
                        <option value="last-week">Weekly</option>
                        <option value="day-wise">Day wise</option>
                      </select>
                    </div> */}
                  </div>
                </div>
                <ReactApexChart
                  options={RangeColumnChart.options}
                  series={RangeColumnChart.series}
                  type="rangeBar"
                  height={250}
                />
              </div>
            </div>
          </div>





          <div className='mt-4 grid lg:grid-cols-6 md:grid-cols-3 grid-cols-1 gap-4'>

            {/* Line Column chart */}

            <div className='rounded bg-[#E4EBEF] col-span-1  md:col-span-2 lg:col-span-4'>
              <div id="chart">

                <div className="px-4 py-4 flex flex-col justify-between h-full  ">
                  {/* Top Section */}
                  <div className="flex justify-between items-center w-full">
                    {/* Revenue Details */}
                    <div className="flex flex-col items-start space-y-1">
                      <p className=" text-lg font-semibold text-[#145883]">
                        Laboratory Revenue and Patient Trend
                      </p>
                    </div>

                    {/* Button Side by Side */}
                    <div>
                      <select
                        value={selectedRange2} onChange={e => setSelectedRange2(e.target.value)} className="text-black border-2 border-[#A5A9AB]  font-semibold bg-[#E4EBEF] rounded text-sm px-3 py-1 focus:outline-none  transition-all duration-300 ease-in-out hover:bg-gray-100"
                      >
                        <option value="yearly">Yearly</option>
                        <option value="monthly">Monthly</option>
                        <option value="daily">Day wise</option>
                      </select>
                    </div>
                  </div>
                </div>


                <ReactApexChart options={LineColumn.options} series={LineColumn.series} type="line" height={350} />
              </div>
              <div id="html-dist"></div>

            </div>

            {/* Pie Chart */}

            <div className='rounded bg-[#E4EBEF]  md:col-span-1 lg:col-span-2'>
              <div id="chart">

                <div className="px-4 py-4 flex flex-col justify-between h-full  ">
                  {/* Top Section */}
                  <div className="flex justify-between items-center w-full">
                    {/* Revenue Details */}
                    <div className="flex flex-col items-start space-y-1">
                      <p className=" text-lg font-semibold text-[#145883]">
                        Revenue shared by tests
                      </p>
                    </div>


                  </div>
                </div>
                <ReactApexChart options={pieData.options} series={pieData.series} type="donut" />
              </div>
              <div id="html-dist"></div>

            </div>
          </div>


          {/* User Filter Table */}

          <div className="relative overflow-x-auto    mx-auto  items-center     py-2">
            {/* Header with Title and Search Box */}


            {/* Title */}
            <h1 className="text-lg md:text-xl lg:text-xl  py-2 font-bold text-[#145883]">Patients Management</h1>

            <div className="flex justify-between items-center mb-4">


              {/* Search Input Box with SVG Icon */}
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name,PRN"
                  className="text-sm px-4 py-1 border rounded border-[#767A7D] focus:outline-none focus:ring-2 focus:ring-gray-600 pr-10" // Added padding-right to make space for the icon
                />
                {/* Search Icon (SVG) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#145883]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>
              </div>


              { }






            </div>




            {/* Table */}
            <table className="w-full text-sm text-center text-black">
              <thead className="text-base text-[#145883]  whitespace-nowrap bg-[#F0F2F3]">

                <tr>
                  {/* <th className="px-6 py-3">Sales Items</th>
                  <th className="px-6 py-3">Sales id</th>
                  <th className="px-6 py-3">Item id</th> */}
                  <th className="px-6 py-3">Sl. no</th>
                  <th className="px-6 py-3">Test id</th>
                  <th className="px-6 py-3">Test Name</th>
                  <th className="px-6 py-3">Patient Name</th>
                  <th className="px-6 py-3">Collection Date</th>
                  <th className="px-6 py-3">Payment</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Reports</th>
                </tr>
              </thead>


              <tbody>
                {filteredPatients.length > 0 ? (
                  filteredPatients
                    .sort((a, b) => {
                      // Sort by 'created_at' field in descending order (latest first)
                      const dateA = new Date(a.created_at);
                      const dateB = new Date(b.created_at);
                      return dateB - dateA; // Descending order
                    })
                    .map((patient,index) => (
                      <tr key={patient.sales_item_id} className="bg-white border-b">
                        {/* <td className="px-6 py-4">{patient.sales_item_id}</td>
                        <td className="px-6 py-4">{patient.sales_id}</td>
                        <td className="px-6 py-4">{patient.item_id}</td> */}
                        <td className="px-6 py-4">{index + 1}</td>
                        <td className="px-6 py-4">{patient.sales_item_id}</td>
                        <td className="px-6 py-4">{patient.item_name}</td>
                        <td className="px-6 py-4">{patient.patient_name}</td>
                        <td className="px-6 py-4">
                          {new Intl.DateTimeFormat('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          }).format(new Date(patient.created_at))}
                        </td>
                        <td className="px-6 py-4">{patient.payment_type?patient.payment_type:'-'}</td>
                        <td className="px-6 py-4 ">
                          <span
                            className={`px-2 py-1 rounded ${patient.status === 'Sample Received'
                                ? 'bg-blue-400'
                                : patient.status === 'Report Generated'
                                  ? 'bg-green-400'
                                  : 'bg-yellow-400'
                              } font-semibold`}
                          >
                            {patient.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 ">
                          <Link
                            to={patient.isReportAvailable ? '/report-showcase' : '/report-entry'}
                            state={{ data: { patient } }}
                            style={{
                              background: 'linear-gradient(180deg, #145883 0%, #01263E 100%)',
                            }}
                            className=" whitespace-nowrap rounded font-bold text-white  px-4 py-2 hover:bg-blue-600 focus:outline-none shadow-md transition-all duration-300 ease-in-out"
                          >
                            {patient.status === 'Report Generated' || patient.status === 'Sample Received' ? 'View' : 'Update'}
                          </Link>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>




        </div>








      </main>
    </>


  );
};

export default Dashboard;


// const [chartData] = useState({
//   series: [
//     {
//       color: "#145883",
//       name: "Last 8 days",
//       data: [10, 60, 35, 51, 49, 14, 69, 41, 148]

//     },
//     {
//       color: "#B5B7B8",
//       name: "Last Week",
//       data: [43, 10, 89, 20, 50, 70, 24, 88, 140],

//     }
//   ],
//   options: {
//     chart: {
//       height: 350,
//       type: 'line',
//       zoom: {
//         enabled: false
//       }
//     },
//     dataLabels: {
//       enabled: false
//     },
//     stroke: {
//       curve: 'straight'
//     },
//     // title: {
//     //   text: 'Revenue',
//     //   align: 'left'
//     // },
//     grid: {
//       row: {
//         // colors: ['#f3f3f3', 'transparent'], // alternating row colors
//         opacity: 0.5
//       }
//     },
//     xaxis: {
//       categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
//     }
//   }
// });
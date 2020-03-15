const fs = require("fs");
const neatCsv = require("neat-csv");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const dailyReportsPath = "./daily_reports";

fs.readdir(dailyReportsPath, async (err, dailyReports) => {
  if (err) {
    console.error(err);
    return;
  }

  // remove template file YYYY-MM-DD.csv
  dailyReports.pop();

  let confirmed = null;
  let deaths = null;
  let dates = [];

  for (let reportPath of dailyReports) {
    const date = getDateFromFilename(reportPath);
    dates.push(date);
    const dailyFilePath = [dailyReportsPath, reportPath].join("/");

    const dataPromise = new Promise((resolve, reject) => {
      fs.readFile(dailyFilePath, (err, buffer) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(buffer);
      });
    });

    const dataBuffer = await dataPromise;

    const dailyData = await neatCsv(dataBuffer);

    if (!confirmed) {
      confirmed = initializeData(dailyData);
      deaths = initializeData(dailyData);
    }

    for (let stateData of dailyData) {
      const stateName = stateData.State;
      confirmed[stateName][date] = stateData.Confirmed;
      deaths[stateName][date] = stateData.Deaths;
    }
  }

  writeTimeSeries("Confirmed", dates, confirmed);
  writeTimeSeries("Deaths", dates, deaths);
});

function writeTimeSeries(title, dates, data) {
  const confirmedWriter = createCsvWriter({
    path: `time_series/time-series_19-covid-${title}.csv`,
    header: [
      { id: "state", title: "State" },
      ...dates.sort().map(date => ({ id: date, title: date }))
    ]
  });

  confirmedWriter.writeRecords(Object.values(data)).then(() => {
    console.log(`Writing ${title} done.`);
  });
}

function initializeData(dailyData) {
  const confirmed = {};
  for (let stateData of dailyData) {
    const stateName = stateData.State;
    confirmed[stateName] = {
      state: stateName
    };
  }
  return confirmed;
}

function getDateFromFilename(filename) {
  const [basename] = filename.split(".");
  return basename;
}

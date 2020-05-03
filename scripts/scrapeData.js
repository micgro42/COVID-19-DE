const https = require('https');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');

const rkiURL = process.argv[2] || 'https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Fallzahlen.html';

https.get(rkiURL, (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    parseHTML(data);
  });
});

function parseHTML(html){
  const dom = new JSDOM(html);
  const data = [ [ 'State','Confirmed','Deaths' ] ];

  dom.window.document.querySelectorAll('tbody tr').forEach(
    (tr) => {
      const statename = tr.children[0].textContent
        .replace(/[^\wüöä-]/ug, '')
      ;
      const infected = tr.children[1].textContent.replace('.', '');
      const deaths = tr.children[4].textContent.replace('.', '');
      data.push([`"${statename}"`, infected, deaths]);
    }
  )
  // Remove the final "Gesamt" line
  data.pop();

  const dateString = extractDateAsString(html);

  const text = data.map( stateData => stateData.join(',')).join("\n");

  fs.writeFile(`daily_reports/${dateString}.csv`, text, 'utf8', () => console.log(`Data written:\n${dateString}\n${text}\n`))
}

function extractDateAsString(html) {
  const dateMatch = html.match(/Stand: (?<day>\d{1,2})\.(?<month>\d{1,2})\.(?<year>\d{4}), \d\d:\d\d Uhr/);
  const { day, month, year } = dateMatch.groups;
  return `${year}-${month.padStart(2,0)}-${day.padStart(2,0)}`;
}

# COVID-19-DE

The file structure of this project is inspired by the Johns Hopkins University project [CSSEGISandData/COVID-19](https://github.com/CSSEGISandData/COVID-19):

```
├── daily_reports
│   └── YYYY-MM-DD.csv
├── README.md
└── time_series
    ├── time-series_19-covid-Confirmed.csv
    └── time-series_19-covid-Deaths.csv
```

## Source of data:

This is created from the data published by the **Robert Koch Institut** on its [website](https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Fallzahlen.html) and archived versions thereof.

## Quality of data:

This data has been manually retyped, so there might be errors.

Also, the Robert Koch Institut announced that it changes how it collects its data on 2020-05-17.
Subsequently, that day might see a drop in some numbers that does not actually correspond to a actual real world change in cases.

## Similar projects

There a some similar projects collecting COVID-19 case data with a different granularity or regional focus:

* [Lower Saxony, Germany](https://github.com/codeforosnabrueck/COVID-19-NDS/)
* [Thuringia, Germany](https://github.com/micb25/corona-jena)


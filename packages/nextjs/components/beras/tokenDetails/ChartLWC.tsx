import React, { useEffect, useRef } from "react";
import { IChartApi, ISeriesApi, Time, createChart } from "lightweight-charts";

/*
type Candlestick = {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
};*/

export const ChartLWC = ({ tokenAddress }: { tokenAddress: string }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chart = useRef<IChartApi>();
  const candleSeries = useRef<ISeriesApi<"Candlestick">>();

  useEffect(() => {
    /*const handleResize = () => {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };*/
    if (chartContainerRef.current) {
      chart.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 300,
        timeScale: {
          borderColor: "rgba(197, 203, 206, 0.8)",
          timeVisible: true,
        },
      });

      //chart.current.timeScale().fitContent();
      candleSeries.current = chart.current.addCandlestickSeries();
      fetch("https://api.lasberas.com/berachain_testnet/candles/" + tokenAddress.toLowerCase())
        .then(response => response.json())
        .then(data => {
          if (candleSeries.current) candleSeries.current.setData(data.candles);
        })
        .catch(() => {
          if (candleSeries.current)
            candleSeries.current.setData([
              {
                time: 1715068800 as Time,
                open: 0.0001502,
                close: 0.0001602,
                high: 0.0001702,
                low: 0.0001402,
              },
              {
                time: 1715069100 as Time,
                open: 0.0001602,
                close: 0.0001702,
                high: 0.0001802,
                low: 0.0001002,
              },
              {
                time: 1715069400 as Time,
                open: 0.0001702,
                close: 0.0002502,
                high: 0.0003002,
                low: 0.0001602,
              },
              {
                time: 1715069700 as Time,
                open: 0.00025,
                close: 0.000245,
                high: 0.00048,
                low: 0.000245,
              },
              {
                time: 1715070000 as Time,
                open: 0.000245,
                close: 0.0002,
                high: 0.0003,
                low: 0.00019,
              },
              {
                time: 1715070300 as Time,
                open: 0.0002,
                close: 0.00015,
                high: 0.00021,
                low: 0.00013,
              },
            ]);
        });
    }

    return () => {
      chart.current?.remove();
    };
  }, []);

  return <div ref={chartContainerRef} />;
};
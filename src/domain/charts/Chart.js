import React from 'react'
import {ResponsiveLine} from "@nivo/line"
import ChartTooltip from "../../components/ChartTooltip"
import * as FirestoreService from "../../services/Firebase"
// import {useChartProps} from "./chartPropsContext"
import {useAppState} from "../app/appStateContext"
import {useChartData} from './useChartData'

const Chart = () => {
  const [emissions] = FirestoreService.useEmissions()
  // const [chartProps] = useChartProps()
  const [appState, setAppState] = useAppState()
  let data = useChartData()
  if (!data) {
    return null;
  }

  return (
      (data && emissions) ?
      <ResponsiveLine
        data={data}
        margin={{top: 100, right: 10, left: 80, bottom: 30}}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickValues: "every day",
          tickRotation: 0,
          format: date => new Intl.DateTimeFormat('ru', {
            month: 'short',
            day: 'numeric'
          }).format(date),
          legendPosition: "start"
        }}
        axisLeft={{
          format: v => `$${v / 1000}k`,
          legend: `Куплена на суму`,
          legendRotation: 90,
          legendOffset: -55,
          legendPosition: 'middle'
        }}

        style={{
          enableArea: true,
          areaBaselineValue: 0,
        }}
        colors={({
          scheme: 'paired'
        })}
        // yScale={{
        //   // type: 'point', // linear | point
        //   // min: 0,
        //   // stacked: true,
        // }}
        xScale={{
          type: 'time',
          precision: 'day',
        }}
        // animate={false}
        // offsetType="diverging"
        order="ascending"
        // enablePointLabel
        // pointLabel={(p) => {
        //   return p.y.toFixed(1)
        // }}
        // enableArea
        // areaBaselineValue={0}
        // debugSlices
        // enableSlices="y"
        // sliceTooltip={(s) => {
        //   console.log(s)
        //   return (
        //     <div>
        //       ...
        //     </div>
        //   )
        // }}
        // enablePoints
        // pointSize={16}

        useMesh

        tooltip={({point}) => {
          return (
            <ChartTooltip point={point}/>
          )}}
        onClick={(point, e) => {
          setAppState({
            selectedEmissionId: point.data.id,
          })
        }}
        // keys={Object.keys(data.data[data.data.length - 1])}
        {...{
          enableGridX: false,
          enableGridY: false,
          enableCrosshair: false,
          animate: false,
        }}
      />
      :
      <div>Loading data...</div>
  )
}

export default Chart

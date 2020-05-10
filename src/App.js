import React from 'react';
import './tailwind.generated.css';
import './App.css';
import * as FirestoreService from './services/Firebase'
import { ResponsiveLine } from '@nivo/line'
import { Settings } from './Settings'
import {useChartProps} from './StateContext'

function App() {
  const [data, loading, errors] = FirestoreService.useData()
  const [emissions] = FirestoreService.useEmissions()
  const [chartProps] = useChartProps()

  return (
    loading ?
      <div className="h-full flex items-center justify-center p-4">Loading...</div>
      :
      <div className="flex h-full items-stretch">
        <div className="Settings p-4 flex-shrink-0">
          <Settings/>
          {
            !!errors.length &&
            <div>
              {errors.map(e => (<p>{e.toString()}</p>))}
            </div>
          }
        </div>
        <div className="relative flex-grow">
          {(data && emissions) &&
            <ResponsiveLine
              data={data}

              margin={{top: 50, right: 0, left: 100, bottom: 40}}
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

              style={{
                enableArea: true,
                areaBaselineValue: 0,
              }}
              colors={{
                scheme: 'paired'
              }}
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
                const {id} = point.data;
                // return '';
                return (
                  <div style={{background: '#fff', padding: '1ex'}}>
                    {emissions[id] ?
                      emissions[id].issuer_name :
                      `no emission ${id}`
                    }
                  </div>
                )}}
              // keys={Object.keys(data.data[data.data.length - 1])}
              {...chartProps}
            />
          }
        </div>
      </div>
  );
}

export default App;

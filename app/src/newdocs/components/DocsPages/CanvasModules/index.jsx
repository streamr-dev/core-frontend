/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */
// @flow

// TODO:
// fix broken modules:
// 1001, 501, 523, 229, 209, 801, 567, 67, 1015
// remove class ="highlight" from content
// Change headings and spacing
// Add category headings
// inputs etc to bold

import React from 'react'
import { Helmet } from 'react-helmet'

// --Boolean--
import And from '$newdocs/content/canvasModules/30-And.mdx'
import BooleanConstant from '$newdocs/content/canvasModules/1003-BooleanConstant.mdx'
import BooleanToNumber from '$newdocs/content/canvasModules/1002-BooleanToNumber.mdx'
import Equals from '$newdocs/content/canvasModules/45-Equals.mdx'
import GreaterThan from '$newdocs/content/canvasModules/46-GreaterThan.mdx'
import IfThenElse from '$newdocs/content/canvasModules/48-IfThenElse.mdx'
import LessThan from '$newdocs/content/canvasModules/47-LessThan.mdx'
import Not from '$newdocs/content/canvasModules/32-Not.mdx'
import Or from '$newdocs/content/canvasModules/31-Or.mdx'
import SameSign from '$newdocs/content/canvasModules/33-SameSign.mdx'
import Xor from '$newdocs/content/canvasModules/573-Xor.mdx'

// --Custom Modules--
import JavaModule from '$newdocs/content/canvasModules/136-JavaModule.mdx'

// --Input--
import Button from '$newdocs/content/canvasModules/218-Button.mdx'
import Switcher from '$newdocs/content/canvasModules/219-Switcher.mdx'
import TextField from '$newdocs/content/canvasModules/220-TextField.mdx'

// --Integrations--
// import HTTPRequest from '$newdocs/content/canvasModules/1001-HTTPRequest.mdx'
import MQTT from '$newdocs/content/canvasModules/1034-MQTT.mdx'
import SimpleHTTP from '$newdocs/content/canvasModules/1000-SimpleHTTP.mdx'
import SQL from '$newdocs/content/canvasModules/1010-SQL.mdx'
import BinaryBetting from '$newdocs/content/canvasModules/1101-BinaryBetting.mdx'
import EthereumCall from '$newdocs/content/canvasModules/1150-EthereumCall.mdx'
import GetContractAt from '$newdocs/content/canvasModules/1023-GetContractAt.mdx'
import GetEvents from '$newdocs/content/canvasModules/1032-GetEvents.mdx'
import PayByUse from '$newdocs/content/canvasModules/1100-PayByUse.mdx'
import SolidityCompileDeploy from '$newdocs/content/canvasModules/1151-SolidityCompileDeploy.mdx'
import VerifySignature from '$newdocs/content/canvasModules/574-VerifySignature.mdx'

// --List--
import AddToList from '$newdocs/content/canvasModules/548-AddToList.mdx'
import AppendToList from '$newdocs/content/canvasModules/549-AppendToList.mdx'
import BuildList from '$newdocs/content/canvasModules/550-BuildList.mdx'
import ConstantList from '$newdocs/content/canvasModules/802-ConstantList.mdx'
import ContainsItem from '$newdocs/content/canvasModules/551-ContainsItem.mdx'
import FlattenList from '$newdocs/content/canvasModules/552-FlattenList.mdx'
import ForEachItem from '$newdocs/content/canvasModules/539-ForEachItem.mdx'
import GetFromList from '$newdocs/content/canvasModules/1012-GetFromList.mdx'
import HeadList from '$newdocs/content/canvasModules/553-HeadList.mdx'
import IndexesOfItem from '$newdocs/content/canvasModules/561-IndexesOfItem.mdx'
import IndexOfItem from '$newdocs/content/canvasModules/560-IndexOfItem.mdx'
import Indices from '$newdocs/content/canvasModules/541-Indices.mdx'
import ListSize from '$newdocs/content/canvasModules/544-ListSize.mdx'
import ListToEvents from '$newdocs/content/canvasModules/1030-ListToEvents.mdx'
import MergeList from '$newdocs/content/canvasModules/554-MergeList.mdx'
import Range from '$newdocs/content/canvasModules/545-Range.mdx'
import RemoveFromList from '$newdocs/content/canvasModules/555-RemoveFromList.mdx'
import RepeatItem from '$newdocs/content/canvasModules/540-RepeatItem.mdx'
import ReverseList from '$newdocs/content/canvasModules/556-ReverseList.mdx'
import ShuffleList from '$newdocs/content/canvasModules/565-ShuffleList.mdx'
import SortList from '$newdocs/content/canvasModules/557-SortList.mdx'
import SubList from '$newdocs/content/canvasModules/546-SubList.mdx'
import TailList from '$newdocs/content/canvasModules/558-TailList.mdx'
import Unique from '$newdocs/content/canvasModules/559-Unique.mdx'

// --Map--
// import BuildMap from '$newdocs/content/canvasModules/501-BuildMap.mdx'
import CollectFromMaps from '$newdocs/content/canvasModules/526-CollectFromMaps.mdx'
import ConstantMap from '$newdocs/content/canvasModules/800-ConstantMap.mdx'
import ContainsValue from '$newdocs/content/canvasModules/224-ContainsValue.mdx'
import CountByKey from '$newdocs/content/canvasModules/221-CountByKey.mdx'
import FilterMap from '$newdocs/content/canvasModules/525-FilterMap.mdx'
import ForEach from '$newdocs/content/canvasModules/223-ForEach.mdx'
import GetFromMap from '$newdocs/content/canvasModules/225-GetFromMap.mdx'
// import GetMultiFromMap from '$newdocs/content/canvasModules/523-GetMultiFromMap.mdx'
import HeadMap from '$newdocs/content/canvasModules/226-HeadMap.mdx'
import KeysToList from '$newdocs/content/canvasModules/227-KeysToList.mdx'
import MapSize from '$newdocs/content/canvasModules/235-MapSize.mdx'
import MergeMap from '$newdocs/content/canvasModules/233-MergeMap.mdx'
import NewMap from '$newdocs/content/canvasModules/232-NewMap.mdx'
import PutToMap from '$newdocs/content/canvasModules/228-PutToMap.mdx'
import RemoveFromMap from '$newdocs/content/canvasModules/234-RemoveFromMap.mdx'
// import SortMap from '$newdocs/content/canvasModules/229-SortMap.mdx'
import SumByKey from '$newdocs/content/canvasModules/222-SumByKey.mdx'
import TailMap from '$newdocs/content/canvasModules/230-TailMap.mdx'
import ValuesToList from '$newdocs/content/canvasModules/231-ValuesToList.mdx'

// --Streams--
import CreateStream from '$newdocs/content/canvasModules/529-CreateStream.mdx'
import GetOrCreateStream from '$newdocs/content/canvasModules/1033-GetOrCreateStream.mdx'
import SearchStream from '$newdocs/content/canvasModules/528-SearchStream.mdx'

// --Text--
import Concatenate from '$newdocs/content/canvasModules/131-Concatenate.mdx'
import ConstantText from '$newdocs/content/canvasModules/19-ConstantText.mdx'
import Contains from '$newdocs/content/canvasModules/129-Contains.mdx'
import EndsWith from '$newdocs/content/canvasModules/198-EndsWith.mdx'
import FormatNumber from '$newdocs/content/canvasModules/569-FormatNumber.mdx'
import JsonParser from '$newdocs/content/canvasModules/1016-JsonParser.mdx'
import RandomString from '$newdocs/content/canvasModules/564-RandomString.mdx'
import Regex from '$newdocs/content/canvasModules/201-Regex.mdx'
import Replace from '$newdocs/content/canvasModules/202-Replace.mdx'
import Split from '$newdocs/content/canvasModules/203-Split.mdx'
import StartsWith from '$newdocs/content/canvasModules/204-StartsWith.mdx'
// import StringTemplate from '$newdocs/content/canvasModules/1015-StringTemplate.mdx'
import StringToNumber from '$newdocs/content/canvasModules/1031-StringToNumber.mdx'
import TextEquals from '$newdocs/content/canvasModules/199-TextEquals.mdx'
import TextLength from '$newdocs/content/canvasModules/200-TextLength.mdx'
import ToLowerCase from '$newdocs/content/canvasModules/206-ToLowerCase.mdx'
import ToUpperCase from '$newdocs/content/canvasModules/207-ToUpperCase.mdx'
import Trim from '$newdocs/content/canvasModules/205-Trim.mdx'
import ValueAsText from '$newdocs/content/canvasModules/208-ValueAsText.mdx'

// --Time & Date--
// import Clock from '$newdocs/content/canvasModules/209-Clock.mdx'
import DateConversion from '$newdocs/content/canvasModules/211-DateConversion.mdx'
// import Scheduler from '$newdocs/content/canvasModules/801-Scheduler.mdx'
import TimeBetweenEvents from '$newdocs/content/canvasModules/210-TimeBetweenEvents.mdx'
import TimeOfDay from '$newdocs/content/canvasModules/60-TimeOfDay.mdx'
import TimeOfEvent from '$newdocs/content/canvasModules/566-TimeOfEvent.mdx'

// --Time Series--
import MODWT from '$newdocs/content/canvasModules/70-MODWT.mdx'
import MovingAverage from '$newdocs/content/canvasModules/524-MovingAverage.mdx'
import MovingAverageExp from '$newdocs/content/canvasModules/96-MovingAverageExp.mdx'
import ARIMA from '$newdocs/content/canvasModules/98-ARIMA.mdx'
import RandomNumber from '$newdocs/content/canvasModules/562-RandomNumber.mdx'
import RandomNumberGaussian from '$newdocs/content/canvasModules/563-RandomNumberGaussian.mdx'
import Abs from '$newdocs/content/canvasModules/27-Abs.mdx'
import Add from '$newdocs/content/canvasModules/520-Add.mdx'
import ChangeAbsolute from '$newdocs/content/canvasModules/11-ChangeAbsolute.mdx'
import ChangeLogarithmic from '$newdocs/content/canvasModules/87-ChangeLogarithmic.mdx'
import ChangeRelative from '$newdocs/content/canvasModules/35-ChangeRelative.mdx'
import Count from '$newdocs/content/canvasModules/161-Count.mdx'
import Divide from '$newdocs/content/canvasModules/6-Divide.mdx'
// import Expression from '$newdocs/content/canvasModules/567-Expression.mdx'
import Invert from '$newdocs/content/canvasModules/29-Invert.mdx'
import LinearMapper from '$newdocs/content/canvasModules/116-LinearMapper.mdx'
import LogNatural from '$newdocs/content/canvasModules/115-LogNatural.mdx'
import Max from '$newdocs/content/canvasModules/62-Max.mdx'
import Min from '$newdocs/content/canvasModules/61-Min.mdx'
import Modulo from '$newdocs/content/canvasModules/213-Modulo.mdx'
import Multiply from '$newdocs/content/canvasModules/1-Multiply.mdx'
import Negate from '$newdocs/content/canvasModules/28-Negate.mdx'
import RoundToStep from '$newdocs/content/canvasModules/120-RoundToStep.mdx'
import Sign from '$newdocs/content/canvasModules/34-Sign.mdx'
import SquareRoot from '$newdocs/content/canvasModules/162-SquareRoot.mdx'
import Subtract from '$newdocs/content/canvasModules/4-Subtract.mdx'
import Sum from '$newdocs/content/canvasModules/53-Sum.mdx'
import Correlation from '$newdocs/content/canvasModules/54-Correlation.mdx'
import Covariance from '$newdocs/content/canvasModules/56-Covariance.mdx'
import GeometricMean from '$newdocs/content/canvasModules/151-GeometricMean.mdx'
import Kurtosis from '$newdocs/content/canvasModules/152-Kurtosis.mdx'
import Max_window from '$newdocs/content/canvasModules/150-Max_window.mdx'
import Min_window from '$newdocs/content/canvasModules/149-Min_window.mdx'
import Percentile from '$newdocs/content/canvasModules/153-Percentile.mdx'
import PopulationVariance from '$newdocs/content/canvasModules/154-PopulationVariance.mdx'
import Skewness from '$newdocs/content/canvasModules/156-Skewness.mdx'
import SpearmansRankCorrelation from '$newdocs/content/canvasModules/55-SpearmansRankCorrelation.mdx'
import StandardDeviation from '$newdocs/content/canvasModules/138-StandardDeviation.mdx'
import SumOfSquares from '$newdocs/content/canvasModules/157-SumOfSquares.mdx'
import UnivariateLinearRegression from '$newdocs/content/canvasModules/51-UnivariateLinearRegression.mdx'
import Variance from '$newdocs/content/canvasModules/155-Variance.mdx'
import Barify from '$newdocs/content/canvasModules/16-Barify.mdx'
import Delay from '$newdocs/content/canvasModules/7-Delay.mdx'
import FlexBarify from '$newdocs/content/canvasModules/158-FlexBarify.mdx'
import PassThrough from '$newdocs/content/canvasModules/521-PassThrough.mdx'
import FourZones from '$newdocs/content/canvasModules/84-FourZones.mdx'
import Peak from '$newdocs/content/canvasModules/49-Peak.mdx'
import SampleIf from '$newdocs/content/canvasModules/125-SampleIf.mdx'
import Sampler from '$newdocs/content/canvasModules/85-Sampler.mdx'
import ThreeZones from '$newdocs/content/canvasModules/25-ThreeZones.mdx'
import ZeroCross from '$newdocs/content/canvasModules/24-ZeroCross.mdx'

// --Utils--
import Canvas from '$newdocs/content/canvasModules/81-Canvas.mdx'
import Comment from '$newdocs/content/canvasModules/119-Comment.mdx'
import Constant from '$newdocs/content/canvasModules/5-Constant.mdx'
import Email from '$newdocs/content/canvasModules/195-Email.mdx'
import ExportCSV from '$newdocs/content/canvasModules/571-ExportCSV.mdx'
import Filter from '$newdocs/content/canvasModules/522-Filter.mdx'
import Label from '$newdocs/content/canvasModules/145-Label.mdx'
import ListAsTable from '$newdocs/content/canvasModules/1011-ListAsTable.mdx'
import MapAsTable from '$newdocs/content/canvasModules/236-MapAsTable.mdx'
import Merge from '$newdocs/content/canvasModules/141-Merge.mdx'
import MovingWindow from '$newdocs/content/canvasModules/570-MovingWindow.mdx'
import RateLimit from '$newdocs/content/canvasModules/217-RateLimit.mdx'
import RequireAll from '$newdocs/content/canvasModules/572-RequireAll.mdx'
import SendToStream from '$newdocs/content/canvasModules/197-SendToStream.mdx'
import Table from '$newdocs/content/canvasModules/527-Table.mdx'
import ConstantColor from '$newdocs/content/canvasModules/215-ConstantColor.mdx'
import Gradient from '$newdocs/content/canvasModules/216-Gradient.mdx'

// --Visualizations--
// import Chart from '$newdocs/content/canvasModules/67-Chart.mdx'
import Heatmap from '$newdocs/content/canvasModules/196-Heatmap.mdx'
import Map_geo from '$newdocs/content/canvasModules/214-Map_geo.mdx'
import Map_image from '$newdocs/content/canvasModules/583-Map_image.mdx'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'

const CanvasModules = () => (
    <DocsLayout subNav={subNav.canvasModules}>
        <Helmet>
            <title>Streamr Docs | Canvas Modules</title>
        </Helmet>

        <h2>Boolean</h2>
        <And />
        <BooleanConstant />
        <BooleanToNumber />
        <Equals />
        <GreaterThan />
        <IfThenElse />
        <LessThan />
        <Not />
        <Or />
        <Not />
        <SameSign />
        <Xor />

        <h2>Custom</h2>
        <JavaModule />

        <h2>Input</h2>
        <Button />
        <Switcher />
        <TextField />

        <h2>Integrations</h2>
        {/* <HTTPRequest /> */}
        <MQTT />
        <SimpleHTTP />
        <SQL />
        <BinaryBetting />
        <EthereumCall />
        <GetContractAt />
        <GetEvents />
        <PayByUse />
        <SolidityCompileDeploy />
        <VerifySignature />

        <h2>List</h2>
        <AddToList />
        <AppendToList />
        <BuildList />
        <ConstantList />
        <ContainsItem />
        <FlattenList />
        <ForEachItem />
        <GetFromList />
        <HeadList />
        <IndexesOfItem />
        <IndexOfItem />
        <Indices />
        <ListSize />
        <ListToEvents />
        <MergeList />
        <Range />
        <RemoveFromList />
        <RepeatItem />
        <ReverseList />
        <ShuffleList />
        <SortList />
        <SubList />
        <TailList />
        <Unique />

        <h2>Map</h2>
        {/* <BuildMap /> */}
        <CollectFromMaps />
        <ConstantMap />
        <ContainsValue />
        <CountByKey />
        <FilterMap />
        <ForEach />
        <GetFromMap />
        {/* <GetMultiFromMap /> */}
        <HeadMap />
        <KeysToList />
        <MapSize />
        <MergeMap />
        <NewMap />
        <PutToMap />
        <RemoveFromMap />
        {/* <SortMap /> */}
        <SumByKey />
        <TailMap />
        <ValuesToList />

        <h2>Streams</h2>
        <CreateStream />
        <GetOrCreateStream />
        <SearchStream />

        <h2>Text</h2>
        <Concatenate />
        <ConstantText />
        <Contains />
        <EndsWith />
        <FormatNumber />
        <JsonParser />
        <RandomString />
        <Regex />
        <Replace />
        <Split />
        <StartsWith />
        {/* <StringTemplate /> */}
        <StringToNumber />
        <TextEquals />
        <TextLength />
        <ToLowerCase />
        <ToUpperCase />
        <Trim />
        <ValueAsText />

        <h2>Time & date</h2>
        {/* <Clock /> */}
        <DateConversion />
        {/* <Scheduler /> */}
        <TimeBetweenEvents />
        <TimeOfDay />
        <TimeOfEvent />

        <h2>Time series</h2>
        <MODWT />
        <MovingAverage />
        <MovingAverageExp />
        <ARIMA />
        <RandomNumber />
        <RandomNumberGaussian />
        <Abs />
        <Add />
        <ChangeAbsolute />
        <ChangeLogarithmic />
        <ChangeRelative />
        <Count />
        <Divide />
        {/* <Expression /> */}
        <Invert />
        <LinearMapper />
        <LogNatural />
        <Max />
        <Min />
        <Modulo />
        <Multiply />
        <Negate />
        <RoundToStep />
        <Sign />
        <SquareRoot />
        <Subtract />
        <Sum />
        <Correlation />
        <Covariance />
        <GeometricMean />
        <Kurtosis />
        <Max_window />
        <Min_window />
        <Percentile />
        <PopulationVariance />
        <Skewness />
        <SpearmansRankCorrelation />
        <StandardDeviation />
        <SumOfSquares />
        <UnivariateLinearRegression />
        <Variance />
        <Barify />
        <Delay />
        <FlexBarify />
        <PassThrough />
        <FourZones />
        <Peak />
        <SampleIf />
        <Sampler />
        <ThreeZones />
        <ZeroCross />

        <h2>Utilities</h2>
        <Canvas />
        <Comment />
        <Constant />
        <Email />
        <ExportCSV />
        <Filter />
        <Label />
        <ListAsTable />
        <MapAsTable />
        <Merge />
        <MovingWindow />
        <RateLimit />
        <RequireAll />
        <SendToStream />
        <Table />
        <ConstantColor />
        <Gradient />

        <h2>Visualizations</h2>
        {/* <Chart /> */}
        <Heatmap />
        <Map_geo />
        <Map_image />
    </DocsLayout>
)

export default CanvasModules

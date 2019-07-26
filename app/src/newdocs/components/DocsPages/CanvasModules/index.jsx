/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */
// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

// --Boolean--
import And from '$newdocs/content/canvasModules/And-30'
import BooleanConstant from '$newdocs/content/canvasModules/BooleanConstant-1003'
import BooleanToNumber from '$newdocs/content/canvasModules/BooleanToNumber-1002'
import Equals from '$newdocs/content/canvasModules/Equals-45'
import GreaterThan from '$newdocs/content/canvasModules/GreaterThan-46'
import IfThenElse from '$newdocs/content/canvasModules/IfThenElse-48'
import LessThan from '$newdocs/content/canvasModules/LessThan-47'
import Not from '$newdocs/content/canvasModules/Not-32'
import Or from '$newdocs/content/canvasModules/Or-31'
import SameSign from '$newdocs/content/canvasModules/SameSign-33'
import Xor from '$newdocs/content/canvasModules/Xor-573'

// --Custom Modules--
import JavaModule from '$newdocs/content/canvasModules/JavaModule-136'

// --Input--
import Button from '$newdocs/content/canvasModules/Button-218'
import Switcher from '$newdocs/content/canvasModules/Switcher-219'
import TextField from '$newdocs/content/canvasModules/TextField-220'

// --Integrations--
import HTTPRequest from '$newdocs/content/canvasModules/HTTPRequest-1001'
import MQTT from '$newdocs/content/canvasModules/MQTT-1034'
import SimpleHTTP from '$newdocs/content/canvasModules/SimpleHTTP-1000'
import SQL from '$newdocs/content/canvasModules/SQL-1010'
import BinaryBetting from '$newdocs/content/canvasModules/BinaryBetting-1101'
import EthereumCall from '$newdocs/content/canvasModules/EthereumCall-1150'
import GetContractAt from '$newdocs/content/canvasModules/GetContractAt-1023'
import GetEvents from '$newdocs/content/canvasModules/GetEvents-1032'
import PayByUse from '$newdocs/content/canvasModules/PayByUse-1100'
import SolidityCompileDeploy from '$newdocs/content/canvasModules/SolidityCompileDeploy-1151'
import VerifySignature from '$newdocs/content/canvasModules/VerifySignature-574'

// --List--
import AddToList from '$newdocs/content/canvasModules/AddToList-548'
import AppendToList from '$newdocs/content/canvasModules/AppendToList-549'
import BuildList from '$newdocs/content/canvasModules/BuildList-550'
import ConstantList from '$newdocs/content/canvasModules/ConstantList-802'
import ContainsItem from '$newdocs/content/canvasModules/ContainsItem-551'
import FlattenList from '$newdocs/content/canvasModules/FlattenList-552'
import ForEachItem from '$newdocs/content/canvasModules/ForEachItem-539'
import GetFromList from '$newdocs/content/canvasModules/GetFromList-1012'
import HeadList from '$newdocs/content/canvasModules/HeadList-553'
import IndexesOfItem from '$newdocs/content/canvasModules/IndexesOfItem-561'
import IndexOfItem from '$newdocs/content/canvasModules/IndexOfItem-560'
import Indices from '$newdocs/content/canvasModules/Indices-541'
import ListSize from '$newdocs/content/canvasModules/ListSize-544'
import ListToEvents from '$newdocs/content/canvasModules/ListToEvents-1030'
import MergeList from '$newdocs/content/canvasModules/MergeList-554'
import Range from '$newdocs/content/canvasModules/Range-545'
import RemoveFromList from '$newdocs/content/canvasModules/RemoveFromList-555'
import RepeatItem from '$newdocs/content/canvasModules/RepeatItem-540'
import ReverseList from '$newdocs/content/canvasModules/ReverseList-556'
import ShuffleList from '$newdocs/content/canvasModules/ShuffleList-565'
import SortList from '$newdocs/content/canvasModules/SortList-557'
import SubList from '$newdocs/content/canvasModules/SubList-546'
import TailList from '$newdocs/content/canvasModules/TailList-558'
import Unique from '$newdocs/content/canvasModules/Unique-559'

// --Map--
import BuildMap from '$newdocs/content/canvasModules/BuildMap-501'
import CollectFromMaps from '$newdocs/content/canvasModules/CollectFromMaps-526'
import ConstantMap from '$newdocs/content/canvasModules/ConstantMap-800'
import ContainsValue from '$newdocs/content/canvasModules/ContainsValue-224'
import CountByKey from '$newdocs/content/canvasModules/CountByKey-221'
import FilterMap from '$newdocs/content/canvasModules/FilterMap-525'
import ForEach from '$newdocs/content/canvasModules/ForEach-223'
import GetFromMap from '$newdocs/content/canvasModules/GetFromMap-225'
import GetMultiFromMap from '$newdocs/content/canvasModules/GetMultiFromMap-523'
import HeadMap from '$newdocs/content/canvasModules/HeadMap-226'
import KeysToList from '$newdocs/content/canvasModules/KeysToList-227'
import MapSize from '$newdocs/content/canvasModules/MapSize-235'
import MergeMap from '$newdocs/content/canvasModules/MergeMap-233'
import NewMap from '$newdocs/content/canvasModules/NewMap-232'
import PutToMap from '$newdocs/content/canvasModules/PutToMap-228'
import RemoveFromMap from '$newdocs/content/canvasModules/RemoveFromMap-234'
import SortMap from '$newdocs/content/canvasModules/SortMap-229'
import SumByKey from '$newdocs/content/canvasModules/SumByKey-222'
import TailMap from '$newdocs/content/canvasModules/TailMap-230'
import ValuesToList from '$newdocs/content/canvasModules/ValuesToList-231'

// --Streams--
import CreateStream from '$newdocs/content/canvasModules/CreateStream-529'
import GetOrCreateStream from '$newdocs/content/canvasModules/GetOrCreateStream-1033'
import SearchStream from '$newdocs/content/canvasModules/SearchStream-528'

// --Text--
import Concatenate from '$newdocs/content/canvasModules/Concatenate-131'
import ConstantText from '$newdocs/content/canvasModules/ConstantText-19'
import Contains from '$newdocs/content/canvasModules/Contains-129'
import EndsWith from '$newdocs/content/canvasModules/EndsWith-198'
import FormatNumber from '$newdocs/content/canvasModules/FormatNumber-569'
import JsonParser from '$newdocs/content/canvasModules/JsonParser-1016'
import RandomString from '$newdocs/content/canvasModules/RandomString-564'
import Regex from '$newdocs/content/canvasModules/Regex-201'
import Replace from '$newdocs/content/canvasModules/Replace-202'
import Split from '$newdocs/content/canvasModules/Split-203'
import StartsWith from '$newdocs/content/canvasModules/StartsWith-204'
import StringTemplate from '$newdocs/content/canvasModules/StringTemplate-1015'
import StringToNumber from '$newdocs/content/canvasModules/StringToNumber-1031'
import TextEquals from '$newdocs/content/canvasModules/TextEquals-199'
import TextLength from '$newdocs/content/canvasModules/TextLength-200'
import ToLowerCase from '$newdocs/content/canvasModules/ToLowerCase-206'
import ToUpperCase from '$newdocs/content/canvasModules/ToUpperCase-207'
import Trim from '$newdocs/content/canvasModules/Trim-205'
import ValueAsText from '$newdocs/content/canvasModules/ValueAsText-208'

// --Time & Date--
import Clock from '$newdocs/content/canvasModules/Clock-209'
import DateConversion from '$newdocs/content/canvasModules/DateConversion-211'
import Scheduler from '$newdocs/content/canvasModules/Scheduler-801'
import TimeBetweenEvents from '$newdocs/content/canvasModules/TimeBetweenEvents-210'
import TimeOfDay from '$newdocs/content/canvasModules/TimeOfDay-60'
import TimeOfEvent from '$newdocs/content/canvasModules/TimeOfEvent-566'

// --Time Series--
import MODWT from '$newdocs/content/canvasModules/MODWT-70'
import MovingAverage from '$newdocs/content/canvasModules/MovingAverage-524'
import MovingAverageExp from '$newdocs/content/canvasModules/MovingAverageExp-96'
import ARIMA from '$newdocs/content/canvasModules/ARIMA-98'
import RandomNumber from '$newdocs/content/canvasModules/RandomNumber-562'
import RandomNumberGaussian from '$newdocs/content/canvasModules/RandomNumberGaussian-563'
import Abs from '$newdocs/content/canvasModules/Abs-27'
import Add from '$newdocs/content/canvasModules/Add-520'
import ChangeAbsolute from '$newdocs/content/canvasModules/ChangeAbsolute-11'
import ChangeLogarithmic from '$newdocs/content/canvasModules/ChangeLogarithmic-87'
import ChangeRelative from '$newdocs/content/canvasModules/ChangeRelative-35'
import Count from '$newdocs/content/canvasModules/Count-161'
import Divide from '$newdocs/content/canvasModules/Divide-6'
import Expression from '$newdocs/content/canvasModules/Expression-567'
import Invert from '$newdocs/content/canvasModules/Invert-29'
import LinearMapper from '$newdocs/content/canvasModules/LinearMapper-116'
import LogNatural from '$newdocs/content/canvasModules/LogNatural-115'
import Max from '$newdocs/content/canvasModules/Max-62'
import Min from '$newdocs/content/canvasModules/Min-61'
import Modulo from '$newdocs/content/canvasModules/Modulo-213'
import Multiply from '$newdocs/content/canvasModules/Multiply-1'
import Negate from '$newdocs/content/canvasModules/Negate-28'
import RoundToStep from '$newdocs/content/canvasModules/RoundToStep-120'
import Sign from '$newdocs/content/canvasModules/Sign-34'
import SquareRoot from '$newdocs/content/canvasModules/SquareRoot-162'
import Subtract from '$newdocs/content/canvasModules/Subtract-4'
import Sum from '$newdocs/content/canvasModules/Sum-53'
import Correlation from '$newdocs/content/canvasModules/Correlation-54'
import Covariance from '$newdocs/content/canvasModules/Covariance-56'
import GeometricMean from '$newdocs/content/canvasModules/GeometricMean-151'
import Kurtosis from '$newdocs/content/canvasModules/Kurtosis-152'
import Max_window from '$newdocs/content/canvasModules/Max_window-150'
import Min_window from '$newdocs/content/canvasModules/Min_window-149'
import Percentile from '$newdocs/content/canvasModules/Percentile-153'
import PopulationVariance from '$newdocs/content/canvasModules/PopulationVariance-154'
import Skewness from '$newdocs/content/canvasModules/Skewness-156'
import SpearmansRankCorrelation from '$newdocs/content/canvasModules/SpearmansRankCorrelation-55'
import StandardDeviation from '$newdocs/content/canvasModules/StandardDeviation-138'
import SumOfSquares from '$newdocs/content/canvasModules/SumOfSquares-157'
import UnivariateLinearRegression from '$newdocs/content/canvasModules/UnivariateLinearRegression-51'
import Variance from '$newdocs/content/canvasModules/Variance-155'
import Barify from '$newdocs/content/canvasModules/Barify-16'
import Delay from '$newdocs/content/canvasModules/Delay-7'
import FlexBarify from '$newdocs/content/canvasModules/FlexBarify-158'
import PassThrough from '$newdocs/content/canvasModules/PassThrough-521'
import FourZones from '$newdocs/content/canvasModules/FourZones-84'
import Peak from '$newdocs/content/canvasModules/Peak-49'
import SampleIf from '$newdocs/content/canvasModules/SampleIf-125'
import Sampler from '$newdocs/content/canvasModules/Sampler-85'
import ThreeZones from '$newdocs/content/canvasModules/ThreeZones-25'
import ZeroCross from '$newdocs/content/canvasModules/ZeroCross-24'

// --Utils--
import Canvas from '$newdocs/content/canvasModules/Canvas-81'
import Comment from '$newdocs/content/canvasModules/Comment-119'
import Constant from '$newdocs/content/canvasModules/Constant-5'
import Email from '$newdocs/content/canvasModules/Email-195'
import ExportCSV from '$newdocs/content/canvasModules/ExportCSV-571'
import Filter from '$newdocs/content/canvasModules/Filter-522'
import Label from '$newdocs/content/canvasModules/Label-145'
import ListAsTable from '$newdocs/content/canvasModules/ListAsTable-1011'
import MapAsTable from '$newdocs/content/canvasModules/MapAsTable-236'
import Merge from '$newdocs/content/canvasModules/Merge-141'
import MovingWindow from '$newdocs/content/canvasModules/MovingWindow-570'
import RateLimit from '$newdocs/content/canvasModules/RateLimit-217'
import RequireAll from '$newdocs/content/canvasModules/RequireAll-572'
import SendToStream from '$newdocs/content/canvasModules/SendToStream-197'
import Table from '$newdocs/content/canvasModules/Table-527'
import ConstantColor from '$newdocs/content/canvasModules/ConstantColor-215'
import Gradient from '$newdocs/content/canvasModules/Gradient-216'

// --Visualizations--
import Chart from '$newdocs/content/canvasModules/Chart-67'
import Heatmap from '$newdocs/content/canvasModules/Heatmap-196'
import Map_geo from '$newdocs/content/canvasModules/Map_geo-214'
import Map_image from '$newdocs/content/canvasModules/Map_image-583'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'

const CanvasModules = () => (
    <DocsLayout subNav={subNav.canvasModules}>
        <Helmet title="Canvas Modules | Streamr Docs" />

        <section id="boolean">
            <h1>Boolean Modules</h1>
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
        </section>

        <section id="custom-modules">
            <h1>Custom Modules</h1>
            <JavaModule />
        </section>

        <section id="input">
            <h1>Input Modules</h1>
            <Button />
            <Switcher />
            <TextField />
        </section>

        <section id="integrations">
            <h1>Integrations Modules</h1>
            <HTTPRequest />
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
        </section>

        <section id="list">
            <h1>List Modules</h1>
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
        </section>

        <section id="map">
            <h1>Map Modules</h1>
            <BuildMap />
            <CollectFromMaps />
            <ConstantMap />
            <ContainsValue />
            <CountByKey />
            <FilterMap />
            <ForEach />
            <GetFromMap />
            <GetMultiFromMap />
            <HeadMap />
            <KeysToList />
            <MapSize />
            <MergeMap />
            <NewMap />
            <PutToMap />
            <RemoveFromMap />
            <SortMap />
            <SumByKey />
            <TailMap />
            <ValuesToList />
        </section>

        <section id="streams">
            <h1>Streams Modules</h1>
            <CreateStream />
            <GetOrCreateStream />
            <SearchStream />
        </section>

        <section id="text">
            <h1>Text Modules</h1>
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
            <StringTemplate />
            <StringToNumber />
            <TextEquals />
            <TextLength />
            <ToLowerCase />
            <ToUpperCase />
            <Trim />
            <ValueAsText />
        </section>

        <section id="time-and-date">
            <h1>Time & date Modules</h1>
            <Clock />
            <DateConversion />
            <Scheduler />
            <TimeBetweenEvents />
            <TimeOfDay />
            <TimeOfEvent />
        </section>

        <section id="time-series">
            <h1>Time series Modules</h1>
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
            <Expression />
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
        </section>

        <section id="utils">
            <h1>Utility Modules</h1>
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
        </section>

        <section id="visualizations">
            <h1>Visualization Modules</h1>
            <Chart />
            <Heatmap />
            <Map_geo />
            <Map_image />
        </section>
    </DocsLayout>
)

export default CanvasModules

/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */
// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import CanvasModuleConfig from '$newdocs/components/CanvasModuleConfig'

// --Boolean--
import And from '$newdocs/content/canvasModules/And-30.mdx'
import AndConfig from '$newdocs/content/canvasModules/And-30'
import BooleanConstant from '$newdocs/content/canvasModules/BooleanConstant-1003.mdx'
import BooleanConstantConfig from '$newdocs/content/canvasModules/BooleanConstant-1003'
import BooleanToNumber from '$newdocs/content/canvasModules/BooleanToNumber-1002.mdx'
import BooleanToNumberConfig from '$newdocs/content/canvasModules/BooleanToNumber-1002'
import Equals from '$newdocs/content/canvasModules/Equals-45.mdx'
import EqualsConfig from '$newdocs/content/canvasModules/Equals-45'
import GreaterThan from '$newdocs/content/canvasModules/GreaterThan-46.mdx'
import GreaterThanConfig from '$newdocs/content/canvasModules/GreaterThan-46'
import IfThenElse from '$newdocs/content/canvasModules/IfThenElse-48.mdx'
import IfThenElseConfig from '$newdocs/content/canvasModules/IfThenElse-48'
import LessThan from '$newdocs/content/canvasModules/LessThan-47.mdx'
import LessThanConfig from '$newdocs/content/canvasModules/LessThan-47'
import Not from '$newdocs/content/canvasModules/Not-32.mdx'
import NotConfig from '$newdocs/content/canvasModules/Not-32'
import Or from '$newdocs/content/canvasModules/Or-31.mdx'
import OrConfig from '$newdocs/content/canvasModules/Or-31'
import SameSign from '$newdocs/content/canvasModules/SameSign-33.mdx'
import SameSignConfig from '$newdocs/content/canvasModules/SameSign-33'
import Xor from '$newdocs/content/canvasModules/Xor-573.mdx'
import XorConfig from '$newdocs/content/canvasModules/Xor-573'

// --Custom Modules--
import JavaModule from '$newdocs/content/canvasModules/JavaModule-136.mdx'
import JavaModuleConfig from '$newdocs/content/canvasModules/JavaModule-136'

// --Input--
import Button from '$newdocs/content/canvasModules/Button-218.mdx'
import ButtonConfig from '$newdocs/content/canvasModules/Button-218'
import Switcher from '$newdocs/content/canvasModules/Switcher-219.mdx'
import SwitcherConfig from '$newdocs/content/canvasModules/Switcher-219'
import TextField from '$newdocs/content/canvasModules/TextField-220.mdx'
import TextFieldConfig from '$newdocs/content/canvasModules/TextField-220'

// --Integrations--
import HTTPRequest from '$newdocs/content/canvasModules/HTTPRequest-1001.mdx'
import HTTPRequestConfig from '$newdocs/content/canvasModules/HTTPRequest-1001'
import MQTT from '$newdocs/content/canvasModules/MQTT-1034.mdx'
import MQTTConfig from '$newdocs/content/canvasModules/MQTT-1034'
import SimpleHTTP from '$newdocs/content/canvasModules/SimpleHTTP-1000.mdx'
import SimpleHTTPConfig from '$newdocs/content/canvasModules/SimpleHTTP-1000'
import SQL from '$newdocs/content/canvasModules/SQL-1010.mdx'
import SQLConfig from '$newdocs/content/canvasModules/SQL-1010'
import BinaryBetting from '$newdocs/content/canvasModules/BinaryBetting-1101.mdx'
import BinaryBettingConfig from '$newdocs/content/canvasModules/BinaryBetting-1101'
import EthereumCall from '$newdocs/content/canvasModules/EthereumCall-1150.mdx'
import EthereumCallConfig from '$newdocs/content/canvasModules/EthereumCall-1150'
import GetContractAt from '$newdocs/content/canvasModules/GetContractAt-1023.mdx'
import GetContractAtConfig from '$newdocs/content/canvasModules/GetContractAt-1023'
import GetEvents from '$newdocs/content/canvasModules/GetEvents-1032.mdx'
import GetEventsConfig from '$newdocs/content/canvasModules/GetEvents-1032'
import PayByUse from '$newdocs/content/canvasModules/PayByUse-1100.mdx'
import PayByUseConfig from '$newdocs/content/canvasModules/PayByUse-1100'
import SolidityCompileDeploy from '$newdocs/content/canvasModules/SolidityCompileDeploy-1151.mdx'
import SolidityCompileDeployConfig from '$newdocs/content/canvasModules/SolidityCompileDeploy-1151'
import VerifySignature from '$newdocs/content/canvasModules/VerifySignature-574.mdx'
import VerifySignatureConfig from '$newdocs/content/canvasModules/VerifySignature-574'

// --List--
import AddToList from '$newdocs/content/canvasModules/AddToList-548.mdx'
import AddToListConfig from '$newdocs/content/canvasModules/AddToList-548'
import AppendToList from '$newdocs/content/canvasModules/AppendToList-549.mdx'
import AppendToListConfig from '$newdocs/content/canvasModules/AppendToList-549'
import BuildList from '$newdocs/content/canvasModules/BuildList-550.mdx'
import BuildListConfig from '$newdocs/content/canvasModules/BuildList-550'
import ConstantList from '$newdocs/content/canvasModules/ConstantList-802.mdx'
import ConstantListConfig from '$newdocs/content/canvasModules/ConstantList-802'
import ContainsItem from '$newdocs/content/canvasModules/ContainsItem-551.mdx'
import ContainsItemConfig from '$newdocs/content/canvasModules/ContainsItem-551'
import FlattenList from '$newdocs/content/canvasModules/FlattenList-552.mdx'
import FlattenListConfig from '$newdocs/content/canvasModules/FlattenList-552'
import ForEachItem from '$newdocs/content/canvasModules/ForEachItem-539.mdx'
import ForEachItemConfig from '$newdocs/content/canvasModules/ForEachItem-539'
import GetFromList from '$newdocs/content/canvasModules/GetFromList-1012.mdx'
import GetFromListConfig from '$newdocs/content/canvasModules/GetFromList-1012'
import HeadList from '$newdocs/content/canvasModules/HeadList-553.mdx'
import HeadListConfig from '$newdocs/content/canvasModules/HeadList-553'
import IndexesOfItem from '$newdocs/content/canvasModules/IndexesOfItem-561.mdx'
import IndexesOfItemConfig from '$newdocs/content/canvasModules/IndexesOfItem-561'
import IndexOfItem from '$newdocs/content/canvasModules/IndexOfItem-560.mdx'
import IndexOfItemConfig from '$newdocs/content/canvasModules/IndexOfItem-560'
import Indices from '$newdocs/content/canvasModules/Indices-541.mdx'
import IndicesConfig from '$newdocs/content/canvasModules/Indices-541'
import ListSize from '$newdocs/content/canvasModules/ListSize-544.mdx'
import ListSizeConfig from '$newdocs/content/canvasModules/ListSize-544'
import ListToEvents from '$newdocs/content/canvasModules/ListToEvents-1030.mdx'
import ListToEventsConfig from '$newdocs/content/canvasModules/ListToEvents-1030'
import MergeList from '$newdocs/content/canvasModules/MergeList-554.mdx'
import MergeListConfig from '$newdocs/content/canvasModules/MergeList-554'
import Range from '$newdocs/content/canvasModules/Range-545.mdx'
import RangeConfig from '$newdocs/content/canvasModules/Range-545'
import RemoveFromList from '$newdocs/content/canvasModules/RemoveFromList-555.mdx'
import RemoveFromListConfig from '$newdocs/content/canvasModules/RemoveFromList-555'
import RepeatItem from '$newdocs/content/canvasModules/RepeatItem-540.mdx'
import RepeatItemConfig from '$newdocs/content/canvasModules/RepeatItem-540'
import ReverseList from '$newdocs/content/canvasModules/ReverseList-556.mdx'
import ReverseListConfig from '$newdocs/content/canvasModules/ReverseList-556'
import ShuffleList from '$newdocs/content/canvasModules/ShuffleList-565.mdx'
import ShuffleListConfig from '$newdocs/content/canvasModules/ShuffleList-565'
import SortList from '$newdocs/content/canvasModules/SortList-557.mdx'
import SortListConfig from '$newdocs/content/canvasModules/SortList-557'
import SubList from '$newdocs/content/canvasModules/SubList-546.mdx'
import SubListConfig from '$newdocs/content/canvasModules/SubList-546'
import TailList from '$newdocs/content/canvasModules/TailList-558.mdx'
import TailListConfig from '$newdocs/content/canvasModules/TailList-558'
import Unique from '$newdocs/content/canvasModules/Unique-559.mdx'
import UniqueConfig from '$newdocs/content/canvasModules/Unique-559'

// --Map--
import BuildMap from '$newdocs/content/canvasModules/BuildMap-501.mdx'
import BuildMapConfig from '$newdocs/content/canvasModules/BuildMap-501'
import CollectFromMaps from '$newdocs/content/canvasModules/CollectFromMaps-526.mdx'
import CollectFromMapsConfig from '$newdocs/content/canvasModules/CollectFromMaps-526'
import ConstantMap from '$newdocs/content/canvasModules/ConstantMap-800.mdx'
import ConstantMapConfig from '$newdocs/content/canvasModules/ConstantMap-800'
import ContainsValue from '$newdocs/content/canvasModules/ContainsValue-224.mdx'
import ContainsValueConfig from '$newdocs/content/canvasModules/ContainsValue-224'
import CountByKey from '$newdocs/content/canvasModules/CountByKey-221.mdx'
import CountByKeyConfig from '$newdocs/content/canvasModules/CountByKey-221'
import FilterMap from '$newdocs/content/canvasModules/FilterMap-525.mdx'
import FilterMapConfig from '$newdocs/content/canvasModules/FilterMap-525'
import ForEach from '$newdocs/content/canvasModules/ForEach-223.mdx'
import ForEachConfig from '$newdocs/content/canvasModules/ForEach-223'
import GetFromMap from '$newdocs/content/canvasModules/GetFromMap-225.mdx'
import GetFromMapConfig from '$newdocs/content/canvasModules/GetFromMap-225'
import GetMultiFromMap from '$newdocs/content/canvasModules/GetMultiFromMap-523.mdx'
import GetMultiFromMapConfig from '$newdocs/content/canvasModules/GetMultiFromMap-523'
import HeadMap from '$newdocs/content/canvasModules/HeadMap-226.mdx'
import HeadMapConfig from '$newdocs/content/canvasModules/HeadMap-226'
import KeysToList from '$newdocs/content/canvasModules/KeysToList-227.mdx'
import KeysToListConfig from '$newdocs/content/canvasModules/KeysToList-227'
import MapSize from '$newdocs/content/canvasModules/MapSize-235.mdx'
import MapSizeConfig from '$newdocs/content/canvasModules/MapSize-235'
import MergeMap from '$newdocs/content/canvasModules/MergeMap-233.mdx'
import MergeMapConfig from '$newdocs/content/canvasModules/MergeMap-233'
import NewMap from '$newdocs/content/canvasModules/NewMap-232.mdx'
import NewMapConfig from '$newdocs/content/canvasModules/NewMap-232'
import PutToMap from '$newdocs/content/canvasModules/PutToMap-228.mdx'
import PutToMapConfig from '$newdocs/content/canvasModules/PutToMap-228'
import RemoveFromMap from '$newdocs/content/canvasModules/RemoveFromMap-234.mdx'
import RemoveFromMapConfig from '$newdocs/content/canvasModules/RemoveFromMap-234'
import SortMap from '$newdocs/content/canvasModules/SortMap-229.mdx'
import SortMapConfig from '$newdocs/content/canvasModules/SortMap-229'
import SumByKey from '$newdocs/content/canvasModules/SumByKey-222.mdx'
import SumByKeyConfig from '$newdocs/content/canvasModules/SumByKey-222'
import TailMap from '$newdocs/content/canvasModules/TailMap-230.mdx'
import TailMapConfig from '$newdocs/content/canvasModules/TailMap-230'
import ValuesToList from '$newdocs/content/canvasModules/ValuesToList-231.mdx'
import ValuesToListConfig from '$newdocs/content/canvasModules/ValuesToList-231'

// --Streams--
import CreateStream from '$newdocs/content/canvasModules/CreateStream-529.mdx'
import CreateStreamConfig from '$newdocs/content/canvasModules/CreateStream-529'
import GetOrCreateStream from '$newdocs/content/canvasModules/GetOrCreateStream-1033.mdx'
import GetOrCreateStreamConfig from '$newdocs/content/canvasModules/GetOrCreateStream-1033'
import SearchStream from '$newdocs/content/canvasModules/SearchStream-528.mdx'
import SearchStreamConfig from '$newdocs/content/canvasModules/SearchStream-528'

// --Text--
import Concatenate from '$newdocs/content/canvasModules/Concatenate-131.mdx'
import ConcatenateConfig from '$newdocs/content/canvasModules/Concatenate-131'
import ConstantText from '$newdocs/content/canvasModules/ConstantText-19.mdx'
import ConstantTextConfig from '$newdocs/content/canvasModules/ConstantText-19'
import Contains from '$newdocs/content/canvasModules/Contains-129.mdx'
import ContainsConfig from '$newdocs/content/canvasModules/Contains-129'
import EndsWith from '$newdocs/content/canvasModules/EndsWith-198.mdx'
import EndsWithConfig from '$newdocs/content/canvasModules/EndsWith-198'
import FormatNumber from '$newdocs/content/canvasModules/FormatNumber-569.mdx'
import FormatNumberConfig from '$newdocs/content/canvasModules/FormatNumber-569'
import JsonParser from '$newdocs/content/canvasModules/JsonParser-1016.mdx'
import JsonParserConfig from '$newdocs/content/canvasModules/JsonParser-1016'
import RandomString from '$newdocs/content/canvasModules/RandomString-564.mdx'
import RandomStringConfig from '$newdocs/content/canvasModules/RandomString-564'
import Regex from '$newdocs/content/canvasModules/Regex-201.mdx'
import RegexConfig from '$newdocs/content/canvasModules/Regex-201'
import Replace from '$newdocs/content/canvasModules/Replace-202.mdx'
import ReplaceConfig from '$newdocs/content/canvasModules/Replace-202'
import Split from '$newdocs/content/canvasModules/Split-203.mdx'
import SplitConfig from '$newdocs/content/canvasModules/Split-203'
import StartsWith from '$newdocs/content/canvasModules/StartsWith-204.mdx'
import StartsWithConfig from '$newdocs/content/canvasModules/StartsWith-204'
import StringTemplate from '$newdocs/content/canvasModules/StringTemplate-1015.mdx'
import StringTemplateConfig from '$newdocs/content/canvasModules/StringTemplate-1015'
import StringToNumber from '$newdocs/content/canvasModules/StringToNumber-1031.mdx'
import StringToNumberConfig from '$newdocs/content/canvasModules/StringToNumber-1031'
import TextEquals from '$newdocs/content/canvasModules/TextEquals-199.mdx'
import TextEqualsConfig from '$newdocs/content/canvasModules/TextEquals-199'
import TextLength from '$newdocs/content/canvasModules/TextLength-200.mdx'
import TextLengthConfig from '$newdocs/content/canvasModules/TextLength-200'
import ToLowerCase from '$newdocs/content/canvasModules/ToLowerCase-206.mdx'
import ToLowerCaseConfig from '$newdocs/content/canvasModules/ToLowerCase-206'
import ToUpperCase from '$newdocs/content/canvasModules/ToUpperCase-207.mdx'
import ToUpperCaseConfig from '$newdocs/content/canvasModules/ToUpperCase-207'
import Trim from '$newdocs/content/canvasModules/Trim-205.mdx'
import TrimConfig from '$newdocs/content/canvasModules/Trim-205'
import ValueAsText from '$newdocs/content/canvasModules/ValueAsText-208.mdx'
import ValueAsTextConfig from '$newdocs/content/canvasModules/ValueAsText-208'

// --Time & Date--
import Clock from '$newdocs/content/canvasModules/Clock-209.mdx'
import ClockConfig from '$newdocs/content/canvasModules/Clock-209'
import DateConversion from '$newdocs/content/canvasModules/DateConversion-211.mdx'
import DateConversionConfig from '$newdocs/content/canvasModules/DateConversion-211'
import Scheduler from '$newdocs/content/canvasModules/Scheduler-801.mdx'
import SchedulerConfig from '$newdocs/content/canvasModules/Scheduler-801'
import TimeBetweenEvents from '$newdocs/content/canvasModules/TimeBetweenEvents-210.mdx'
import TimeBetweenEventsConfig from '$newdocs/content/canvasModules/TimeBetweenEvents-210'
import TimeOfDay from '$newdocs/content/canvasModules/TimeOfDay-60.mdx'
import TimeOfDayConfig from '$newdocs/content/canvasModules/TimeOfDay-60'
import TimeOfEvent from '$newdocs/content/canvasModules/TimeOfEvent-566.mdx'
import TimeOfEventConfig from '$newdocs/content/canvasModules/TimeOfEvent-566'

// --Time Series--
import MODWT from '$newdocs/content/canvasModules/MODWT-70.mdx'
import MODWTConfig from '$newdocs/content/canvasModules/MODWT-70'
import MovingAverage from '$newdocs/content/canvasModules/MovingAverage-524.mdx'
import MovingAverageConfig from '$newdocs/content/canvasModules/MovingAverage-524'
import MovingAverageExp from '$newdocs/content/canvasModules/MovingAverageExp-96.mdx'
import MovingAverageExpConfig from '$newdocs/content/canvasModules/MovingAverageExp-96'
import ARIMA from '$newdocs/content/canvasModules/ARIMA-98.mdx'
import ARIMAConfig from '$newdocs/content/canvasModules/ARIMA-98'
import RandomNumber from '$newdocs/content/canvasModules/RandomNumber-562.mdx'
import RandomNumberConfig from '$newdocs/content/canvasModules/RandomNumber-562'
import RandomNumberGaussian from '$newdocs/content/canvasModules/RandomNumberGaussian-563.mdx'
import RandomNumberGaussianConfig from '$newdocs/content/canvasModules/RandomNumberGaussian-563'
import Abs from '$newdocs/content/canvasModules/Abs-27.mdx'
import AbsConfig from '$newdocs/content/canvasModules/Abs-27'
import Add from '$newdocs/content/canvasModules/Add-520.mdx'
import AddConfig from '$newdocs/content/canvasModules/Add-520'
import ChangeAbsolute from '$newdocs/content/canvasModules/ChangeAbsolute-11.mdx'
import ChangeAbsoluteConfig from '$newdocs/content/canvasModules/ChangeAbsolute-11'
import ChangeLogarithmic from '$newdocs/content/canvasModules/ChangeLogarithmic-87.mdx'
import ChangeLogarithmicConfig from '$newdocs/content/canvasModules/ChangeLogarithmic-87'
import ChangeRelative from '$newdocs/content/canvasModules/ChangeRelative-35.mdx'
import ChangeRelativeConfig from '$newdocs/content/canvasModules/ChangeRelative-35'
import Count from '$newdocs/content/canvasModules/Count-161.mdx'
import CountConfig from '$newdocs/content/canvasModules/Count-161'
import Divide from '$newdocs/content/canvasModules/Divide-6.mdx'
import DivideConfig from '$newdocs/content/canvasModules/Divide-6'
import Expression from '$newdocs/content/canvasModules/Expression-567.mdx'
import ExpressionConfig from '$newdocs/content/canvasModules/Expression-567'
import Invert from '$newdocs/content/canvasModules/Invert-29.mdx'
import InvertConfig from '$newdocs/content/canvasModules/Invert-29'
import LinearMapper from '$newdocs/content/canvasModules/LinearMapper-116.mdx'
import LinearMapperConfig from '$newdocs/content/canvasModules/LinearMapper-116'
import LogNatural from '$newdocs/content/canvasModules/LogNatural-115.mdx'
import LogNaturalConfig from '$newdocs/content/canvasModules/LogNatural-115'
import Max from '$newdocs/content/canvasModules/Max-62.mdx'
import MaxConfig from '$newdocs/content/canvasModules/Max-62'
import Min from '$newdocs/content/canvasModules/Min-61.mdx'
import MinConfig from '$newdocs/content/canvasModules/Min-61'
import Modulo from '$newdocs/content/canvasModules/Modulo-213.mdx'
import ModuloConfig from '$newdocs/content/canvasModules/Modulo-213'
import Multiply from '$newdocs/content/canvasModules/Multiply-1.mdx'
import MultiplyConfig from '$newdocs/content/canvasModules/Multiply-1'
import Negate from '$newdocs/content/canvasModules/Negate-28.mdx'
import NegateConfig from '$newdocs/content/canvasModules/Negate-28'
import RoundToStep from '$newdocs/content/canvasModules/RoundToStep-120.mdx'
import RoundToStepConfig from '$newdocs/content/canvasModules/RoundToStep-120'
import Sign from '$newdocs/content/canvasModules/Sign-34.mdx'
import SignConfig from '$newdocs/content/canvasModules/Sign-34'
import SquareRoot from '$newdocs/content/canvasModules/SquareRoot-162.mdx'
import SquareRootConfig from '$newdocs/content/canvasModules/SquareRoot-162'
import Subtract from '$newdocs/content/canvasModules/Subtract-4.mdx'
import SubtractConfig from '$newdocs/content/canvasModules/Subtract-4'
import Sum from '$newdocs/content/canvasModules/Sum-53.mdx'
import SumConfig from '$newdocs/content/canvasModules/Sum-53'
import Correlation from '$newdocs/content/canvasModules/Correlation-54.mdx'
import CorrelationConfig from '$newdocs/content/canvasModules/Correlation-54'
import Covariance from '$newdocs/content/canvasModules/Covariance-56.mdx'
import CovarianceConfig from '$newdocs/content/canvasModules/Covariance-56'
import GeometricMean from '$newdocs/content/canvasModules/GeometricMean-151.mdx'
import GeometricMeanConfig from '$newdocs/content/canvasModules/GeometricMean-151'
import Kurtosis from '$newdocs/content/canvasModules/Kurtosis-152.mdx'
import KurtosisConfig from '$newdocs/content/canvasModules/Kurtosis-152'
import Max_window from '$newdocs/content/canvasModules/Max_window-150.mdx'
import Max_windowConfig from '$newdocs/content/canvasModules/Max_window-150'
import Min_window from '$newdocs/content/canvasModules/Min_window-149.mdx'
import Min_windowConfig from '$newdocs/content/canvasModules/Min_window-149'
import Percentile from '$newdocs/content/canvasModules/Percentile-153.mdx'
import PercentileConfig from '$newdocs/content/canvasModules/Percentile-153'
import PopulationVariance from '$newdocs/content/canvasModules/PopulationVariance-154.mdx'
import PopulationVarianceConfig from '$newdocs/content/canvasModules/PopulationVariance-154'
import Skewness from '$newdocs/content/canvasModules/Skewness-156.mdx'
import SkewnessConfig from '$newdocs/content/canvasModules/Skewness-156'
import SpearmansRankCorrelation from '$newdocs/content/canvasModules/SpearmansRankCorrelation-55.mdx'
import SpearmansRankCorrelationConfig from '$newdocs/content/canvasModules/SpearmansRankCorrelation-55'
import StandardDeviation from '$newdocs/content/canvasModules/StandardDeviation-138.mdx'
import StandardDeviationConfig from '$newdocs/content/canvasModules/StandardDeviation-138'
import SumOfSquares from '$newdocs/content/canvasModules/SumOfSquares-157.mdx'
import SumOfSquaresConfig from '$newdocs/content/canvasModules/SumOfSquares-157'
import UnivariateLinearRegression from '$newdocs/content/canvasModules/UnivariateLinearRegression-51.mdx'
import UnivariateLinearRegressionConfig from '$newdocs/content/canvasModules/UnivariateLinearRegression-51'
import Variance from '$newdocs/content/canvasModules/Variance-155.mdx'
import VarianceConfig from '$newdocs/content/canvasModules/Variance-155'
import Barify from '$newdocs/content/canvasModules/Barify-16.mdx'
import BarifyConfig from '$newdocs/content/canvasModules/Barify-16'
import Delay from '$newdocs/content/canvasModules/Delay-7.mdx'
import DelayConfig from '$newdocs/content/canvasModules/Delay-7'
import FlexBarify from '$newdocs/content/canvasModules/FlexBarify-158.mdx'
import FlexBarifyConfig from '$newdocs/content/canvasModules/FlexBarify-158'
import PassThrough from '$newdocs/content/canvasModules/PassThrough-521.mdx'
import PassThroughConfig from '$newdocs/content/canvasModules/PassThrough-521'
import FourZones from '$newdocs/content/canvasModules/FourZones-84.mdx'
import FourZonesConfig from '$newdocs/content/canvasModules/FourZones-84'
import Peak from '$newdocs/content/canvasModules/Peak-49.mdx'
import PeakConfig from '$newdocs/content/canvasModules/Peak-49'
import SampleIf from '$newdocs/content/canvasModules/SampleIf-125.mdx'
import SampleIfConfig from '$newdocs/content/canvasModules/SampleIf-125'
import Sampler from '$newdocs/content/canvasModules/Sampler-85.mdx'
import SamplerConfig from '$newdocs/content/canvasModules/Sampler-85'
import ThreeZones from '$newdocs/content/canvasModules/ThreeZones-25.mdx'
import ThreeZonesConfig from '$newdocs/content/canvasModules/ThreeZones-25'
import ZeroCross from '$newdocs/content/canvasModules/ZeroCross-24.mdx'
import ZeroCrossConfig from '$newdocs/content/canvasModules/ZeroCross-24'

// --Utils--
import Canvas from '$newdocs/content/canvasModules/Canvas-81.mdx'
import CanvasConfig from '$newdocs/content/canvasModules/Canvas-81'
import Comment from '$newdocs/content/canvasModules/Comment-119.mdx'
import CommentConfig from '$newdocs/content/canvasModules/Comment-119'
import Constant from '$newdocs/content/canvasModules/Constant-5.mdx'
import ConstantConfig from '$newdocs/content/canvasModules/Constant-5'
import Email from '$newdocs/content/canvasModules/Email-195.mdx'
import EmailConfig from '$newdocs/content/canvasModules/Email-195'
import ExportCSV from '$newdocs/content/canvasModules/ExportCSV-571.mdx'
import ExportCSVConfig from '$newdocs/content/canvasModules/ExportCSV-571'
import Filter from '$newdocs/content/canvasModules/Filter-522.mdx'
import FilterConfig from '$newdocs/content/canvasModules/Filter-522'
import Label from '$newdocs/content/canvasModules/Label-145.mdx'
import LabelConfig from '$newdocs/content/canvasModules/Label-145'
import ListAsTable from '$newdocs/content/canvasModules/ListAsTable-1011.mdx'
import ListAsTableConfig from '$newdocs/content/canvasModules/ListAsTable-1011'
import MapAsTable from '$newdocs/content/canvasModules/MapAsTable-236.mdx'
import MapAsTableConfig from '$newdocs/content/canvasModules/MapAsTable-236'
import Merge from '$newdocs/content/canvasModules/Merge-141.mdx'
import MergeConfig from '$newdocs/content/canvasModules/Merge-141'
import MovingWindow from '$newdocs/content/canvasModules/MovingWindow-570.mdx'
import MovingWindowConfig from '$newdocs/content/canvasModules/MovingWindow-570'
import RateLimit from '$newdocs/content/canvasModules/RateLimit-217.mdx'
import RateLimitConfig from '$newdocs/content/canvasModules/RateLimit-217'
import RequireAll from '$newdocs/content/canvasModules/RequireAll-572.mdx'
import RequireAllConfig from '$newdocs/content/canvasModules/RequireAll-572'
import SendToStream from '$newdocs/content/canvasModules/SendToStream-197.mdx'
import SendToStreamConfig from '$newdocs/content/canvasModules/SendToStream-197'
import Table from '$newdocs/content/canvasModules/Table-527.mdx'
import TableConfig from '$newdocs/content/canvasModules/Table-527'
import ConstantColor from '$newdocs/content/canvasModules/ConstantColor-215.mdx'
import ConstantColorConfig from '$newdocs/content/canvasModules/ConstantColor-215'
import Gradient from '$newdocs/content/canvasModules/Gradient-216.mdx'
import GradientConfig from '$newdocs/content/canvasModules/Gradient-216'

// --Visualizations--
import Chart from '$newdocs/content/canvasModules/Chart-67.mdx'
import ChartConfig from '$newdocs/content/canvasModules/Chart-67'
import Heatmap from '$newdocs/content/canvasModules/Heatmap-196.mdx'
import HeatmapConfig from '$newdocs/content/canvasModules/Heatmap-196'
import Map_geo from '$newdocs/content/canvasModules/Map_geo-214.mdx'
import Map_geoConfig from '$newdocs/content/canvasModules/Map_geo-214'
import Map_image from '$newdocs/content/canvasModules/Map_image-583.mdx'
import Map_imageConfig from '$newdocs/content/canvasModules/Map_image-583'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'
import docsStyles from '$newdocs/components/DocsLayout/docsLayout.pcss'

const CanvasModules = () => {
    console.warn('b a')
    return (
        <DocsLayout subNav={subNav.canvasModules}>
            <Helmet title="Canvas Modules | Streamr Docs" />
            <section id="boolean" className={docsStyles.canvasModule}>
                <h2>Boolean Modules</h2>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {AndConfig.name}
                    </h3>
                    <And />
                    <CanvasModuleConfig
                        moduleInputs={AndConfig.help.inputs}
                        moduleOutputs={AndConfig.help.outputs}
                        moduleParams={AndConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {BooleanConstantConfig.name}
                    </h3>
                    <BooleanConstant />
                    <CanvasModuleConfig
                        moduleInputs={BooleanConstantConfig.help.inputs}
                        moduleOutputs={BooleanConstantConfig.help.outputs}
                        moduleParams={BooleanConstantConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {BooleanToNumberConfig.name}
                    </h3>
                    <BooleanToNumber />
                    <CanvasModuleConfig
                        moduleInputs={BooleanToNumberConfig.help.inputs}
                        moduleOutputs={BooleanToNumberConfig.help.outputs}
                        moduleParams={BooleanToNumberConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {EqualsConfig.name}
                    </h3>
                    <Equals />
                    <CanvasModuleConfig
                        moduleInputs={EqualsConfig.help.inputs}
                        moduleOutputs={EqualsConfig.help.outputs}
                        moduleParams={EqualsConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {GreaterThanConfig.name}
                    </h3>
                    <GreaterThan />
                    <CanvasModuleConfig
                        moduleInputs={GreaterThanConfig.help.inputs}
                        moduleOutputs={GreaterThanConfig.help.outputs}
                        moduleParams={GreaterThanConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {IfThenElseConfig.name}
                    </h3>
                    <IfThenElse />
                    <CanvasModuleConfig
                        moduleInputs={IfThenElseConfig.help.inputs}
                        moduleOutputs={IfThenElseConfig.help.outputs}
                        moduleParams={IfThenElseConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {LessThanConfig.name}
                    </h3>
                    <LessThan />
                    <CanvasModuleConfig
                        moduleInputs={LessThanConfig.help.inputs}
                        moduleOutputs={LessThanConfig.help.outputs}
                        moduleParams={LessThanConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {NotConfig.name}
                    </h3>
                    <Not />
                    <CanvasModuleConfig
                        moduleInputs={NotConfig.help.inputs}
                        moduleOutputs={NotConfig.help.outputs}
                        moduleParams={NotConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {OrConfig.name}
                    </h3>
                    <Or />
                    <CanvasModuleConfig
                        moduleInputs={OrConfig.help.inputs}
                        moduleOutputs={OrConfig.help.outputs}
                        moduleParams={OrConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {SameSignConfig.name}
                    </h3>
                    <SameSign />
                    <CanvasModuleConfig
                        moduleInputs={SameSignConfig.help.inputs}
                        moduleOutputs={SameSignConfig.help.outputs}
                        moduleParams={SameSignConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {XorConfig.name}
                    </h3>
                    <Xor />
                    <CanvasModuleConfig
                        moduleInputs={XorConfig.help.inputs}
                        moduleOutputs={XorConfig.help.outputs}
                        moduleParams={XorConfig.help.params}
                    />
                </section>
            </section>

            <section id="custom-modules" className={docsStyles.canvasModule}>
                <h2>Custom modules</h2>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {JavaModuleConfig.name}
                    </h3>
                    <JavaModule />
                    <CanvasModuleConfig
                        moduleInputs={JavaModuleConfig.help.inputs}
                        moduleOutputs={JavaModuleConfig.help.outputs}
                        moduleParams={JavaModuleConfig.help.params}
                    />
                </section>
            </section>

            <section id="input" className={docsStyles.canvasModule}>
                <h2>Input Modules</h2>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ButtonConfig.name}
                    </h3>
                    <Button />
                    <CanvasModuleConfig
                        moduleInputs={ButtonConfig.help.inputs}
                        moduleOutputs={ButtonConfig.help.outputs}
                        moduleParams={ButtonConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {SwitcherConfig.name}
                    </h3>
                    <Switcher />
                    <CanvasModuleConfig
                        moduleInputs={SwitcherConfig.help.inputs}
                        moduleOutputs={SwitcherConfig.help.outputs}
                        moduleParams={SwitcherConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {TextFieldConfig.name}
                    </h3>
                    <TextField />
                    <CanvasModuleConfig
                        moduleInputs={TextFieldConfig.help.inputs}
                        moduleOutputs={TextFieldConfig.help.outputs}
                        moduleParams={TextFieldConfig.help.params}
                    />
                </section>
            </section>

            <section id="integrations" className={docsStyles.canvasModule}>
                <h2>Integrations modules</h2>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {HTTPRequestConfig.name}
                    </h3>
                    <HTTPRequest />
                    <CanvasModuleConfig
                        moduleInputs={HTTPRequestConfig.help.inputs}
                        moduleOutputs={HTTPRequestConfig.help.outputs}
                        moduleParams={HTTPRequestConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {MQTTConfig.name}
                    </h3>
                    <MQTT />
                    <CanvasModuleConfig
                        moduleInputs={MQTTConfig.help.inputs}
                        moduleOutputs={MQTTConfig.help.outputs}
                        moduleParams={MQTTConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {SimpleHTTPConfig.name}
                    </h3>
                    <SimpleHTTP />
                    <CanvasModuleConfig
                        moduleInputs={SimpleHTTPConfig.help.inputs}
                        moduleOutputs={SimpleHTTPConfig.help.outputs}
                        moduleParams={SimpleHTTPConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {SQLConfig.name}
                    </h3>
                    <SQL />
                    <CanvasModuleConfig
                        moduleInputs={SQLConfig.help.inputs}
                        moduleOutputs={SQLConfig.help.outputs}
                        moduleParams={SQLConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {BinaryBettingConfig.name}
                    </h3>
                    <BinaryBetting />
                    <CanvasModuleConfig
                        moduleInputs={BinaryBettingConfig.help.inputs}
                        moduleOutputs={BinaryBettingConfig.help.outputs}
                        moduleParams={BinaryBettingConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {EthereumCallConfig.name}
                    </h3>
                    <EthereumCall />
                    <CanvasModuleConfig
                        moduleInputs={EthereumCallConfig.help.inputs}
                        moduleOutputs={EthereumCallConfig.help.outputs}
                        moduleParams={EthereumCallConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {GetContractAtConfig.name}
                    </h3>
                    <GetContractAt />
                    <CanvasModuleConfig
                        moduleInputs={GetContractAtConfig.help.inputs}
                        moduleOutputs={GetContractAtConfig.help.outputs}
                        moduleParams={GetContractAtConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {GetEventsConfig.name}
                    </h3>
                    <GetEvents />
                    <CanvasModuleConfig
                        moduleInputs={GetEventsConfig.help.inputs}
                        moduleOutputs={GetEventsConfig.help.outputs}
                        moduleParams={GetEventsConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {PayByUseConfig.name}
                    </h3>
                    <PayByUse />
                    <CanvasModuleConfig
                        moduleInputs={PayByUseConfig.help.inputs}
                        moduleOutputs={PayByUseConfig.help.outputs}
                        moduleParams={PayByUseConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {SolidityCompileDeployConfig.name}
                    </h3>
                    <SolidityCompileDeploy />
                    <CanvasModuleConfig
                        moduleInputs={SolidityCompileDeployConfig.help.inputs}
                        moduleOutputs={SolidityCompileDeployConfig.help.outputs}
                        moduleParams={SolidityCompileDeployConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {VerifySignatureConfig.name}
                    </h3>
                    <VerifySignature />
                    <CanvasModuleConfig
                        moduleInputs={VerifySignatureConfig.help.inputs}
                        moduleOutputs={VerifySignatureConfig.help.outputs}
                        moduleParams={VerifySignatureConfig.help.params}
                    />
                </section>
            </section>

            <section id="list" className={docsStyles.canvasModule}>
                <h2>List modules</h2>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {AddToListConfig.name}
                    </h3>
                    <AddToList />
                    <CanvasModuleConfig
                        moduleInputs={AddToListConfig.help.inputs}
                        moduleOutputs={AddToListConfig.help.outputs}
                        moduleParams={AddToListConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {AppendToListConfig.name}
                    </h3>
                    <AppendToList />
                    <CanvasModuleConfig
                        moduleInputs={AppendToListConfig.help.inputs}
                        moduleOutputs={AppendToListConfig.help.outputs}
                        moduleParams={AppendToListConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {BuildListConfig.name}
                    </h3>
                    <BuildList />
                    <CanvasModuleConfig
                        moduleInputs={BuildListConfig.help.inputs}
                        moduleOutputs={BuildListConfig.help.outputs}
                        moduleParams={BuildListConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ConstantListConfig.name}
                    </h3>
                    <ConstantList />
                    <CanvasModuleConfig
                        moduleInputs={ConstantListConfig.help.inputs}
                        moduleOutputs={ConstantListConfig.help.outputs}
                        moduleParams={ConstantListConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ContainsItemConfig.name}
                    </h3>
                    <ContainsItem />
                    <CanvasModuleConfig
                        moduleInputs={ContainsItemConfig.help.inputs}
                        moduleOutputs={ContainsItemConfig.help.outputs}
                        moduleParams={ContainsItemConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {FlattenListConfig.name}
                    </h3>
                    <FlattenList />
                    <CanvasModuleConfig
                        moduleInputs={FlattenListConfig.help.inputs}
                        moduleOutputs={FlattenListConfig.help.outputs}
                        moduleParams={FlattenListConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ForEachItemConfig.name}
                    </h3>
                    <ForEachItem />
                    <CanvasModuleConfig
                        moduleInputs={ForEachItemConfig.help.inputs}
                        moduleOutputs={ForEachItemConfig.help.outputs}
                        moduleParams={ForEachItemConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {GetFromListConfig.name}
                    </h3>
                    <GetFromList />
                    <CanvasModuleConfig
                        moduleInputs={GetFromListConfig.help.inputs}
                        moduleOutputs={GetFromListConfig.help.outputs}
                        moduleParams={GetFromListConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {HeadListConfig.name}
                    </h3>
                    <HeadList />
                    <CanvasModuleConfig
                        moduleInputs={HeadListConfig.help.inputs}
                        moduleOutputs={HeadListConfig.help.outputs}
                        moduleParams={HeadListConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {IndexesOfItemConfig.name}
                    </h3>
                    <IndexesOfItem />
                    <CanvasModuleConfig
                        moduleInputs={IndexesOfItemConfig.help.inputs}
                        moduleOutputs={IndexesOfItemConfig.help.outputs}
                        moduleParams={IndexesOfItemConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {IndexOfItemConfig.name}
                    </h3>
                    <IndexOfItem />
                    <CanvasModuleConfig
                        moduleInputs={IndexOfItemConfig.help.inputs}
                        moduleOutputs={IndexOfItemConfig.help.outputs}
                        moduleParams={IndexOfItemConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {IndicesConfig.name}
                    </h3>
                    <Indices />
                    <CanvasModuleConfig
                        moduleInputs={IndicesConfig.help.inputs}
                        moduleOutputs={IndicesConfig.help.outputs}
                        moduleParams={IndicesConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ListSizeConfig.name}
                    </h3>
                    <ListSize />
                    <CanvasModuleConfig
                        moduleInputs={ListSizeConfig.help.inputs}
                        moduleOutputs={ListSizeConfig.help.outputs}
                        moduleParams={ListSizeConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ListToEventsConfig.name}
                    </h3>
                    <ListToEvents />
                    <CanvasModuleConfig
                        moduleInputs={ListToEventsConfig.help.inputs}
                        moduleOutputs={ListToEventsConfig.help.outputs}
                        moduleParams={ListToEventsConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {MergeListConfig.name}
                    </h3>
                    <MergeList />
                    <CanvasModuleConfig
                        moduleInputs={MergeListConfig.help.inputs}
                        moduleOutputs={MergeListConfig.help.outputs}
                        moduleParams={MergeListConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {RangeConfig.name}
                    </h3>
                    <Range />
                    <CanvasModuleConfig
                        moduleInputs={RangeConfig.help.inputs}
                        moduleOutputs={RangeConfig.help.outputs}
                        moduleParams={RangeConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {RemoveFromListConfig.name}
                    </h3>
                    <RemoveFromList />
                    <CanvasModuleConfig
                        moduleInputs={RemoveFromListConfig.help.inputs}
                        moduleOutputs={RemoveFromListConfig.help.outputs}
                        moduleParams={RemoveFromListConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {RepeatItemConfig.name}
                    </h3>
                    <RepeatItem />
                    <CanvasModuleConfig
                        moduleInputs={RepeatItemConfig.help.inputs}
                        moduleOutputs={RepeatItemConfig.help.outputs}
                        moduleParams={RepeatItemConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ReverseListConfig.name}
                    </h3>
                    <ReverseList />
                    <CanvasModuleConfig
                        moduleInputs={ReverseListConfig.help.inputs}
                        moduleOutputs={ReverseListConfig.help.outputs}
                        moduleParams={ReverseListConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ShuffleListConfig.name}
                    </h3>
                    <ShuffleList />
                    <CanvasModuleConfig
                        moduleInputs={ShuffleListConfig.help.inputs}
                        moduleOutputs={ShuffleListConfig.help.outputs}
                        moduleParams={ShuffleListConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {SortListConfig.name}
                    </h3>
                    <SortList />
                    <CanvasModuleConfig
                        moduleInputs={SortListConfig.help.inputs}
                        moduleOutputs={SortListConfig.help.outputs}
                        moduleParams={SortListConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {SubListConfig.name}
                    </h3>
                    <SubList />
                    <CanvasModuleConfig
                        moduleInputs={SubListConfig.help.inputs}
                        moduleOutputs={SubListConfig.help.outputs}
                        moduleParams={SubListConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {TailListConfig.name}
                    </h3>
                    <TailList />
                    <CanvasModuleConfig
                        moduleInputs={TailListConfig.help.inputs}
                        moduleOutputs={TailListConfig.help.outputs}
                        moduleParams={TailListConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {UniqueConfig.name}
                    </h3>
                    <Unique />
                    <CanvasModuleConfig
                        moduleInputs={UniqueConfig.help.inputs}
                        moduleOutputs={UniqueConfig.help.outputs}
                        moduleParams={UniqueConfig.help.params}
                    />
                </section>
            </section>

            <section id="map" className={docsStyles.canvasModule}>
                <h2>Map modules</h2>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {BuildMapConfig.name}
                    </h3>
                    <BuildMap />
                    <CanvasModuleConfig
                        moduleInputs={BuildMapConfig.help.inputs}
                        moduleOutputs={BuildMapConfig.help.outputs}
                        moduleParams={BuildMapConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {CollectFromMapsConfig.name}
                    </h3>
                    <CollectFromMaps />
                    <CanvasModuleConfig
                        moduleInputs={CollectFromMapsConfig.help.inputs}
                        moduleOutputs={CollectFromMapsConfig.help.outputs}
                        moduleParams={CollectFromMapsConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ConstantMapConfig.name}
                    </h3>
                    <ConstantMap />
                    <CanvasModuleConfig
                        moduleInputs={ConstantMapConfig.help.inputs}
                        moduleOutputs={ConstantMapConfig.help.outputs}
                        moduleParams={ConstantMapConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ContainsValueConfig.name}
                    </h3>
                    <ContainsValue />
                    <CanvasModuleConfig
                        moduleInputs={ContainsValueConfig.help.inputs}
                        moduleOutputs={ContainsValueConfig.help.outputs}
                        moduleParams={ContainsValueConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {CountByKeyConfig.name}
                    </h3>
                    <CountByKey />
                    <CanvasModuleConfig
                        moduleInputs={CountByKeyConfig.help.inputs}
                        moduleOutputs={CountByKeyConfig.help.outputs}
                        moduleParams={CountByKeyConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {FilterMapConfig.name}
                    </h3>
                    <FilterMap />
                    <CanvasModuleConfig
                        moduleInputs={FilterMapConfig.help.inputs}
                        moduleOutputs={FilterMapConfig.help.outputs}
                        moduleParams={FilterMapConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ForEachConfig.name}
                    </h3>
                    <ForEach />
                    <CanvasModuleConfig
                        moduleInputs={ForEachConfig.help.inputs}
                        moduleOutputs={ForEachConfig.help.outputs}
                        moduleParams={ForEachConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {GetFromMapConfig.name}
                    </h3>
                    <GetFromMap />
                    <CanvasModuleConfig
                        moduleInputs={GetFromMapConfig.help.inputs}
                        moduleOutputs={GetFromMapConfig.help.outputs}
                        moduleParams={GetFromMapConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {GetMultiFromMapConfig.name}
                    </h3>
                    <GetMultiFromMap />
                    <CanvasModuleConfig
                        moduleInputs={GetMultiFromMapConfig.help.inputs}
                        moduleOutputs={GetMultiFromMapConfig.help.outputs}
                        moduleParams={GetMultiFromMapConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {HeadMapConfig.name}
                    </h3>
                    <HeadMap />
                    <CanvasModuleConfig
                        moduleInputs={HeadMapConfig.help.inputs}
                        moduleOutputs={HeadMapConfig.help.outputs}
                        moduleParams={HeadMapConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {KeysToListConfig.name}
                    </h3>
                    <KeysToList />
                    <CanvasModuleConfig
                        moduleInputs={KeysToListConfig.help.inputs}
                        moduleOutputs={KeysToListConfig.help.outputs}
                        moduleParams={KeysToListConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {MapSizeConfig.name}
                    </h3>
                    <MapSize />
                    <CanvasModuleConfig
                        moduleInputs={MapSizeConfig.help.inputs}
                        moduleOutputs={MapSizeConfig.help.outputs}
                        moduleParams={MapSizeConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {MergeMapConfig.name}
                    </h3>
                    <MergeMap />
                    <CanvasModuleConfig
                        moduleInputs={MergeMapConfig.help.inputs}
                        moduleOutputs={MergeMapConfig.help.outputs}
                        moduleParams={MergeMapConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {NewMapConfig.name}
                    </h3>
                    <NewMap />
                    <CanvasModuleConfig
                        moduleInputs={NewMapConfig.help.inputs}
                        moduleOutputs={NewMapConfig.help.outputs}
                        moduleParams={NewMapConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {PutToMapConfig.name}
                    </h3>
                    <PutToMap />
                    <CanvasModuleConfig
                        moduleInputs={PutToMapConfig.help.inputs}
                        moduleOutputs={PutToMapConfig.help.outputs}
                        moduleParams={PutToMapConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {RemoveFromMapConfig.name}
                    </h3>
                    <RemoveFromMap />
                    <CanvasModuleConfig
                        moduleInputs={RemoveFromMapConfig.help.inputs}
                        moduleOutputs={RemoveFromMapConfig.help.outputs}
                        moduleParams={RemoveFromMapConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {SortMapConfig.name}
                    </h3>
                    <SortMap />
                    <CanvasModuleConfig
                        moduleInputs={SortMapConfig.help.inputs}
                        moduleOutputs={SortMapConfig.help.outputs}
                        moduleParams={SortMapConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {SumByKeyConfig.name}
                    </h3>
                    <SumByKey />
                    <CanvasModuleConfig
                        moduleInputs={SumByKeyConfig.help.inputs}
                        moduleOutputs={SumByKeyConfig.help.outputs}
                        moduleParams={SumByKeyConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {TailMapConfig.name}
                    </h3>
                    <TailMap />
                    <CanvasModuleConfig
                        moduleInputs={TailMapConfig.help.inputs}
                        moduleOutputs={TailMapConfig.help.outputs}
                        moduleParams={TailMapConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ValuesToListConfig.name}
                    </h3>
                    <ValuesToList />
                    <CanvasModuleConfig
                        moduleInputs={ValuesToListConfig.help.inputs}
                        moduleOutputs={ValuesToListConfig.help.outputs}
                        moduleParams={ValuesToListConfig.help.params}
                    />
                </section>
            </section>

            <section id="streams" className={docsStyles.canvasModule}>
                <h2>Streams modules</h2>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {CreateStreamConfig.name}
                    </h3>
                    <CreateStream />
                    <CanvasModuleConfig
                        moduleInputs={CreateStreamConfig.help.inputs}
                        moduleOutputs={CreateStreamConfig.help.outputs}
                        moduleParams={CreateStreamConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {GetOrCreateStreamConfig.name}
                    </h3>
                    <GetOrCreateStream />
                    <CanvasModuleConfig
                        moduleInputs={GetOrCreateStreamConfig.help.inputs}
                        moduleOutputs={GetOrCreateStreamConfig.help.outputs}
                        moduleParams={GetOrCreateStreamConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {SearchStreamConfig.name}
                    </h3>
                    <SearchStream />
                    <CanvasModuleConfig
                        moduleInputs={SearchStreamConfig.help.inputs}
                        moduleOutputs={SearchStreamConfig.help.outputs}
                        moduleParams={SearchStreamConfig.help.params}
                    />
                </section>
            </section>

            <section id="text" className={docsStyles.canvasModule}>
                <h2>Text modules</h2>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ConcatenateConfig.name}
                    </h3>
                    <Concatenate />
                    <CanvasModuleConfig
                        moduleInputs={ConcatenateConfig.help.inputs}
                        moduleOutputs={ConcatenateConfig.help.outputs}
                        moduleParams={ConcatenateConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ConstantTextConfig.name}
                    </h3>
                    <ConstantText />
                    <CanvasModuleConfig
                        moduleInputs={ConstantTextConfig.help.inputs}
                        moduleOutputs={ConstantTextConfig.help.outputs}
                        moduleParams={ConstantTextConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ContainsConfig.name}
                    </h3>
                    <Contains />
                    <CanvasModuleConfig
                        moduleInputs={ContainsConfig.help.inputs}
                        moduleOutputs={ContainsConfig.help.outputs}
                        moduleParams={ContainsConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {EndsWithConfig.name}
                    </h3>
                    <EndsWith />
                    <CanvasModuleConfig
                        moduleInputs={EndsWithConfig.help.inputs}
                        moduleOutputs={EndsWithConfig.help.outputs}
                        moduleParams={EndsWithConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {FormatNumberConfig.name}
                    </h3>
                    <FormatNumber />
                    <CanvasModuleConfig
                        moduleInputs={FormatNumberConfig.help.inputs}
                        moduleOutputs={FormatNumberConfig.help.outputs}
                        moduleParams={FormatNumberConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {JsonParserConfig.name}
                    </h3>
                    <JsonParser />
                    <CanvasModuleConfig
                        moduleInputs={JsonParserConfig.help.inputs}
                        moduleOutputs={JsonParserConfig.help.outputs}
                        moduleParams={JsonParserConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {RandomStringConfig.name}
                    </h3>
                    <RandomString />
                    <CanvasModuleConfig
                        moduleInputs={RandomStringConfig.help.inputs}
                        moduleOutputs={RandomStringConfig.help.outputs}
                        moduleParams={RandomStringConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {RegexConfig.name}
                    </h3>
                    <Regex />
                    <CanvasModuleConfig
                        moduleInputs={RegexConfig.help.inputs}
                        moduleOutputs={RegexConfig.help.outputs}
                        moduleParams={RegexConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ReplaceConfig.name}
                    </h3>
                    <Replace />
                    <CanvasModuleConfig
                        moduleInputs={ReplaceConfig.help.inputs}
                        moduleOutputs={ReplaceConfig.help.outputs}
                        moduleParams={ReplaceConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {SplitConfig.name}
                    </h3>
                    <Split />
                    <CanvasModuleConfig
                        moduleInputs={SplitConfig.help.inputs}
                        moduleOutputs={SplitConfig.help.outputs}
                        moduleParams={SplitConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {StartsWithConfig.name}
                    </h3>
                    <StartsWith />
                    <CanvasModuleConfig
                        moduleInputs={StartsWithConfig.help.inputs}
                        moduleOutputs={StartsWithConfig.help.outputs}
                        moduleParams={StartsWithConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {StringTemplateConfig.name}
                    </h3>
                    <StringTemplate />
                    <CanvasModuleConfig
                        moduleInputs={StringTemplateConfig.help.inputs}
                        moduleOutputs={StringTemplateConfig.help.outputs}
                        moduleParams={StringTemplateConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {StringToNumberConfig.name}
                    </h3>
                    <StringToNumber />
                    <CanvasModuleConfig
                        moduleInputs={StringToNumberConfig.help.inputs}
                        moduleOutputs={StringToNumberConfig.help.outputs}
                        moduleParams={StringToNumberConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {TextEqualsConfig.name}
                    </h3>
                    <TextEquals />
                    <CanvasModuleConfig
                        moduleInputs={TextEqualsConfig.help.inputs}
                        moduleOutputs={TextEqualsConfig.help.outputs}
                        moduleParams={TextEqualsConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {TextLengthConfig.name}
                    </h3>
                    <TextLength />
                    <CanvasModuleConfig
                        moduleInputs={TextLengthConfig.help.inputs}
                        moduleOutputs={TextLengthConfig.help.outputs}
                        moduleParams={TextLengthConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ToLowerCaseConfig.name}
                    </h3>
                    <ToLowerCase />
                    <CanvasModuleConfig
                        moduleInputs={ToLowerCaseConfig.help.inputs}
                        moduleOutputs={ToLowerCaseConfig.help.outputs}
                        moduleParams={ToLowerCaseConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ToUpperCaseConfig.name}
                    </h3>
                    <ToUpperCase />
                    <CanvasModuleConfig
                        moduleInputs={ToUpperCaseConfig.help.inputs}
                        moduleOutputs={ToUpperCaseConfig.help.outputs}
                        moduleParams={ToUpperCaseConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {TrimConfig.name}
                    </h3>
                    <Trim />
                    <CanvasModuleConfig
                        moduleInputs={TrimConfig.help.inputs}
                        moduleOutputs={TrimConfig.help.outputs}
                        moduleParams={TrimConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ValueAsTextConfig.name}
                    </h3>
                    <ValueAsText />
                    <CanvasModuleConfig
                        moduleInputs={ValueAsTextConfig.help.inputs}
                        moduleOutputs={ValueAsTextConfig.help.outputs}
                        moduleParams={ValueAsTextConfig.help.params}
                    />
                </section>
            </section>

            <section id="time-and-date" className={docsStyles.canvasModule}>
                <h2>Time & date modules</h2>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ClockConfig.name}
                    </h3>
                    <Clock />
                    <CanvasModuleConfig
                        moduleInputs={ClockConfig.help.inputs}
                        moduleOutputs={ClockConfig.help.outputs}
                        moduleParams={ClockConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {DateConversionConfig.name}
                    </h3>
                    <DateConversion />
                    <CanvasModuleConfig
                        moduleInputs={DateConversionConfig.help.inputs}
                        moduleOutputs={DateConversionConfig.help.outputs}
                        moduleParams={DateConversionConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {SchedulerConfig.name}
                    </h3>
                    <Scheduler />
                    <CanvasModuleConfig
                        moduleInputs={SchedulerConfig.help.inputs}
                        moduleOutputs={SchedulerConfig.help.outputs}
                        moduleParams={SchedulerConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {TimeBetweenEventsConfig.name}
                    </h3>
                    <TimeBetweenEvents />
                    <CanvasModuleConfig
                        moduleInputs={TimeBetweenEventsConfig.help.inputs}
                        moduleOutputs={TimeBetweenEventsConfig.help.outputs}
                        moduleParams={TimeBetweenEventsConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {TimeOfDayConfig.name}
                    </h3>
                    <TimeOfDay />
                    <CanvasModuleConfig
                        moduleInputs={TimeOfDayConfig.help.inputs}
                        moduleOutputs={TimeOfDayConfig.help.outputs}
                        moduleParams={TimeOfDayConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {TimeOfEventConfig.name}
                    </h3>
                    <TimeOfEvent />
                    <CanvasModuleConfig
                        moduleInputs={TimeOfEventConfig.help.inputs}
                        moduleOutputs={TimeOfEventConfig.help.outputs}
                        moduleParams={TimeOfEventConfig.help.params}
                    />
                </section>
            </section>

            <section id="time-series" className={docsStyles.canvasModule}>
                <h2>Time series modules</h2>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {MODWTConfig.name}
                    </h3>
                    <MODWT />
                    <CanvasModuleConfig
                        moduleInputs={MODWTConfig.help.inputs}
                        moduleOutputs={MODWTConfig.help.outputs}
                        moduleParams={MODWTConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {MovingAverageConfig.name}
                    </h3>
                    <MovingAverage />
                    <CanvasModuleConfig
                        moduleInputs={MovingAverageConfig.help.inputs}
                        moduleOutputs={MovingAverageConfig.help.outputs}
                        moduleParams={MovingAverageConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {MovingAverageExpConfig.name}
                    </h3>
                    <MovingAverageExp />
                    <CanvasModuleConfig
                        moduleInputs={MovingAverageExpConfig.help.inputs}
                        moduleOutputs={MovingAverageExpConfig.help.outputs}
                        moduleParams={MovingAverageExpConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ARIMAConfig.name}
                    </h3>
                    <ARIMA />
                    <CanvasModuleConfig
                        moduleInputs={ARIMAConfig.help.inputs}
                        moduleOutputs={ARIMAConfig.help.outputs}
                        moduleParams={ARIMAConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {RandomNumberConfig.name}
                    </h3>
                    <RandomNumber />
                    <CanvasModuleConfig
                        moduleInputs={RandomNumberConfig.help.inputs}
                        moduleOutputs={RandomNumberConfig.help.outputs}
                        moduleParams={RandomNumberConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {RandomNumberGaussianConfig.name}
                    </h3>
                    <RandomNumberGaussian />
                    <CanvasModuleConfig
                        moduleInputs={RandomNumberGaussianConfig.help.inputs}
                        moduleOutputs={RandomNumberGaussianConfig.help.outputs}
                        moduleParams={RandomNumberGaussianConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {AbsConfig.name}
                    </h3>
                    <Abs />
                    <CanvasModuleConfig
                        moduleInputs={AbsConfig.help.inputs}
                        moduleOutputs={AbsConfig.help.outputs}
                        moduleParams={AbsConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {AddConfig.name}
                    </h3>
                    <Add />
                    <CanvasModuleConfig
                        moduleInputs={AddConfig.help.inputs}
                        moduleOutputs={AddConfig.help.outputs}
                        moduleParams={AddConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ChangeAbsoluteConfig.name}
                    </h3>
                    <ChangeAbsolute />
                    <CanvasModuleConfig
                        moduleInputs={ChangeAbsoluteConfig.help.inputs}
                        moduleOutputs={ChangeAbsoluteConfig.help.outputs}
                        moduleParams={ChangeAbsoluteConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ChangeLogarithmicConfig.name}
                    </h3>
                    <ChangeLogarithmic />
                    <CanvasModuleConfig
                        moduleInputs={ChangeLogarithmicConfig.help.inputs}
                        moduleOutputs={ChangeLogarithmicConfig.help.outputs}
                        moduleParams={ChangeLogarithmicConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ChangeRelativeConfig.name}
                    </h3>
                    <ChangeRelative />
                    <CanvasModuleConfig
                        moduleInputs={ChangeRelativeConfig.help.inputs}
                        moduleOutputs={ChangeRelativeConfig.help.outputs}
                        moduleParams={ChangeRelativeConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {CountConfig.name}
                    </h3>
                    <Count />
                    <CanvasModuleConfig
                        moduleInputs={CountConfig.help.inputs}
                        moduleOutputs={CountConfig.help.outputs}
                        moduleParams={CountConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {DivideConfig.name}
                    </h3>
                    <Divide />
                    <CanvasModuleConfig
                        moduleInputs={DivideConfig.help.inputs}
                        moduleOutputs={DivideConfig.help.outputs}
                        moduleParams={DivideConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ExpressionConfig.name}
                    </h3>
                    <Expression />
                    <CanvasModuleConfig
                        moduleInputs={ExpressionConfig.help.inputs}
                        moduleOutputs={ExpressionConfig.help.outputs}
                        moduleParams={ExpressionConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {InvertConfig.name}
                    </h3>
                    <Invert />
                    <CanvasModuleConfig
                        moduleInputs={InvertConfig.help.inputs}
                        moduleOutputs={InvertConfig.help.outputs}
                        moduleParams={InvertConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {LinearMapperConfig.name}
                    </h3>
                    <LinearMapper />
                    <CanvasModuleConfig
                        moduleInputs={LinearMapperConfig.help.inputs}
                        moduleOutputs={LinearMapperConfig.help.outputs}
                        moduleParams={LinearMapperConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {LogNaturalConfig.name}
                    </h3>
                    <LogNatural />
                    <CanvasModuleConfig
                        moduleInputs={LogNaturalConfig.help.inputs}
                        moduleOutputs={LogNaturalConfig.help.outputs}
                        moduleParams={LogNaturalConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {MaxConfig.name}
                    </h3>
                    <Max />
                    <CanvasModuleConfig
                        moduleInputs={MaxConfig.help.inputs}
                        moduleOutputs={MaxConfig.help.outputs}
                        moduleParams={MaxConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {MinConfig.name}
                    </h3>
                    <Min />
                    <CanvasModuleConfig
                        moduleInputs={MinConfig.help.inputs}
                        moduleOutputs={MinConfig.help.outputs}
                        moduleParams={MinConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ModuloConfig.name}
                    </h3>
                    <Modulo />
                    <CanvasModuleConfig
                        moduleInputs={ModuloConfig.help.inputs}
                        moduleOutputs={ModuloConfig.help.outputs}
                        moduleParams={ModuloConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {MultiplyConfig.name}
                    </h3>
                    <Multiply />
                    <CanvasModuleConfig
                        moduleInputs={MultiplyConfig.help.inputs}
                        moduleOutputs={MultiplyConfig.help.outputs}
                        moduleParams={MultiplyConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {NegateConfig.name}
                    </h3>
                    <Negate />
                    <CanvasModuleConfig
                        moduleInputs={NegateConfig.help.inputs}
                        moduleOutputs={NegateConfig.help.outputs}
                        moduleParams={NegateConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {RoundToStepConfig.name}
                    </h3>
                    <RoundToStep />
                    <CanvasModuleConfig
                        moduleInputs={RoundToStepConfig.help.inputs}
                        moduleOutputs={RoundToStepConfig.help.outputs}
                        moduleParams={RoundToStepConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {SignConfig.name}
                    </h3>
                    <Sign />
                    <CanvasModuleConfig
                        moduleInputs={SignConfig.help.inputs}
                        moduleOutputs={SignConfig.help.outputs}
                        moduleParams={SignConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {SquareRootConfig.name}
                    </h3>
                    <SquareRoot />
                    <CanvasModuleConfig
                        moduleInputs={SquareRootConfig.help.inputs}
                        moduleOutputs={SquareRootConfig.help.outputs}
                        moduleParams={SquareRootConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {SubtractConfig.name}
                    </h3>
                    <Subtract />
                    <CanvasModuleConfig
                        moduleInputs={SubtractConfig.help.inputs}
                        moduleOutputs={SubtractConfig.help.outputs}
                        moduleParams={SubtractConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {SumConfig.name}
                    </h3>
                    <Sum />
                    <CanvasModuleConfig
                        moduleInputs={SumConfig.help.inputs}
                        moduleOutputs={SumConfig.help.outputs}
                        moduleParams={SumConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {CorrelationConfig.name}
                    </h3>
                    <Correlation />
                    <CanvasModuleConfig
                        moduleInputs={CorrelationConfig.help.inputs}
                        moduleOutputs={CorrelationConfig.help.outputs}
                        moduleParams={CorrelationConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {CovarianceConfig.name}
                    </h3>
                    <Covariance />
                    <CanvasModuleConfig
                        moduleInputs={CovarianceConfig.help.inputs}
                        moduleOutputs={CovarianceConfig.help.outputs}
                        moduleParams={CovarianceConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {GeometricMeanConfig.name}
                    </h3>
                    <GeometricMean />
                    <CanvasModuleConfig
                        moduleInputs={GeometricMeanConfig.help.inputs}
                        moduleOutputs={GeometricMeanConfig.help.outputs}
                        moduleParams={GeometricMeanConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {KurtosisConfig.name}
                    </h3>
                    <Kurtosis />
                    <CanvasModuleConfig
                        moduleInputs={KurtosisConfig.help.inputs}
                        moduleOutputs={KurtosisConfig.help.outputs}
                        moduleParams={KurtosisConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {Max_windowConfig.name}
                    </h3>
                    <Max_window />
                    <CanvasModuleConfig
                        moduleInputs={Max_windowConfig.help.inputs}
                        moduleOutputs={Max_windowConfig.help.outputs}
                        moduleParams={Max_windowConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {Min_windowConfig.name}
                    </h3>
                    <Min_window />
                    <CanvasModuleConfig
                        moduleInputs={Min_windowConfig.help.inputs}
                        moduleOutputs={Min_windowConfig.help.outputs}
                        moduleParams={Min_windowConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {PercentileConfig.name}
                    </h3>
                    <Percentile />
                    <CanvasModuleConfig
                        moduleInputs={PercentileConfig.help.inputs}
                        moduleOutputs={PercentileConfig.help.outputs}
                        moduleParams={PercentileConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {PopulationVarianceConfig.name}
                    </h3>
                    <PopulationVariance />
                    <CanvasModuleConfig
                        moduleInputs={PopulationVarianceConfig.help.inputs}
                        moduleOutputs={PopulationVarianceConfig.help.outputs}
                        moduleParams={PopulationVarianceConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {SkewnessConfig.name}
                    </h3>
                    <Skewness />
                    <CanvasModuleConfig
                        moduleInputs={SkewnessConfig.help.inputs}
                        moduleOutputs={SkewnessConfig.help.outputs}
                        moduleParams={SkewnessConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {SpearmansRankCorrelationConfig.name}
                    </h3>
                    <SpearmansRankCorrelation />
                    <CanvasModuleConfig
                        moduleInputs={SpearmansRankCorrelationConfig.help.inputs}
                        moduleOutputs={SpearmansRankCorrelationConfig.help.outputs}
                        moduleParams={SpearmansRankCorrelationConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {StandardDeviationConfig.name}
                    </h3>
                    <StandardDeviation />
                    <CanvasModuleConfig
                        moduleInputs={StandardDeviationConfig.help.inputs}
                        moduleOutputs={StandardDeviationConfig.help.outputs}
                        moduleParams={StandardDeviationConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {SumOfSquaresConfig.name}
                    </h3>
                    <SumOfSquares />
                    <CanvasModuleConfig
                        moduleInputs={SumOfSquaresConfig.help.inputs}
                        moduleOutputs={SumOfSquaresConfig.help.outputs}
                        moduleParams={SumOfSquaresConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {UnivariateLinearRegressionConfig.name}
                    </h3>
                    <UnivariateLinearRegression />
                    <CanvasModuleConfig
                        moduleInputs={UnivariateLinearRegressionConfig.help.inputs}
                        moduleOutputs={UnivariateLinearRegressionConfig.help.outputs}
                        moduleParams={UnivariateLinearRegressionConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {VarianceConfig.name}
                    </h3>
                    <Variance />
                    <CanvasModuleConfig
                        moduleInputs={VarianceConfig.help.inputs}
                        moduleOutputs={VarianceConfig.help.outputs}
                        moduleParams={VarianceConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {BarifyConfig.name}
                    </h3>
                    <Barify />
                    <CanvasModuleConfig
                        moduleInputs={BarifyConfig.help.inputs}
                        moduleOutputs={BarifyConfig.help.outputs}
                        moduleParams={BarifyConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {DelayConfig.name}
                    </h3>
                    <Delay />
                    <CanvasModuleConfig
                        moduleInputs={DelayConfig.help.inputs}
                        moduleOutputs={DelayConfig.help.outputs}
                        moduleParams={DelayConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {FlexBarifyConfig.name}
                    </h3>
                    <FlexBarify />
                    <CanvasModuleConfig
                        moduleInputs={FlexBarifyConfig.help.inputs}
                        moduleOutputs={FlexBarifyConfig.help.outputs}
                        moduleParams={FlexBarifyConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {PassThroughConfig.name}
                    </h3>
                    <PassThrough />
                    <CanvasModuleConfig
                        moduleInputs={PassThroughConfig.help.inputs}
                        moduleOutputs={PassThroughConfig.help.outputs}
                        moduleParams={PassThroughConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {FourZonesConfig.name}
                    </h3>
                    <FourZones />
                    <CanvasModuleConfig
                        moduleInputs={FourZonesConfig.help.inputs}
                        moduleOutputs={FourZonesConfig.help.outputs}
                        moduleParams={FourZonesConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {PeakConfig.name}
                    </h3>
                    <Peak />
                    <CanvasModuleConfig
                        moduleInputs={PeakConfig.help.inputs}
                        moduleOutputs={PeakConfig.help.outputs}
                        moduleParams={PeakConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {SampleIfConfig.name}
                    </h3>
                    <SampleIf />
                    <CanvasModuleConfig
                        moduleInputs={SampleIfConfig.help.inputs}
                        moduleOutputs={SampleIfConfig.help.outputs}
                        moduleParams={SampleIfConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {SamplerConfig.name}
                    </h3>
                    <Sampler />
                    <CanvasModuleConfig
                        moduleInputs={SamplerConfig.help.inputs}
                        moduleOutputs={SamplerConfig.help.outputs}
                        moduleParams={SamplerConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ThreeZonesConfig.name}
                    </h3>
                    <ThreeZones />
                    <CanvasModuleConfig
                        moduleInputs={ThreeZonesConfig.help.inputs}
                        moduleOutputs={ThreeZonesConfig.help.outputs}
                        moduleParams={ThreeZonesConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ZeroCrossConfig.name}
                    </h3>
                    <ZeroCross />
                    <CanvasModuleConfig
                        moduleInputs={ZeroCrossConfig.help.inputs}
                        moduleOutputs={ZeroCrossConfig.help.outputs}
                        moduleParams={ZeroCrossConfig.help.params}
                    />
                </section>
            </section>

            <section id="utils" className={docsStyles.canvasModule}>
                <h2>Utility modules</h2>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {CanvasConfig.name}
                    </h3>
                    <Canvas />
                    <CanvasModuleConfig
                        moduleInputs={CanvasConfig.help.inputs}
                        moduleOutputs={CanvasConfig.help.outputs}
                        moduleParams={CanvasConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {CommentConfig.name}
                    </h3>
                    <Comment />
                    <CanvasModuleConfig
                        moduleInputs={CommentConfig.help.inputs}
                        moduleOutputs={CommentConfig.help.outputs}
                        moduleParams={CommentConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ConstantConfig.name}
                    </h3>
                    <Constant />
                    <CanvasModuleConfig
                        moduleInputs={ConstantConfig.help.inputs}
                        moduleOutputs={ConstantConfig.help.outputs}
                        moduleParams={ConstantConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {EmailConfig.name}
                    </h3>
                    <Email />
                    <CanvasModuleConfig
                        moduleInputs={EmailConfig.help.inputs}
                        moduleOutputs={EmailConfig.help.outputs}
                        moduleParams={EmailConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ExportCSVConfig.name}
                    </h3>
                    <ExportCSV />
                    <CanvasModuleConfig
                        moduleInputs={ExportCSVConfig.help.inputs}
                        moduleOutputs={ExportCSVConfig.help.outputs}
                        moduleParams={ExportCSVConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {FilterConfig.name}
                    </h3>
                    <Filter />
                    <CanvasModuleConfig
                        moduleInputs={FilterConfig.help.inputs}
                        moduleOutputs={FilterConfig.help.outputs}
                        moduleParams={FilterConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {LabelConfig.name}
                    </h3>
                    <Label />
                    <CanvasModuleConfig
                        moduleInputs={LabelConfig.help.inputs}
                        moduleOutputs={LabelConfig.help.outputs}
                        moduleParams={LabelConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ListAsTableConfig.name}
                    </h3>
                    <ListAsTable />
                    <CanvasModuleConfig
                        moduleInputs={ListAsTableConfig.help.inputs}
                        moduleOutputs={ListAsTableConfig.help.outputs}
                        moduleParams={ListAsTableConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {MapAsTableConfig.name}
                    </h3>
                    <MapAsTable />
                    <CanvasModuleConfig
                        moduleInputs={MapAsTableConfig.help.inputs}
                        moduleOutputs={MapAsTableConfig.help.outputs}
                        moduleParams={MapAsTableConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {MergeConfig.name}
                    </h3>
                    <Merge />
                    <CanvasModuleConfig
                        moduleInputs={MergeConfig.help.inputs}
                        moduleOutputs={MergeConfig.help.outputs}
                        moduleParams={MergeConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {MovingWindowConfig.name}
                    </h3>
                    <MovingWindow />
                    <CanvasModuleConfig
                        moduleInputs={MovingWindowConfig.help.inputs}
                        moduleOutputs={MovingWindowConfig.help.outputs}
                        moduleParams={MovingWindowConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {RateLimitConfig.name}
                    </h3>
                    <RateLimit />
                    <CanvasModuleConfig
                        moduleInputs={RateLimitConfig.help.inputs}
                        moduleOutputs={RateLimitConfig.help.outputs}
                        moduleParams={RateLimitConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {RequireAllConfig.name}
                    </h3>
                    <RequireAll />
                    <CanvasModuleConfig
                        moduleInputs={RequireAllConfig.help.inputs}
                        moduleOutputs={RequireAllConfig.help.outputs}
                        moduleParams={RequireAllConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {SendToStreamConfig.name}
                    </h3>
                    <SendToStream />
                    <CanvasModuleConfig
                        moduleInputs={SendToStreamConfig.help.inputs}
                        moduleOutputs={SendToStreamConfig.help.outputs}
                        moduleParams={SendToStreamConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {TableConfig.name}
                    </h3>
                    <Table />
                    <CanvasModuleConfig
                        moduleInputs={TableConfig.help.inputs}
                        moduleOutputs={TableConfig.help.outputs}
                        moduleParams={TableConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ConstantColorConfig.name}
                    </h3>
                    <ConstantColor />
                    <CanvasModuleConfig
                        moduleInputs={ConstantColorConfig.help.inputs}
                        moduleOutputs={ConstantColorConfig.help.outputs}
                        moduleParams={ConstantColorConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {GradientConfig.name}
                    </h3>
                    <Gradient />
                    <CanvasModuleConfig
                        moduleInputs={GradientConfig.help.inputs}
                        moduleOutputs={GradientConfig.help.outputs}
                        moduleParams={GradientConfig.help.params}
                    />
                </section>
            </section>

            <section id="visualizations" className={docsStyles.canvasModule}>
                <h2>Visualization modules</h2>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {ChartConfig.name}
                    </h3>
                    <Chart />
                    <CanvasModuleConfig
                        moduleInputs={ChartConfig.help.inputs}
                        moduleOutputs={ChartConfig.help.outputs}
                        moduleParams={ChartConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {HeatmapConfig.name}
                    </h3>
                    <Heatmap />
                    <CanvasModuleConfig
                        moduleInputs={HeatmapConfig.help.inputs}
                        moduleOutputs={HeatmapConfig.help.outputs}
                        moduleParams={HeatmapConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {Map_geoConfig.name}
                    </h3>
                    <Map_geo />
                    <CanvasModuleConfig
                        moduleInputs={Map_geoConfig.help.inputs}
                        moduleOutputs={Map_geoConfig.help.outputs}
                        moduleParams={Map_geoConfig.help.params}
                    />
                </section>
                <section className={docsStyles.singleModule}>
                    <h3>
                        {Map_imageConfig.name}
                    </h3>
                    <Map_image />
                    <CanvasModuleConfig
                        moduleInputs={Map_imageConfig.help.inputs}
                        moduleOutputs={Map_imageConfig.help.outputs}
                        moduleParams={Map_imageConfig.help.params}
                    />
                </section>
            </section>
        </DocsLayout>
    )
}

export default CanvasModules

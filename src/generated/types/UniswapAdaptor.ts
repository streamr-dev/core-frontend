/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export interface UniswapAdaptorInterface extends utils.Interface {
  functions: {
    "getConversionRateInput(address,address,uint256)": FunctionFragment;
    "getConversionRateOutput(address,address,uint256)": FunctionFragment;
    "buyWithERC20(bytes32,uint256,uint256,address,uint256)": FunctionFragment;
    "buyWithETH(bytes32,uint256,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "getConversionRateInput"
      | "getConversionRateOutput"
      | "buyWithERC20"
      | "buyWithETH"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getConversionRateInput",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getConversionRateOutput",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "buyWithERC20",
    values: [BytesLike, BigNumberish, BigNumberish, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "buyWithETH",
    values: [BytesLike, BigNumberish, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "getConversionRateInput",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getConversionRateOutput",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "buyWithERC20",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "buyWithETH", data: BytesLike): Result;

  events: {};
}

export interface UniswapAdaptor extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: UniswapAdaptorInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    getConversionRateInput(
      from_token: string,
      to_token: string,
      input_amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getConversionRateOutput(
      from_token: string,
      to_token: string,
      output_amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    buyWithERC20(
      productId: BytesLike,
      minSubscriptionSeconds: BigNumberish,
      timeWindow: BigNumberish,
      erc20_address: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    buyWithETH(
      productId: BytesLike,
      minSubscriptionSeconds: BigNumberish,
      timeWindow: BigNumberish,
      overrides?: PayableOverrides & { from?: string }
    ): Promise<ContractTransaction>;
  };

  getConversionRateInput(
    from_token: string,
    to_token: string,
    input_amount: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getConversionRateOutput(
    from_token: string,
    to_token: string,
    output_amount: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  buyWithERC20(
    productId: BytesLike,
    minSubscriptionSeconds: BigNumberish,
    timeWindow: BigNumberish,
    erc20_address: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  buyWithETH(
    productId: BytesLike,
    minSubscriptionSeconds: BigNumberish,
    timeWindow: BigNumberish,
    overrides?: PayableOverrides & { from?: string }
  ): Promise<ContractTransaction>;

  callStatic: {
    getConversionRateInput(
      from_token: string,
      to_token: string,
      input_amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getConversionRateOutput(
      from_token: string,
      to_token: string,
      output_amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    buyWithERC20(
      productId: BytesLike,
      minSubscriptionSeconds: BigNumberish,
      timeWindow: BigNumberish,
      erc20_address: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    buyWithETH(
      productId: BytesLike,
      minSubscriptionSeconds: BigNumberish,
      timeWindow: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    getConversionRateInput(
      from_token: string,
      to_token: string,
      input_amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getConversionRateOutput(
      from_token: string,
      to_token: string,
      output_amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    buyWithERC20(
      productId: BytesLike,
      minSubscriptionSeconds: BigNumberish,
      timeWindow: BigNumberish,
      erc20_address: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    buyWithETH(
      productId: BytesLike,
      minSubscriptionSeconds: BigNumberish,
      timeWindow: BigNumberish,
      overrides?: PayableOverrides & { from?: string }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getConversionRateInput(
      from_token: string,
      to_token: string,
      input_amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getConversionRateOutput(
      from_token: string,
      to_token: string,
      output_amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    buyWithERC20(
      productId: BytesLike,
      minSubscriptionSeconds: BigNumberish,
      timeWindow: BigNumberish,
      erc20_address: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    buyWithETH(
      productId: BytesLike,
      minSubscriptionSeconds: BigNumberish,
      timeWindow: BigNumberish,
      overrides?: PayableOverrides & { from?: string }
    ): Promise<PopulatedTransaction>;
  };
}

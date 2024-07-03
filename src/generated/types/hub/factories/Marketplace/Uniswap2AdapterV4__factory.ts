/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  BigNumberish,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../common";
import type {
  Uniswap2AdapterV4,
  Uniswap2AdapterV4Interface,
} from "../../Marketplace/Uniswap2AdapterV4";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_marketplace",
        type: "address",
      },
      {
        internalType: "address",
        name: "_projectRegistry",
        type: "address",
      },
      {
        internalType: "address",
        name: "_uniswapRouter",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "_deployedOnDomainId",
        type: "uint32",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "projectId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "minSubscriptionSeconds",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timeWindow",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "erc20Address",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "buyWithERC20",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "projectId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "minSubscriptionSeconds",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timeWindow",
        type: "uint256",
      },
    ],
    name: "buyWithETH",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "domainIds",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "forwarder",
        type: "address",
      },
    ],
    name: "isTrustedForwarder",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "liquidityToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "marketplace",
    outputs: [
      {
        internalType: "contract IMarketplaceV4",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "onTokenTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "projectRegistry",
    outputs: [
      {
        internalType: "contract IProjectRegistryV1",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "uniswapRouter",
    outputs: [
      {
        internalType: "contract IUniswapV2Router02",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162001afb38038062001afb8339810160408190526200003491620000f5565b600080546001600160a01b031990811682556001805482166001600160a01b039788161781556002805483169688169690961790955560038054909116939095169290921790935560058054928301815590527f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db06008820401805460079092166004026101000a63ffffffff8181021990931692909316929092021790556200015c565b80516001600160a01b0381168114620000f057600080fd5b919050565b600080600080608085870312156200010c57600080fd5b6200011785620000d8565b93506200012760208601620000d8565b92506200013760408601620000d8565b9150606085015163ffffffff811681146200015157600080fd5b939692955090935050565b61198f806200016c6000396000f3fe6080604052600436106100865760003560e01c80635a33d8dc116100595780635a33d8dc14610142578063735de9f7146101625780639030d0f714610182578063a4c0ed36146101a2578063abc8c7af146101c257600080fd5b80631b04c9571461008b57806343cd8f7e146100a057806356a5dd3c146100dd578063572b6c0514610112575b600080fd5b61009e610099366004611175565b6101e2565b005b3480156100ac57600080fd5b506004546100c0906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b3480156100e957600080fd5b506100fd6100f83660046111a1565b610346565b60405163ffffffff90911681526020016100d4565b34801561011e57600080fd5b5061013261012d3660046111d2565b610380565b60405190151581526020016100d4565b34801561014e57600080fd5b506002546100c0906001600160a01b031681565b34801561016e57600080fd5b506003546100c0906001600160a01b031681565b34801561018e57600080fd5b5061009e61019d3660046111f6565b6103f5565b3480156101ae57600080fd5b5061009e6101bd36600461123f565b6106ec565b3480156101ce57600080fd5b506001546100c0906001600160a01b031681565b6000806101ee85610af1565b9150915060006101fc610c75565b9050826000036102b8573415610243576040516001600160a01b038216903480156108fc02916000818181858888f19350505050158015610241573d6000803e3d6000fd5b505b6001546040516301cc3a8960e11b815260048101889052602481018790526001600160a01b03838116604483015290911690630398751290606401600060405180830381600087803b15801561029857600080fd5b505af11580156102ac573d6000803e3d6000fd5b50505050505050505050565b61033e818787878734600360009054906101000a90046001600160a01b03166001600160a01b031663ad5c46486040518163ffffffff1660e01b8152600401602060405180830381865afa158015610314573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061033891906112c8565b89610c84565b505050505050565b6005818154811061035657600080fd5b9060005260206000209060089182820401919006600402915054906101000a900463ffffffff1681565b60025460405163572b6c0560e01b81526001600160a01b038381166004830152600092169063572b6c0590602401602060405180830381865afa1580156103cb573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103ef91906112e5565b92915050565b6001600160a01b0382166104495760405162461bcd60e51b81526020600482015260166024820152751d5cd948189d5e55da5d1a115512081a5b9cdd19585960521b60448201526064015b60405180910390fd5b60008061045587610af1565b915091506000610463610c75565b9050826000036104e2576001546040516301cc3a8960e11b8152600481018a9052602481018990526001600160a01b03838116604483015290911690630398751290606401600060405180830381600087803b1580156104c257600080fd5b505af11580156104d6573d6000803e3d6000fd5b505050505050506106e5565b6040516323b872dd60e01b81526001600160a01b038281166004830152306024830152604482018690528691908216906323b872dd906064016020604051808303816000875af115801561053a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061055e91906112e5565b6105aa5760405162461bcd60e51b815260206004820152601f60248201527f6d7573742070726520617070726f766520746f6b656e207472616e73666572006044820152606401610440565b60035460405163095ea7b360e01b81526001600160a01b039182166004820152600060248201529082169063095ea7b3906044016020604051808303816000875af11580156105fd573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061062191906112e5565b61063d5760405162461bcd60e51b815260040161044090611307565b60035460405163095ea7b360e01b81526001600160a01b039182166004820152602481018790529082169063095ea7b3906044016020604051808303816000875af1158015610690573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106b491906112e5565b6106d05760405162461bcd60e51b815260040161044090611307565b6106e0828a8a8a888a8c8a610c84565b505050505b5050505050565b602081146107315760405162461bcd60e51b8152602060048201526012602482015271195c9c9bdc97d89859141c9bda9958dd125960721b6044820152606401610440565b8135600061073d610c75565b60035460405163095ea7b360e01b81526001600160a01b0391821660048201526000602482015291925082169063095ea7b3906044016020604051808303816000875af1158015610792573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107b691906112e5565b6107d25760405162461bcd60e51b815260040161044090611307565b60035460405163095ea7b360e01b81526001600160a01b039182166004820152602481018790529082169063095ea7b3906044016020604051808303816000875af1158015610825573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061084991906112e5565b6108655760405162461bcd60e51b815260040161044090611307565b60008061087184610af1565b915091506000610888610882610c75565b83610ff3565b6003549091506000906001600160a01b03166338ed17398a600185306108b14262015180611346565b6040518663ffffffff1660e01b81526004016108d19594939291906113a2565b6000604051808303816000875af11580156108f0573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526109189190810190611472565b600183516109269190611508565b815181106109365761093661151f565b602090810291909101015160015460405163095ea7b360e01b81526001600160a01b0391821660048201526000602482015291925084169063095ea7b3906044016020604051808303816000875af1158015610996573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109ba91906112e5565b6109d65760405162461bcd60e51b815260040161044090611307565b60015460405163095ea7b360e01b81526001600160a01b039182166004820152602481018390529084169063095ea7b3906044016020604051808303816000875af1158015610a29573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a4d91906112e5565b610a695760405162461bcd60e51b815260040161044090611307565b6000610a758583611535565b6001546040516301cc3a8960e11b8152600481018a9052602481018390526001600160a01b038e81166044830152929350911690630398751290606401600060405180830381600087803b158015610acc57600080fd5b505af1158015610ae0573d6000803e3d6000fd5b505050505050505050505050505050565b600254604051630e29a66960e21b81526004810183905260009182916001600160a01b03909116906338a699a490602401602060405180830381865afa158015610b3f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b6391906112e5565b610baf5760405162461bcd60e51b815260206004820152601960248201527f6572726f725f70726f6a656374446f65734e6f744578697374000000000000006044820152606401610440565b6002546040516351ec389f60e11b81526000916001600160a01b03169063a3d8713e90610be3908790600590600401611557565b600060405180830381865afa158015610c00573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610c2891908101906117fb565b505050905080600081518110610c4057610c4061151f565b602002602001015160400151925080600081518110610c6157610c6161151f565b602002602001015160200151915050915091565b6000610c7f611153565b905090565b6000610c908383610ff3565b90506000610c9e8742611346565b90506000600360009054906101000a90046001600160a01b03166001600160a01b031663ad5c46486040518163ffffffff1660e01b8152600401602060405180830381865afa158015610cf5573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d1991906112c8565b6001600160a01b0316856001600160a01b031603610dde57600354604051637ff36ab560e01b81526001600160a01b0390911690637ff36ab5908890610d6a90600190889030908990600401611924565b60006040518083038185885af1158015610d88573d6000803e3d6000fd5b50505050506040513d6000823e601f3d908101601f19168201604052610db19190810190611472565b60018451610dbf9190611508565b81518110610dcf57610dcf61151f565b60200260200101519050610e87565b6003546040516338ed173960e01b81526001600160a01b03909116906338ed173990610e179089906001908890309089906004016113a2565b6000604051808303816000875af1158015610e36573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610e5e9190810190611472565b60018451610e6c9190611508565b81518110610e7c57610e7c61151f565b602002602001015190505b6000610e938883611535565b905089811015610ee55760405162461bcd60e51b815260206004820152601c60248201527f6572726f725f6d696e537562736372697074696f6e5365636f6e6473000000006044820152606401610440565b60015460405163095ea7b360e01b81526001600160a01b039182166004820152602481018490529086169063095ea7b3906044016020604051808303816000875af1158015610f38573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f5c91906112e5565b610f785760405162461bcd60e51b815260040161044090611307565b6001546040516301cc3a8960e11b8152600481018d9052602481018390526001600160a01b038e8116604483015290911690630398751290606401600060405180830381600087803b158015610fcd57600080fd5b505af1158015610fe1573d6000803e3d6000fd5b50505050505050505050505050505050565b6004546060906001600160a01b0316611093576040805160028082526060820183529091602083019080368337019050509050828160008151811061103a5761103a61151f565b60200260200101906001600160a01b031690816001600160a01b031681525050818160018151811061106e5761106e61151f565b60200260200101906001600160a01b031690816001600160a01b0316815250506103ef565b60408051600380825260808201909252906020820160608036833701905050905082816000815181106110c8576110c861151f565b6001600160a01b0392831660209182029290920101526004548251911690829060019081106110f9576110f961151f565b60200260200101906001600160a01b031690816001600160a01b031681525050818160028151811061112d5761112d61151f565b60200260200101906001600160a01b031690816001600160a01b03168152505092915050565b600061115e33610380565b15611170575060131936013560601c90565b503390565b60008060006060848603121561118a57600080fd5b505081359360208301359350604090920135919050565b6000602082840312156111b357600080fd5b5035919050565b6001600160a01b03811681146111cf57600080fd5b50565b6000602082840312156111e457600080fd5b81356111ef816111ba565b9392505050565b600080600080600060a0868803121561120e57600080fd5b853594506020860135935060408601359250606086013561122e816111ba565b949793965091946080013592915050565b6000806000806060858703121561125557600080fd5b8435611260816111ba565b935060208501359250604085013567ffffffffffffffff8082111561128457600080fd5b818701915087601f83011261129857600080fd5b8135818111156112a757600080fd5b8860208285010111156112b957600080fd5b95989497505060200194505050565b6000602082840312156112da57600080fd5b81516111ef816111ba565b6000602082840312156112f757600080fd5b815180151581146111ef57600080fd5b6020808252600f908201526e185c1c1c9bdd985b0819985a5b1959608a1b604082015260600190565b634e487b7160e01b600052601160045260246000fd5b6000821982111561135957611359611330565b500190565b600081518084526020808501945080840160005b838110156113975781516001600160a01b031687529582019590820190600101611372565b509495945050505050565b85815284602082015260a0604082015260006113c160a083018661135e565b6001600160a01b0394909416606083015250608001529392505050565b634e487b7160e01b600052604160045260246000fd5b6040516060810167ffffffffffffffff81118282101715611417576114176113de565b60405290565b604051601f8201601f1916810167ffffffffffffffff81118282101715611446576114466113de565b604052919050565b600067ffffffffffffffff821115611468576114686113de565b5060051b60200190565b6000602080838503121561148557600080fd5b825167ffffffffffffffff81111561149c57600080fd5b8301601f810185136114ad57600080fd5b80516114c06114bb8261144e565b61141d565b81815260059190911b820183019083810190878311156114df57600080fd5b928401925b828410156114fd578351825292840192908401906114e4565b979650505050505050565b60008282101561151a5761151a611330565b500390565b634e487b7160e01b600052603260045260246000fd5b60008261155257634e487b7160e01b600052601260045260246000fd5b500490565b6000604080830185845260208281860152818654611579818590815260200190565b60008981526020812095509092505b816007820110156115fc57845463ffffffff808216855281861c81168686015281881c811688860152606082811c821690860152608082811c82169086015260a082811c82169086015260c082811c9091169085015260e090811c9084015260019094019361010090920191600801611588565b935493818110156116185763ffffffff85168352918301916001015b818110156116335784841c63ffffffff168352918301916001015b8181101561164e5784861c63ffffffff168352918301916001015b8181101561166b57606085901c63ffffffff168352918301916001015b8181101561168857608085901c63ffffffff168352918301916001015b818110156116a55760a085901c63ffffffff168352918301916001015b818110156116c25760c085901c63ffffffff168352918301916001015b818110156116d65760e085901c8352918301915b509098975050505050505050565b600082601f8301126116f557600080fd5b815167ffffffffffffffff81111561170f5761170f6113de565b6020611723601f8301601f1916820161141d565b828152858284870101111561173757600080fd5b60005b8381101561175557858101830151828201840152820161173a565b838111156117665760008385840101525b5095945050505050565b600082601f83011261178157600080fd5b815160206117916114bb8361144e565b82815260059290921b840181019181810190868411156117b057600080fd5b8286015b848110156117f057805167ffffffffffffffff8111156117d45760008081fd5b6117e28986838b01016116e4565b8452509183019183016117b4565b509695505050505050565b6000806000806080858703121561181157600080fd5b845167ffffffffffffffff8082111561182957600080fd5b818701915087601f83011261183d57600080fd5b8151602061184d6114bb8361144e565b8281526060928302850182019282820191908c85111561186c57600080fd5b958301955b848710156118c85780878e0312156118895760008081fd5b6118916113f4565b875161189c816111ba565b8152878501516118ab816111ba565b818601526040888101519082015283529586019591830191611871565b819a50838c0151995060408c01519650858711156118e557600080fd5b6118f18d888e016116e4565b9850808c0151965050505050508082111561190b57600080fd5b5061191887828801611770565b91505092959194509250565b84815260806020820152600061193d608083018661135e565b6001600160a01b0394909416604083015250606001529291505056fea2646970667358221220f68b23c3192b90f3d4a69a290e5fd70bf970ba2fc679637f0757ee815b5566b164736f6c634300080d0033";

type Uniswap2AdapterV4ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: Uniswap2AdapterV4ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Uniswap2AdapterV4__factory extends ContractFactory {
  constructor(...args: Uniswap2AdapterV4ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _marketplace: AddressLike,
    _projectRegistry: AddressLike,
    _uniswapRouter: AddressLike,
    _deployedOnDomainId: BigNumberish,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      _marketplace,
      _projectRegistry,
      _uniswapRouter,
      _deployedOnDomainId,
      overrides || {}
    );
  }
  override deploy(
    _marketplace: AddressLike,
    _projectRegistry: AddressLike,
    _uniswapRouter: AddressLike,
    _deployedOnDomainId: BigNumberish,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      _marketplace,
      _projectRegistry,
      _uniswapRouter,
      _deployedOnDomainId,
      overrides || {}
    ) as Promise<
      Uniswap2AdapterV4 & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Uniswap2AdapterV4__factory {
    return super.connect(runner) as Uniswap2AdapterV4__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): Uniswap2AdapterV4Interface {
    return new Interface(_abi) as Uniswap2AdapterV4Interface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): Uniswap2AdapterV4 {
    return new Contract(address, _abi, runner) as unknown as Uniswap2AdapterV4;
  }
}
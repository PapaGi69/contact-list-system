export default [
	{
	  "type": "constructor",
	  "name": "",
	  "inputs": [
		{
		  "type": "string",
		  "name": "_name_",
		  "internalType": "string"
		},
		{
		  "type": "string",
		  "name": "_symbol_",
		  "internalType": "string"
		},
		{
		  "type": "uint96",
		  "name": "_royaltyBps_",
		  "internalType": "uint96"
		},
		{
		  "type": "string",
		  "name": "_contractURI_",
		  "internalType": "string"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "event",
	  "name": "Approval",
	  "inputs": [
		{
		  "type": "address",
		  "name": "owner",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "type": "address",
		  "name": "approved",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "type": "uint256",
		  "name": "tokenId",
		  "indexed": true,
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "ApprovalForAll",
	  "inputs": [
		{
		  "type": "address",
		  "name": "owner",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "type": "address",
		  "name": "operator",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "type": "bool",
		  "name": "approved",
		  "indexed": false,
		  "internalType": "bool"
		}
	  ],
	  "outputs": [],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "OwnershipTransferred",
	  "inputs": [
		{
		  "type": "address",
		  "name": "previousOwner",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "type": "address",
		  "name": "newOwner",
		  "indexed": true,
		  "internalType": "address"
		}
	  ],
	  "outputs": [],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "Paused",
	  "inputs": [
		{
		  "type": "address",
		  "name": "account",
		  "indexed": false,
		  "internalType": "address"
		}
	  ],
	  "outputs": [],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "PurchaseBlock",
	  "inputs": [
		{
		  "type": "address",
		  "name": "seller",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "type": "address",
		  "name": "buyer",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "type": "uint256",
		  "name": "tokenId",
		  "indexed": true,
		  "internalType": "uint256"
		},
		{
		  "type": "string",
		  "name": "tokenUri",
		  "indexed": false,
		  "internalType": "string"
		}
	  ],
	  "outputs": [],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "PurchaseBlocks",
	  "inputs": [
		{
		  "type": "address",
		  "name": "seller",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "type": "address",
		  "name": "buyer",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "type": "uint256[]",
		  "name": "tokenIds",
		  "indexed": false,
		  "internalType": "uint256[]"
		},
		{
		  "type": "string[]",
		  "name": "tokenUris",
		  "indexed": false,
		  "internalType": "string[]"
		}
	  ],
	  "outputs": [],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "RoleAdminChanged",
	  "inputs": [
		{
		  "type": "bytes32",
		  "name": "role",
		  "indexed": true,
		  "internalType": "bytes32"
		},
		{
		  "type": "bytes32",
		  "name": "previousAdminRole",
		  "indexed": true,
		  "internalType": "bytes32"
		},
		{
		  "type": "bytes32",
		  "name": "newAdminRole",
		  "indexed": true,
		  "internalType": "bytes32"
		}
	  ],
	  "outputs": [],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "RoleGranted",
	  "inputs": [
		{
		  "type": "bytes32",
		  "name": "role",
		  "indexed": true,
		  "internalType": "bytes32"
		},
		{
		  "type": "address",
		  "name": "account",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "type": "address",
		  "name": "sender",
		  "indexed": true,
		  "internalType": "address"
		}
	  ],
	  "outputs": [],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "RoleRevoked",
	  "inputs": [
		{
		  "type": "bytes32",
		  "name": "role",
		  "indexed": true,
		  "internalType": "bytes32"
		},
		{
		  "type": "address",
		  "name": "account",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "type": "address",
		  "name": "sender",
		  "indexed": true,
		  "internalType": "address"
		}
	  ],
	  "outputs": [],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "Transfer",
	  "inputs": [
		{
		  "type": "address",
		  "name": "from",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "type": "address",
		  "name": "to",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "type": "uint256",
		  "name": "tokenId",
		  "indexed": true,
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "Unpaused",
	  "inputs": [
		{
		  "type": "address",
		  "name": "account",
		  "indexed": false,
		  "internalType": "address"
		}
	  ],
	  "outputs": [],
	  "anonymous": false
	},
	{
	  "type": "function",
	  "name": "DEFAULT_ADMIN_ROLE",
	  "inputs": [],
	  "outputs": [
		{
		  "type": "bytes32",
		  "name": "",
		  "internalType": "bytes32"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "DOMAIN_SEPARATOR",
	  "inputs": [],
	  "outputs": [
		{
		  "type": "bytes32",
		  "name": "",
		  "internalType": "bytes32"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "MINTER_ROLE",
	  "inputs": [],
	  "outputs": [
		{
		  "type": "bytes32",
		  "name": "",
		  "internalType": "bytes32"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "OWNER_ROLE",
	  "inputs": [],
	  "outputs": [
		{
		  "type": "bytes32",
		  "name": "",
		  "internalType": "bytes32"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "PAUSER_ROLE",
	  "inputs": [],
	  "outputs": [
		{
		  "type": "bytes32",
		  "name": "",
		  "internalType": "bytes32"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "addAllowedTokenForTransfer",
	  "inputs": [
		{
		  "type": "address",
		  "name": "tokenAddress",
		  "internalType": "address"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "approve",
	  "inputs": [
		{
		  "type": "address",
		  "name": "to",
		  "internalType": "address"
		},
		{
		  "type": "uint256",
		  "name": "tokenId",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "balanceOf",
	  "inputs": [
		{
		  "type": "address",
		  "name": "owner",
		  "internalType": "address"
		}
	  ],
	  "outputs": [
		{
		  "type": "uint256",
		  "name": "",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "contractURI",
	  "inputs": [],
	  "outputs": [
		{
		  "type": "string",
		  "name": "",
		  "internalType": "string"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "getAllowedTokensForTransfer",
	  "inputs": [],
	  "outputs": [
		{
		  "type": "address[]",
		  "name": "",
		  "internalType": "address[]"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "getApproved",
	  "inputs": [
		{
		  "type": "uint256",
		  "name": "tokenId",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [
		{
		  "type": "address",
		  "name": "",
		  "internalType": "address"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "getRoleAdmin",
	  "inputs": [
		{
		  "type": "bytes32",
		  "name": "role",
		  "internalType": "bytes32"
		}
	  ],
	  "outputs": [
		{
		  "type": "bytes32",
		  "name": "",
		  "internalType": "bytes32"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "grantRole",
	  "inputs": [
		{
		  "type": "bytes32",
		  "name": "role",
		  "internalType": "bytes32"
		},
		{
		  "type": "address",
		  "name": "account",
		  "internalType": "address"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "hasRole",
	  "inputs": [
		{
		  "type": "bytes32",
		  "name": "role",
		  "internalType": "bytes32"
		},
		{
		  "type": "address",
		  "name": "account",
		  "internalType": "address"
		}
	  ],
	  "outputs": [
		{
		  "type": "bool",
		  "name": "",
		  "internalType": "bool"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "isAllowedTokenForTransfer",
	  "inputs": [
		{
		  "type": "address",
		  "name": "tokenAddress",
		  "internalType": "address"
		}
	  ],
	  "outputs": [
		{
		  "type": "bool",
		  "name": "",
		  "internalType": "bool"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "isApprovedForAll",
	  "inputs": [
		{
		  "type": "address",
		  "name": "owner",
		  "internalType": "address"
		},
		{
		  "type": "address",
		  "name": "operator",
		  "internalType": "address"
		}
	  ],
	  "outputs": [
		{
		  "type": "bool",
		  "name": "",
		  "internalType": "bool"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "mintBatchBlocksWithPermit",
	  "inputs": [
		{
		  "type": "address",
		  "name": "to",
		  "internalType": "address"
		},
		{
		  "type": "address",
		  "name": "seller",
		  "internalType": "address"
		},
		{
		  "type": "uint256",
		  "name": "quantity",
		  "internalType": "uint256"
		},
		{
		  "type": "string[]",
		  "name": "tokenUris",
		  "internalType": "string[]"
		},
		{
		  "type": "uint256",
		  "name": "value",
		  "internalType": "uint256"
		},
		{
		  "type": "bytes",
		  "name": "mintSignature",
		  "internalType": "bytes"
		},
		{
		  "type": "address",
		  "name": "tokenAddress",
		  "internalType": "address"
		},
		{
		  "type": "tuple",
		  "name": "permitDetail",
		  "components": [
			{
			  "type": "uint256",
			  "name": "deadline",
			  "internalType": "uint256"
			},
			{
			  "type": "uint8",
			  "name": "v",
			  "internalType": "uint8"
			},
			{
			  "type": "bytes32",
			  "name": "r",
			  "internalType": "bytes32"
			},
			{
			  "type": "bytes32",
			  "name": "s",
			  "internalType": "bytes32"
			}
		  ],
		  "internalType": "struct ERC721WithPermit.PermitDetail"
		},
		{
		  "type": "tuple",
		  "name": "platformFeeDetail",
		  "components": [
			{
			  "type": "address",
			  "name": "recipient",
			  "internalType": "address"
			},
			{
			  "type": "uint256",
			  "name": "amount",
			  "internalType": "uint256"
			},
			{
			  "type": "uint256",
			  "name": "deadline",
			  "internalType": "uint256"
			},
			{
			  "type": "uint8",
			  "name": "v",
			  "internalType": "uint8"
			},
			{
			  "type": "bytes32",
			  "name": "r",
			  "internalType": "bytes32"
			},
			{
			  "type": "bytes32",
			  "name": "s",
			  "internalType": "bytes32"
			}
		  ],
		  "internalType": "struct ERC721WithPermit.PlatformFeeDetail"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "mintSingleBlockWithPermit",
	  "inputs": [
		{
		  "type": "address",
		  "name": "to",
		  "internalType": "address"
		},
		{
		  "type": "string",
		  "name": "tokenUri",
		  "internalType": "string"
		},
		{
		  "type": "uint256",
		  "name": "value",
		  "internalType": "uint256"
		},
		{
		  "type": "address",
		  "name": "seller",
		  "internalType": "address"
		},
		{
		  "type": "bytes",
		  "name": "mintSignature",
		  "internalType": "bytes"
		},
		{
		  "type": "address",
		  "name": "tokenAddress",
		  "internalType": "address"
		},
		{
		  "type": "tuple",
		  "name": "permitDetail",
		  "components": [
			{
			  "type": "uint256",
			  "name": "deadline",
			  "internalType": "uint256"
			},
			{
			  "type": "uint8",
			  "name": "v",
			  "internalType": "uint8"
			},
			{
			  "type": "bytes32",
			  "name": "r",
			  "internalType": "bytes32"
			},
			{
			  "type": "bytes32",
			  "name": "s",
			  "internalType": "bytes32"
			}
		  ],
		  "internalType": "struct ERC721WithPermit.PermitDetail"
		},
		{
		  "type": "tuple",
		  "name": "platformFeeDetail",
		  "components": [
			{
			  "type": "address",
			  "name": "recipient",
			  "internalType": "address"
			},
			{
			  "type": "uint256",
			  "name": "amount",
			  "internalType": "uint256"
			},
			{
			  "type": "uint256",
			  "name": "deadline",
			  "internalType": "uint256"
			},
			{
			  "type": "uint8",
			  "name": "v",
			  "internalType": "uint8"
			},
			{
			  "type": "bytes32",
			  "name": "r",
			  "internalType": "bytes32"
			},
			{
			  "type": "bytes32",
			  "name": "s",
			  "internalType": "bytes32"
			}
		  ],
		  "internalType": "struct ERC721WithPermit.PlatformFeeDetail"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "name",
	  "inputs": [],
	  "outputs": [
		{
		  "type": "string",
		  "name": "",
		  "internalType": "string"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "nonces",
	  "inputs": [
		{
		  "type": "address",
		  "name": "owner",
		  "internalType": "address"
		}
	  ],
	  "outputs": [
		{
		  "type": "uint256",
		  "name": "",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "owner",
	  "inputs": [],
	  "outputs": [
		{
		  "type": "address",
		  "name": "",
		  "internalType": "address"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "ownerOf",
	  "inputs": [
		{
		  "type": "uint256",
		  "name": "tokenId",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [
		{
		  "type": "address",
		  "name": "",
		  "internalType": "address"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "pause",
	  "inputs": [],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "paused",
	  "inputs": [],
	  "outputs": [
		{
		  "type": "bool",
		  "name": "",
		  "internalType": "bool"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "removeAllowedTokenForTransfer",
	  "inputs": [
		{
		  "type": "uint256",
		  "name": "index",
		  "internalType": "uint256"
		},
		{
		  "type": "address",
		  "name": "tokenAddress",
		  "internalType": "address"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "renounceOwnership",
	  "inputs": [],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "renounceRole",
	  "inputs": [
		{
		  "type": "bytes32",
		  "name": "role",
		  "internalType": "bytes32"
		},
		{
		  "type": "address",
		  "name": "account",
		  "internalType": "address"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "revokeRole",
	  "inputs": [
		{
		  "type": "bytes32",
		  "name": "role",
		  "internalType": "bytes32"
		},
		{
		  "type": "address",
		  "name": "account",
		  "internalType": "address"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "royaltyInfo",
	  "inputs": [
		{
		  "type": "uint256",
		  "name": "_tokenId",
		  "internalType": "uint256"
		},
		{
		  "type": "uint256",
		  "name": "_salePrice",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [
		{
		  "type": "address",
		  "name": "",
		  "internalType": "address"
		},
		{
		  "type": "uint256",
		  "name": "",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "safeTransferFrom",
	  "inputs": [
		{
		  "type": "address",
		  "name": "from",
		  "internalType": "address"
		},
		{
		  "type": "address",
		  "name": "to",
		  "internalType": "address"
		},
		{
		  "type": "uint256",
		  "name": "tokenId",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "safeTransferFrom",
	  "inputs": [
		{
		  "type": "address",
		  "name": "from",
		  "internalType": "address"
		},
		{
		  "type": "address",
		  "name": "to",
		  "internalType": "address"
		},
		{
		  "type": "uint256",
		  "name": "tokenId",
		  "internalType": "uint256"
		},
		{
		  "type": "bytes",
		  "name": "data",
		  "internalType": "bytes"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "setApprovalForAll",
	  "inputs": [
		{
		  "type": "address",
		  "name": "operator",
		  "internalType": "address"
		},
		{
		  "type": "bool",
		  "name": "approved",
		  "internalType": "bool"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "setDefaultRoyalty",
	  "inputs": [
		{
		  "type": "address",
		  "name": "receiver",
		  "internalType": "address"
		},
		{
		  "type": "uint96",
		  "name": "feeNumerator",
		  "internalType": "uint96"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "supportsInterface",
	  "inputs": [
		{
		  "type": "bytes4",
		  "name": "interfaceId",
		  "internalType": "bytes4"
		}
	  ],
	  "outputs": [
		{
		  "type": "bool",
		  "name": "",
		  "internalType": "bool"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "symbol",
	  "inputs": [],
	  "outputs": [
		{
		  "type": "string",
		  "name": "",
		  "internalType": "string"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "tokenURI",
	  "inputs": [
		{
		  "type": "uint256",
		  "name": "tokenId",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [
		{
		  "type": "string",
		  "name": "",
		  "internalType": "string"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "transferFrom",
	  "inputs": [
		{
		  "type": "address",
		  "name": "from",
		  "internalType": "address"
		},
		{
		  "type": "address",
		  "name": "to",
		  "internalType": "address"
		},
		{
		  "type": "uint256",
		  "name": "tokenId",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "transferOwnership",
	  "inputs": [
		{
		  "type": "address",
		  "name": "newOwner",
		  "internalType": "address"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "unpause",
	  "inputs": [],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "updateTokenUri",
	  "inputs": [
		{
		  "type": "uint256",
		  "name": "tokenId",
		  "internalType": "uint256"
		},
		{
		  "type": "string",
		  "name": "tokenUri",
		  "internalType": "string"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	}
  ]
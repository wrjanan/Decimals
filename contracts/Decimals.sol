// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Decimals is ERC721Enumerable, ReentrancyGuard, Ownable {
    uint16 private claimedCommunityRewards = 0;
    uint16 public MAX_NFT_SUPPLY = 10000;
    uint128 public constant MAX_VALUE = 1000000000000000000;

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    function getFirst(uint256 tokenId) public pure returns (string memory) {
        return pluck(tokenId, "FIRST");
    }

    function getSecond(uint256 tokenId) public pure returns (string memory) {
        return pluck(tokenId, "SECOND");
    }

    function getThird(uint256 tokenId) public pure returns (string memory) {
        return pluck(tokenId, "THIRD");
    }

    function getFourth(uint256 tokenId) public pure returns (string memory) {
        return pluck(tokenId, "FOURTH");
    }

    function getFifth(uint256 tokenId) public pure returns (string memory) {
        return pluck(tokenId, "FIFTH");
    }

    function getSixth(uint256 tokenId) public pure returns (string memory) {
        return pluck(tokenId, "SIXTH");
    }

    function getSeventh(uint256 tokenId) public pure returns (string memory) {
        return pluck(tokenId, "SEVENTH");
    }

    function getEight(uint256 tokenId) public pure returns (string memory) {
        return pluck(tokenId, "EIGHTH");
    }

    function pluck(uint256 tokenId, string memory keyPrefix) internal pure returns (string memory) {
        uint256 rand = random(string(abi.encodePacked(keyPrefix, toString(tokenId))));
        uint256 luck = rand % 21;
        uint256 value = rand % MAX_VALUE;

        if (luck >= 19) {
            if (luck == 19) {
                value = SafeMath.add(value, SafeMath.div(MAX_VALUE - value, 2));
            } else {
                value = SafeMath.div(MAX_VALUE - value, 2);
            }
        }

        uint256 numbers = MAX_VALUE / 10;
        string memory output = "0.";
        while (SafeMath.div(value, numbers) < 1) {
            numbers = SafeMath.div(numbers, 10);
            output = string(abi.encodePacked(output, "0"));
        }
        return string(abi.encodePacked(output, toString(value)));
    }

    function tokenURI(uint256 tokenId) public pure override returns (string memory) {
        string[17] memory parts;
        parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350" style="background-color:11ee11"><style>.base {font-size: 20px;}</style><text x="10" y="40" class="base">';

        parts[1] = getFirst(tokenId);
        parts[2] = '</text><text x="10" y="80" class="base">';

        parts[3] = getSecond(tokenId);
        parts[4] = '</text><text x="10" y="120" class="base">';

        parts[5] = getThird(tokenId);
        parts[6] = '</text><text x="10" y="160" class="base">';

        parts[7] = getFourth(tokenId);
        parts[8] = '</text><text x="10" y="200" class="base">';

        parts[9] = getFifth(tokenId);
        parts[10] = '</text><text x="10" y="240" class="base">';

        parts[11] = getSixth(tokenId);
        parts[12] = '</text><text x="10" y="280" class="base">';

        parts[13] = getSeventh(tokenId);
        parts[14] = '</text><text x="10" y="320" class="base">';

        parts[15] = getEight(tokenId);
        parts[16] = "</text></svg>";

        string memory output = string(
            abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6], parts[7], parts[8])
        );
        output = string(
            abi.encodePacked(
                output,
                parts[9],
                parts[10],
                parts[11],
                parts[12],
                parts[13],
                parts[14],
                parts[15],
                parts[16]
            )
        );

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Decimals #',
                        toString(tokenId),
                        '", "description": "Decimals can be anything.", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(output)),
                        '"}'
                    )
                )
            )
        );
        output = string(abi.encodePacked("data:application/json;base64,", json));

        return output;
    }

    function mint(uint256 numberOfNfts) public nonReentrant {
        require(numberOfNfts > 0, "numberOfNfts must be more than 0");
        require(numberOfNfts <= 3, "You may not buy more than 3 NFTs at once");
        require(SafeMath.add(numberOfNfts, SafeMath.sub(totalSupply(),claimedCommunityRewards)) <= 8888, "Exceeds MAX_NFT_SUPPLY");

        for (uint i = 0; i < numberOfNfts; i++) {
            uint mintIndex = SafeMath.sub(totalSupply(),claimedCommunityRewards);
            _safeMint(_msgSender(), mintIndex);
            totalSupply();
        }
    }

    function claimCommunityRewards(uint256[] calldata tokenIds) public onlyOwner {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(tokenIds[i] > 8888 && tokenIds[i] < 10000, "Token ID invalid");
            claimedCommunityRewards++;
            _safeMint(_msgSender(), tokenIds[i]);
        }
    }

    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    constructor() ERC721("decimals", "Decimals") Ownable() {}
}


/// [MIT License]
/// @title Base64
/// @notice Provides a function for encoding some bytes in base64
/// @author Brecht Devos <brecht@loopring.org>
library Base64 {
    bytes internal constant TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    /// @notice Encodes some bytes to the base64 representation
    function encode(bytes memory data) internal pure returns (string memory) {
        uint256 len = data.length;
        if (len == 0) return "";

        // multiply by 4/3 rounded up
        uint256 encodedLen = 4 * ((len + 2) / 3);

        // Add some extra buffer at the end
        bytes memory result = new bytes(encodedLen + 32);

        bytes memory table = TABLE;

        assembly {
            let tablePtr := add(table, 1)
            let resultPtr := add(result, 32)

            for {
                let i := 0
            } lt(i, len) {

            } {
                i := add(i, 3)
                let input := and(mload(add(data, i)), 0xffffff)

                let out := mload(add(tablePtr, and(shr(18, input), 0x3F)))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(shr(12, input), 0x3F))), 0xFF))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(shr(6, input), 0x3F))), 0xFF))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(input, 0x3F))), 0xFF))
                out := shl(224, out)

                mstore(resultPtr, out)

                resultPtr := add(resultPtr, 4)
            }

            switch mod(len, 3)
            case 1 {
                mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
            }
            case 2 {
                mstore(sub(resultPtr, 1), shl(248, 0x3d))
            }

            mstore(result, encodedLen)
        }

        return string(result);
    }
}
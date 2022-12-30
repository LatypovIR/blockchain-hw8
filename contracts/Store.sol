// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Store {
    mapping(address => string) user_to_file;

    /**
     * Notifies that the user has registered the hash of the file saved in IPFS.
     *
     * @param user - the address of the user who registered the hash
     * @param CID - CID of the file
     */
    event FileAdded(address user, string CID);

    /**
     * Saves information about file uploaded to IPFS
     *
     * @param CID - CID of the file saved in IPFS
     */
    function setFile(string memory CID) public {
        user_to_file[msg.sender] = CID;
        emit FileAdded(msg.sender, CID);
    }

    /**
     * @return CID - CID of the file uploaded to IPFS
     */
    function getFile() public view returns (string memory CID) {
        CID = user_to_file[msg.sender];
    }
}
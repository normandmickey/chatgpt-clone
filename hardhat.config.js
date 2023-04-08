require('dotenv').config(); //all the key value pairs are being made available due to this lib
require("@nomicfoundation/hardhat-toolbox");
    
module.exports = {
  solidity: "0.8.17",
  networks: {
    polygon: {
      url: `${process.env.ALCHEMY_POLYGON_URL}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    goerli: {
      url: `${process.env.ALCHEMY_GOERLI_URL}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },

  }
};

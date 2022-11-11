// NftUploader.jsx
import { Web3Storage } from 'web3.storage'
import Web3Mint from "../../utils/Web3Mint.json";
import { ethers } from "ethers";
import { Button } from "@mui/material";
import React from "react";
import { useEffect, useState } from 'react'
import ImageLogo from "./image.svg";
import twitterLogo from "./assets/twitter-logo.svg";
import LoadingSpinner from "./LoadingSpiner";
//import SimpleConfirm from '@kamiya-kei/simple-confirm';
import "./NftUploader.css";
import { NFTStorage, File } from 'nft.storage'
import mime from 'mime'
const NFT_STORAGE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGNFRkRCYWI4NGE4RjhhOWEyQjM0RTBkNmQ5RTFhMjdCMUUwNzYwMjEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2ODA4MzgxNDI0NiwibmFtZSI6Ikp1aWxsaWFyZCJ9.u2WR7t81CGk9JvB13aEy4m4IJaeP_0zCkk-lKSqFPgk'

const TWITTER_HANDLE = "juilliard_inst";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = "https://testnets.opensea.io/0x4833C2fB6F00787c7F5f60a7F1a8aD9e191648C8";
const MAX_TOTAL_MINT_COUNT = 100;
// 0x4 は　Rinkeby の ID です。
const EthereumMainNetworkChainId = "0x1";
const RopstenTestNetworkChainId = "0x3";
const GoerliTestNetworkChainId = "0x5";
const KovanTestNetworkChainId = "0x2a";
const MaticPoygonMainNetworkChainId = "0x89";
const MaticMumbaiTestNetworkChainId = "0x13881";
let _tokenIds;

const CONTRACT_ADDRESS = "0x5A01dC12161bf7A5B42314591bbe2aB46635561f";
const API_KEY ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGNFRkRCYWI4NGE4RjhhOWEyQjM0RTBkNmQ5RTFhMjdCMUUwNzYwMjEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2ODA4MzgxNDI0NiwibmFtZSI6Ikp1aWxsaWFyZCJ9.u2WR7t81CGk9JvB13aEy4m4IJaeP_0zCkk-lKSqFPgk";

const NftUploader = () => {
  /*
   * ユーザーのウォレットアドレスを格納するために使用する状態変数を定義します。
   */
  const [currentAccount, setCurrentAccount] = useState("");
  /*この段階でcurrentAccountの中身は空*/
  console.log("currentAccount: ", currentAccount);
  /* ミント数を保存するために使用する状態変数を定義 */
  const [totalMintCount, setTotalMintCount] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  //顔写真登録フラグを保存する変数とメソッド
  const [value, setValue] = useState("");

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    let chainId = await ethereum.request({ method: "eth_chainId" });
    console.log("Connected to chain " + chainId);
    switch( chainId ){
      case EthereumMainNetworkChainId: 
            alert("You are connected to the Ethereum Main Network! Could you please connect to the Mumbai Test Network?");
            break;
      case RopstenTestNetworkChainId: 
            alert("You are connected to the Ropsten Test Network! Could you please connect to the Mumbai Test Network?");
            break;
      case MaticPoygonMainNetworkChainId: 
            alert("You are connected to the Poygon Main Network! Could you please connect to the Mumbai Test Network?");
            break;
      case MaticMumbaiTestNetworkChainId: 
            console.log("You are connected to the Mumbai Test Network!");
            break;
      case GoerliTestNetworkChainId: 
            alert("You are connected to the Goerli Test Network! Could you please connect to the Mumbai Test Network?");
            break;
      case KovanTestNetworkChainId: 
            alert("You are connected to the Kovan Test Network! Could you please connect to the Mumbai Test Network?");
            break;
      default:
            alert("You are not connected to the Mumbai Test Network! Could you please connect to the Mumbai Test Network?");
            break;
    }

    

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          Web3Mint.abi,
          signer
        );
  
        /* コントラクトからgetTokenIdsメソッドを呼び出す */
        _tokenIds = await connectedContract.getTokenIds();
        setTotalMintCount( _tokenIds.toNumber() );
        console.log("checkIfWalletIsConnected setTotalMintCount!  ", _tokenIds.toNumber() );
  
      } else {
        console.log("Ethereum object doesn't exist!");
      }
      
    } else {
      console.log("No authorized account found");
    }
  };

  const connectWallet = async () =>{
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      if (window.ethereum.networkVersion !== MaticMumbaiTestNetworkChainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${Number(80001).toString(16)}` }]
          });
        } catch (err) {
            // This error code indicates that the chain has not been added to MetaMask
          if (err.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainName: 'Matic Testnet Mumbai',
                  chainId: `0x${Number(80001).toString(16)}`,
                  nativeCurrency: { name: 'Matic', symbol: 'MATIC', decimals: 18 },
                  rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
                  blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
                }
              ]
            });
          }
        }
      }
      /*
       * ウォレットアドレスに対してアクセスをリクエストしています。
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      /*
       * ウォレットアドレスを currentAccount に紐付けます。
       */
      setCurrentAccount(accounts[0]);

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          Web3Mint.abi,
          signer
        );

        /* コントラクトからgetTokenIdsメソッドを呼び出す */
        _tokenIds = await connectedContract.getTokenIds();
        setTotalMintCount( _tokenIds.toNumber() );
        console.log("connectWallet setTotalMintCount!  ", _tokenIds.toNumber() );
        if(  MAX_TOTAL_MINT_COUNT <= _tokenIds.toNumber() ){
          alert(`I'm terribly sorry the total number of NFTs minted has reached the upper limit. Could you please wait next updating on Sep 7th, 2022?`);
        }

      } else {
        console.log("Ethereum object doesn't exist!");
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let wavePortalContract;

    const onNewTotalMintCount = (tokenId) => {
      console.log("useEffect NewTotalMintCount", tokenId.toNumber());
      const tokenIdCleaned = tokenId.toNumber();
      setTotalMintCount(tokenIdCleaned);
    };

    /* NewWaveイベントがコントラクトから発信されたときに、情報をを受け取ります */
    if (window.ethereum) {

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      wavePortalContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        Web3Mint.abi,
        signer
      );

      wavePortalContract.on("NewTotalMintCount", onNewTotalMintCount);
    }
    /*メモリリークを防ぐために、NewWaveのイベントを解除します*/
    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewTotalMintCount", onNewTotalMintCount);
      }
    };
  }, []);

  const askContractToMintNft = async (ipfs) => {
    
    if( totalMintCount < MAX_TOTAL_MINT_COUNT ){
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const connectedContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            Web3Mint.abi,
            signer
          );
          console.log("Going to pop wallet now to pay gas...");
          let nftTxn = await connectedContract.mintIpfsNFT("sample",ipfs);
          console.log("Mining...please wait.");
          await nftTxn.wait();
          console.log(
            `Mined!`
          );
          setIsLoading(false);
          /* コントラクトからgetTokenIdsメソッドを呼び出す */
          _tokenIds = await connectedContract.getTokenIds();
          alert(
            `あなたのウォレットに NFT を送信しました。OpenSea に表示されるまで最大で10分かかることがあります。NFT へのリンクはこちらです: https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS}/${_tokenIds.toNumber()-1}`
          );
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    }else{
      alert(`I'm terribly sorry the total number of NFTs minted has reached the upper limit. Could you please wait next updating on Sep 7th, 2022?`);
    }
  };

  const imageToNFT = async (e) => {
  //const imageToNFT = () => {
    
    //document.getElementById("p1").style.display ="none";  
    //setIsLoading(true);
    if( totalMintCount < MAX_TOTAL_MINT_COUNT ){
      //connectWallet();
      //const client = new Web3Storage({ token: API_KEY })
      //const image = e.target
      //console.log(image)
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.onload = (e) => {
          console.log(e.target.result)
          setValue(e.target.result)
        }
        reader.readAsDataURL(file)
        //setIsVisiblePictureValue(true) 
      }

      /*const rootCid = await client.put(image.files, {
          name: 'experiment',
          maxRetries: 3
      })
      const res = await client.get(rootCid) // Web3Response
      const files = await res.files() // Web3File[]
      for (const file of files) {
        console.log("file.cid:",file.cid)
        askContractToMintNft(file.cid)
      }*/
    }else{
      alert(`I'm terribly sorry the total number of NFTs minted has reached the upper limit. Could you please wait next updating on Sep 7th, 2022?`);
      setIsLoading(false);
    }
    
  }

  const storeNFT = async (image) => {
    // create a new NFTStorage client using our API key
    const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY })

    // call client.store, passing in the image & metadata
    return nftstorage.storeBlob(image);
  };

  const useNFTstrage = async (e) => {
    
    setIsLoading(true);
    console.log("Your picture is uploading!");
    
    if( totalMintCount < MAX_TOTAL_MINT_COUNT ){
    
        const images = e.target.files;

      for (const image of images) {
        const cid = await storeNFT(image);
        console.log("Your picture uploaded!");
        console.log(cid);
        askContractToMintNft(cid);
      }

    }else{
      alert(`I'm terribly sorry the total number of NFTs minted has reached the upper limit. Could you please wait next updating on Sep 7th, 2022?`);
      setIsLoading(false);
    }
  }

  const renderFooterContainer = () => (
    <div className="footer-container">
      <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
      <a
        className="footer-text"
        href={TWITTER_LINK}
        target="_blank"
        rel="noreferrer"
      >{`built on @${TWITTER_HANDLE}`}</a>
    </div>
  );

  const renderNotConnectedContainer = () => (
    <div className="container1">
      <div className="header-container">
        <div className="outerBox1">
          <p className="header gradient-text">If you choose image, you can mint your NFT.</p>
          <p className="header2 gradient-text">Click the "Connect to Wallet" button below first!</p>
          <button onClick={connectWallet} className="cta-button connect-wallet-button" >
            Connect to Wallet
          </button>
        </div>
      </div>
      {renderFooterContainer()}
    </div>
  );
  const renderUser = (
    <div id = "p1">
      <div className="nftUplodeBox">
        <div className="imageLogoAndText">
          <img src={ImageLogo} alt="imagelogo" />
          <p className="sub-text">Drag and Drop files here!</p>
        </div>
        <input className="nftUploadInput" multiple name="imageURL" type="file" accept=".jpg , .jpeg , .png" onChange={useNFTstrage} />
      </div>
      <p>or</p>
      <Button variant="contained" className="cta-button connect-wallet-button">
      click to select files!
        <input className="nftUploadInput" type="file" accept=".jpg , .jpeg , .png" onChange={useNFTstrage} />
      </Button>
    </div>
  );
  const renderConnectedContainer = () => (
    <div className="container2">
      <div className="header-container">
        <div className="outerBox2">
          <p className="header3 gradient-text">NFT UpLoader</p>
          {isLoading ? <LoadingSpinner /> : renderUser}
          {currentAccount && (
            <p >NFT {totalMintCount} / {MAX_TOTAL_MINT_COUNT} minted so far</p>
          )}
          {currentAccount && (
            <a className="App-link" href={OPENSEA_LINK} target="_blank" rel="noopener noreferrer" >
              <button className="cta-button connect-wallet-button">
                MY CLASSY NFTs
              </button>
            </a>
          )}
          
        </div>
      </div>
      {renderFooterContainer()}
    </div>
  );
  
  /* https://bafybeifo6olbjp5hyayo5iawktdvq426ggms53ynvnxy4fd3na3muek234.ipfs.nftstorage.link/
   * ページがロードされたときに useEffect()内の関数が呼び出されます。
   */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
        
      {currentAccount === "" ? (
        renderNotConnectedContainer()
      ) : (
        renderConnectedContainer()
      )}

    </div>
  );
};

export default NftUploader;
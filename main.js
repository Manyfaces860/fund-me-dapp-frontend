import { ethers, parseEther } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import { abi, contractAddress } from "./constants.js"

const con = () => {
    console.log('clicked!!')
    const data = document.getElementById("shouldnotbehere");

    data.style.visibility = 'visible';
    data.style.transform = 'scale(7)'
    data.style.backdropFilter = 'blur(10px)';

}

const connectToWallet = async () => {
    const connectButt = document.getElementById("connect");
    if(typeof window.ethereum !== 'undefined') {
        console.log('i see a metamask!!');
        await window.ethereum.request({method : "eth_requestAccounts"});
    }
    else {
        console.log('i see nothing nigga..')
    }
    connectButt.innerText = 'connected'
    connectButt.style.backgroundColor = 'black'
}

const Fund = async () => {
    const fundInput = document.getElementsByClassName("fund-input");
    const ethAmount = fundInput[0].value;
    fundInput[0].value = '0'
    console.log(ethAmount)
    
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        console.log(signer);
        const contract = new ethers.Contract(contractAddress, abi, signer);
        // console.log(contract)
        try {
            const transactionResponse = await contract.Fund({value : parseEther(ethAmount)})
            console.log(transactionResponse);
            await ListenForTransactionMine(transactionResponse , provider);
            console.log('Done!')
        } catch (error) {
            console.log(error);            
        }
    }   
}

const ListenForTransactionMine = (transactionResponse, provider) => {
    console.log(`Listening for Mine ${transactionResponse.hash}...`);
    return new Promise((resolve , reject) => {
        provider.once(transactionResponse.hash , (transactionReceipt) => {
            console.log(`Completed transaction ${transactionReceipt.blocknumber} confirmations`);
            resolve();
        })
    })
}

const GetBalance = async () => {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balance = await provider.getBalance(contractAddress);
        const balanceEther = ethers.formatEther(balance);
        console.log(balanceEther);
        document.getElementById("shouldnotbehere").innerHTML = `<i id="eth">ETH</i> ${balanceEther}`;
        con();
    }
}

const Withdraw = async () => {
    
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            const transactionResponse = await contract.WithDraw();
            console.log(transactionResponse);
            await ListenForTransactionMine(transactionResponse , provider);
            console.log('Done!')
        } catch (error) {
            console.log(error);            
        }
    }   
}


const connectButt = document.getElementsByClassName("connect");
connectButt[0].onclick = connectToWallet;

const fundButt = document.getElementById("fund-button");
fundButt.addEventListener('click' , Fund);

const balanceButt = document.getElementById("balance-button");
balanceButt.onclick = GetBalance;

const withdrawButt = document.getElementById("withdraw");
withdrawButt.onclick = Withdraw;

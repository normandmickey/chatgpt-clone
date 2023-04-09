
import { Configuration, OpenAIApi } from 'openai';

import FormSection from './components/FormSection';
import AnswerSection from './components/AnswerSection';

import { useState } from 'react';

import { ethers } from "ethers";
import paywallArtifact from "./Paywall.json";
import React, { useEffect } from "react";

const history = [];

const App = () => {
	//Paywall
        const [account, setAccount] = useState("");
	const [accessible, setAccessible] = useState(false);
	const [paywall, setPaywall] = useState(null);

        useEffect(() => {
	loadAccounts();
	loadPaywall();
	}, []);

const loadAccounts = async () => {
if (typeof window.ethereum !== "undefined") {
const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
setAccount(accounts[0]);
}
};

const loadPaywall = async () => {
if (typeof window.ethereum !== "undefined") {
const provider = new ethers.providers.Web3Provider(window.ethereum);
const contractAddress = "0x9C7A5F14fB535269577798f5e3AcAAc0D450E989"; // Replace with your contract's address
const paywallContract = new ethers.Contract(contractAddress, paywallArtifact.abi, provider);

try {
const signer = provider.getSigner();
const signedPaywallContract = paywallContract.connect(signer);
setPaywall(signedPaywallContract);
} catch (err) {
console.log("Error: ", err);
}
}
};

const handleAccess = async () => {
if (paywall) {
try {
const valueToSend = ethers.utils.parseUnits("0.50", "ether");
const tx = await paywall.grantAccess({ value: valueToSend });
const receipt = await tx.wait();

if (receipt.status === 1) {
setAccessible(true);
}
} catch (err) {
console.log("Error: ", err);
}
}
};


        //end Paywall

	const configuration = new Configuration({
		organization: process.env.REACT_APP_OPENAI_ORGANIZATION,
		apiKey: process.env.REACT_APP_OPENAI_API_KEY,
	});

	const openai = new OpenAIApi(configuration);

        const moderationConfiguration = new Configuration({
                apiKey: process.env.REACT_APP_OPENAI_API_KEY,
        });

        const moderationOpenai = new OpenAIApi(moderationConfiguration);

	const [storedValues, setStoredValues] = useState([]);
        
        const messages = [];
        for (const [input_text, completion_text] of history) {
          messages.push({ role: "user", content: input_text });
          messages.push({ role: "assistant", content: completion_text });
        }
	
        const generateResponse = async (newQuestion, setNewQuestion) => {
                messages.push({ role: "user", content: newQuestion });
		let options = {
                        model: process.env.REACT_APP_OPENAI_MODEL,
                        messages: messages,
                };

		const response = await openai.createChatCompletion(options);

		if (response.data.choices) {
                        var finalAnswer = "";
                        var flagged = false;
                        const tempAnswer = response.data.choices[0].message.content;
                        const moderationResponse = await moderationOpenai.createModeration({
                          input: tempAnswer,
                        });
                        flagged = moderationResponse.data.results[0].flagged;
                       
                        if (flagged) {
                         finalAnswer = "Response flagged by OpenAI moderation";
                        } else {
                         finalAnswer = tempAnswer;
                        }

                        history.push([newQuestion, finalAnswer]);
			setStoredValues([
				{
					question: newQuestion,
					answer: finalAnswer,
				},
				...storedValues,
			]);
                        setNewQuestion('');
		}
	};

return (
<div className="App">
<h1>Polygon Paywall for AskGPT.eth.limo</h1>
<p>0.50 Matic per session with GPT-4</p>
<p>Connect your Metamask wallet to the Polygon Mainnet and refresh this page.</p>
{!accessible ? (
<button className="btn" onClick={handleAccess}>Pay 0.50 Matic to access AskGPT.eth</button>
) : (
<div>
<h2></h2>
<p>You have successfully unlocked AskGPT.eth!</p>
<div>
                        <div className="header-section">
                                <h1>AskGPT.eth</h1>
                                {storedValues.length < 1 && (
                                         <p>
                                         </p>
                                )}
                        </div>

                        <FormSection generateResponse={generateResponse} />

                        {storedValues.length > 0 && <AnswerSection storedValues={storedValues} />}
                </div>

</div>
)}
</div>
);

};

export default App;

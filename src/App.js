import React from 'react';
import { Configuration, OpenAIApi } from 'openai';

import FormSection from './components/FormSection';
import AnswerSection from './components/AnswerSection';

import { useState, useEffect } from 'react';
import networks from '@unlock-protocol/networks'
import { Paywall } from '@unlock-protocol/paywall'

import { ethers } from "ethers";
//import unlock from "@unlock-protocol/contracts/abis/Unlock";

//import "@unlock-protocol/contracts/dist/Unlock/UnlockV0.sol";

const paywallConfig = {
  "pessimistic": true,
    "locks": {
        "0xf2a7513175c137688a1a144f8642c9766db29ad1": {
           "network": 100,
           "name": "AskGPT-TEST4"
        }
    },
    "icon": "",
    "metadataInputs": [
        {
        }
    ]
  }

// Configure networks to use
// You can also use @unlock-protocol/networks for convenience...
const networkConfigs = {
  1: {
    provider: networks[1],
  },
  100: {
    provider: networks[100],
    // configuration for gnosis chain... etc
  },
  // etc
}
// Pass a provider. You can also use a provider from a library such as Magic.li>
// If no provider is set, the library uses window.ethereum
const provider = window.ethereum

const paywall = new Paywall(paywallConfig, networkConfigs, provider)

paywall.loadCheckoutModal();

const history = [];

const App = () => {
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
		<div>
			<div className="header-section">
				<h1>ChatGPT-O-Matic</h1>
				{storedValues.length < 1 && (
					<p>
					</p>
				)}

			</div>
			<FormSection generateResponse={generateResponse} />

			{storedValues.length > 0 && <AnswerSection storedValues={storedValues} />}
		</div>
	);
};

export default App;

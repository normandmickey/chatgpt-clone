
import { Configuration, OpenAIApi } from 'openai';

import FormSection from './components/FormSection';
import AnswerSection from './components/AnswerSection';

import { useState } from 'react';

const history = [];

const App = () => {
	const configuration = new Configuration({
		organization: process.env.OPENAI_ORGANIZATION,
		apiKey: process.env.REACT_APP_OPENAI_API_KEY,
	});

	const openai = new OpenAIApi(configuration);
	const [storedValues, setStoredValues] = useState([]);
        
        const messages = [];
        for (const [input_text, completion_text] of history) {
          messages.push({ role: "user", content: input_text });
          messages.push({ role: "assistant", content: completion_text });
        }
	
        const generateResponse = async (newQuestion, setNewQuestion) => {
                messages.push({ role: "user", content: newQuestion });
		let options = {
                        model: 'gpt-3.5-turbo',
                        messages: messages,
                };

		const response = await openai.createChatCompletion(options);

		if (response.data.choices) {
                        history.push([newQuestion, response.data.choices[0].message.content]);
			setStoredValues([
				{
					question: newQuestion,
					answer: response.data.choices[0].message.content,
				},
				...storedValues,
			]);
                        setNewQuestion('');
		}
	};

	return (
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
	);
};

export default App;

import { useState } from 'react';

import { ThreeDots } from 'react-loader-spinner';

const FormSection = ({ generateResponse }) => {
    const [newQuestion, setNewQuestion] = useState('');
    const [loading,setLoading] = useState(false);
   
    function toggleLoading(){
      if(!loading){
        setLoading(true)
      }
      else{
        setLoading(false)
      }
    }
    
   
    return (
        <div className="form-section">
            <textarea
                rows="5"
                className="form-control"
                placeholder="Ask me anything..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
            ></textarea>
            <button className="btn" 
              onClick={() => {
                paywall.loadCheckoutModal();
                toggleLoading(); 
                generateResponse(newQuestion, setNewQuestion);
              }}>
                Ask GPT
                {newQuestion ? ( 
                 <ThreeDots
                 width=""
                 height="20"
                 color="#CA228C"
                 ariaLabel="loading"
                />
                ) : (
                  <p></p>
                )}

            </button>
        </div>
    )
}

export default FormSection

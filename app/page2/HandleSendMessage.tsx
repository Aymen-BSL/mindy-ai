

const HandleSendMessage = async (message: string) => {

    const response = await fetch('https://3b90-41-226-8-251.ngrok-free.app/get-chat-response', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: localStorage.getItem("userId"), // Ensure you save the user ID from /start-chat
            message,
        }),
    });

   return await response.text();
    
};

export default HandleSendMessage;



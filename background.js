chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'chat') {
        const apiUrl = request.apiUrl;
        const apiKey = request.apiKey;
        const model = request.model;
        const message = request.message;

        // 调用大模型 API
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [{
                    role: 'user',
                    content: message
                }]
            })
        })
        .then(response => response.json())
        .then(data => {
            // 发送响应到 sidepanel.js
            if (data.choices && data.choices.length > 0) {
                sendResponse({
                    message: data.choices[0].message.content
                });
            } else {
                sendResponse({
                    message: 'Error: No response from the model'
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            sendResponse({
                message: 'Error: ' + error.message
            });
        });

        // 必须返回 true 以指示您想异步使用 sendResponse
        return true;
    }
});
